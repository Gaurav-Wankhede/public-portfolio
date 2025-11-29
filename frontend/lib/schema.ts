import { z } from "zod";

export const ProjectSchema = z.object({
  slug: z.string(),
  title: z.string(),
  date: z.string(),
  description: z.object({
    title: z.string().nullable().optional(),
    overview: z.string(),
    problem: z.string().nullable().optional(),
    solution: z.string().nullable().optional(),
    impact: z.string().nullable().optional(),
    datasetDescription: z
      .object({
        title: z.string(),
        items: z.array(z.string()),
      })
      .nullable()
      .optional(),
    projectInfo: z.string().nullable().optional(),
    dashboardInfo: z.string().nullable().optional(),
  }),
  images: z.array(z.string()).optional().default([]),
  technologies: z.array(z.string()),
  features: z.array(z.string()),
  githubUrl: z.string().nullable().optional(),
  ReportUrl: z.string().nullable().optional(),
  demoUrl: z.string().nullable().optional(),
  youtubeUrl: z.string().nullable().optional(),
  liveUrl: z.string().nullable().optional(),
  documentationUrl: z.string().nullable().optional(),
});

export type Project = z.infer<typeof ProjectSchema>;
