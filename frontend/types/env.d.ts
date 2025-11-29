declare namespace NodeJS {
  interface ProcessEnv {
    GROQ_API_KEY: string;
    MONGODB_URL: string;
    MONGODB_DB: string;
    GOOGLE_API_KEY: string;
    BACKEND_URL?: string; // Server-only - never exposed to client
    NEXT_PUBLIC_BACKEND_URL?: string; // Deprecated - use BACKEND_URL
    NEXT_PUBLIC_API_URL_LOCAL?: string;
  }
}
