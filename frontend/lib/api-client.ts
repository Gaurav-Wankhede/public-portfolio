import { ApiResponse } from "@/lib/types";
import {
  fallbackProjects,
  fallbackCertificates,
  shouldUseFallback,
} from "@/lib/data/fallback";

// Server-only backend URL - NEVER exposed to client bundle
// Uses BACKEND_URL (server-only) with fallback to NEXT_PUBLIC version for backwards compatibility
function getServerBackendUrl(): string | null {
  // Server-only env var (preferred - not in client bundle)
  if (process.env.BACKEND_URL) {
    return process.env.BACKEND_URL;
  }
  // Fallback for backwards compatibility
  if (process.env.NEXT_PUBLIC_BACKEND_URL) {
    return process.env.NEXT_PUBLIC_BACKEND_URL;
  }
  // Local development fallback
  if (process.env.NEXT_PUBLIC_API_URL_LOCAL) {
    return process.env.NEXT_PUBLIC_API_URL_LOCAL;
  }
  // Return null to indicate fallback data should be used
  return null;
}

// DEPRECATED: Only for backwards compatibility with existing code
// New code should NOT use this - use server components with getServerBackendUrl()
export const BACKEND_URL: string = (() => {
  if (typeof window !== "undefined") {
    // Client-side: return empty string (forces use of proxy routes)
    return "";
  }
  return getServerBackendUrl() || "";
})();

// Helper to call backend with base URL
export const backendFetch = (path: string, init?: RequestInit) => {
  const url = path.startsWith("http") ? path : `${BACKEND_URL}${path}`;
  return fetch(url, init);
};

// Keep response handler centralized for reuse across modules
export const handleApiResponse = async <T>(
  response: Response,
): Promise<ApiResponse<T>> => {
  try {
    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Failed to parse error response" }));
      return {
        data: null,
        error: {
          message: errorData?.message || `HTTP error ${response.status}`,
          status: response.status,
          details: errorData,
        },
      };
    }

    const data = await response.json();
    // If the response is an object with a truthy 'error' property, treat as error
    if (data && typeof data === "object" && "error" in data && data.error) {
      return {
        data: null,
        error:
          typeof data.error === "object"
            ? data.error
            : {
                message: "API returned error",
                status: response.status,
              },
      };
    }
    // Otherwise, treat as valid payload
    return {
      data,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: {
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
        status: 500,
        details: error,
      },
    };
  }
};

// Check if running on server (SSR)
const isServer = typeof window === "undefined";

// Helper to get the appropriate URL for API calls
// - Client-side: Use proxy routes (/api/*) to hide backend URL
// - Server-side (SSR): Call backend directly (Cloudflare Workers can't self-fetch)
// Returns null if no backend URL is configured (use fallback data instead)
function getApiUrl(proxyPath: string, backendPath: string): string | null {
  if (isServer) {
    // SSR: Call backend directly using server-only URL
    // This URL is NEVER sent to the client
    const serverUrl = getServerBackendUrl();
    if (!serverUrl) {
      // No backend configured - caller should use fallback data
      return null;
    }
    return `${serverUrl}${backendPath}`;
  }
  // Client: Use proxy route (hides backend URL from browser)
  return proxyPath;
}

