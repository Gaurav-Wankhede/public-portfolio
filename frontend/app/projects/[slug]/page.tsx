import { notFound } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { ProjectSchema, type Project } from "@/lib/schema";
import { Metadata } from "next";
import { generateDynamicMetadata } from "@/lib/generateMetadata";
import ProjectClientUI from "./project-client-ui"; // Import the new client component

// Force dynamic rendering - pure SSR with no caching
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "edge";

// --- generateMetadata function (remains the same) ---
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const awaitedParams = await params;
  const originalSlug = awaitedParams.slug;
  const slug = originalSlug.toLowerCase();

  console.log("🏷️ [Metadata] Fetching project for metadata:", slug);

  const response = await apiClient.projects.getBySlug(slug);
  const projectFromApi = response.data;

  console.log("🏷️ [Metadata] Response:", {
    hasError: !!response.error,
    hasData: !!projectFromApi,
    errorDetails: response.error,
  });

  // Validate and narrow the API data to Project using zod
  const parsed = ProjectSchema.safeParse(projectFromApi);
  if (!parsed.success) {
    console.log("🏷️ [Metadata] Validation failed:", parsed.error.errors);
    return {
      title: "Project Data is Missing",
      description: "The project data structure is not as expected.",
    };
  }

  console.log("🏷️ [Metadata] Metadata generated for:", parsed.data.title);
  const project: Project = parsed.data;

  const imageUrl =
    project.images && project.images.length > 0
      ? project.images[0]
      : "/og-image.jpg";
  return generateDynamicMetadata(
    "projects",
    project.title,
    project.description?.overview,
    slug,
    imageUrl,
    project.date,
  );
}

// --- Server Component Page ---
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const awaitedParams = await params;
  const originalSlug = awaitedParams.slug;
  const slug = originalSlug.toLowerCase();

  console.log("🔍 [Page] Fetching project with slug:", slug);

  // Fetch data on the server
  const response = await apiClient.projects.getBySlug(slug);

  console.log("📦 [Page] Response:", {
    hasError: !!response.error,
    hasData: !!response.data,
    errorDetails: response.error,
    dataKeys: response.data ? Object.keys(response.data) : [],
  });

  if (response.error || !response.data) {
    console.log("❌ [Page] Calling notFound() - error or no data");
    notFound(); // Trigger 404 if project not found
  }

  const parsed = ProjectSchema.safeParse(response.data);
  if (!parsed.success) {
    console.log("❌ [Page] Zod validation failed:", parsed.error.errors);
    notFound();
  }

  console.log("✅ [Page] Project loaded successfully:", parsed.data.title);
  const project: Project = parsed.data;

  // Render the outer structure and pass data to the client component
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Pass project data to the client component for interactive UI */}
      <ProjectClientUI project={project} />
    </div>
  );
}
