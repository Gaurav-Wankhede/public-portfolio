// chat-service.ts

import { ChatRequest, ChatResponse } from "@/types/chat";

// Server-only backend URL - never exposed to client
const BACKEND_API =
  process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL;

export class ChatService {
  public async processChat(request: ChatRequest): Promise<ChatResponse> {
    try {
      const response = await fetch(`${BACKEND_API}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include session cookies
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const err = await response.text();
        console.error("Backend chat API error:", err);
        return { content: "⚠️ Error: Could not fetch response from backend." };
      }

      const data = await response.json();
      return {
        content: data?.content || "⚠️ No content returned from backend.",
      };
    } catch (error) {
      console.error("Network failure to backend /chat:", error);
      return { content: "⚠️ Chat backend unavailable. Try again shortly." };
    }
  }
}

export const chatService = new ChatService();
