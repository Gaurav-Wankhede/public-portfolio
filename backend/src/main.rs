use axum::{
    http::StatusCode,
    response::IntoResponse,
    routing::{get, post},
    Extension, Json, Router,
};
use serde_json::json;
use std::sync::Arc;

mod api;
mod auth;
mod database;
mod error;
mod middleware;
mod models;
mod repositories;

use api::chat::{GeminiClient, PortfolioOwner};
use auth::{AuthConfig, LoginRequest, LoginResponse};

#[shuttle_runtime::main]
async fn main(
    #[shuttle_runtime::Secrets] secrets: shuttle_runtime::SecretStore,
) -> shuttle_axum::ShuttleAxum {
    tracing::info!("Starting Portfolio Rust Backend...");

    // Validate required secrets
    let mongodb_uri = secrets
        .get("MONGODB_URI")
        .expect("MONGODB_URI must be set in Secrets.toml");
    let admin_email = secrets
        .get("ADMIN_EMAIL")
        .expect("ADMIN_EMAIL must be set in Secrets.toml");
    let admin_password = secrets
        .get("ADMIN_PASSWORD")
        .expect("ADMIN_PASSWORD must be set in Secrets.toml");
    let google_api_key = secrets
        .get("GOOGLE_API_KEY")
        .expect("GOOGLE_API_KEY must be set in Secrets.toml");

    // Optional: Custom JWT secret (recommended for production)
    let jwt_secret = secrets.get("JWT_SECRET");

    tracing::info!("Secrets validated successfully");

    // Initialize MongoDB connection
    let db_connection = database::DatabaseConnection::new(&mongodb_uri, "portfolio")
        .await
        .expect("Failed to initialize MongoDB connection");

    let db_client = Arc::new(database::MongoClient::new(db_connection));
    tracing::info!("MongoDB connection initialized successfully");

    // Initialize JWT Auth Config
    let auth_config = Arc::new(AuthConfig::from_env(
        admin_email.clone(),
        admin_password,
        jwt_secret,
    ));

    tracing::info!("JWT authentication configured for admin: {}", admin_email);

    // Initialize Gemini client for chat
    let gemini_client = Arc::new(GeminiClient::new(google_api_key.clone()));
    tracing::info!("Gemini client initialized");

    // Load portfolio owner configuration from secrets
    let portfolio_owner = PortfolioOwner::from_secrets(&secrets);
    tracing::info!(
        "Portfolio owner configured: {} ({})",
        portfolio_owner.name,
        portfolio_owner.title
    );

    // Build API router with admin authentication
    let api_router = api::build_router(
        db_client.clone(),
        auth_config.clone(),
        gemini_client,
        google_api_key,
        portfolio_owner,
    );

    // Auth routes
    let auth_router = Router::new()
        .route("/login", post(login_handler))
        .route("/verify", get(verify_handler))
        .with_state(auth_config.clone());

    let router = Router::new()
        .route("/", get(root))
        .route("/health", get(health_check))
        .nest("/api", api_router)
        .nest("/auth", auth_router)
        .layer(Extension(db_client))
        .layer(middleware::configure_cors())
        .layer(middleware::configure_tracing());

    tracing::info!("Router configured - Backend ready for requests");

    Ok(router.into())
}

/// Root endpoint - API information
async fn root() -> impl IntoResponse {
    (
        StatusCode::OK,
        Json(json!({
            "name": "Portfolio Rust Backend",
            "version": "1.0.0",
            "status": "operational",
            "framework": "Axum + Shuttle.rs",
            "endpoints": {
                "health": "/health",
                "auth": "/auth/login",
                "projects": "/api/v1/projects",
                "certificates": "/api/v1/certificates",
                "chat": "/api/v1/chat"
            }
        })),
    )
}

/// Health check endpoint with database connectivity
async fn health_check(
    Extension(db_client): Extension<Arc<database::MongoClient>>,
) -> Json<serde_json::Value> {
    let db_status = match db_client.projects().estimated_document_count().await {
        Ok(_) => "connected",
        Err(_) => "disconnected",
    };

    Json(json!({
        "status": "healthy",
        "service": "portfolio-rust-backend",
        "database": db_status,
        "timestamp": chrono::Utc::now().to_rfc3339(),
        "version": "1.0.0",
    }))
}

/// Login endpoint - authenticate with email/password and receive JWT token
async fn login_handler(
    axum::extract::State(auth_config): axum::extract::State<Arc<AuthConfig>>,
    Json(payload): Json<LoginRequest>,
) -> Result<Json<LoginResponse>, StatusCode> {
    tracing::info!("Login attempt for: {}", payload.email);

    match auth_config.authenticate(&payload.email, &payload.password) {
        Ok(token) => {
            tracing::info!("Login successful for: {}", payload.email);
            Ok(Json(LoginResponse {
                token,
                expires_in: 24 * 3600, // 24 hours in seconds
                token_type: "Bearer".to_string(),
            }))
        }
        Err(e) => {
            tracing::warn!("Login failed for {}: {}", payload.email, e);
            Err(StatusCode::UNAUTHORIZED)
        }
    }
}

/// Verify token endpoint - check if token is valid
async fn verify_handler(
    axum::extract::State(auth_config): axum::extract::State<Arc<AuthConfig>>,
    headers: axum::http::HeaderMap,
) -> Result<Json<serde_json::Value>, StatusCode> {
    let auth_header = headers
        .get("Authorization")
        .and_then(|h| h.to_str().ok())
        .ok_or(StatusCode::UNAUTHORIZED)?;

    let token = auth_header
        .strip_prefix("Bearer ")
        .ok_or(StatusCode::UNAUTHORIZED)?;

    let claims = auth_config
        .verify_token(token)
        .map_err(|_| StatusCode::UNAUTHORIZED)?;

    Ok(Json(json!({
        "valid": true,
        "email": claims.sub,
        "expires_at": claims.exp
    })))
}
