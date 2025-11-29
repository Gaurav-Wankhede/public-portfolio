import { NextResponse, NextRequest } from "next/server";
import { ChatRequest, ChatResponse, Message } from "@/types/chat";

// Using Node.js runtime for Cloudflare Workers compatibility
export const runtime = "edge"; // Commented out - OpenNext doesn't support edge runtime in default server function

// Server-only backend URL - never exposed to client
const BACKEND_URL =
  process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL;

export async function POST(req: NextRequest) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  if (req.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const body = await req.json();
    // Accept both "message" and "messages" from frontend for backward compatibility
    const { message, messages, chat_history } = body;
    const userMessage = messages || message;

    if (!userMessage) {
      return NextResponse.json(
        {
          error: "Message is missing in the request body",
          content: "I couldn't understand your message. Please try again.",
        },
        { status: 400, headers: corsHeaders },
      );
    }

    console.log("Forwarding chat request to backend");

    const backendRes = await fetch(BACKEND_URL + "/api/v1/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages: userMessage, chat_history }),
    });

    if (!backendRes.ok) {
      const errorText = await backendRes.text();
      console.error("Backend Error:", errorText);
      return NextResponse.json(
        { content: "Backend error: " + errorText },
        { status: 500, headers: corsHeaders },
      );
    }

    const responseData: ChatResponse = await backendRes.json();

    const chatResponse: Message = {
      role: "assistant",
      content: responseData.content,
    };

    return NextResponse.json(chatResponse, { headers: corsHeaders });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      {
        content:
          "I apologize, but I'm currently experiencing high traffic. Please try again in a few moments.",
      },
      { status: 200 },
    );
  }
}
