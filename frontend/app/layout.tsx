export const runtime = "edge";

import "@/app/globals.css";
import { siteMetadata } from "@/app/metadata";
import { generateMetadata } from "@/lib/generateMetadata";
import type { Metadata } from "next";
import ClientLayout from "@/components/client/ClientLayout";
import WebVitals from "@/components/WebVitals";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import SkipToContent from "@/components/SkipToContent";
import { PersonSchema, WebSiteSchema } from "@/components/StructuredData";
import Script from "next/script";

// Export metadata as a Server Component
export const metadata: Metadata = {
  ...generateMetadata("home"),
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
    ],
    shortcut: "/icon.png",
    apple: "/logo.png",
  },
  manifest: "/site.webmanifest",
  verification: {
    google: "Caz_7cJN7rqN4NqFy5ARLfJcKPOtgfiuE8rJnOBWn9I",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={siteMetadata.language} suppressHydrationWarning>
      <head>
        {/* Structured Data for SEO */}
        <PersonSchema />
        <WebSiteSchema />

        {/* Google AdSense - Add publisher ID in production */}
        {process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}

        {/* Cloudflare Web Analytics - Add token after deployment */}
        {process.env.NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN && (
          <Script
            defer
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={`{"token": "${process.env.NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN}"}`}
            strategy="afterInteractive"
          />
        )}
      </head>
      <body className="font-sans" suppressHydrationWarning>
        <SkipToContent />
        <ErrorBoundary>
          <ClientLayout>
            <main id="main-content">{children}</main>
            <WebVitals />
          </ClientLayout>
        </ErrorBoundary>
      </body>
    </html>
  );
}
