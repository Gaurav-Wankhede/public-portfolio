/**
 * Site Configuration
 * Customize these values to personalize your portfolio
 * All values can be overridden via environment variables
 */

export const siteConfig = {
  // Owner Information
  ownerName: process.env.NEXT_PUBLIC_OWNER_NAME || "Your Name",
  ownerFirstName: process.env.NEXT_PUBLIC_OWNER_FIRST_NAME || "User",
  ownerInitials: process.env.NEXT_PUBLIC_OWNER_INITIALS || "YN",
  ownerTitle: process.env.NEXT_PUBLIC_OWNER_TITLE || "Full-Stack Developer",
  ownerBio:
    process.env.NEXT_PUBLIC_OWNER_BIO ||
    "Passionate developer building innovative solutions with modern technologies.",

  // Site Metadata
  siteName: process.env.NEXT_PUBLIC_SITE_NAME || "Portfolio",
  siteDescription:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
    "My personal portfolio showcasing projects and skills",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://example.com",

  // Contact
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@example.com",
  contactPhone: process.env.NEXT_PUBLIC_CONTACT_PHONE || "",
  contactLocation: process.env.NEXT_PUBLIC_CONTACT_LOCATION || "",

  // Social Links (leave empty string if not applicable)
  socialLinks: {
    github: process.env.NEXT_PUBLIC_GITHUB_URL || "",
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || "",
    twitter: process.env.NEXT_PUBLIC_TWITTER_URL || "",
    youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL || "",
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "",
  },

  // GitHub username for stats (optional)
  githubUsername: process.env.NEXT_PUBLIC_GITHUB_USERNAME || "",

  // Stats/Counter Configuration
  fallbackRepoCount: parseInt(
    process.env.NEXT_PUBLIC_FALLBACK_REPO_COUNT || "20",
    10,
  ),
  fallbackContributionCount: parseInt(
    process.env.NEXT_PUBLIC_FALLBACK_CONTRIBUTION_COUNT || "10",
    10,
  ),
  freelanceProjectsCount: parseInt(
    process.env.NEXT_PUBLIC_FREELANCE_PROJECTS_COUNT || "6",
    10,
  ),
  deployedAppsCount: parseInt(
    process.env.NEXT_PUBLIC_DEPLOYED_APPS_COUNT || "10",
    10,
  ),

  // Chat Page Configuration
  chatPageTitle: `Ask ${process.env.NEXT_PUBLIC_OWNER_FIRST_NAME || "User"}`,
  chatPageDescription: `Chat with an AI assistant to learn more about ${process.env.NEXT_PUBLIC_OWNER_NAME || "this developer"}`,

  // Footer Configuration
  footerTagline:
    process.env.NEXT_PUBLIC_FOOTER_TAGLINE || "Building the future with code",
  copyrightStartYear: process.env.NEXT_PUBLIC_COPYRIGHT_START_YEAR || "2024",

  // Navigation Links (routes that should appear in navbar)
  navLinks: [
    { path: "/projects", label: "Projects" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
  ],

  // Footer Links (customize which links appear in footer)
  footerQuickLinks: [
    { href: "/", label: "Home" },
    { href: "/projects", label: "Projects" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ],

  // Suggested prompts for chat (customize as needed)
  suggestedPrompts: [
    {
      icon: "🚀",
      text: `Tell me about the projects`,
      description: "Explore portfolio highlights",
    },
    {
      icon: "💻",
      text: `What technologies are used?`,
      description: "Tech stack & expertise",
    },
    {
      icon: "🎯",
      text: `What are the key skills?`,
      description: "Skills and experience",
    },
    {
      icon: "📧",
      text: `How can I get in touch?`,
      description: "Contact information",
    },
  ],
};

export type SiteConfig = typeof siteConfig;
