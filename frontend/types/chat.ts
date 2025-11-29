// Chat message types
export interface Message {
  role: string;
  content: string;
}

// Chat request type
export interface ChatRequest {
  messages: string; // Backend expects "messages" not "message"
  chat_history?: Message[];
}

// Chat response type
export interface ChatResponse {
  content: string;
  source_documents?: Record<string, any>[];
}

// Mock response options for fallback functionality
export type MockResponseOption = "greeting" | "help" | "projects" | "default";

// Database document types for chat-related data
export interface Project {
  _id: string;
  title: string;
  date: string;
  technologies: string[];
  description?: {
    overview?: string;
    problem?: string;
    solution?: string;
    impact?: string;
  };
  githubUrl?: string;
  demoUrl?: string;
  ReportUrl?: string;
  embedding?: number[];
}

export interface Certificate {
  _id: string;
  name: string;
  issuer: string;
  issue_date: string;
  link?: string;
  image_url?: string;
  embedding?: number[];
}
