import { siteConfig } from "@/config/site";

export const siteMetadata = {
  title: `${siteConfig.ownerName} | ${siteConfig.ownerTitle}`,
  description: siteConfig.siteDescription,
  siteUrl: siteConfig.siteUrl,
  siteName: siteConfig.siteName,
  twitterHandle: "",
  author: siteConfig.ownerName,
  language: "en",
  locale: "en_US",
  type: "website",
  ogImage: "/og-image.jpg",
  github: siteConfig.socialLinks.github,
  linkedin: siteConfig.socialLinks.linkedin,
  youtube: siteConfig.socialLinks.youtube,
  email: siteConfig.contactEmail,
  keywords: [
    siteConfig.ownerName,
    "Portfolio",
    "Developer",
    "Projects",
    "Software Engineer",
  ],
  routes: {
    home: {
      title: `${siteConfig.ownerName} | ${siteConfig.ownerTitle}`,
      description: siteConfig.siteDescription,
      keywords: [siteConfig.ownerName, "Portfolio", "Developer"],
    },
    about: {
      title: `About ${siteConfig.ownerName}`,
      description: siteConfig.ownerBio,
      keywords: ["About", siteConfig.ownerName, "Background"],
    },
    projects: {
      title: `Projects | ${siteConfig.ownerName}`,
      description: `Explore projects by ${siteConfig.ownerName}`,
      keywords: ["Projects", "Portfolio", "Work"],
    },
    contact: {
      title: `Contact ${siteConfig.ownerName}`,
      description: `Get in touch with ${siteConfig.ownerName}`,
      keywords: ["Contact", "Hire", "Collaboration"],
    },
    "Ask-Gaurav": {
      title: siteConfig.chatPageTitle,
      description: siteConfig.chatPageDescription,
      keywords: ["Chat", "AI Assistant", "Q&A"],
    },
  },
};
