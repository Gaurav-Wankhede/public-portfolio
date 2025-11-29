export const runtime = "edge";

import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Project Details",
  description:
    "Detailed information about this project including technologies, implementation, and results.",
};

export default function ProjectLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
