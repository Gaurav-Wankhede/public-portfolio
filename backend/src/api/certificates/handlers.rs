use crate::{database::MongoClient, models::Certificate};
use axum::{
    extract::{Path, State},
    http::StatusCode,
    Json,
};
use mongodb::bson::{doc};
use serde_json::{json, Value};
use std::sync::Arc;
use validator::Validate;

/// List all certificates
#[cfg_attr(feature = "swagger", utoipa::path(
    get,
    path = "/api/v1/certificates",
    responses(
        (status = 200, description = "List of certificates retrieved successfully"),
        (status = 500, description = "Internal server error")
    ),
    tag = "certificates"
))]
pub async fn list_certificates(
    State(db): State<Arc<MongoClient>>,
) -> Result<Json<Value>, StatusCode> {
    let collection = db.certificates();

    let cursor_result = collection.find(doc! {}).await;

    match cursor_result {
        Ok(mut cursor) => {
            let mut certificates = Vec::new();
            let mut success_count = 0;
            let mut error_count = 0;

            use futures::stream::StreamExt;
            while let Some(result) = cursor.next().await {
                match result {
                    Ok(doc) => {
                        certificates.push(doc);
                        success_count += 1;
                    }
                    Err(e) => {
                        error_count += 1;
                        tracing::warn!("Failed to deserialize certificate {}: {}", error_count, e);
                    }
                }
            }

            tracing::info!(
                "Certificates retrieval: {} successful, {} failed",
                success_count,
                error_count
            );

            // Return direct array for consistency with frontend expectations
            Ok(Json(json!(certificates)))
        }
        Err(error) => {
            tracing::error!("Failed to fetch certificates: {}", error);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

/// Get single certificate by slug
#[cfg_attr(feature = "swagger", utoipa::path(
    get,
    path = "/api/v1/certificates/{slug}",
    responses(
        (status = 200, description = "Certificate retrieved successfully"),
        (status = 404, description = "Certificate not found")
    ),
    tag = "certificates"
))]
pub async fn get_certificate(
    State(db): State<Arc<MongoClient>>,
    Path(slug): Path<String>,
) -> Result<Json<Value>, StatusCode> {
    let collection = db.certificates();

    match collection.find_one(doc! { "slug": slug }).await {
        Ok(Some(certificate)) => Ok(Json(json!(certificate))),
        Ok(None) => Err(StatusCode::NOT_FOUND),
        Err(error) => {
            tracing::error!("Database error: {}", error);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

/// Create new certificate (Admin only)
#[cfg_attr(feature = "swagger", utoipa::path(
    post,
    path = "/api/v1/certificates",
    responses(
        (status = 201, description = "Certificate created successfully"),
        (status = 400, description = "Invalid request body"),
        (status = 401, description = "Unauthorized - Missing or invalid token"),
        (status = 403, description = "Forbidden - Not an admin user")
    ),
    security(
        ("google_oauth" = ["openid", "email", "profile"])
    ),
    tag = "certificates"
))]
pub async fn create_certificate(
    State(db): State<Arc<MongoClient>>,
    Json(mut certificate): Json<Certificate>,
) -> Result<(StatusCode, Json<Value>), StatusCode> {
    // Validate input
    certificate.validate().map_err(|e| {
        tracing::warn!("Validation failed for certificate creation: {}", e);
        StatusCode::BAD_REQUEST
    })?;

    let collection = db.certificates();

    certificate.slug = Certificate::generate_slug(&certificate.name);

    let doc = mongodb::bson::to_document(&certificate).map_err(|_| StatusCode::BAD_REQUEST)?;

    match collection.insert_one(doc).await {
        Ok(result) => {
            let inserted_id = result
                .inserted_id
                .as_object_id()
                .ok_or(StatusCode::INTERNAL_SERVER_ERROR)?;

            Ok((
                StatusCode::CREATED,
                Json(json!({
                    "id": inserted_id.to_hex(),
                    "message": "Certificate created successfully"
                })),
            ))
        }
        Err(error) => {
            tracing::error!("Failed to create certificate: {}", error);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}
