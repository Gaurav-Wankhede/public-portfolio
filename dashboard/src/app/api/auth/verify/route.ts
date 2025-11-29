import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL;

/**
 * Verify token endpoint - proxies to backend JWT verification
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader) {
      return NextResponse.json(
        { valid: false, error: "No authorization header" },
        { status: 401 },
      );
    }

    const response = await fetch(`${BACKEND_URL}/auth/verify`, {
      method: "GET",
      headers: {
        Authorization: authHeader,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { valid: false, error: "Token verification failed" },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json({ valid: true, ...data });
  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json(
      { valid: false, error: "Failed to verify token" },
      { status: 500 },
    );
  }
}
