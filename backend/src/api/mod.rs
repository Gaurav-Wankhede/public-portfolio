pub mod certificates;
pub mod chat;
pub mod projects;

use crate::{auth::AuthConfig, database::MongoClient};
use axum::Router;
use chat::GeminiClient;
use std::sync::Arc;

/// Build API router with all endpoints
/// Admin-protected routes require auth_config
/// API is versioned at /v1 prefix for future compatibility
pub fn build_router(
    db_client: Arc<MongoClient>,
    auth_config: Arc<AuthConfig>,
    gemini_client: Arc<GeminiClient>,
    api_key: String,
) -> Router {
    // Version 1 API routes
    let v1_router = Router::new()
        .nest(
            "/projects",
            projects::router(db_client.clone(), auth_config.clone()),
        )
        .nest(
            "/certificates",
            certificates::router(db_client.clone(), auth_config.clone()),
        )
        .nest(
            "/chat",
            chat::router(db_client.clone(), gemini_client, api_key),
        );

    // Nest under /v1 prefix
    Router::new().nest("/v1", v1_router)
}
