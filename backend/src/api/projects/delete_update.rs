use crate::{auth::UserInfo, database::MongoClient, models::project::ProjectUpdate};
use axum::{
    extract::{Path, State},
    http::StatusCode,
    Extension, Json,
};
use serde_json::{json, Value};
use std::sync::Arc;
use validator::Validate;

/// Delete project by slug (Admin only)
#[cfg_attr(feature = "swagger", utoipa::path(
    delete,
    path = "/api/v1/projects/{slug}",
    responses(
        (status = 200, description = "Project deleted successfully"),
        (status = 404, description = "Project not found"),
        (status = 401, description = "Unauthorized - Missing or invalid token"),
        (status = 403, description = "Forbidden - Not an admin user"),
        (status = 500, description = "Internal server error")
    ),
    security(
        ("google_oauth" = ["openid", "email", "profile"])
    ),
    tag = "projects"
))]
pub async fn delete_project(
    State(db): State<Arc<MongoClient>>,
    Extension(user): Extension<UserInfo>,
    Path(slug): Path<String>,
) -> Result<Json<Value>, StatusCode> {
    tracing::info!("Admin {} deleting project: {}", user.email, slug);
    match db.delete_by_slug("projects", &slug).await {
        Ok(true) => {
            tracing::info!("Project '{}' deleted by {}", slug, user.email);
            Ok(Json(json!({"message": "Project deleted successfully"})))
        }
        Ok(false) => Err(StatusCode::NOT_FOUND),
        Err(e) => {
            tracing::error!("Failed to delete project: {}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

/// Update project by slug (Admin only)
#[cfg_attr(feature = "swagger", utoipa::path(
    put,
    path = "/api/v1/projects/{slug}",
    request_body = ProjectUpdate,
    responses(
        (status = 200, description = "Project updated successfully"),
        (status = 404, description = "Project not found"),
        (status = 400, description = "Invalid request body"),
        (status = 401, description = "Unauthorized - Missing or invalid token"),
        (status = 403, description = "Forbidden - Not an admin user"),
        (status = 500, description = "Internal server error")
    ),
    security(
        ("google_oauth" = ["openid", "email", "profile"])
    ),
    tag = "projects"
))]
pub async fn update_project(
    State(db): State<Arc<MongoClient>>,
    Extension(user): Extension<UserInfo>,
    Path(slug): Path<String>,
    Json(project): Json<ProjectUpdate>,
) -> Result<Json<Value>, StatusCode> {
    tracing::info!("Admin {} updating project: {}", user.email, slug);

    // Validate input
    project.validate().map_err(|e| {
        tracing::warn!("Validation failed for project update: {}", e);
        StatusCode::BAD_REQUEST
    })?;

    let update_doc = mongodb::bson::to_document(&project).map_err(|_| StatusCode::BAD_REQUEST)?;

    match db.update_by_slug("projects", &slug, update_doc).await {
        Ok(true) => {
            tracing::info!("Project '{}' updated by {}", slug, user.email);
            Ok(Json(json!({
                "message": "Project updated successfully",
                "slug": slug
            })))
        }
        Ok(false) => Err(StatusCode::NOT_FOUND),
        Err(e) => {
            tracing::error!("Failed to update project: {}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}
