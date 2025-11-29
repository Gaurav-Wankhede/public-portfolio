import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protected routes that require authentication
const protectedRoutes = ["/dashboard", "/projects", "/certificates"];

// Public routes that don't require auth
const publicRoutes = [
  "/sign-in",
  "/unauthorized",
  "/auth/callback",
  "/api/auth",
];

// Allowed origins - configure via environment variables
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3333",
  process.env.NEXT_PUBLIC_SITE_URL,
  process.env.NEXT_PUBLIC_DASHBOARD_URL,
  process.env.BACKEND_URL,
].filter(Boolean) as string[];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();
  const origin = request.headers.get("origin");

  // CORS headers
  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS",
    );
    response.headers.set("Access-Control-Allow-Credentials", "true");
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, Origin, X-Requested-With",
    );
  }

  // Allow public routes
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return response;
  }

  // Check if route requires authentication
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (isProtectedRoute) {
    // Check for access token in cookies
    const accessToken = request.cookies.get("access_token")?.value;

    if (!accessToken) {
      // Redirect to sign-in if not authenticated
      const signInUrl = new URL("/sign-in", request.url);
      signInUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(signInUrl);
    }

    // Token exists - allow access
    // Backend will verify token validity on API calls
    return response;
  }

  return response;
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|.*\\..*|favicon.ico).*)",
    "/",
    // Always run for API routes
    "/api/:path*",
  ],
};
