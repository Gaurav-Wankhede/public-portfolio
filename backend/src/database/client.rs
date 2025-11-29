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

    /// Get testimonials collection
    pub fn testimonials(&self) -> Collection<Document> {
        self.connection.database().collection("testimonials")
    }

    /// Get blog posts collection
    pub fn blog_posts(&self) -> Collection<Document> {
        self.connection.database().collection("posts")
    }

    /// Get blog categories collection
    pub fn blog_categories(&self) -> Collection<Document> {
        self.connection.database().collection("categories")
    }

    /// Get blog tags collection
    pub fn blog_tags(&self) -> Collection<Document> {
        self.connection.database().collection("tags")
    }

    /// Get affiliate products collection
    pub fn affiliate_products(&self) -> Collection<Document> {
        self.connection.database().collection("affiliate_products")
    }

    /// Get affiliate clicks collection
    pub fn affiliate_clicks(&self) -> Collection<Document> {
        self.connection.database().collection("affiliate_clicks")
    }

    /// Get affiliate conversions collection
    pub fn affiliate_conversions(&self) -> Collection<Document> {
        self.connection
            .database()
            .collection("affiliate_conversions")
    }

    /// Get affiliate commissions collection
    #[allow(dead_code)]
    pub fn affiliate_commissions(&self) -> Collection<Document> {
        self.connection
            .database()
            .collection("affiliate_commissions")
    }

    /// Get generic collection by name
    pub fn collection(&self, name: &str) -> Collection<Document> {
        self.connection.database().collection(name)
    }

    /// Delete document by ID from collection
    pub async fn delete_by_id(&self, collection_name: &str, id: &str) -> anyhow::Result<bool> {
        let collection = self.collection(collection_name);
        let object_id = bson::oid::ObjectId::parse_str(id)?;
        let result = collection.delete_one(doc! { "_id": object_id }).await?;
        Ok(result.deleted_count > 0)
    }

    /// Update document by ID in collection
    pub async fn update_by_id(
        &self,
        collection_name: &str,
        id: &str,
        update_data: Document,
    ) -> anyhow::Result<bool> {
        let collection = self.collection(collection_name);
        let object_id = bson::oid::ObjectId::parse_str(id)?;
        let result = collection
            .update_one(doc! { "_id": object_id }, doc! { "$set": update_data })
            .await?;
        Ok(result.modified_count > 0)
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
