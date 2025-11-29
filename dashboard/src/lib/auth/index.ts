/**
 * JWT Authentication utilities for dashboard
 */

const TOKEN_KEY = "auth_token";
const EXPIRES_KEY = "auth_expires";
const EMAIL_KEY = "auth_email";

/**
 * Get the stored auth token
 */
export function getToken(): string | null {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem(TOKEN_KEY);
  const expires = localStorage.getItem(EXPIRES_KEY);

  if (!token || !expires) return null;

  // Check if token is expired
  if (Date.now() > parseInt(expires)) {
    clearAuth();
    return null;
  }

  return token;
}

/**
 * Get the stored admin email
 */
export function getEmail(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(EMAIL_KEY);
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return getToken() !== null;
}

/**
 * Clear authentication data
 */
export function clearAuth(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EXPIRES_KEY);
  localStorage.removeItem(EMAIL_KEY);
}

/**
 * Get authorization headers for API requests
 */
export function getAuthHeaders(): HeadersInit {
  const token = getToken();
  if (!token) return {};

  return {
    Authorization: `Bearer ${token}`,
  };
}

/**
 * Make an authenticated API request
 */
export async function authFetch(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const token = getToken();

  if (!token) {
    throw new Error("Not authenticated");
  }

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // If unauthorized, clear auth and throw
  if (response.status === 401) {
    clearAuth();
    throw new Error("Session expired. Please sign in again.");
  }

  return response;
}

/**
 * Verify token with backend (via local API route)
 */
export async function verifyToken(): Promise<boolean> {
  const token = getToken();
  if (!token) return false;

  try {
    // Use local API route to proxy to backend (hides backend URL from client)
    const response = await fetch("/api/auth/verify", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      clearAuth();
      return false;
    }

    return true;
  } catch {
    return false;
  }
}
