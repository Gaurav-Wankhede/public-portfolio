export const runtime = "edge";
import { NextResponse } from "next/server";

interface Project {
  slug: string;
  date: string;
  title: string;
}

async function fetchProjects(): Promise<Project[]> {
  try {
    const backendUrl =
      process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) return [];

    const res = await fetch(`${backendUrl}/api/v1/projects`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch projects: ${res.status}`);
    }

    const data = await res.json();
    return data.projects || [];
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

export async function GET() {
  const projects = await fetchProjects();

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
  const currentDate = new Date().toISOString().split("T")[0];

  const staticRoutes = [
    { url: "/", priority: "1.0", changefreq: "daily" },
    { url: "/about", priority: "0.8", changefreq: "weekly" },
    { url: "/projects", priority: "0.9", changefreq: "weekly" },
    { url: "/Ask-Username", priority: "0.9", changefreq: "weekly" },
    { url: "/contact", priority: "0.7", changefreq: "monthly" },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticRoutes
    .map(
      (route) => `
  <url>
    <loc>${baseUrl}${route.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`,
    )
    .join("")}
  ${projects
    .map(
      (project) => `
  <url>
    <loc>${baseUrl}/projects/${project.slug}</loc>
    <lastmod>${project.date || currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`,
    )
    .join("")}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "no-store, must-revalidate",
    },
  });
}
