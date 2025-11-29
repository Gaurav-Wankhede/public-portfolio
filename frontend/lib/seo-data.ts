import { siteConfig } from "@/config/site";

// SEO data structure
export interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  ogImage: string;
  canonicalUrl: string;
}

// Dynamic SEO data per route
// Centralized for use in both API routes and direct imports
export const dynamicSEOData: Record<string, SEOData> = {
  home: {
    title: `${siteConfig.ownerName} | ${siteConfig.ownerTitle}`,
    description: siteConfig.siteDescription,
    keywords: [siteConfig.ownerName, "Portfolio", "Developer", "Projects"],
    ogImage: `/api/og?title=${encodeURIComponent(siteConfig.ownerName)}&subtitle=${encodeURIComponent(siteConfig.ownerTitle)}&theme=default`,
    canonicalUrl: siteConfig.siteUrl,
  },
  about: {
    title: `About ${siteConfig.ownerName}`,
    description: siteConfig.ownerBio,
    keywords: ["About", siteConfig.ownerName, "Background", "Experience"],
    ogImage: `/api/og?title=About&subtitle=${encodeURIComponent(siteConfig.ownerName)}&theme=default`,
    canonicalUrl: `${siteConfig.siteUrl}/about`,
  },
  projects: {
    title: `Projects | ${siteConfig.ownerName}`,
    description: `Explore projects and work by ${siteConfig.ownerName}`,
    keywords: ["Projects", "Portfolio", "Work", "Applications"],
    ogImage: `/api/og?title=Projects&subtitle=Portfolio%20Showcase&theme=projects`,
    canonicalUrl: `${siteConfig.siteUrl}/projects`,
  },
  contact: {
    title: `Contact ${siteConfig.ownerName}`,
    description: `Get in touch with ${siteConfig.ownerName} for collaboration and opportunities`,
    keywords: ["Contact", "Hire", "Collaboration", "Get in Touch"],
    ogImage: `/api/og?title=Contact&subtitle=Let's%20Connect&theme=contact`,
    canonicalUrl: `${siteConfig.siteUrl}/contact`,
  },
  "Ask-Gaurav": {
    title: siteConfig.chatPageTitle,
    description: siteConfig.chatPageDescription,
    keywords: ["Chat", "AI Assistant", "Q&A", "Ask"],
    ogImage: `/api/og?title=${encodeURIComponent(siteConfig.chatPageTitle)}&subtitle=AI-Powered%20Q%26A&theme=default`,
    canonicalUrl: `${siteConfig.siteUrl}/Ask-Username`,
  },
};
