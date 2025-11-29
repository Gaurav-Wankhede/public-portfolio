import { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

const baseUrl = siteConfig.siteUrl;

// Generate the current date for lastModified
const getCurrentDate = () => new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: baseUrl,
      lastModified: getCurrentDate(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: getCurrentDate(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: getCurrentDate(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: getCurrentDate(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/Ask-Username`,
      lastModified: getCurrentDate(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];
}
