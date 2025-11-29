"use client";

import { type Project } from "@/lib/schema";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Calendar,
  ExternalLink,
  Github,
  Play,
  FileText,
  Layers,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { ImageCarousel } from "@/components/ImageCarousel";
import YouTubePlayer from "@/components/YouTubePlayer";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";
import type { Components } from "react-markdown";
import type { HTMLAttributes, AnchorHTMLAttributes } from "react";
import { useState } from "react";

interface ProjectClientUIProps {
  project: Project;
}

export default function ProjectClientUI({ project }: ProjectClientUIProps) {
  const [activeSection, setActiveSection] = useState<string>("overview");

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground">Project data is not available.</p>
      </div>
    );
  }

  const markdownComponents: Components = {
    p: ({ children, ...props }: HTMLAttributes<HTMLParagraphElement>) => (
      <p className="mb-3 leading-relaxed" {...props}>
        {children}
      </p>
    ),
    a: ({ children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) => (
      <a
        className="text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    ),
    code: ({
      inline,
      children,
      ...props
    }: HTMLAttributes<HTMLElement> & { inline?: boolean }) =>
      inline ? (
        <code
          className="px-1.5 py-0.5 rounded-md bg-primary/10 text-sm font-mono"
          {...props}
        >
          {children}
        </code>
      ) : (
        <code className="font-mono" {...props}>
          {children}
        </code>
      ),
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const hasChallengeSolutionImpact =
    project.description?.problem ||
    project.description?.solution ||
    project.description?.impact;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Hero Section - Bold Typography */}
      <motion.header variants={itemVariants} className="space-y-6">
        <div className="space-y-4">
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {project.title}
          </motion.h1>

          {/* Meta Info Row */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
              <Calendar className="w-3.5 h-3.5" />
              {project.date && !isNaN(new Date(project.date).getTime())
                ? new Date(project.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                  })
                : "Date N/A"}
            </div>
          </div>

          {/* Tech Stack Pills */}
          <div className="flex flex-wrap gap-2">
            {project.technologies?.map((tech, index) => (
              <motion.div
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.05 }}
              >
                <Badge
                  variant="secondary"
                  className="rounded-full px-3 py-1 text-xs font-medium bg-primary/10 hover:bg-primary/20 border-0 transition-colors"
                >
                  {tech}
                </Badge>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Action Buttons - Glassmorphism */}
        <div className="flex flex-wrap gap-3">
          {project.githubUrl && (
            <motion.a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-5 py-2.5 rounded-xl bg-foreground text-background font-medium text-sm hover:bg-foreground/90 transition-all duration-300 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Github className="w-4 h-4" />
              View Code
              <ArrowUpRight className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
            </motion.a>
          )}
          {project.demoUrl && (
            <motion.a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ExternalLink className="w-4 h-4" />
              Live Demo
              <ArrowUpRight className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
            </motion.a>
          )}
          {project.ReportUrl && (
            <motion.a
              href={project.ReportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-5 py-2.5 rounded-xl bg-muted/80 backdrop-blur-sm text-foreground font-medium text-sm hover:bg-muted transition-all duration-300 border border-border/50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FileText className="w-4 h-4" />
              Report
            </motion.a>
          )}
        </div>
      </motion.header>

      {/* Navigation Pills */}
      <motion.nav variants={itemVariants} className="sticky top-4 z-10">
        <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-muted/30 backdrop-blur-md border border-border/30 w-fit">
          <button
            onClick={() => setActiveSection("overview")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
              activeSection === "overview"
                ? "bg-background text-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            }`}
          >
            Overview
          </button>
          {project.images && project.images.length > 0 && (
            <button
              onClick={() => setActiveSection("gallery")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeSection === "gallery"
                  ? "bg-background text-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50"
              }`}
            >
              Gallery
            </button>
          )}
          {project.youtubeUrl && (
            <button
              onClick={() => setActiveSection("demo")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeSection === "demo"
                  ? "bg-background text-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50"
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              Demo
            </button>
          )}
          {project.features && project.features.length > 0 && (
            <button
              onClick={() => setActiveSection("features")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeSection === "features"
                  ? "bg-background text-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Features
            </button>
          )}
        </div>
      </motion.nav>

      {/* Content Sections */}
      <div className="space-y-6">
        {/* Overview Section */}
        {activeSection === "overview" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Main Overview - Glass Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-muted/50 to-muted/30 backdrop-blur-sm border border-border/30">
              <div className="prose prose-sm sm:prose-base max-w-none text-foreground/90">
                <Markdown
                  components={markdownComponents}
                  rehypePlugins={[
                    rehypeRaw,
                    rehypeSanitize,
                    rehypeSlug,
                    rehypeHighlight,
                  ]}
                >
                  {project.description?.overview}
                </Markdown>
              </div>
            </div>

            {/* Bento Grid for Challenge/Solution/Impact */}
            {hasChallengeSolutionImpact && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {project.description?.problem && (
                  <motion.div
                    variants={itemVariants}
                    className="p-6 rounded-2xl bg-red-500/5 border border-red-500/10 hover:border-red-500/20 transition-colors group"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 rounded-lg bg-red-500/10">
                        <Layers className="w-4 h-4 text-red-500" />
                      </div>
                      <h3 className="font-semibold text-foreground">
                        Challenge
                      </h3>
                    </div>
                    <div className="text-sm text-muted-foreground leading-relaxed">
                      <Markdown
                        components={markdownComponents}
                        rehypePlugins={[rehypeRaw, rehypeSanitize]}
                      >
                        {project.description.problem}
                      </Markdown>
                    </div>
                  </motion.div>
                )}

                {project.description?.solution && (
                  <motion.div
                    variants={itemVariants}
                    className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/10 hover:border-blue-500/20 transition-colors group"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 rounded-lg bg-blue-500/10">
                        <Sparkles className="w-4 h-4 text-blue-500" />
                      </div>
                      <h3 className="font-semibold text-foreground">
                        Solution
                      </h3>
                    </div>
                    <div className="text-sm text-muted-foreground leading-relaxed">
                      <Markdown
                        components={markdownComponents}
                        rehypePlugins={[rehypeRaw, rehypeSanitize]}
                      >
                        {project.description.solution}
                      </Markdown>
                    </div>
                  </motion.div>
                )}

                {project.description?.impact && (
                  <motion.div
                    variants={itemVariants}
                    className="p-6 rounded-2xl bg-green-500/5 border border-green-500/10 hover:border-green-500/20 transition-colors group md:col-span-2 lg:col-span-1"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 rounded-lg bg-green-500/10">
                        <ArrowUpRight className="w-4 h-4 text-green-500" />
                      </div>
                      <h3 className="font-semibold text-foreground">Impact</h3>
                    </div>
                    <div className="text-sm text-muted-foreground leading-relaxed">
                      <Markdown
                        components={markdownComponents}
                        rehypePlugins={[rehypeRaw, rehypeSanitize]}
                      >
                        {project.description.impact}
                      </Markdown>
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {/* Additional Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.description?.datasetDescription && (
                <div className="p-6 rounded-2xl bg-muted/30 border border-border/30">
                  <h3 className="font-semibold mb-3 text-foreground">
                    {project.description.datasetDescription?.title ||
                      "Dataset Details"}
                  </h3>
                  <ul className="space-y-2">
                    {project.description.datasetDescription?.items?.map(
                      (item, index) => (
                        <li
                          key={index}
                          className="text-sm text-muted-foreground flex items-start gap-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              )}

              {project.description?.dashboardInfo && (
                <div className="p-6 rounded-2xl bg-muted/30 border border-border/30">
                  <h3 className="font-semibold mb-3 text-foreground">
                    Dashboard Info
                  </h3>
                  <div className="text-sm text-muted-foreground">
                    <Markdown
                      components={markdownComponents}
                      rehypePlugins={[rehypeRaw, rehypeSanitize]}
                    >
                      {project.description.dashboardInfo}
                    </Markdown>
                  </div>
                </div>
              )}

              {project.description?.projectInfo && (
                <div className="p-6 rounded-2xl bg-muted/30 border border-border/30 md:col-span-2">
                  <h3 className="font-semibold mb-3 text-foreground">
                    Project Info
                  </h3>
                  <div className="text-sm text-muted-foreground">
                    <Markdown
                      components={markdownComponents}
                      rehypePlugins={[rehypeRaw, rehypeSanitize]}
                    >
                      {project.description.projectInfo}
                    </Markdown>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Gallery Section */}
        {activeSection === "gallery" &&
          project.images &&
          project.images.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="rounded-3xl overflow-hidden bg-muted/30 border border-border/30 p-4 sm:p-6"
            >
              <ImageCarousel images={project.images} />
            </motion.div>
          )}

        {/* Video Demo Section */}
        {activeSection === "demo" && project.youtubeUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-3xl overflow-hidden bg-muted/30 border border-border/30 p-4 sm:p-6"
          >
            <YouTubePlayer url={project.youtubeUrl} />
          </motion.div>
        )}

        {/* Features Section */}
        {activeSection === "features" &&
          project.features &&
          project.features.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {project.features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-5 rounded-2xl bg-muted/30 border border-border/30 hover:border-primary/30 transition-colors group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <Sparkles className="w-4 h-4 text-primary" />
                      </div>
                      <div className="text-sm text-muted-foreground leading-relaxed">
                        <Markdown
                          components={markdownComponents}
                          rehypePlugins={[rehypeRaw, rehypeSanitize]}
                        >
                          {feature}
                        </Markdown>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
      </div>

      {/* Documentation Link - Bottom CTA */}
      {project.documentationUrl && (
        <motion.div
          variants={itemVariants}
          className="pt-8 border-t border-border/30"
        >
          <a
            href={project.documentationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 hover:border-primary/40 transition-all duration-300"
          >
            <div>
              <h3 className="font-semibold text-foreground mb-1">
                Documentation
              </h3>
              <p className="text-sm text-muted-foreground">
                View the complete project documentation
              </p>
            </div>
            <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <ArrowUpRight className="w-5 h-5 text-primary" />
            </div>
          </a>
        </motion.div>
      )}
    </motion.div>
  );
}
