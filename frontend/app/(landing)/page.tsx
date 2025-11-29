export const runtime = "edge";

import LandingClientUI from "@/app/(landing)/landing-client-ui";
import { generateMetadata as generateMetadataUtil } from "@/lib/generateMetadata";
import { HomePageSchema } from "@/components/StructuredDataDynamic";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return await generateMetadataUtil("home");
}

export default function LandingPage() {
  return (
    <>
      <HomePageSchema />
      <LandingClientUI />
    </>
  );
}
