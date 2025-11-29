use mongodb::bson::Document;

/// Format projects into storytelling-friendly context
/// Presents data in a way that encourages narrative responses
pub fn format_projects(docs: Vec<Document>) -> String {
    if docs.is_empty() {
        return "No specific projects to reference right now. If asked about projects, share that you have various projects on your GitHub and invite them to explore.".to_string();
    }

    let mut formatted = Vec::new();

    for doc in docs {
        let mut project = Vec::new();

        if let Ok(title) = doc.get_str("title") {
            // Project name as a conversation starter
            project.push(format!("**{}**", title));

            // Timeline context
            if let Ok(date) = doc.get_str("date") {
                project.push(format!("*Built: {}*", date));
            }

            // Tech stack (for reference, not for listing)
            if let Ok(techs) = doc.get_array("technologies") {
                let tech_list: Vec<String> = techs
                    .iter()
                    .filter_map(|t| t.as_str().map(|s| s.to_string()))
                    .collect();
                if !tech_list.is_empty() {
                    project.push(format!("Tech used: {}", tech_list.join(", ")));
                }
            }

            // The story elements - most important for humanized responses
            if let Ok(desc) = doc.get_document("description") {
                // The problem (the WHY)
                if let Ok(problem) = desc.get_str("problem") {
                    project.push(format!("The problem I wanted to solve: {}", problem));
                }

                // The overview (the WHAT)
                if let Ok(overview) = desc.get_str("overview") {
                    project.push(format!("What it does: {}", overview));
                }

                // The solution (the HOW)
                if let Ok(solution) = desc.get_str("solution") {
                    project.push(format!("How I solved it: {}", solution));
                }
            }

            // Links for reference (only share when relevant)
            let mut links = Vec::new();
            if let Ok(github) = doc.get_str("githubUrl") {
                links.push(format!("GitHub: {}", github));
            }
            if let Ok(demo) = doc.get_str("demoUrl") {
                links.push(format!("Live demo: {}", demo));
            }
            if let Ok(report) = doc.get_str("ReportUrl") {
                links.push(format!("Report: {}", report));
            }

            if !links.is_empty() {
                project.push(format!("Links: {}", links.join(" | ")));
            }

            project.push("---".to_string());
            formatted.push(project.join("\n"));
        }
    }

    formatted.join("\n\n")
}

/// Format certificates into growth-journey context
/// Frames certifications as investments in learning, not just achievements
pub fn format_certificates(docs: Vec<Document>) -> String {
    if docs.is_empty() {
        return "No specific certifications to reference right now. If asked about learning, share your commitment to continuous growth and self-directed learning.".to_string();
    }

    let mut formatted = Vec::new();

    for doc in docs {
        let mut cert = Vec::new();

        if let Ok(name) = doc.get_str("name") {
            // Certificate as a learning milestone
            cert.push(format!("**{}**", name));

            // Who provided the learning
            if let Ok(issuer) = doc.get_str("issuer") {
                cert.push(format!("From: {}", issuer));
            }

            // When this learning journey happened
            if let Ok(date) = doc.get_str("issue_date") {
                cert.push(format!("Completed: {}", date));
            }

            // Verification link
            if let Ok(link) = doc.get_str("link") {
                cert.push(format!("Verify: {}", link));
            }

            cert.push("---".to_string());
            formatted.push(cert.join("\n"));
        }
    }

    formatted.join("\n\n")
}

#[cfg(test)]
mod tests {
    use super::*;
    use mongodb::bson::doc;

    #[test]
    fn test_format_empty_projects() {
        let result = format_projects(vec![]);
        assert!(result.contains("No specific projects"));
    }

    #[test]
    fn test_format_empty_certificates() {
        let result = format_certificates(vec![]);
        assert!(result.contains("No specific certifications"));
    }

    #[test]
    fn test_format_project_with_title() {
        let doc = doc! {
            "title": "Test Project",
            "date": "2024"
        };
        let result = format_projects(vec![doc]);
        assert!(result.contains("**Test Project**"));
        assert!(result.contains("Built: 2024"));
    }

    #[test]
    fn test_format_certificate_with_details() {
        let doc = doc! {
            "name": "AI Certificate",
            "issuer": "Coursera",
            "issue_date": "2024"
        };
        let result = format_certificates(vec![doc]);
        assert!(result.contains("**AI Certificate**"));
        assert!(result.contains("From: Coursera"));
    }
}
