export const runtime = "edge";

import type { Metadata } from "next";
import { generateMetadata as generateMetadataUtil } from "@/lib/generateMetadata";
import { ReactNode } from "react";

// Generate metadata for the contact route
export async function generateMetadata(): Promise<Metadata> {
  return await generateMetadataUtil("contact");
}

export default function ContactLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
