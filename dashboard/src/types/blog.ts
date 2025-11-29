/**
 * Blog Post and Category Types
 * Matches backend Rust models for blog management
 */

export type PostStatus = "draft" | "published" | "scheduled";

export interface SEO {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  ogImage?: string;
  canonicalUrl?: string;
}

export interface Author {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface DarkPsychology {
  triggers: string[];
  hookScore: number;
}

/**
 * Blog Metadata for ad and affiliate matching
 * Added for Google Ads + Affiliate integration
 */
export interface BlogMetadata {
  /** Additional keywords for relevance matching (beyond SEO keywords) */
  keywords: string[];
  /** Google AdSense categories for this post (e.g., "technology", "programming", "web-development") */
  adCategories: string[];
  /** Affiliate product categories relevant to this post (e.g., "tech", "books", "courses") */
  affiliateCategories: string[];
}

export interface BlogPost {
  _id?: string;
  slug: string;
  title: string;
  subtitle?: string;
  content: string;
  excerpt: string;
  seo: SEO;
  author?: Author;
  status: PostStatus;
  publishedAt?: string;
  scheduledFor?: string;
  categories: string[]; // ObjectId references
  tags: string[]; // ObjectId references
  featuredImage?: string;
  readingTime?: number;
  viewCount?: number;
  darkPsychology?: DarkPsychology;
  metadata?: BlogMetadata; // NEW: For ad/affiliate matching
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBlogPost {
  slug: string;
  title: string;
  subtitle?: string;
  content: string;
  excerpt: string;
  seo: SEO;
  status: PostStatus;
  scheduledFor?: string;
  categories: string[];
  tags: string[];
  featuredImage?: string;
  metadata?: BlogMetadata; // NEW
}

export interface UpdateBlogPost {
  slug?: string;
  title?: string;
  subtitle?: string;
  content?: string;
  excerpt?: string;
  seo?: SEO;
  status?: PostStatus;
  scheduledFor?: string;
  categories?: string[];
  tags?: string[];
  featuredImage?: string;
  metadata?: BlogMetadata; // NEW
}

/**
 * Blog Category Model
 */
export interface Category {
  _id?: string;
  slug: string;
  name: string;
  description?: string;
  parentId?: string; // Reference to parent category for hierarchy
  affiliateCategories: string[]; // NEW: Maps to affiliate product categories (e.g., ["tech", "books"])
  adCategories: string[]; // NEW: Maps to Google AdSense categories (e.g., ["technology", "programming"])
  createdAt?: string;
}

export interface CreateCategory {
  slug: string;
  name: string;
  description?: string;
  parentId?: string;
  affiliateCategories: string[];
  adCategories: string[];
}

export interface UpdateCategory {
  slug?: string;
  name?: string;
  description?: string;
  parentId?: string;
  affiliateCategories?: string[];
  adCategories?: string[];
}

/**
 * Blog Tag Model
 */
export interface Tag {
  _id?: string;
  slug: string;
  name: string;
  createdAt?: string;
}

export interface CreateTag {
  slug: string;
  name: string;
}

export interface UpdateTag {
  slug?: string;
  name?: string;
}

/**
 * Predefined affiliate product categories
 * Should match backend ProductCategory enum
 */
export const AFFILIATE_PRODUCT_CATEGORIES = [
  "books",
  "tech",
  "courses",
  "tools",
  "accessories",
] as const;

/**
 * Common Google AdSense categories
 * Reference: https://support.google.com/adsense/answer/9725
 */
export const ADSENSE_CATEGORIES = [
  "technology",
  "programming",
  "web-development",
  "software",
  "hardware",
  "mobile",
  "ai-machine-learning",
  "data-science",
  "cybersecurity",
  "cloud-computing",
  "devops",
  "gaming",
  "business",
  "marketing",
  "finance",
  "education",
  "tutorials",
  "reviews",
  "news",
  "lifestyle",
] as const;

export type AffiliateCategory = (typeof AFFILIATE_PRODUCT_CATEGORIES)[number];
export type AdSenseCategory = (typeof ADSENSE_CATEGORIES)[number];
