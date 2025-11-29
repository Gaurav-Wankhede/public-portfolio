export const runtime = "edge";

import type { Metadata } from "next";
import { generateMetadata as generateMetadataUtil } from "@/lib/generateMetadata";
import { ReactNode } from "react";

// Generate metadata for the projects route
export async function generateMetadata(): Promise<Metadata> {
  return await generateMetadataUtil("projects");
}

export default function ProjectsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
