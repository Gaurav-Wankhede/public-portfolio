import { siteMetadata } from "@/app/metadata";
import { siteConfig } from "@/config/site";

// Define interfaces for the project, article, and tool objects
interface Project {
  title: string;
  description: string;
  image: string;
  slug: string;
}

interface Article {
  title: string;
  description: string;
  image: string;
  date: string;
  modifiedDate?: string;
  slug: string;
}

interface Tool {
  title: string;
  description: string;
  url: string;
}

export const homeJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteConfig.ownerName,
  jobTitle: siteConfig.ownerTitle,
  description: siteConfig.ownerBio,
  url: siteMetadata.siteUrl,
  sameAs: Object.values(siteConfig.socialLinks).filter(Boolean),
  knowsAbout: [
    "Software Development",
    "Web Development",
    "Full Stack Development",
  ],
};

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteMetadata.siteName,
  url: siteMetadata.siteUrl,
  description: siteMetadata.description,
  author: {
    "@type": "Person",
    name: siteMetadata.author,
    url: siteMetadata.siteUrl,
  },
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteMetadata.siteUrl}/search?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export const projectJsonLd = (project: Project) => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: project.title,
  description: project.description,
  applicationCategory: "WebApplication",
  operatingSystem: "All",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/OnlineOnly",
  },
  author: {
    "@type": "Person",
    name: siteMetadata.author,
    url: siteMetadata.siteUrl,
  },
  screenshot: project.image,
  url: `${siteMetadata.siteUrl}/projects/${project.slug}`,
});

export const articleJsonLd = (article: Article) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: article.title,
  description: article.description,
  image: article.image,
  datePublished: article.date,
  dateModified: article.modifiedDate || article.date,
  author: {
    "@type": "Person",
    name: siteMetadata.author,
    url: siteMetadata.siteUrl,
  },
  publisher: {
    "@type": "Organization",
    name: siteMetadata.siteName,
    logo: {
      "@type": "ImageObject",
      url: `${siteMetadata.siteUrl}/logo.png`,
    },
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": `${siteMetadata.siteUrl}/blog/${article.slug}`,
  },
});

export const toolJsonLd = (tool: Tool) => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: tool.title,
  description: tool.description,
  applicationCategory: "WebApplication",
  operatingSystem: "All",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/OnlineOnly",
  },
  author: {
    "@type": "Person",
    name: siteMetadata.author,
    url: siteMetadata.siteUrl,
  },
  url: `${siteMetadata.siteUrl}${tool.url}`,
});

// Helper function to get metadata for a specific route
export const getRouteMetadata = (route: keyof typeof siteMetadata.routes) => {
  const routeData = siteMetadata.routes[route];
  return {
    title: routeData.title,
    description: routeData.description,
    keywords: routeData.keywords.join(", "),
    url: `${siteMetadata.siteUrl}/${route === "home" ? "" : route}`,
  };
};

// Helper function to generate page-specific metadata
export const generateMetadata = (
  route: keyof typeof siteMetadata.routes,
  pageTitle?: string,
) => {
  const routeData = siteMetadata.routes[route];
  const title = pageTitle || routeData.title;

  return {
    title,
    description: routeData.description,
    keywords: routeData.keywords,
    openGraph: {
      title,
      description: routeData.description,
      url: `${siteMetadata.siteUrl}/${route === "home" ? "" : route}`,
      siteName: siteMetadata.siteName,
      locale: siteMetadata.locale,
      type: "website",
      images: [
        {
          url: siteMetadata.ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: routeData.description,
      site: siteMetadata.twitterHandle,
      creator: siteMetadata.twitterHandle,
      images: [siteMetadata.ogImage],
    },
  };
};
