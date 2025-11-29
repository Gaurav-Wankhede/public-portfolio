"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";
import { SafeComponent } from "./SafeComponent";
import { apiClient } from "@/lib/api-client";
import { type Project } from "@/lib/schema";

const InfiniteMovingProjects = dynamic(
  () =>
    import("./ui/InfiniteMovingProjects").then((mod) => ({
      default: mod.InfiniteMovingProjects,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-48">
        <div className="animate-pulse text-muted-foreground">
          Loading projects...
        </div>
      </div>
    ),
  },
);

interface SafeInfiniteMovingProjectsProps {
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}

function ProjectsFetcher(props: SafeInfiniteMovingProjectsProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await apiClient.projects.getAll();
        if (!response.error && Array.isArray(response.data)) {
          setProjects(response.data as Project[]);
        }
      } catch (error) {
        console.error("Failed to load projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-pulse text-muted-foreground">
          Loading projects...
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return null;
  }

  return <InfiniteMovingProjects projects={projects} {...props} />;
}

export default function SafeInfiniteMovingProjects(
  props: SafeInfiniteMovingProjectsProps,
) {
  return (
    <SafeComponent
      fallback={
        <div className="text-center py-8 text-muted-foreground">
          <p>Projects showcase coming soon</p>
        </div>
      }
    >
      <Suspense
        fallback={
          <div className="h-48 animate-pulse bg-muted rounded-lg"></div>
        }
      >
        <ProjectsFetcher {...props} />
      </Suspense>
    </SafeComponent>
  );
}
