"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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
}

interface ProjectFormProps {
  project: Omit<Project, "images">;
  isEditing: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    section?: keyof Project["description"],
  ) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({
  project,
  isEditing,
  onSubmit,
  onChange,
  onImageChange,
  onCancel,
}) => {
  return (
    <form onSubmit={onSubmit} className="mb-8 bg-card border rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">
        {isEditing ? "Edit Project" : "Add New Project"}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="title" className="block mb-1">
            Title
          </Label>
          <Input
            type="text"
            id="title"
            name="title"
            value={project.title}
            onChange={onChange}
            required
            className="w-full"
            placeholder="Enter project title"
          />
        </div>

        <div>
          <Label htmlFor="date" className="block mb-1">
            Date
          </Label>
          <Input
            type="date"
            id="date"
            name="date"
            value={project.date}
            onChange={onChange}
            required
            className="w-full"
          />
        </div>
      </div>

      <div className="mb-4">
        <Label htmlFor="slug" className="block mb-1">
          Slug (auto-generated)
        </Label>
        <Input
          type="text"
          id="slug"
          name="slug"
          value={project.slug}
          readOnly
          disabled
          className="w-full bg-muted"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="githubUrl">GitHub URL</Label>
          <Input
            type="url"
            id="githubUrl"
            name="githubUrl"
            value={project.githubUrl}
            onChange={onChange}
            className="w-full"
            placeholder="https://github.com/username/repo"
          />
        </div>
        <div>
          <Label htmlFor="reportUrl">Report URL</Label>
          <Input
            type="url"
            id="reportUrl"
            name="ReportUrl"
            value={project.ReportUrl}
            onChange={onChange}
            className="w-full"
            placeholder="https://example.com/report.pdf"
          />
        </div>
        <div>
          <Label htmlFor="demoUrl">Demo URL (Optional)</Label>
          <Input
            type="url"
            id="demoUrl"
            name="demoUrl"
            value={project.demoUrl ?? ""}
            onChange={onChange}
            className="w-full"
            placeholder="https://demo.example.com"
          />
        </div>
        <div>
          <Label htmlFor="youtubeUrl">YouTube URL (Optional)</Label>
          <Input
            type="url"
            id="youtubeUrl"
            name="youtubeUrl"
            value={project.youtubeUrl ?? ""}
            onChange={onChange}
            placeholder="https://www.youtube.com/watch?v=VIDEO_ID"
            className="w-full"
          />
        </div>
      </div>

      <div className="mb-4">
        <Label htmlFor="overview">Overview (supports Markdown)</Label>
        <Textarea
          id="overview"
          name="overview"
          value={project.description.overview}
          onChange={(e) => onChange(e, "overview")}
          className="w-full min-h-[150px]"
          placeholder="Write a comprehensive overview of your project. You can use **bold**, *italic*, [links](https://example.com), and other Markdown formatting."
        />
        <p className="text-xs text-muted-foreground mt-1">
          Supports Markdown for rich text formatting.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="problem">Problem (supports Markdown)</Label>
          <Textarea
            id="problem"
            name="problem"
            value={project.description.problem}
            onChange={(e) => onChange(e, "problem")}
            className="w-full min-h-[150px]"
            placeholder="Describe the problem or challenge this project addresses."
          />
          <p className="text-xs text-muted-foreground mt-1">
            Supports Markdown for rich text formatting.
          </p>
        </div>
        <div>
          <Label htmlFor="solution">Solution (supports Markdown)</Label>
          <Textarea
            id="solution"
            name="solution"
            value={project.description.solution}
            onChange={(e) => onChange(e, "solution")}
            className="w-full min-h-[150px]"
            placeholder="Explain your approach to solving the problem."
          />
          <p className="text-xs text-muted-foreground mt-1">
            Supports Markdown for rich text formatting.
          </p>
        </div>
        <div>
          <Label htmlFor="impact">Impact (supports Markdown)</Label>
          <Textarea
            id="impact"
            name="impact"
            value={project.description.impact}
            onChange={(e) => onChange(e, "impact")}
            className="w-full min-h-[150px]"
            placeholder="Describe the results and impact of your project."
          />
          <p className="text-xs text-muted-foreground mt-1">
            Supports Markdown for rich text formatting.
          </p>
        </div>
      </div>

      <div className="mb-4">
        <Label htmlFor="technologies">Technologies (comma-separated)</Label>
        <Input
          type="text"
          id="technologies"
          name="technologies"
          value={project.technologies.join(", ")}
          onChange={onChange}
          className="w-full"
          placeholder="React, TypeScript, Node.js, PostgreSQL"
        />
      </div>

      <div className="mb-4">
        <Label htmlFor="features">
          Features (one per line, supports Markdown)
        </Label>
        <Textarea
          id="features"
          name="features"
          value={project.features.join("\n")}
          onChange={onChange}
          className="w-full min-h-[150px]"
          placeholder="- **Bold feature title**: Description of the feature&#10;- Another feature with *italic emphasis*&#10;- Feature with [link](https://example.com)"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Enter each feature on a new line. You can use Markdown formatting for
          rich text.
        </p>
      </div>

      <div className="mb-6">
        <Label htmlFor="images">Images</Label>
        <Input
          type="file"
          id="images"
          multiple
          onChange={onImageChange}
          className="w-full"
          accept="image/*"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Select one or more images for your project.
        </p>
      </div>

      <div className="flex gap-2">
        <Button type="submit">
          {isEditing ? "Update Project" : "Create Project"}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
