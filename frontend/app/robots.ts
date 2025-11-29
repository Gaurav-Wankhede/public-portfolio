import { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.siteUrl;

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/projects/", "/about/", "/contact/", "/Ask-Username/"],
      disallow: ["/api/", "/private/", "/_*", "/*.json$"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
