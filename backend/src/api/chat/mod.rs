mod client;
mod config;
mod embeddings;
mod formatter;
pub mod handlers;
mod prompt;
mod vector_search;

pub use client::GeminiClient;
pub use config::PortfolioOwner;
pub use embeddings::generate_embedding;
pub use formatter::{format_certificates, format_projects};
pub use prompt::build_system_prompt;
pub use vector_search::{keyword_search, vector_search};

use crate::database::MongoClient;
use axum::{routing::post, Router};
use std::sync::Arc;

pub use handlers::RagState;

/// Build chat router with RAG state (DB + Gemini + Portfolio Owner)
pub fn router(
    db_client: Arc<MongoClient>,
    gemini_client: Arc<GeminiClient>,
    api_key: String,
    portfolio_owner: PortfolioOwner,
) -> Router {
    let rag_state = Arc::new(RagState {
        db_client,
        gemini_client,
        api_key,
        portfolio_owner,
    });

    Router::new()
        .route("/", post(handlers::chat_handler))
        .with_state(rag_state)
}
