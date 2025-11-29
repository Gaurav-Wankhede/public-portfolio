import React, { useState, useEffect, useRef } from "react";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Github, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Description {
  title?: string | null;
  overview: string;
  problem?: string | null;
  solution?: string | null;
  impact?: string | null;
  datasetDescription?: { title: string; items: string[] } | null;
  projectInfo?: string | null;
  dashboardInfo?: string | null;
}

interface Project {
  slug: string;
  title: string;
  description: Description;
  date: string;
  technologies: string[];
  githubUrl?: string | null;
  liveUrl?: string | null;
  images: string[];
}

// Default placeholder image when no project image is available
const PLACEHOLDER_IMAGE = "/placeholder-project.svg";

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const [mounted, setMounted] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (cardRef.current && isHovering) {
        const rect = cardRef.current.getBoundingClientRect();
        setMousePosition({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isHovering]);

  if (!mounted) {
    return (
      <div className="relative w-[280px] sm:w-[320px] lg:w-[360px] rounded-xl p-3 sm:p-4 bg-muted/50 backdrop-blur-sm shadow-lg animate-pulse border-0">
        <div className="w-full aspect-video bg-muted rounded-lg"></div>
        <div className="h-5 w-3/4 bg-muted rounded mt-3"></div>
        <div className="h-10 w-full bg-muted rounded mt-2"></div>
        <div className="flex gap-1.5 mt-2">
          <div className="h-5 w-14 bg-muted rounded-full"></div>
          <div className="h-5 w-16 bg-muted rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="group relative w-[280px] sm:w-[320px] lg:w-[360px] rounded-xl bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-2xl hover:shadow-amber-500/10 sm:hover:-translate-y-2 transition-all duration-300 p-3 sm:p-4 flex flex-col gap-2.5 sm:gap-3 border border-transparent hover:border-amber-500/30 neon-border-hover"
      style={{
        // @ts-ignore - CSS custom properties
        "--neon-gradient": isHovering
          ? `radial-gradient(circle 250px at ${mousePosition.x}px ${mousePosition.y}px, rgba(218, 165, 32, 0.4), rgba(139, 92, 246, 0.2) 50%, transparent 100%)`
          : "transparent",
      }}
    >
      {/* Image */}
      <Link
        href={`/projects/${project.slug}`}
        className="relative block w-full aspect-video overflow-hidden rounded-lg shadow-md group-hover:shadow-xl transition-shadow duration-300"
      >
        <Image
          src={project.images?.[0] || PLACEHOLDER_IMAGE}
          alt={project.title}
          fill
          sizes="(max-width: 640px) 280px, (max-width: 1024px) 320px, 360px"
          className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
          priority
        />
      </Link>

      {/* Title */}
      <CardTitle className="text-foreground text-sm sm:text-base lg:text-lg font-semibold line-clamp-1 group-hover:text-primary transition-colors">
        {project.title}
      </CardTitle>

      {/* Description */}
      <CardDescription className="text-muted-foreground text-xs sm:text-sm line-clamp-2">
        {project.description.overview.length > 80
          ? `${project.description.overview.slice(0, 80)}...`
          : project.description.overview}
      </CardDescription>

      {/* Date */}
      <div className="flex items-center text-xs text-muted-foreground">
        <Calendar className="w-3.5 h-3.5 mr-1.5" />
        {new Date(project.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
        })}
      </div>

      {/* Tech badges */}
      <div className="flex flex-wrap gap-1.5">
        {project.technologies.slice(0, 3).map((tech) => (
          <Badge
            key={tech}
            variant="outline"
            className="rounded-full bg-primary/10 text-foreground border-0 text-[10px] sm:text-xs whitespace-nowrap leading-none h-5 px-2"
          >
            {tech}
          </Badge>
        ))}
        {project.technologies.length > 3 && (
          <Badge
            variant="outline"
            className="rounded-full bg-muted text-muted-foreground border-0 text-[10px] sm:text-xs whitespace-nowrap leading-none h-5 px-2"
          >
            +{project.technologies.length - 3}
          </Badge>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 mt-auto items-center">
        {project.githubUrl && (
          <Link
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-muted hover:bg-primary text-muted-foreground hover:text-primary-foreground shadow-sm transition-all duration-300"
          >
            <Github className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Link>
        )}
        {project.liveUrl && (
          <Link
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-muted hover:bg-primary text-muted-foreground hover:text-primary-foreground shadow-sm transition-all duration-300"
          >
            <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Link>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
