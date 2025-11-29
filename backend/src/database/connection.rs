use anyhow::{Context, Result};
use mongodb::{Client, Database};
use std::sync::Arc;

/// Database connection manager with pooling
#[derive(Debug, Clone)]
pub struct DatabaseConnection {
    client: Arc<Client>,
    database_name: String,
}

impl DatabaseConnection {
    /// Create new database connection from MongoDB URI
    pub async fn new(uri: &str, database_name: &str) -> Result<Self> {
        tracing::info!("Initializing MongoDB connection to: {}", database_name);

        let client = Client::with_uri_str(uri)
            .await
            .context("Failed to create MongoDB client")?;

        // Verify connection
        client
            .list_database_names()
            .await
            .context("Failed to verify MongoDB connection")?;

        tracing::info!("MongoDB connection established successfully");

        Ok(Self {
            client: Arc::new(client),
            database_name: database_name.to_string(),
        })
    }

    /// Get database instance
    pub fn database(&self) -> Database {
        self.client.database(&self.database_name)
    }
}
