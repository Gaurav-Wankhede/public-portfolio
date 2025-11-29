use mongodb::bson::oid::ObjectId;
use serde::{Deserialize, Serialize};
use validator::Validate;

#[cfg(feature = "swagger")]
use utoipa::ToSchema;

#[derive(Debug, Serialize, Deserialize, Validate)]
#[cfg_attr(feature = "swagger", derive(ToSchema))]
pub struct Project {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    #[cfg_attr(feature = "swagger", schema(value_type = Option<String>))]
    pub id: Option<ObjectId>,

    #[validate(length(min = 1))]
    pub slug: String,

    pub date: String,

    #[validate(length(min = 1))]
    pub title: String,

    pub description: Option<Description>,

    #[validate(length(min = 1))]
    pub technologies: Vec<String>,

    pub features: Vec<String>,

    #[serde(rename = "githubUrl")]
    #[validate(url)]
    pub github_url: String,

    #[serde(rename = "ReportUrl")]
    pub report_url: Option<String>,

    #[serde(rename = "demoUrl")]
    pub demo_url: Option<String>,

    #[serde(rename = "youtubeUrl")]
    pub youtube_url: Option<String>,

    pub embedding: Option<Vec<f64>>,
    pub images: Option<Vec<String>>,
}

#[derive(Debug, Serialize, Deserialize)]
#[cfg_attr(feature = "swagger", derive(ToSchema))]
pub struct Description {
    pub title: Option<String>,
    pub overview: Option<String>,
    pub problem: Option<String>,
    pub solution: Option<String>,
    pub impact: Option<String>,
    #[serde(rename = "datasetDescription")]
    pub dataset_description: Option<serde_json::Value>,
    #[serde(rename = "dashboardInfo")]
    pub dashboard_info: Option<String>,
}

/// DTO for updating projects - excludes _id and embedding (auto-managed)
#[derive(Debug, Serialize, Deserialize, Validate)]
#[cfg_attr(feature = "swagger", derive(ToSchema))]
pub struct ProjectUpdate {
    #[validate(length(min = 1))]
    pub slug: String,

    pub date: String,

    #[validate(length(min = 1))]
    pub title: String,

    pub description: Option<Description>,

    #[validate(length(min = 1))]
    pub technologies: Vec<String>,

    pub features: Vec<String>,

    #[serde(rename = "githubUrl")]
    #[validate(url)]
    pub github_url: String,

    #[serde(rename = "ReportUrl")]
    pub report_url: Option<String>,

    #[serde(rename = "demoUrl")]
    pub demo_url: Option<String>,

    #[serde(rename = "youtubeUrl")]
    pub youtube_url: Option<String>,

    pub images: Option<Vec<String>>,
}
