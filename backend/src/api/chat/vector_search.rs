use mongodb::{bson::{doc, Document}, Collection};
use anyhow::Result;

/// Perform MongoDB vector search on embeddings
pub async fn vector_search(
    collection: &Collection<Document>,
    query_embedding: Vec<f64>,
    index_name: &str,
    limit: i64,
) -> Result<Vec<Document>> {
    let pipeline = vec![
        doc! {
            "$vectorSearch": {
                "index": index_name,
                "path": "embedding",
                "queryVector": query_embedding,
                "numCandidates": 10,
                "limit": limit
            }
        },
        doc! {
            "$project": {
                "_id": 1,
                "title": 1,
                "name": 1,
                "date": 1,
                "issue_date": 1,
                "description": 1,
                "technologies": 1,
                "githubUrl": 1,
                "demoUrl": 1,
                "ReportUrl": 1,
                "issuer": 1,
                "link": 1,
                "score": { "$meta": "vectorSearchScore" }
            }
        }
    ];
    
    let mut cursor = collection.aggregate(pipeline).await?;
    let mut results = Vec::new();
    
    use futures::stream::TryStreamExt;
    while let Some(doc) = cursor.try_next().await? {
        results.push(doc);
    }
    
    Ok(results)
}

/// Fallback keyword search when vector search fails
pub async fn keyword_search(
    collection: &Collection<Document>,
    query: &str,
    search_fields: Vec<&str>,
    limit: i64,
) -> Result<Vec<Document>> {
    let query_words: Vec<&str> = query.split_whitespace().collect();
    let mut or_conditions = Vec::new();
    
    for word in query_words {
        for field in &search_fields {
            or_conditions.push(doc! {
                *field: {
                    "$regex": word.to_string(),
                    "$options": "i"
                }
            });
        }
    }
    
    let filter = doc! { "$or": or_conditions };
    let options = mongodb::options::FindOptions::builder()
        .limit(limit)
        .build();
    
    let mut cursor = collection.find(filter).with_options(options).await?;
    let mut results = Vec::new();
    
    use futures::stream::TryStreamExt;
    while let Some(doc) = cursor.try_next().await? {
        results.push(doc);
    }
    
    Ok(results)
}
