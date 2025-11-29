import Script from "next/script";
import { siteConfig } from "@/config/site";

/**
 * Person Schema Structured Data for SEO
 * Helps search engines understand the portfolio owner's professional identity
 */
export function PersonSchema() {
  const sameAs = Object.values(siteConfig.socialLinks).filter(Boolean);

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.ownerName,
    jobTitle: siteConfig.ownerTitle,
    description: siteConfig.ownerBio,
    url: siteConfig.siteUrl,
    image: `${siteConfig.siteUrl}/profile.png`,
    sameAs: sameAs,
    email: siteConfig.contactEmail,
    knowsAbout: [
      "Software Development",
      "Full-Stack Development",
      "Web Development",
    ],
  };

  return (
    <Script
      id="person-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      strategy="afterInteractive"
    />
  );
}

/**
 * WebSite Schema for search engine optimization
 */
export function WebSiteSchema() {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.siteName,
    url: siteConfig.siteUrl,
    description: siteConfig.siteDescription,
    inLanguage: "en",
    author: {
      "@type": "Person",
      name: siteConfig.ownerName,
      url: siteConfig.siteUrl,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.siteUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <Script
      id="website-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      strategy="afterInteractive"
    />
  );
}

/**
 * BreadcrumbList Schema for navigation
 */
interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.siteUrl}${item.url}`,
    })),
  };

  return (
    <Script
      id="breadcrumb-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      strategy="afterInteractive"
    />
  );
}

/**
 * VideoObject Schema for videos
 */
interface VideoData {
  title: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration?: string;
  embedUrl: string;
}

export function VideoSchema({ video }: { video: VideoData }) {
  const videoSchema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.title,
    description: video.description,
    thumbnailUrl: video.thumbnailUrl,
    uploadDate: video.uploadDate,
    duration: video.duration,
    embedUrl: video.embedUrl,
    author: {
      "@type": "Person",
      name: siteConfig.ownerName,
      url: siteConfig.siteUrl,
    },
  };

  return (
    <Script
      id="video-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }}
      strategy="afterInteractive"
    />
  );
}

/**
 * FAQPage Schema for FAQ pages
 */
interface FAQItem {
  question: string;
  answer: string;
}

export function FAQSchema({ faqs }: { faqs: FAQItem[] }) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <Script
      id="faq-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      strategy="afterInteractive"
    />
  );
}
