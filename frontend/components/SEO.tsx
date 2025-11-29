import Head from "next/head";
import { siteConfig } from "@/config/site";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: string;
  canonicalUrl?: string;
}

export default function SEO({
  title = `${siteConfig.ownerName} - ${siteConfig.ownerTitle}`,
  description = siteConfig.siteDescription,
  keywords = [
    siteConfig.ownerName,
    "Developer",
    "Portfolio",
    "Projects",
    "Software Engineer",
  ],
  ogImage = "/og-image.jpg",
  ogType = "website",
  canonicalUrl = siteConfig.siteUrl,
}: SEOProps) {
  const formattedTitle = `${title} | ${siteConfig.siteName}`;

  // Build sameAs array from available social links
  const sameAs = Object.values(siteConfig.socialLinks).filter(Boolean);

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{formattedTitle}</title>
      <meta name="title" content={formattedTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(", ")} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={formattedTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonicalUrl} />
      <meta property="twitter:title" content={formattedTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="author" content={siteConfig.ownerName} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />

      {/* Schema.org markup for Google */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: siteConfig.ownerName,
          jobTitle: siteConfig.ownerTitle,
          url: canonicalUrl,
          sameAs: sameAs,
        })}
      </script>
    </Head>
  );
}
