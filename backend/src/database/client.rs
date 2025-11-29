use super::DatabaseConnection;
use bson::{doc, Document};
use mongodb::Collection;

/// MongoDB client wrapper for collection access
#[derive(Debug, Clone)]
pub struct MongoClient {
    connection: DatabaseConnection,
}

impl MongoClient {
    /// Create new MongoClient instance
    pub fn new(connection: DatabaseConnection) -> Self {
        Self { connection }
    }

    /// Get projects collection
    pub fn projects(&self) -> Collection<Document> {
        self.connection.database().collection("projects")
    }

    /// Get certificates collection
    pub fn certificates(&self) -> Collection<Document> {
        self.connection.database().collection("certificates")
    }

    /// Get generic collection by name
    pub fn collection(&self, name: &str) -> Collection<Document> {
        self.connection.database().collection(name)
    }

    /// Delete document by slug from collection
    pub async fn delete_by_slug(&self, collection_name: &str, slug: &str) -> anyhow::Result<bool> {
        let collection = self.collection(collection_name);
        let result = collection.delete_one(doc! { "slug": slug }).await?;
        Ok(result.deleted_count > 0)
    }

    /// Update document by slug in collection
    pub async fn update_by_slug(
        &self,
        collection_name: &str,
        slug: &str,
        update_data: Document,
    ) -> anyhow::Result<bool> {
        let collection = self.collection(collection_name);
        let result = collection
            .update_one(doc! { "slug": slug }, doc! { "$set": update_data })
            .await?;
        Ok(result.modified_count > 0)
    }
}
