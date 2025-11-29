mod client;
pub mod handlers;
mod vector_search;
mod prompt;
mod formatter;
mod embeddings;

pub use client::GeminiClient;
pub use vector_search::{vector_search, keyword_search};
pub use prompt::build_system_prompt;
pub use formatter::{format_projects, format_certificates};
pub use embeddings::generate_embedding;

use axum::{
    routing::post,
    Router,
};
use std::sync::Arc;
use crate::database::MongoClient;

pub use handlers::RagState;

/// Build chat router with RAG state (DB + Gemini)
pub fn router(
    db_client: Arc<MongoClient>,
    gemini_client: Arc<GeminiClient>,
    api_key: String,
) -> Router {
    let rag_state = Arc::new(RagState {
        db_client,
        gemini_client,
        api_key,
    });
    
    Router::new()
        .route("/", post(handlers::chat_handler))
        .with_state(rag_state)
}
