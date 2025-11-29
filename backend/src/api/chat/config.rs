/// Portfolio owner configuration for AI chat persona
/// All fields are loaded from environment variables via Shuttle secrets

#[derive(Clone, Debug)]
pub struct PortfolioOwner {
    /// Full name of the portfolio owner
    pub name: String,
    /// Professional title (e.g., "Full-Stack Developer", "AI Engineer")
    pub title: String,
    /// Short bio/tagline
    pub tagline: String,
    /// Location (e.g., "India", "San Francisco, CA")
    pub location: String,
    /// Core expertise areas (comma-separated in env, parsed to Vec)
    pub expertise: Vec<String>,
    /// Social links
    pub youtube_url: Option<String>,
    pub youtube_channel_name: Option<String>,
    pub linkedin_url: Option<String>,
    pub github_url: Option<String>,
    pub twitter_url: Option<String>,
    pub email: Option<String>,
    pub website_url: Option<String>,
}

impl PortfolioOwner {
    /// Create from Shuttle secrets with sensible defaults
    pub fn from_secrets(secrets: &shuttle_runtime::SecretStore) -> Self {
        let expertise_str = secrets
            .get("PORTFOLIO_EXPERTISE")
            .unwrap_or_else(|| "Software Development, Web Development".to_string());

        let expertise: Vec<String> = expertise_str
            .split(',')
            .map(|s| s.trim().to_string())
            .filter(|s| !s.is_empty())
            .collect();

        Self {
            name: secrets
                .get("PORTFOLIO_OWNER_NAME")
                .unwrap_or_else(|| "Portfolio Owner".to_string()),
            title: secrets
                .get("PORTFOLIO_OWNER_TITLE")
                .unwrap_or_else(|| "Software Developer".to_string()),
            tagline: secrets
                .get("PORTFOLIO_TAGLINE")
                .unwrap_or_else(|| "Building solutions that matter".to_string()),
            location: secrets
                .get("PORTFOLIO_LOCATION")
                .unwrap_or_else(|| "Earth".to_string()),
            expertise,
            youtube_url: secrets.get("PORTFOLIO_YOUTUBE_URL"),
            youtube_channel_name: secrets.get("PORTFOLIO_YOUTUBE_CHANNEL"),
            linkedin_url: secrets.get("PORTFOLIO_LINKEDIN_URL"),
            github_url: secrets.get("PORTFOLIO_GITHUB_URL"),
            twitter_url: secrets.get("PORTFOLIO_TWITTER_URL"),
            email: secrets.get("PORTFOLIO_EMAIL"),
            website_url: secrets.get("PORTFOLIO_WEBSITE_URL"),
        }
    }

    /// Format social links section for the prompt
    pub fn format_social_links(&self) -> String {
        let mut links = Vec::new();

        if let Some(ref url) = self.youtube_url {
            let channel = self.youtube_channel_name.as_deref().unwrap_or("My Channel");
            links.push(format!(
                "- **YouTube ({}):** {} — \"I share tutorials and insights here\"",
                channel, url
            ));
        }

        if let Some(ref url) = self.linkedin_url {
            links.push(format!(
                "- **LinkedIn:** {} — \"Let's connect professionally\"",
                url
            ));
        }

        if let Some(ref url) = self.github_url {
            links.push(format!(
                "- **GitHub:** {} — \"Check out my open-source work\"",
                url
            ));
        }

        if let Some(ref url) = self.twitter_url {
            links.push(format!(
                "- **Twitter/X:** {} — \"Follow for tech updates\"",
                url
            ));
        }

        if let Some(ref email) = self.email {
            links.push(format!(
                "- **Email:** {} — \"For collaborations or questions\"",
                email
            ));
        }

        if let Some(ref url) = self.website_url {
            links.push(format!("- **Website:** {} — \"Visit my portfolio\"", url));
        }

        if links.is_empty() {
            "No social links configured.".to_string()
        } else {
            links.join("\n")
        }
    }

    /// Format expertise for the prompt
    pub fn format_expertise(&self) -> String {
        if self.expertise.is_empty() {
            "Software Development".to_string()
        } else {
            self.expertise.join(", ")
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_format_social_links_empty() {
        let owner = PortfolioOwner {
            name: "Test".to_string(),
            title: "Dev".to_string(),
            tagline: "Test".to_string(),
            location: "Test".to_string(),
            expertise: vec![],
            youtube_url: None,
            youtube_channel_name: None,
            linkedin_url: None,
            github_url: None,
            twitter_url: None,
            email: None,
            website_url: None,
        };
        assert_eq!(owner.format_social_links(), "No social links configured.");
    }

    #[test]
    fn test_format_expertise() {
        let owner = PortfolioOwner {
            name: "Test".to_string(),
            title: "Dev".to_string(),
            tagline: "Test".to_string(),
            location: "Test".to_string(),
            expertise: vec!["Rust".to_string(), "TypeScript".to_string()],
            youtube_url: None,
            youtube_channel_name: None,
            linkedin_url: None,
            github_url: None,
            twitter_url: None,
            email: None,
            website_url: None,
        };
        assert_eq!(owner.format_expertise(), "Rust, TypeScript");
    }
}
