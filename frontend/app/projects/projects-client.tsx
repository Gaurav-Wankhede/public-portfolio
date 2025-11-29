"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
  Calendar,
  ExternalLink,
  FileText,
  Github,
  Youtube,
} from "lucide-react";
import { type Project } from "@/lib/schema";

const Card = dynamic(
  () => import("@/components/ui/card").then((mod) => ({ default: mod.Card })),
  { ssr: true },
);
const CardHeader = dynamic(
  () =>
    import("@/components/ui/card").then((mod) => ({ default: mod.CardHeader })),
  { ssr: true },
);
const CardTitle = dynamic(
  () =>
    import("@/components/ui/card").then((mod) => ({ default: mod.CardTitle })),
  { ssr: true },
);
const CardDescription = dynamic(
  () =>
    import("@/components/ui/card").then((mod) => ({
      default: mod.CardDescription,
    })),
  { ssr: true },
);
const CardContent = dynamic(
  () =>
    import("@/components/ui/card").then((mod) => ({
      default: mod.CardContent,
    })),
  { ssr: true },
);
const Badge = dynamic(
  () => import("@/components/ui/badge").then((mod) => ({ default: mod.Badge })),
  { ssr: true },
);
const Pagination = dynamic(
  () =>
    import("@/components/ui/pagination").then((mod) => ({
      default: mod.Pagination,
    })),
  { ssr: true },
);
const PaginationContent = dynamic(
  () =>
    import("@/components/ui/pagination").then((mod) => ({
      default: mod.PaginationContent,
    })),
  { ssr: true },
);
const PaginationItem = dynamic(
  () =>
    import("@/components/ui/pagination").then((mod) => ({
      default: mod.PaginationItem,
    })),
  { ssr: true },
);
const PaginationLink = dynamic(
  () =>
    import("@/components/ui/pagination").then((mod) => ({
      default: mod.PaginationLink,
    })),
  { ssr: true },
);
const PaginationPrevious = dynamic(
  () =>
    import("@/components/ui/pagination").then((mod) => ({
      default: mod.PaginationPrevious,
    })),
  { ssr: true },
);
const PaginationNext = dynamic(
  () =>
    import("@/components/ui/pagination").then((mod) => ({
      default: mod.PaginationNext,
    })),
  { ssr: true },
);
const MotionDiv = dynamic(
  () => import("framer-motion").then((mod) => ({ default: mod.motion.div })),
  {
    ssr: false,
    loading: () => (
      <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
    ),
  },
);

interface ProjectsClientProps {
  projects: Project[];
}

export default function ProjectsClient({ projects }: ProjectsClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 100;

  // Mouse tracking for neon border effect
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (hoveredIndex !== null && cardRefs.current[hoveredIndex]) {
        const rect = cardRefs.current[hoveredIndex]!.getBoundingClientRect();
        setMousePosition({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [hoveredIndex]);

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects.slice(
    indexOfFirstProject,
    indexOfLastProject,
  );
  const totalPages = Math.ceil(projects.length / projectsPerPage);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <>
      <MotionDiv
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 px-4 md:px-0"
      >
        <h1 className="text-4xl font-bold mb-3 text-foreground">Projects</h1>
        <p className="text-lg text-muted-foreground">
          A showcase of my work - from AI-powered solutions to full-stack
          applications
        </p>
      </MotionDiv>

      <MotionDiv
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 md:px-0"
      >
        {currentProjects.map((project, index) => (
          <MotionDiv key={project.slug} variants={item}>
            <Card
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group h-full bg-card/50 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-0 neon-border-hover"
              style={{
                // @ts-ignore - CSS custom properties
                "--neon-gradient":
                  hoveredIndex === index
                    ? `radial-gradient(circle 200px at ${mousePosition.x}px ${mousePosition.y}px, rgba(14, 165, 233, 0.4), transparent 100%)`
                    : "transparent",
              }}
            >
              <CardHeader className="p-6">
                <div
                  onClick={() =>
                    (window.location.href = `/projects/${project.slug}`)
                  }
                  className="cursor-pointer"
                >
                  <div className="relative aspect-video w-full mb-4 overflow-hidden rounded-xl shadow-sm">
                    <Image
                      src={project.images[0] || "/project-placeholder.jpg"}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <CardTitle className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                    {project.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground line-clamp-2">
                    {project.description.overview}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="px-6 pb-6 pt-0">
                <div className="flex items-center text-sm text-muted-foreground hover:text-primary mb-4 transition-colors">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(project.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                  })}
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech: string, index: number) => (
                    <Badge
                      key={`${project.slug}-tech-${index}`}
                      variant="outline"
                      className="rounded-full bg-primary/10 text-foreground border-0 shadow-sm hover:shadow-md hover:bg-primary/20 transition-all"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2 mt-4">
                  {project.githubUrl && (
                    <Link
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-9 h-9 rounded-full bg-muted hover:bg-primary text-muted-foreground hover:text-primary-foreground shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <Github className="h-4 w-4" />
                    </Link>
                  )}
                  {project.demoUrl && (
                    <Link
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-9 h-9 rounded-full bg-muted hover:bg-primary text-muted-foreground hover:text-primary-foreground shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  )}
                  {project.youtubeUrl && (
                    <Link
                      href={project.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-9 h-9 rounded-full bg-muted hover:bg-primary text-muted-foreground hover:text-primary-foreground shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <Youtube className="h-4 w-4" />
                    </Link>
                  )}
                  {project.ReportUrl && (
                    <Link
                      href={project.ReportUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-9 h-9 rounded-full bg-muted hover:bg-primary text-muted-foreground hover:text-primary-foreground shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <FileText className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          </MotionDiv>
        ))}
      </MotionDiv>

      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(currentPage - 1);
                  }}
                />
              </PaginationItem>
            )}
            {Array.from({ length: totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(i + 1);
                  }}
                  isActive={currentPage === i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            {currentPage < totalPages && (
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(currentPage + 1);
                  }}
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
}
