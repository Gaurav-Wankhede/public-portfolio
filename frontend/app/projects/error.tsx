"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function ProjectsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Projects error:", error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto space-y-6 text-center">
        <div className="flex justify-center">
          <div className="rounded-full bg-orange-500/10 p-4">
            <AlertTriangle className="w-12 h-12 text-orange-500" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Failed to load projects</h2>
          <p className="text-muted-foreground">
            {error.message || "Unable to fetch projects at this time"}
          </p>
        </div>
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  );
}
