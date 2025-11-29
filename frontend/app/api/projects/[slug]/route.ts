import { NextRequest, NextResponse } from "next/server";
import { fallbackProjects } from "@/lib/data/fallback";

export const runtime = "edge";

// Server-only backend URL - never exposed to client
const BACKEND_URL =
  process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL;

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  const params = await context.params;
  const { slug } = params;

  // If no backend URL configured, return fallback data
  if (!BACKEND_URL) {
    console.log("📦 [Project API] No backend configured, using fallback data");
    const project = fallbackProjects.find((p) => p.slug === slug);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json(project, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
        "X-Data-Source": "fallback",
      },
    });
  }

  try {
    console.log(
      "🔍 [Project API] Fetching from:",
      `${BACKEND_URL}/api/v1/projects/${slug}`,
    );

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(`${BACKEND_URL}/api/v1/projects/${slug}`, {
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
      console.error("❌ [Project API] Backend error, trying fallback");
      const project = fallbackProjects.find((p) => p.slug === slug);
      if (project) {
        return NextResponse.json(project, {
          headers: {
            "Cache-Control":
              "public, s-maxage=3600, stale-while-revalidate=7200",
            "X-Data-Source": "fallback",
          },
        });
      }
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const data = await response.json();
    console.log(
      "✅ [Project API] Successfully fetched project:",
      data.title || "Unknown",
    );

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
        "X-Data-Source": "backend",
      },
    });
  } catch (error) {
    console.error("💥 [Project API] Exception, trying fallback:", error);

    // Try fallback data on error
    const project = fallbackProjects.find((p) => p.slug === slug);
    if (project) {
      return NextResponse.json(project, {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
          "X-Data-Source": "fallback",
        },
      });
    }
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }
}
