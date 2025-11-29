pub mod delete_update;
pub mod handlers;

use crate::{auth::AuthConfig, database::MongoClient};
use axum::{
    middleware,
    routing::{delete, get, post, put},
    Router,
};
use std::sync::Arc;

/// Build projects router with CRUD endpoints
/// POST operations require admin authentication
pub fn router(db_client: Arc<MongoClient>, auth_config: Arc<AuthConfig>) -> Router {
    Router::new()
        .route("/", get(handlers::list_projects))
        .route(
            "/",
            post(handlers::create_project).layer(middleware::from_fn_with_state(
                auth_config.clone(),
                crate::auth::middleware::require_admin,
            )),
        )
        .route("/{slug}", get(handlers::get_project))
        .route(
            "/{slug}",
            delete(delete_update::delete_project).layer(middleware::from_fn_with_state(
                auth_config.clone(),
                crate::auth::middleware::require_admin,
            )),
        )
        .route(
            "/{slug}",
            put(delete_update::update_project).layer(middleware::from_fn_with_state(
                auth_config,
                crate::auth::middleware::require_admin,
            )),
        )
        .with_state(db_client)
}
