"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileQuestion } from "lucide-react";

export default function ProjectDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Project detail error:", error);
  }, [error]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="max-w-md mx-auto space-y-6 text-center">
        <div className="flex justify-center">
          <div className="rounded-full bg-red-500/10 p-4">
            <FileQuestion className="w-12 h-12 text-red-500" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Project not found</h2>
          <p className="text-muted-foreground">
            {error.message || "This project could not be loaded"}
          </p>
        </div>
        <div className="flex gap-4 justify-center">
          <Button onClick={reset} variant="outline">
            Try again
          </Button>
          <Button asChild>
            <Link href="/projects">Back to Projects</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
