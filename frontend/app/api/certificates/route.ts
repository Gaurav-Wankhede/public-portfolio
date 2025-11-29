import { NextRequest, NextResponse } from "next/server";
import { fallbackCertificates } from "@/lib/data/fallback";

export const runtime = "edge";

// Server-only backend URL - never exposed to client
const BACKEND_URL =
  process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL;

export async function GET(request: NextRequest) {
  // If no backend URL configured, return fallback data
  if (!BACKEND_URL) {
    console.log(
      "📦 [Certificates API] No backend configured, using fallback data",
    );
    return NextResponse.json(fallbackCertificates, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
        "X-Data-Source": "fallback",
      },
    });
  }

  try {
    console.log(
      "🔍 [Certificates API] Fetching from:",
      `${BACKEND_URL}/api/v1/certificates`,
    );

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(`${BACKEND_URL}/api/v1/certificates`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      signal: controller.signal,
      cache: "no-store",
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error("❌ [Certificates API] Backend error, using fallback");
      return NextResponse.json(fallbackCertificates, {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
          "X-Data-Source": "fallback",
        },
      });
    }

    const data = await response.json();
    console.log(
      "✅ [Certificates API] Successfully fetched",
      data?.length || 0,
      "certificates",
    );

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
        "X-Data-Source": "backend",
      },
    });
  } catch (error) {
    console.error("💥 [Certificates API] Exception, using fallback:", error);

    // Return fallback data on any error
    return NextResponse.json(fallbackCertificates, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
        "X-Data-Source": "fallback",
      },
    });
  }
}
