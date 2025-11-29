export interface ApiError {
  message: string;
  status: number;
  details?: unknown;
}

export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
}

export interface Testimonial {
  _id: string;
  name: string;
  email: string;
  role: string;
  content: string;
  rating: number;
  socialProfiles: {
    portfolio?: string;
    linkedin?: string;
    github?: string;
    x?: string;
    image_url?: string;
  };
  date: string;
} 