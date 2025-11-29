export const runtime = "edge";

import type { Metadata } from "next";
import { generateMetadata as generateMetadataUtil } from "@/lib/generateMetadata";
import { ReactNode } from "react";

// Generate metadata for the Ask-Gaurav route
export async function generateMetadata(): Promise<Metadata> {
  return await generateMetadataUtil("Ask-Gaurav");
}

export default function AskLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
