/**
 * Fallback/Demo Data
 * Used when backend is not connected or database is not configured
 * Users can customize these to show their own demo content
 */

import { siteConfig } from "@/config/site";

export interface FallbackProject {
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
  youtubeUrl: string | null;
  images: string[];
}

export interface FallbackCertificate {
  slug: string;
  name: string;
  issuer: string;
  link: string;
  issue_date: string;
  image_url: string | null;
}

/**
 * Demo projects - customize these with your own projects
 */
export const fallbackProjects: FallbackProject[] = [
  {
    slug: "portfolio-website",
    date: "2025-01-15",
    title: "Portfolio Website",
    description: {
      overview: `A modern portfolio website built with Next.js 15, showcasing ${siteConfig.ownerName}'s projects, skills, and professional journey.`,
      problem: "Needed a professional online presence to showcase work and connect with potential clients and employers.",
      solution: "Built a full-stack portfolio with Next.js frontend, Rust backend, and AI-powered chat functionality.",
      impact: "Increased professional visibility and provided a central hub for showcasing technical capabilities.",
    },
    technologies: ["Next.js 15", "TypeScript", "Tailwind CSS", "Rust", "Axum", "MongoDB"],
    features: [
      "Responsive design with dark/light mode",
      "AI-powered chat assistant",
      "Dynamic project showcase",
      "Certificate gallery",
      "Contact form",
    ],
    githubUrl: "https://github.com/username/portfolio",
    ReportUrl: "",
    demoUrl: null,
    youtubeUrl: null,
    images: [],
  },
  {
    slug: "task-management-app",
    date: "2024-11-20",
    title: "Task Management Application",
    description: {
      overview: "A full-stack task management application with real-time updates and team collaboration features.",
      problem: "Teams needed a simple yet powerful tool to manage tasks and collaborate effectively.",
      solution: "Developed a real-time task management system with drag-and-drop interfaces and team workspaces.",
      impact: "Improved team productivity by 40% through streamlined task tracking and collaboration.",
    },
    technologies: ["React", "Node.js", "PostgreSQL", "WebSocket", "Docker"],
    features: [
      "Real-time task updates",
      "Drag-and-drop Kanban board",
      "Team workspaces",
      "Due date reminders",
      "Activity timeline",
    ],
    githubUrl: "https://github.com/username/task-manager",
    ReportUrl: "",
    demoUrl: "https://tasks.example.com",
    youtubeUrl: null,
    images: [],
  },
  {
    slug: "ecommerce-platform",
    date: "2024-08-10",
    title: "E-Commerce Platform",
    description: {
      overview: "A scalable e-commerce platform with inventory management, payment processing, and analytics dashboard.",
      problem: "Small businesses needed an affordable, customizable e-commerce solution.",
      solution: "Built a modular e-commerce platform with easy customization and integrated payment gateways.",
      impact: "Enabled 50+ small businesses to launch online stores with minimal technical knowledge.",
    },
    technologies: ["Next.js", "Stripe", "Prisma", "PostgreSQL", "Redis", "AWS S3"],
    features: [
      "Product catalog management",
      "Secure payment processing",
      "Inventory tracking",
      "Order management",
      "Sales analytics dashboard",
    ],
    githubUrl: "https://github.com/username/ecommerce",
    ReportUrl: "",
    demoUrl: null,
    youtubeUrl: null,
    images: [],
  },
];

/**
 * Demo certificates - customize these with your own certifications
 */
export const fallbackCertificates: FallbackCertificate[] = [
  {
    slug: "aws-solutions-architect",
    name: "AWS Solutions Architect Associate",
    issuer: "Amazon Web Services",
    link: "https://aws.amazon.com/certification/",
    issue_date: "2024-06-15",
    image_url: null,
  },
  {
    slug: "google-cloud-professional",
    name: "Google Cloud Professional Developer",
    issuer: "Google Cloud",
    link: "https://cloud.google.com/certification",
    issue_date: "2024-03-20",
    image_url: null,
  },
  {
    slug: "rust-programming",
    name: "Rust Programming Fundamentals",
    issuer: "The Rust Foundation",
    link: "https://www.rust-lang.org/",
    issue_date: "2023-12-01",
    image_url: null,
  },
  {
    slug: "mongodb-developer",
    name: "MongoDB Developer Certification",
    issuer: "MongoDB University",
    link: "https://university.mongodb.com/",
    issue_date: "2023-09-10",
    image_url: null,
  },
];

/**
 * Check if we should use fallback data
 * Returns true if BACKEND_URL is not configured
 */
export function shouldUseFallback(): boolean {
  const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL;
  return !backendUrl || backendUrl.trim() === "";
}
