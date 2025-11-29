use super::{
    build_system_prompt, client::GeminiClient, format_certificates, format_projects,
    generate_embedding, keyword_search, vector_search,
};
use crate::{
    database::MongoClient,
    models::{ChatRequest, ChatResponse},
};
use axum::{extract::State, http::StatusCode, Json};
use std::sync::Arc;

/// RAG state containing both DB and Gemini clients
pub struct RagState {
    pub db_client: Arc<MongoClient>,
    pub gemini_client: Arc<GeminiClient>,
    pub api_key: String,
}

/// Handle chat request with RAG (Retrieval-Augmented Generation)
#[cfg_attr(feature = "swagger", utoipa::path(
    post,
    path = "/api/v1/chat",
    responses(
        (status = 200, description = "Chat response with portfolio context"),
        (status = 500, description = "Internal server error")
    ),
    tag = "chat"
))]
pub async fn chat_handler(
    State(rag_state): State<Arc<RagState>>,
    Json(request): Json<ChatRequest>,
) -> Result<Json<ChatResponse>, StatusCode> {
    tracing::info!(
        "RAG Chat request: {}...",
        &request.messages.chars().take(50).collect::<String>()
    );

    // Step 1: Generate embedding for user query
    let query_embedding = match generate_embedding(&rag_state.api_key, &request.messages).await {
        Ok(emb) => emb,
        Err(e) => {
            tracing::warn!("Embedding generation failed: {}, using direct chat", e);
            return fallback_chat(&rag_state.gemini_client, &request.messages).await;
        }
    };

    // Step 2: Vector search for projects
    let projects_docs = match vector_search(
        &rag_state.db_client.projects(),
        query_embedding.clone(),
        "projects_index",
        3,
    )
    .await
    {
        Ok(docs) if !docs.is_empty() => docs,
        _ => {
            tracing::info!("Vector search failed, using keyword fallback for projects");
            keyword_search(
                &rag_state.db_client.projects(),
                &request.messages,
                vec!["title", "description.overview"],
                3,
            )
            .await
            .unwrap_or_default()
        }
    };

    // Step 3: Vector search for certificates
    let certs_docs = match vector_search(
        &rag_state.db_client.certificates(),
        query_embedding,
        "certificates_index",
        3,
    )
    .await
    {
        Ok(docs) if !docs.is_empty() => docs,
        _ => keyword_search(
            &rag_state.db_client.certificates(),
            &request.messages,
            vec!["name", "issuer"],
            3,
        )
        .await
        .unwrap_or_default(),
    };

    // Step 4: Format context
    let projects_context = format_projects(projects_docs);
    let certs_context = format_certificates(certs_docs);

    // Step 5: Build system prompt with context
    let system_prompt = build_system_prompt(&projects_context, &certs_context);

    // Step 6: Combine system prompt + user message
    let full_prompt = format!(
        "{}

User Question: {}",
        system_prompt, request.messages
    );

    // Step 7: Generate response
    match rag_state.gemini_client.chat(&full_prompt).await {
        Ok(content) => {
            tracing::info!("RAG response generated successfully");
            Ok(Json(ChatResponse { content }))
        }
        Err(e) => {
            tracing::error!("Gemini API error: {}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

async fn fallback_chat(
    gemini_client: &GeminiClient,
    message: &str,
) -> Result<Json<ChatResponse>, StatusCode> {
    match gemini_client.chat(message).await {
        Ok(content) => Ok(Json(ChatResponse { content })),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}
