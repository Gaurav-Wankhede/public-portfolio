import { NextResponse } from "next/server";
import { dynamicSEOData } from "@/lib/seo-data";
import { siteConfig } from "@/config/site";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const route = searchParams.get("route") || "home";

  // Get SEO data for the requested route
  const seoData = dynamicSEOData[route] || dynamicSEOData.home;

  return NextResponse.json({
    success: true,
    data: {
      ...seoData,
      siteName: siteConfig.siteName,
      siteUrl: siteConfig.siteUrl,
      author: siteConfig.ownerName,
      locale: "en_US",
    },
  });
}
