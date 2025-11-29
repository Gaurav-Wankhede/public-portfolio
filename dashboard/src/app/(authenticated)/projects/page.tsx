"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, XCircle, Plus } from "lucide-react";
import { fetchData } from "@/lib/api-utils";
import { generateSlug } from "@/lib/utils";
import { ProjectCard } from "./_components/ProjectCard";
import { ProjectForm } from "./_components/ProjectForm";
import { SearchBar } from "./_components/SearchBar";
import { LoadingSkeleton } from "./_components/LoadingSkeleton";
import { EmptyState } from "./_components/EmptyState";

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

interface Notification {
  type: "success" | "error";
  message: string;
}

const ProjectsPage = () => {
  const [mounted, setMounted] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [newProject, setNewProject] = useState<Omit<Project, "images">>({
    slug: "",
    date: new Date().toISOString().slice(0, 10),
    title: "",
    description: { overview: "", problem: "", solution: "", impact: "" },
    technologies: [],
    features: [],
    githubUrl: "",
    ReportUrl: "",
    demoUrl: null,
    youtubeUrl: null,
  });
  const [newImages, setNewImages] = useState<File[]>([]);
  const [notification, setNotification] = useState<Notification | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const data = await fetchData("/projects");
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setNotification({ type: "error", message: "Failed to load projects." });
        setTimeout(() => setNotification(null), 3000);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Prevent hydration mismatch by not rendering theme-dependent content until mounted
  if (!mounted) {
    return null;
  }

  const sortedProjects = [...projects].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const filteredProjects = sortedProjects.filter((project) => {
    const query = searchQuery.toLowerCase();
    return (
      project.title.toLowerCase().includes(query) ||
      project.description.overview.toLowerCase().includes(query) ||
      project.technologies.some((tech) => tech.toLowerCase().includes(query))
    );
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    section?: keyof Project["description"],
  ) => {
    const { name, value } = e.target;
    if (section) {
      setNewProject((prev) => ({
        ...prev,
        description: { ...prev.description, [section]: value },
      }));
    } else if (name === "technologies") {
      setNewProject((prev) => ({
        ...prev,
        [name]: value.split(",").map((s) => s.trim()),
      }));
    } else if (name === "features") {
      const featuresList = value
        .split("\n")
        .map((s) => s.trim())
        .filter((s) => s !== "");
      setNewProject((prev) => ({ ...prev, [name]: featuresList }));
    } else if (name === "demoUrl" || name === "youtubeUrl") {
      setNewProject((prev) => ({ ...prev, [name]: value.trim() || null }));
    } else if (name === "title") {
      const slug = generateSlug(value);
      setNewProject((prev) => ({
        ...prev,
        [name]: value,
        slug: slug,
      }));
    } else {
      setNewProject((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("project_data", JSON.stringify(newProject));
    newImages.forEach((image) => formData.append("images", image));

    try {
      const endpoint =
        isEditingProject && newProject.slug
          ? `/api/projects/${newProject.slug}`
          : `/api/projects`;

      const res = await fetch(endpoint, {
        method: isEditingProject ? "PUT" : "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.error ||
            `Failed to ${isEditingProject ? "update" : "create"} project`,
        );
      }

      const responseData = await res.json();
      console.log("Project operation successful:", responseData);
      setNotification({
        type: "success",
        message: `Project ${isEditingProject ? "updated" : "created"} successfully!`,
      });

      // Refresh projects after successful operation
      const data = await fetchData("/projects");
      setProjects(data);

      setNewProject({
        slug: "",
        date: new Date().toISOString().slice(0, 10),
        title: "",
        description: { overview: "", problem: "", solution: "", impact: "" },
        technologies: [],
        features: [],
        githubUrl: "",
        ReportUrl: "",
        demoUrl: null,
        youtubeUrl: null,
      });
      setNewImages([]);
      setIsAddingProject(false);
      setIsEditingProject(false);
      setTimeout(() => setNotification(null), 3000);
    } catch (error: unknown) {
      console.error(
        `Error ${isEditingProject ? "updating" : "creating"} project:`,
        error,
      );
      if (error instanceof Error) {
        setNotification({
          type: "error",
          message: `Failed to ${isEditingProject ? "update" : "create"} project. ${error.message}`,
        });
      } else {
        setNotification({
          type: "error",
          message: `Failed to ${isEditingProject ? "update" : "create"} project. An unknown error occurred.`,
        });
      }
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleEditProject = async (slug: string) => {
    try {
      const res = await fetch(`/api/projects/${slug}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.error || "Failed to fetch project for editing",
        );
      }
      const projectData: Project = await res.json();
      setNewProject(projectData);
      setIsAddingProject(true);
      setIsEditingProject(true);
    } catch (error) {
      console.error("Error fetching project for editing:", error);
      setNotification({
        type: "error",
        message: "Failed to fetch project for editing.",
      });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleDeleteProject = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this project?")) {
      return;
    }

    try {
      if (!slug.trim()) {
        setNotification({
          type: "error",
          message: "Invalid project slug for deletion.",
        });
        setTimeout(() => setNotification(null), 3000);
        return;
      }

      const res = await fetch(`/api/projects/${slug}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.error || errorData.detail || "Failed to delete project",
        );
      }

      setNotification({
        type: "success",
        message: "Project deleted successfully!",
      });

      // Refresh projects after deletion
      const data = await fetchData("/projects");
      setProjects(data);

      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error("Error deleting project:", error);
      setNotification({ type: "error", message: "Failed to delete project." });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleCancelAddEdit = () => {
    setIsAddingProject(false);
    setIsEditingProject(false);
    setNewProject({
      slug: "",
      date: new Date().toISOString().slice(0, 10),
      title: "",
      description: { overview: "", problem: "", solution: "", impact: "" },
      technologies: [],
      features: [],
      githubUrl: "",
      ReportUrl: "",
      demoUrl: null,
      youtubeUrl: null,
    });
    setNewImages([]);
  };

  return (
    <div
      className="container mx-auto py-10 px-4 sm:px-6 lg:px-8"
      suppressHydrationWarning
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" suppressHydrationWarning>
          Projects
        </h1>
        <p className="text-muted-foreground" suppressHydrationWarning>
          Manage and showcase your portfolio projects
        </p>
      </div>

      {notification && (
        <Alert
          variant={notification.type === "success" ? "default" : "destructive"}
          className="mb-6"
        >
          {notification.type === "success" ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <XCircle className="h-4 w-4" />
          )}
          <AlertTitle>
            {notification.type === "success" ? "Success" : "Error"}
          </AlertTitle>
          <AlertDescription>{notification.message}</AlertDescription>
        </Alert>
      )}

      {!isAddingProject && (
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search projects by title, description, or technology..."
            className="flex-1"
          />
          <Button
            onClick={() => setIsAddingProject(true)}
            className="sm:w-auto w-full"
          >
            <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
            Add New Project
          </Button>
        </div>
      )}

      {isAddingProject && (
        <ProjectForm
          project={newProject}
          isEditing={isEditingProject}
          onSubmit={handleSubmit}
          onChange={handleInputChange}
          onImageChange={handleImageChange}
          onCancel={handleCancelAddEdit}
        />
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <LoadingSkeleton count={6} />
        </div>
      ) : filteredProjects.length === 0 ? (
        <EmptyState
          isSearching={searchQuery.length > 0}
          searchQuery={searchQuery}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              onEdit={handleEditProject}
              onDelete={handleDeleteProject}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
