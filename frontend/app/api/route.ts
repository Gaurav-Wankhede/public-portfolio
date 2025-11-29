export const runtime = 'edge';
import { NextResponse } from 'next/server';

// GET /api - Health check endpoint
export async function GET() {
  return NextResponse.json({
    message: "Portfolio API is working fine!",
    status: "ok",
    version: "1.0.0"
  });
} 