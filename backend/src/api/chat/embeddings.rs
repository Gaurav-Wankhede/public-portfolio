use reqwest::Client;
use serde::{Deserialize, Serialize};
use anyhow::Result;

#[derive(Debug, Serialize)]
struct EmbeddingRequest {
    model: String,
    content: Content,
}

#[derive(Debug, Serialize)]
struct Content {
    parts: Vec<Part>,
}

#[derive(Debug, Serialize)]
struct Part {
    text: String,
}

#[derive(Debug, Deserialize)]
struct EmbeddingResponse {
    embedding: Embedding,
}

#[derive(Debug, Deserialize)]
struct Embedding {
    values: Vec<f64>,
}

/// Generate embedding vector for query
pub async fn generate_embedding(
    api_key: &str,
    text: &str,
) -> Result<Vec<f64>> {
    let client = Client::new();
    let url = format!(
        "https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key={}",
        api_key
    );
    
    let request_body = EmbeddingRequest {
        model: "models/text-embedding-004".to_string(),
        content: Content {
            parts: vec![Part {
                text: text.to_string(),
            }],
        },
    };
    
    let response = client
        .post(&url)
        .json(&request_body)
        .send()
        .await?;
    
    let embedding_response: EmbeddingResponse = response.json().await?;
    
    Ok(embedding_response.embedding.values)
}
