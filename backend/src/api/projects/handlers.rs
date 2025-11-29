use crate::{database::MongoClient, models::Project};
use axum::{
    extract::{Path, State},
    http::StatusCode,
    Json,
};
use mongodb::bson::{doc};
use serde_json::{json, Value};
use std::sync::Arc;
use validator::Validate;

/// List all projects
#[cfg_attr(feature = "swagger", utoipa::path(
    get,
    path = "/api/v1/projects",
    responses(
        (status = 200, description = "List of projects retrieved successfully"),
        (status = 500, description = "Internal server error")
    ),
    tag = "projects"
))]
pub async fn list_projects(State(db): State<Arc<MongoClient>>) -> Result<Json<Value>, StatusCode> {
    let collection = db.projects();

    let cursor_result = collection.find(doc! {}).await;

    match cursor_result {
        Ok(mut cursor) => {
            let mut projects = Vec::new();
            let mut success_count = 0;
            let mut error_count = 0;

            use futures::stream::StreamExt;
            while let Some(result) = cursor.next().await {
                match result {
                    Ok(doc) => {
                        projects.push(doc);
                        success_count += 1;
                    }
                    Err(e) => {
                        error_count += 1;
                        tracing::warn!(
                            "Failed to deserialize project document {}: {}",
                            error_count,
                            e
                        );
                    }
                }
            }

            tracing::info!(
                "Projects retrieval: {} successful, {} failed",
                success_count,
                error_count
            );

            // Return direct array for consistency with frontend expectations
            Ok(Json(json!(projects)))
        }
        Err(error) => {
            tracing::error!("Failed to fetch projects: {}", error);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

/// Get single project by slug
#[cfg_attr(feature = "swagger", utoipa::path(
    get,
    path = "/api/v1/projects/{slug}",
    responses(
        (status = 200, description = "Project retrieved successfully"),
        (status = 404, description = "Project not found")
    ),
    tag = "projects"
))]
pub async fn get_project(
    State(db): State<Arc<MongoClient>>,
    Path(slug): Path<String>,
) -> Result<Json<Value>, StatusCode> {
    let collection = db.projects();

    match collection.find_one(doc! { "slug": slug }).await {
        Ok(Some(project)) => Ok(Json(json!(project))),
        Ok(None) => Err(StatusCode::NOT_FOUND),
        Err(error) => {
            tracing::error!("Database error: {}", error);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

/// Create new project (Admin only)
#[cfg_attr(feature = "swagger", utoipa::path(
    post,
    path = "/api/v1/projects",
    responses(
        (status = 201, description = "Project created successfully"),
        (status = 400, description = "Invalid request body"),
        (status = 401, description = "Unauthorized - Missing or invalid token"),
        (status = 403, description = "Forbidden - Not an admin user")
    ),
    security(
        ("google_oauth" = ["openid", "email", "profile"])
    ),
    tag = "projects"
))]
pub async fn create_project(
    State(db): State<Arc<MongoClient>>,
    Json(project): Json<Project>,
) -> Result<(StatusCode, Json<Value>), StatusCode> {
    // Validate input
    project.validate().map_err(|e| {
        tracing::warn!("Validation failed for project creation: {}", e);
        StatusCode::BAD_REQUEST
    })?;

    let collection = db.projects();

    let doc = mongodb::bson::to_document(&project).map_err(|_| StatusCode::BAD_REQUEST)?;

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
                    "message": "Project created successfully"
                })),
            ))
        }
        Err(error) => {
            tracing::error!("Failed to create project: {}", error);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}
