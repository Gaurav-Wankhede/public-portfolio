use axum::{
    http::StatusCode,
    response::{IntoResponse, Response},
    Json,
};
use serde_json::json;
use std::fmt;

/// Unified API error type for consistent error responses
#[allow(dead_code)]
#[derive(Debug, Clone)]
pub enum ApiError {
    /// Bad request - invalid input from client (400)
    BadRequest(String),

    /// Unauthorized - authentication required (401)
    Unauthorized(String),

    /// Forbidden - authenticated but lacking permissions (403)
    Forbidden(String),

    /// Not found - resource doesn't exist (404)
    NotFound(String),

    /// Conflict - resource already exists or state conflict (409)
    Conflict(String),

    /// Unprocessable entity - validation failed (422)
    ValidationError(String),

    /// Internal server error - unexpected errors (500)
    InternalError(String),

    /// Service unavailable - temporary failure (503)
    ServiceUnavailable(String),
}

impl fmt::Display for ApiError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::BadRequest(msg) => write!(f, "Bad request: {}", msg),
            Self::Unauthorized(msg) => write!(f, "Unauthorized: {}", msg),
            Self::Forbidden(msg) => write!(f, "Forbidden: {}", msg),
            Self::NotFound(msg) => write!(f, "Not found: {}", msg),
            Self::Conflict(msg) => write!(f, "Conflict: {}", msg),
            Self::ValidationError(msg) => write!(f, "Validation error: {}", msg),
            Self::InternalError(msg) => write!(f, "Internal error: {}", msg),
            Self::ServiceUnavailable(msg) => write!(f, "Service unavailable: {}", msg),
        }
    }
}

impl std::error::Error for ApiError {}

impl ApiError {
    /// Get the HTTP status code for this error
    pub fn status_code(&self) -> StatusCode {
        match self {
            Self::BadRequest(_) => StatusCode::BAD_REQUEST,
            Self::Unauthorized(_) => StatusCode::UNAUTHORIZED,
            Self::Forbidden(_) => StatusCode::FORBIDDEN,
            Self::NotFound(_) => StatusCode::NOT_FOUND,
            Self::Conflict(_) => StatusCode::CONFLICT,
            Self::ValidationError(_) => StatusCode::UNPROCESSABLE_ENTITY,
            Self::InternalError(_) => StatusCode::INTERNAL_SERVER_ERROR,
            Self::ServiceUnavailable(_) => StatusCode::SERVICE_UNAVAILABLE,
        }
    }

    /// Get the error type string for JSON response
    pub fn error_type(&self) -> &'static str {
        match self {
            Self::BadRequest(_) => "bad_request",
            Self::Unauthorized(_) => "unauthorized",
            Self::Forbidden(_) => "forbidden",
            Self::NotFound(_) => "not_found",
            Self::Conflict(_) => "conflict",
            Self::ValidationError(_) => "validation_error",
            Self::InternalError(_) => "internal_error",
            Self::ServiceUnavailable(_) => "service_unavailable",
        }
    }
}

impl IntoResponse for ApiError {
    fn into_response(self) -> Response {
        let status = self.status_code();
        let error_type = self.error_type();
        let message = self.to_string();

        // Log internal errors
        if matches!(self, ApiError::InternalError(_)) {
            tracing::error!("Internal server error: {}", message);
        }

        let body = Json(json!({
            "error": {
                "type": error_type,
                "message": message,
            }
        }));

        (status, body).into_response()
    }
}

// Conversion implementations for common error types

impl From<mongodb::error::Error> for ApiError {
    fn from(err: mongodb::error::Error) -> Self {
        tracing::error!("MongoDB error: {}", err);
        ApiError::InternalError("Database operation failed".to_string())
    }
}

impl From<mongodb::bson::oid::Error> for ApiError {
    fn from(err: mongodb::bson::oid::Error) -> Self {
        ApiError::BadRequest(format!("Invalid ObjectId: {}", err))
    }
}

impl From<mongodb::bson::ser::Error> for ApiError {
    fn from(err: mongodb::bson::ser::Error) -> Self {
        tracing::error!("BSON serialization error: {}", err);
        ApiError::InternalError("Failed to serialize data".to_string())
    }
}

impl From<validator::ValidationErrors> for ApiError {
    fn from(err: validator::ValidationErrors) -> Self {
        let errors: Vec<String> = err
            .field_errors()
            .iter()
            .flat_map(|(field, errors)| {
                errors.iter().map(move |e| {
                    format!(
                        "{}: {}",
                        field,
                        e.message
                            .as_ref()
                            .map(|m| m.as_ref())
                            .unwrap_or("validation failed")
                    )
                })
            })
            .collect();

        ApiError::ValidationError(errors.join(", "))
    }
}

impl From<anyhow::Error> for ApiError {
    fn from(err: anyhow::Error) -> Self {
        tracing::error!("Anyhow error: {}", err);
        ApiError::InternalError(err.to_string())
    }
}

/// Result type alias using ApiError
#[allow(dead_code)]
pub type ApiResult<T> = Result<T, ApiError>;
