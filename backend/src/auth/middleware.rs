use super::jwt::{AuthConfig, UserInfo};
use axum::{
    extract::{Request, State},
    http::StatusCode,
    middleware::Next,
    response::Response,
};
use std::sync::Arc;

/// Middleware to require admin authentication via JWT
pub async fn require_admin(
    State(auth_config): State<Arc<AuthConfig>>,
    mut request: Request,
    next: Next,
) -> Result<Response, StatusCode> {
    // Extract Authorization header
    let auth_header = request
        .headers()
        .get("Authorization")
        .and_then(|h| h.to_str().ok())
        .ok_or_else(|| {
            tracing::warn!("Authentication failed: Missing Authorization header");
            StatusCode::UNAUTHORIZED
        })?;

    // Extract token from "Bearer <token>"
    let token = auth_header.strip_prefix("Bearer ").ok_or_else(|| {
        tracing::warn!("Authentication failed: Invalid Authorization header format");
        StatusCode::UNAUTHORIZED
    })?;

    // Verify JWT token
    let claims = auth_config.verify_token(token).map_err(|err| {
        tracing::error!("Token verification failed: {}", err);
        StatusCode::UNAUTHORIZED
    })?;

    // Check if user is the admin
    if !auth_config.is_admin(&claims) {
        tracing::warn!(
            "Authorization failed: User '{}' is not the admin",
            claims.sub
        );
        return Err(StatusCode::FORBIDDEN);
    }

    tracing::info!("Admin authenticated successfully: {}", claims.sub);

    // Store user info in request extensions
    let user_info = UserInfo { email: claims.sub };
    request.extensions_mut().insert(user_info);

    Ok(next.run(request).await)
}
