export const runtime = "edge";

import type { Metadata } from "next";
import { generateMetadata as generateMetadataUtil } from "@/lib/generateMetadata";

export async function generateMetadata(): Promise<Metadata> {
  return await generateMetadataUtil("about");
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
