import { Project } from "./schema";
import { ApiResponse, Testimonial } from "@/lib/types"; // Ensure this path is correct
import { BACKEND_URL, backendFetch, handleApiResponse } from "@/lib/api-client";

interface Certificate {
  _id: string;
  name: string;
  issuer: string;
  link: string;
  issue_date: string;
  image_url: string;
  slug: string;
  embedding: number[];
}

export const api = {
  projects: {
    async getAll(): Promise<ApiResponse<Project[]>> {
      try {
        console.log("Fetching projects from:", `${BACKEND_URL}/projects`);
        const response = await backendFetch(`/projects`, {
          cache: "no-store", // Pure SSR - no caching
          headers: {
            Accept: "application/json",
          },
        });
        return handleApiResponse<Project[]>(response);
      } catch (error) {
        console.error("Projects API Error:", error);
        return {
          data: null,
          error: {
            message:
              error instanceof Error
                ? error.message
                : "Failed to fetch projects",
            status: 500,
            details: error,
          },
        };
      }
    },

    async getBySlug(slug: string): Promise<ApiResponse<Project>> {
      try {
        console.log(
          "Fetching project from:",
          `${BACKEND_URL}/projects/${slug}`,
        );
        const response = await backendFetch(`/projects/${slug}`, {
          cache: "no-store", // Pure SSR - no caching
          headers: {
            Accept: "application/json",
          },
        });
        return handleApiResponse<Project>(response);
      } catch (error) {
        console.error("Project API Error:", error);
        return {
          data: null,
          error: {
            message:
              error instanceof Error
                ? error.message
                : `Failed to fetch project: ${slug}`,
            status: 500,
            details: error,
          },
        };
      }
    },

    async create(project: Omit<Project, "id">): Promise<ApiResponse<Project>> {
      try {
        console.log("Creating project:", project);
        const response = await backendFetch(`/projects`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(project),
        });
        return handleApiResponse<Project>(response);
      } catch (error) {
        console.error("Project Creation API Error:", error);
        return {
          data: null,
          error: {
            message:
              error instanceof Error
                ? error.message
                : "Failed to create project",
            status: 500,
            details: error,
          },
        };
      }
    },

    async update(
      slug: string,
      project: Partial<Project>,
    ): Promise<ApiResponse<Project>> {
      try {
        console.log("Updating project:", slug, project);
        const response = await backendFetch(`/projects/${slug}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(project),
        });
        return handleApiResponse<Project>(response);
      } catch (error) {
        console.error("Project Update API Error:", error);
        return {
          data: null,
          error: {
            message:
              error instanceof Error
                ? error.message
                : `Failed to update project: ${slug}`,
            status: 500,
            details: error,
          },
        };
      }
    },

    async delete(slug: string): Promise<ApiResponse<void>> {
      try {
        console.log("Deleting project:", slug);
        const response = await backendFetch(`/projects/${slug}`, {
          method: "DELETE",
          headers: {
            Accept: "application/json",
          },
        });
        return handleApiResponse<void>(response);
      } catch (error) {
        console.error("Project Deletion API Error:", error);
        return {
          data: null,
          error: {
            message:
              error instanceof Error
                ? error.message
                : `Failed to delete project: ${slug}`,
            status: 500,
            details: error,
          },
        };
      }
    },
  },

  certificates: {
    async getAll(): Promise<ApiResponse<Certificate[]>> {
      try {
        console.log(
          "Fetching certificates from:",
          `${BACKEND_URL}/certificates`,
        );
        const response = await backendFetch(`/certificates`, {
          cache: "no-store", // Pure SSR - no caching
          headers: {
            Accept: "application/json",
          },
        });
        return handleApiResponse<Certificate[]>(response);
      } catch (error) {
        console.error("Certificates API Error:", error);
        return {
          data: null,
          error: {
            message:
              error instanceof Error
                ? error.message
                : "Failed to fetch certificates",
            status: 500,
            details: error,
          },
        };
      }
    },

    async getBySlug(slug: string): Promise<ApiResponse<Certificate>> {
      try {
        console.log(
          "Fetching certificate from:",
          `${BACKEND_URL}/certificates/${slug}`,
        );
        const response = await backendFetch(`/certificates/${slug}`, {
          cache: "no-store", // Pure SSR - no caching
          headers: {
            Accept: "application/json",
          },
        });
        return handleApiResponse<Certificate>(response);
      } catch (error) {
        console.error("Certificate API Error:", error);
        return {
          data: null,
          error: {
            message:
              error instanceof Error
                ? error.message
                : `Failed to fetch certificate: ${slug}`,
            status: 500,
            details: error,
          },
        };
      }
    },
  },

  testimonials: {
    getAll: async (): Promise<ApiResponse<Testimonial[]>> => {
      const response = await backendFetch(`/testimonials`);
      return handleApiResponse<Testimonial[]>(response);
    },
  },
};