export const apiClient = {
  projects: {
    async getBySlug(slug: string): Promise<ApiResponse<unknown>> {
      try {
        const url = getApiUrl(
          `/api/projects/${slug}`,
          `/api/v1/projects/${slug}`,
        );

        // Use fallback data if no backend configured
        if (!url) {
          const project = fallbackProjects.find((p) => p.slug === slug);
          if (project) {
            return { data: project, error: null };
          }
          return {
            data: null,
            error: { message: `Project not found: ${slug}`, status: 404 },
          };
        }

        console.log("Fetching project from:", url);

        const response = await fetch(url, {
          cache: "no-store", // Pure SSR - no caching
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
        return handleApiResponse(response);
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

    async getAll(): Promise<ApiResponse<unknown[]>> {
      try {
        const url = getApiUrl("/api/projects", "/api/v1/projects");

        // Use fallback data if no backend configured
        if (!url) {
          console.log("Using fallback projects data");
          return { data: fallbackProjects, error: null };
        }

        console.log("Fetching projects from:", url);

        const response = await fetch(url, {
          cache: "no-store", // Pure SSR - no caching
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
        return handleApiResponse(response);
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

    async create(formData: FormData): Promise<ApiResponse<unknown>> {
      try {
        console.log("Creating project");
        const response = await fetch("/api/projects", {
          method: "POST",
          body: formData,
        });
        return handleApiResponse(response);
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
      formData: FormData,
    ): Promise<ApiResponse<unknown>> {
      try {
        console.log("Updating project:", slug);
        const response = await fetch(`/api/projects/${slug}`, {
          method: "PUT",
          body: formData,
        });
        return handleApiResponse(response);
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
        const response = await fetch(`/api/projects/${slug}`, {
          method: "DELETE",
          headers: {
            Accept: "application/json",
          },
        });
        return handleApiResponse(response);
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
    async getAll(): Promise<ApiResponse<unknown[]>> {
      try {
        const url = getApiUrl("/api/certificates", "/api/v1/certificates");

        // Use fallback data if no backend configured
        if (!url) {
          console.log("Using fallback certificates data");
          return { data: fallbackCertificates, error: null };
        }

        console.log("Fetching certificates from:", url);
        const response = await fetch(url, {
          cache: "no-store", // SSR - fresh data
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
        return handleApiResponse(response);
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

    async getBySlug(slug: string): Promise<ApiResponse<unknown>> {
      try {
        const url = getApiUrl(
          `/api/certificates/${slug}`,
          `/api/v1/certificates/${slug}`,
        );

        // Use fallback data if no backend configured
        if (!url) {
          const certificate = fallbackCertificates.find((c) => c.slug === slug);
          if (certificate) {
            return { data: certificate, error: null };
          }
          return {
            data: null,
            error: { message: `Certificate not found: ${slug}`, status: 404 },
          };
        }

        console.log("Fetching certificate from:", url);
        const response = await fetch(url, {
          cache: "no-store", // SSR - fresh data
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
        return handleApiResponse(response);
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

    async create(formData: FormData): Promise<ApiResponse<unknown>> {
      try {
        console.log("Creating certificate");
        const response = await fetch("/api/certificates", {
          method: "POST",
          body: formData,
        });
        return handleApiResponse(response);
      } catch (error) {
        console.error("Certificate Creation API Error:", error);
        return {
          data: null,
          error: {
            message:
              error instanceof Error
                ? error.message
                : "Failed to create certificate",
            status: 500,
            details: error,
          },
        };
      }
    },

    async update(
      slug: string,
      formData: FormData,
    ): Promise<ApiResponse<unknown>> {
      try {
        console.log("Updating certificate:", slug);
        const response = await fetch(`/api/certificates/${slug}`, {
          method: "PUT",
          body: formData,
        });
        return handleApiResponse(response);
      } catch (error) {
        console.error("Certificate Update API Error:", error);
        return {
          data: null,
          error: {
            message:
              error instanceof Error
                ? error.message
                : `Failed to update certificate: ${slug}`,
            status: 500,
            details: error,
          },
        };
      }
    },

    async delete(slug: string): Promise<ApiResponse<void>> {
      try {
        console.log("Deleting certificate:", slug);
        const response = await fetch(`/api/certificates/${slug}`, {
          method: "DELETE",
          headers: {
            Accept: "application/json",
          },
        });
        return handleApiResponse(response);
      } catch (error) {
        console.error("Certificate Deletion API Error:", error);
        return {
          data: null,
          error: {
            message:
              error instanceof Error
                ? error.message
                : `Failed to delete certificate: ${slug}`,
            status: 500,
            details: error,
          },
        };
      }
    },
  },
};
