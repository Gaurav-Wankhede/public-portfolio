use mongodb::bson::oid::ObjectId;
use serde::{Deserialize, Serialize};
use validator::Validate;

#[cfg(feature = "swagger")]
use utoipa::ToSchema;

#[derive(Debug, Serialize, Deserialize, Validate)]
#[cfg_attr(feature = "swagger", derive(ToSchema))]
pub struct Certificate {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    #[cfg_attr(feature = "swagger", schema(value_type = Option<String>))]
    pub id: Option<ObjectId>,

    #[validate(length(min = 1))]
    pub name: String,

    #[validate(length(min = 1))]
    pub issuer: String,

    #[validate(url)]
    pub link: String,

    pub slug: String,

    #[serde(rename = "issue_date")]
    pub issue_date: Option<String>,

    pub embedding: Option<Vec<f64>>,

    #[serde(rename = "image_url")]
    pub image_url: Option<String>,
}

impl Certificate {
    pub fn generate_slug(name: &str) -> String {
        name.to_lowercase()
            .chars()
            .map(|c| if c.is_alphanumeric() { c } else { '-' })
            .collect::<String>()
            .split('-')
            .filter(|s| !s.is_empty())
            .collect::<Vec<_>>()
            .join("-")
    }
}

/// DTO for updating certificates - excludes _id, slug, and embedding (auto-managed)
#[derive(Debug, Serialize, Deserialize, Validate)]
#[cfg_attr(feature = "swagger", derive(ToSchema))]
pub struct CertificateUpdate {
    #[validate(length(min = 1))]
    pub name: String,

    #[validate(length(min = 1))]
    pub issuer: String,

    #[validate(url)]
    pub link: String,

    #[serde(rename = "issue_date")]
    pub issue_date: Option<String>,

    #[serde(rename = "image_url")]
    pub image_url: Option<String>,
}
