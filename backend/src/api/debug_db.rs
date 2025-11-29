use axum::{
    extract::State,
    http::StatusCode,
    Json,
};
use std::sync::Arc;
use serde::{Deserialize, Serialize};
use crate::database::DatabaseConnection;

#[derive(Debug, Serialize, Deserialize)]
pub struct DatabaseInfo {
    pub databases: Vec<String>,
    pub current_database: String,
    pub collections: Vec<CollectionInfo>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CollectionInfo {
    pub name: String,
    pub document_count: i64,
}

/// Debug endpoint to list all databases and collections
pub async fn list_databases(
    State(db_conn): State<Arc<DatabaseConnection>>,
) -> Result<Json<DatabaseInfo>, (StatusCode, String)> {
    // List all databases
    let databases = db_conn.client()
        .list_database_names()
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("Failed to list databases: {}", e)))?;
    
    // Get current database name
    let current_db = db_conn.database();
    let db_name = current_db.name().to_string();
    
    // List collections in current database
    let collection_names = current_db
        .list_collection_names()
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("Failed to list collections: {}", e)))?;
    
    // Get document counts for each collection
    let mut collections = Vec::new();
    for name in collection_names {
        let collection = current_db.collection::<mongodb::bson::Document>(&name);
        let count = collection
            .count_documents(mongodb::bson::doc! {})
            .await
            .unwrap_or(0);
        
        collections.push(CollectionInfo {
            name,
            document_count: count as i64,
        });
    }
    
    Ok(Json(DatabaseInfo {
        databases,
        current_database: db_name,
        collections,
    }))
}
