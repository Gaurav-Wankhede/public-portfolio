use axum::http::{HeaderValue, Method};
use tower_http::cors::CorsLayer;

/// Configure CORS middleware for the portfolio API
///
/// Configured to allow requests from specific production and development origins
pub fn configure_cors() -> CorsLayer {
    // Define allowed origins for production and development
    let allowed_origins = vec![
        // Development - Frontend (3111) and Dashboard (3333)
        "http://localhost:3111",
        "http://localhost:3333",
        "http://127.0.0.1:3111",
        "http://127.0.0.1:3333",
        // Production
        "https://gauravwankhede.com",
        "https://www.gauravwankhede.com",
        "https://admin.gauravwankhede.com",
        "https://gaurav-wankhede-frontend.pages.dev",
        "https://dashboard.gauravwankhede.com",
    ];

    let origins: Vec<HeaderValue> = allowed_origins
        .iter()
        .filter_map(|origin| origin.parse().ok())
        .collect();

    CorsLayer::new()
        // Allow common HTTP methods
        .allow_methods([
            Method::GET,
            Method::POST,
            Method::PUT,
            Method::DELETE,
            Method::PATCH,
            Method::OPTIONS,
        ])
        // Allow common headers
        .allow_headers([
            axum::http::header::CONTENT_TYPE,
            axum::http::header::AUTHORIZATION,
            axum::http::header::ACCEPT,
            axum::http::header::ORIGIN,
        ])
        // Allow specific origins
        .allow_origin(origins)
        // Enable credentials for authenticated requests
        .allow_credentials(true)
}
