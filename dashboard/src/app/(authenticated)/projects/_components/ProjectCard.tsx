"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  Github,
  Edit,
  Trash2,
  Youtube,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Project {
  slug: string;
  date: string;
  title: string;
  description: {
    overview: string;
    problem: string;
    solution: string;
    impact: string;
  };
  technologies: string[];
  features: string[];
  githubUrl: string;
  ReportUrl: string;
  demoUrl: string | null;
  youtubeUrl?: string | null;
  images: string[];
}

interface ProjectCardProps {
  project: Project;
  onEdit: (slug: string) => void;
  onDelete: (slug: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onEdit,
  onDelete,
}) => {
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <article
      className={cn(
        "group relative bg-card border rounded-lg overflow-hidden transition-all duration-300",
        "hover:shadow-lg hover:border-primary/50 hover:-translate-y-1",
        "focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2",
      )}
      aria-label={`Project: ${project.title}`}
    >
      {/* Project Image */}
      {project.images && project.images.length > 0 && (
        <div className="relative h-48 w-full overflow-hidden bg-muted">
          <Image
            src={project.images[0]}
            alt={`${project.title} preview`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      )}

      {/* Card Content */}
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-xl font-semibold line-clamp-2 group-hover:text-primary transition-colors">
              {project.title}
            </h3>
            <time
              dateTime={project.date}
              className="text-sm text-muted-foreground whitespace-nowrap"
              aria-label={`Created on ${new Date(project.date).toLocaleDateString()}`}
            >
              {new Date(project.date).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </time>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-3">
            {truncateText(project.description.overview, 150)}
          </p>
        </div>

        {/* Technologies */}
        {project.technologies && project.technologies.length > 0 && (
          <div
            className="flex flex-wrap gap-2"
            role="list"
            aria-label="Technologies used"
          >
            {project.technologies.slice(0, 4).map((tech, index) => (
              <span
                key={index}
                role="listitem"
                className={cn(
                  "px-2.5 py-1 text-xs font-medium rounded-full",
                  "bg-primary/10 text-primary border border-primary/20",
                  "transition-colors hover:bg-primary/20",
                )}
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span className="px-2.5 py-1 text-xs font-medium text-muted-foreground">
                +{project.technologies.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* External Links */}
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="External links"
        >
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md",
                "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              )}
              aria-label="View GitHub repository"
            >
              <Github className="h-3.5 w-3.5" aria-hidden="true" />
              GitHub
            </a>
          )}

          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md",
                "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              )}
              aria-label="View live demo"
            >
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              Demo
            </a>
          )}

          {project.youtubeUrl && (
            <a
              href={project.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md",
                "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              )}
              aria-label="Watch video demo"
            >
              <Youtube className="h-3.5 w-3.5" aria-hidden="true" />
              Video
            </a>
          )}

          {project.ReportUrl && (
            <a
              href={project.ReportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md",
                "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              )}
              aria-label="View project report"
            >
              <FileText className="h-3.5 w-3.5" aria-hidden="true" />
              Report
            </a>
          )}
        </div>

        {/* Action Buttons */}
        <div
          className="flex gap-2 pt-2 border-t"
          role="group"
          aria-label="Actions"
        >
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(project.slug)}
            className="flex-1"
            aria-label={`Edit ${project.title}`}
          >
            <Edit className="h-4 w-4 mr-1.5" aria-hidden="true" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(project.slug)}
            className="flex-1"
            aria-label={`Delete ${project.title}`}
          >
            <Trash2 className="h-4 w-4 mr-1.5" aria-hidden="true" />
            Delete
          </Button>
        </div>
      </div>
    </article>
  );
};
