use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

/// Chat request from client
#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct ChatRequest {
    pub messages: String,
    #[serde(default)]
    pub chat_history: Option<Vec<ChatMessage>>,
}

/// Individual chat message
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct ChatMessage {
    pub role: String,
    pub content: String,
}

/// Chat response to client
#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct ChatResponse {
    pub content: String,
}
