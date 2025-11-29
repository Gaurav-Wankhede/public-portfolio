import { siteMetadata } from "@/app/metadata";
import { Metadata } from "next";
import { dynamicSEOData, type SEOData } from "./seo-data";

type RouteKey = keyof typeof siteMetadata.routes;

interface DynamicSEOData {
  title: string;
  description: string;
  keywords: string[];
  ogImage: string;
  canonicalUrl: string;
  siteName: string;
  siteUrl: string;
  author: string;
  twitterHandle: string;
  locale: string;
}

/**
 * Get SEO data for a route - direct import, no HTTP fetch
 * @param route - The route key to get SEO data for
 * @returns DynamicSEOData with site metadata merged in
 */
function getSEOData(route: string): DynamicSEOData {
  // Get SEO data for the requested route, fallback to home
  const seoData: SEOData = dynamicSEOData[route] || dynamicSEOData.home;

  // Merge with site-wide metadata
  return {
    ...seoData,
    siteName: siteMetadata.siteName,
    siteUrl: siteMetadata.siteUrl,
    author: siteMetadata.author,
    twitterHandle: siteMetadata.twitterHandle,
    locale: siteMetadata.locale,
  };
}

/**
 * Generate metadata for Next.js pages
 * Uses direct import of SEO data - no HTTP fetch needed
 *
 * @param route - The route key from siteMetadata.routes
 * @param dynamicTitle - Optional dynamic title to override the default
 * @param dynamicDescription - Optional dynamic description to override the default
 * @param imageUrl - Optional image URL for og:image
 * @returns Promise<Metadata> object for Next.js pages
 */
export async function generateMetadata(
  route: RouteKey,
  dynamicTitle?: string,
  dynamicDescription?: string,
  imageUrl?: string,
): Promise<Metadata> {
  // Get SEO data directly (no HTTP fetch)
  const dynamicData = getSEOData(route);

  // Use dynamic data, with optional overrides
  const routeData = siteMetadata.routes[route];
  const title = dynamicTitle || dynamicData.title || routeData.title;
  const description =
    dynamicDescription || dynamicData.description || routeData.description;
  const keywords = dynamicData.keywords || routeData.keywords;
  const ogImage = imageUrl || dynamicData.ogImage || siteMetadata.ogImage;
  const url =
    dynamicData.canonicalUrl ||
    `${siteMetadata.siteUrl}/${route === "home" ? "" : route}`;

  return {
    title,
    description,
    keywords,
    authors: [{ name: siteMetadata.author, url: siteMetadata.siteUrl }],
    creator: siteMetadata.author,
    publisher: siteMetadata.author,
    metadataBase: new URL(siteMetadata.siteUrl),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteMetadata.siteName,
      locale: siteMetadata.locale,
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: siteMetadata.twitterHandle,
      creator: siteMetadata.twitterHandle,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

/**
 * Generate metadata for dynamic routes (e.g., blog posts, projects)
 *
 * @param baseRoute - The base route key from siteMetadata.routes
 * @param title - The title of the dynamic page
 * @param description - The description of the dynamic page
 * @param slug - The slug of the dynamic page
 * @param imageUrl - The image URL for og:image
 * @param publishDate - Optional publish date for articles/blog posts
 * @param modifiedDate - Optional modified date for articles/blog posts
 * @returns Metadata object for Next.js pages
 */
export function generateDynamicMetadata(
  baseRoute: RouteKey,
  title: string,
  description: string,
  slug: string,
  imageUrl: string,
  publishDate?: string,
  modifiedDate?: string,
): Metadata {
  const routeData = siteMetadata.routes[baseRoute];
  const url = `${siteMetadata.siteUrl}/${baseRoute}/${slug}`;

  const metadata: Metadata = {
    title,
    description,
    keywords: [...routeData.keywords],
    authors: [{ name: siteMetadata.author, url: siteMetadata.siteUrl }],
    creator: siteMetadata.author,
    publisher: siteMetadata.author,
    metadataBase: new URL(siteMetadata.siteUrl),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteMetadata.siteName,
      locale: siteMetadata.locale,
      type: "article",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      publishedTime: publishDate,
      modifiedTime: modifiedDate,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: siteMetadata.twitterHandle,
      creator: siteMetadata.twitterHandle,
      images: [imageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
        { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      ],
      apple: "/apple-touch-icon.png",
    },
    manifest: "/site.webmanifest",
  };

  return metadata;
}
