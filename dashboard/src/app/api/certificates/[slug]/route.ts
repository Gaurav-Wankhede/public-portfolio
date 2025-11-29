import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const response = await fetch(`${BACKEND_URL}/api/v1/certificates/${slug}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Backend responded with status ${response.status}` },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error proxying certificate request:", error);
    return NextResponse.json(
      { error: "Failed to fetch certificate from backend" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    // Get authorization header from client request
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json(
        { error: "Authorization required" },
        { status: 401 },
      );
    }

    const { slug } = await params;
    const formData = await request.formData();

    const response = await fetch(`${BACKEND_URL}/api/v1/certificates/${slug}`, {
      method: "PUT",
      headers: {
        Authorization: authHeader,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        {
          error:
            errorText || `Backend responded with status ${response.status}`,
        },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error proxying certificate update:", error);
    return NextResponse.json(
      { error: "Failed to update certificate" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    // Get authorization header from client request
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json(
        { error: "Authorization required" },
        { status: 401 },
      );
    }

    const { slug } = await params;
    const response = await fetch(`${BACKEND_URL}/api/v1/certificates/${slug}`, {
      method: "DELETE",
      headers: {
        Authorization: authHeader,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        {
          error:
            errorText || `Backend responded with status ${response.status}`,
        },
        { status: response.status },
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error proxying certificate deletion:", error);
    return NextResponse.json(
      { error: "Failed to delete certificate" },
      { status: 500 },
    );
  }
}
