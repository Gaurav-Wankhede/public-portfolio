import { apiClient } from "@/lib/api-client";
import { type Project } from "@/lib/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import ProjectsClient from "./projects-client";

// Configure Edge Runtime for Cloudflare deployment
export const runtime = "edge";

// Force dynamic rendering to always fetch fresh data
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { generateMetadata as generateMetadataUtil } from "@/lib/generateMetadata";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return await generateMetadataUtil("projects");
}

async function getProjects(): Promise<Project[]> {
  const response = await apiClient.projects.getAll();

  if (response.error || !Array.isArray(response.data)) {
    console.error("Error fetching projects:", response.error);
    return [];
  }

  const projects = response.data as Project[];
  // Sort projects by date in descending order
  return projects.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  if (projects.length === 0) {
    return (
      <div className="container mx-auto px-6 md:px-8 lg:px-12 py-16 text-center">
        <h1 className="text-4xl font-bold mb-8 text-foreground">Projects</h1>
        <div className="p-4 border border-red-500/20 rounded-lg bg-red-500/10 text-red-500">
          Unable to load projects. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 md:px-8 lg:px-12 py-16">
      <ProjectsClient projects={projects} />
    </div>
  );
}
