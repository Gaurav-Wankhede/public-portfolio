/**
 * API utilities for dashboard
 * All requests go through Next.js API proxy routes to hide backend URL from client
 */

import { getToken, clearAuth } from "@/lib/auth";

/**
 * Get the API base URL (always uses Next.js API routes)
 * @returns The base URL for API requests
 */
export const getApiUrl = () => {
  // Always use Next.js API routes (relative URLs work in both client and server)
  return "/api";
};

/**
 * Get authorization headers for authenticated requests
 */
export const getAuthHeaders = (): HeadersInit => {
  const token = getToken();
  if (!token) return {};

  return {
    Authorization: `Bearer ${token}`,
  };
};

/**
 * Fetch data from API endpoints (public endpoints)
 * @param path - The API path (e.g., '/projects', '/certificates')
 * @returns Promise with the JSON response data
 */
export const fetchData = async (path: string) => {
  const apiUrl = getApiUrl();
  // Remove trailing slash if present as API routes handle it
  const cleanPath = path.endsWith("/") ? path.slice(0, -1) : path;
  const res = await fetch(`${apiUrl}${cleanPath}`);

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  return await res.json();
};

/**
 * Fetch data from protected API endpoints (requires authentication)
 * @param path - The API path (e.g., '/projects', '/certificates')
 * @param options - Optional fetch options
 * @returns Promise with the JSON response data
 */
export const fetchProtectedData = async (
  path: string,
  options: RequestInit = {},
) => {
  const apiUrl = getApiUrl();
  const cleanPath = path.endsWith("/") ? path.slice(0, -1) : path;

  const token = getToken();
  if (!token) {
    throw new Error("Not authenticated");
  }

  const res = await fetch(`${apiUrl}${cleanPath}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  // Handle unauthorized responses
  if (res.status === 401) {
    clearAuth();
    if (typeof window !== "undefined") {
      window.location.href = "/sign-in";
    }
    throw new Error("Session expired. Please sign in again.");
  }

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  return await res.json();
};

/**
 * Make authenticated POST/PUT/DELETE requests
 * @param path - The API path
 * @param method - HTTP method
 * @param body - Request body (FormData or JSON)
 * @returns Promise with the response
 */
export const mutateData = async (
  path: string,
  method: "POST" | "PUT" | "DELETE",
  body?: FormData | object,
): Promise<Response> => {
  const apiUrl = getApiUrl();
  const cleanPath = path.endsWith("/") ? path.slice(0, -1) : path;

  const token = getToken();
  if (!token) {
    throw new Error("Not authenticated");
  }

  const isFormData = body instanceof FormData;

  const headers: HeadersInit = {
    Authorization: `Bearer ${token}`,
  };

  // Only set Content-Type for JSON, FormData sets its own boundary
  if (!isFormData && body) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${apiUrl}${cleanPath}`, {
    method,
    headers,
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
  });

  // Handle unauthorized responses
  if (res.status === 401) {
    clearAuth();
    if (typeof window !== "undefined") {
      window.location.href = "/sign-in";
    }
    throw new Error("Session expired. Please sign in again.");
  }

  return res;
};
