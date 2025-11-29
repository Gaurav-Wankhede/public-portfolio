"use client";

import Script from "next/script";
import { siteConfig } from "@/config/site";

/**
 * Dynamic Project Schema for individual project pages
 */
interface ProjectSchemaProps {
  name: string;
  description: string;
  image: string;
  url: string;
  datePublished: string;
  technologies: string[];
  category: string;
}

export function ProjectSchema(props: ProjectSchemaProps) {
  const projectSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": props.url,
    name: props.name,
    description: props.description,
    image: props.image,
    url: props.url,
    author: {
      "@type": "Person",
      name: siteConfig.ownerName,
      url: siteConfig.siteUrl,
      jobTitle: siteConfig.ownerTitle,
    },
    creator: {
      "@type": "Person",
      name: siteConfig.ownerName,
    },
    datePublished: props.datePublished,
    inLanguage: "en",
    keywords: props.technologies.join(", "),
    genre: props.category,
    about: props.technologies.map((tech) => ({
      "@type": "Thing",
      name: tech,
    })),
  };

  return (
    <Script
      id="project-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema) }}
      strategy="afterInteractive"
    />
  );
}

/**
 * Dynamic Portfolio/ItemList Schema for projects page
 */
interface PortfolioProject {
  name: string;
  description: string;
  url: string;
  image: string;
  technologies: string[];
}

export function PortfolioSchema({
  projects,
}: {
  projects: PortfolioProject[];
}) {
  const portfolioSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${siteConfig.ownerName}'s Projects`,
    description: siteConfig.siteDescription,
    url: `${siteConfig.siteUrl}/projects`,
    numberOfItems: projects.length,
    itemListElement: projects.map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "CreativeWork",
        name: project.name,
        description: project.description,
        url: project.url,
        image: project.image,
        author: {
          "@type": "Person",
          name: siteConfig.ownerName,
        },
        keywords: project.technologies.join(", "),
      },
    })),
  };

  return (
    <Script
      id="portfolio-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(portfolioSchema) }}
      strategy="afterInteractive"
    />
  );
}

/**
 * Dynamic ProfilePage Schema for About page
 */
interface Certificate {
  name: string;
  issuer: string;
  date: string;
  url: string;
}

export function ProfilePageSchema({
  certificates,
}: {
  certificates: Certificate[];
}) {
  const sameAs = Object.values(siteConfig.socialLinks).filter(Boolean);

  const profileSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: siteConfig.ownerName,
      jobTitle: siteConfig.ownerTitle,
      description: siteConfig.ownerBio,
      url: siteConfig.siteUrl,
      image: `${siteConfig.siteUrl}/profile.png`,
      sameAs: sameAs,
      email: siteConfig.contactEmail,
      hasCredential: certificates.map((cert) => ({
        "@type": "EducationalOccupationalCredential",
        name: cert.name,
        credentialCategory: "certificate",
        recognizedBy: {
          "@type": "Organization",
          name: cert.issuer,
        },
        dateCreated: cert.date,
        url: cert.url,
      })),
    },
  };

  return (
    <Script
      id="profile-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(profileSchema) }}
      strategy="afterInteractive"
    />
  );
}

/**
 * Dynamic ContactPage Schema
 */
export function ContactPageSchema() {
  const sameAs = Object.values(siteConfig.socialLinks).filter(Boolean);

  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: `Contact ${siteConfig.ownerName}`,
    description: `Get in touch with ${siteConfig.ownerName}`,
    url: `${siteConfig.siteUrl}/contact`,
    mainEntity: {
      "@type": "Person",
      name: siteConfig.ownerName,
      email: siteConfig.contactEmail,
      url: siteConfig.siteUrl,
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "Professional Services",
        email: siteConfig.contactEmail,
        availableLanguage: ["English"],
        areaServed: "Worldwide",
      },
      sameAs: sameAs,
    },
  };

  return (
    <Script
      id="contact-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      strategy="afterInteractive"
    />
  );
}

/**
 * Homepage combined schema with Person + WebSite
 */
export function HomePageSchema() {
  const sameAs = Object.values(siteConfig.socialLinks).filter(Boolean);

  const homeSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${siteConfig.siteUrl}#person`,
        name: siteConfig.ownerName,
        url: siteConfig.siteUrl,
        image: `${siteConfig.siteUrl}/profile.png`,
        jobTitle: siteConfig.ownerTitle,
        description: siteConfig.ownerBio,
        sameAs: sameAs,
        email: siteConfig.contactEmail,
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.siteUrl}#website`,
        url: siteConfig.siteUrl,
        name: siteConfig.siteName,
        description: siteConfig.siteDescription,
        publisher: {
          "@id": `${siteConfig.siteUrl}#person`,
        },
        inLanguage: "en",
      },
    ],
  };

  return (
    <Script
      id="homepage-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(homeSchema) }}
      strategy="afterInteractive"
    />
  );
}
