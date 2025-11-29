use crate::{auth::UserInfo, database::MongoClient, models::certificate::CertificateUpdate};
use axum::{
    extract::{Path, State},
    http::StatusCode,
    Extension, Json,
};
use serde_json::{json, Value};
use std::sync::Arc;
use validator::Validate;

/// Delete certificate by slug (Admin only)
#[cfg_attr(feature = "swagger", utoipa::path(
    delete,
    path = "/api/v1/certificates/{slug}",
    responses(
        (status = 200, description = "Certificate deleted successfully"),
        (status = 404, description = "Certificate not found"),
        (status = 401, description = "Unauthorized - Missing or invalid token"),
        (status = 403, description = "Forbidden - Not an admin user"),
        (status = 500, description = "Internal server error")
    ),
    security(
        ("google_oauth" = ["openid", "email", "profile"])
    ),
    tag = "certificates"
))]
pub async fn delete_certificate(
    State(db): State<Arc<MongoClient>>,
    Extension(user): Extension<UserInfo>,
    Path(slug): Path<String>,
) -> Result<Json<Value>, StatusCode> {
    tracing::info!("Admin {} deleting certificate: {}", user.email, slug);
    match db.delete_by_slug("certificates", &slug).await {
        Ok(true) => {
            tracing::info!("Certificate '{}' deleted by {}", slug, user.email);
            Ok(Json(json!({"message": "Certificate deleted successfully"})))
        }
        Ok(false) => Err(StatusCode::NOT_FOUND),
        Err(e) => {
            tracing::error!("Failed to delete certificate: {}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

/// Update certificate by slug (Admin only)
#[cfg_attr(feature = "swagger", utoipa::path(
    put,
    path = "/api/v1/certificates/{slug}",
    request_body = CertificateUpdate,
    responses(
        (status = 200, description = "Certificate updated successfully"),
        (status = 404, description = "Certificate not found"),
        (status = 400, description = "Invalid request body"),
        (status = 401, description = "Unauthorized - Missing or invalid token"),
        (status = 403, description = "Forbidden - Not an admin user"),
        (status = 500, description = "Internal server error")
    ),
    security(
        ("google_oauth" = ["openid", "email", "profile"])
    ),
    tag = "certificates"
))]
pub async fn update_certificate(
    State(db): State<Arc<MongoClient>>,
    Extension(user): Extension<UserInfo>,
    Path(slug): Path<String>,
    Json(certificate): Json<CertificateUpdate>,
) -> Result<Json<Value>, StatusCode> {
    tracing::info!("Admin {} updating certificate: {}", user.email, slug);

    // Validate input
    certificate.validate().map_err(|e| {
        tracing::warn!("Validation failed for certificate update: {}", e);
        StatusCode::BAD_REQUEST
    })?;

    let update_doc =
        mongodb::bson::to_document(&certificate).map_err(|_| StatusCode::BAD_REQUEST)?;

    match db.update_by_slug("certificates", &slug, update_doc).await {
        Ok(true) => {
            tracing::info!("Certificate '{}' updated by {}", slug, user.email);
            Ok(Json(json!({
                "message": "Certificate updated successfully",
                "slug": slug
            })))
        }
        Ok(false) => Err(StatusCode::NOT_FOUND),
        Err(e) => {
            tracing::error!("Failed to update certificate: {}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}
