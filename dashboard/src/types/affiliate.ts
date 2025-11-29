// Affiliate Product Types - matching Rust backend models

export type ProductCategory =
  | "Books"
  | "Tech"
  | "Courses"
  | "Tools"
  | "Accessories";

export type AffiliateNetworkType =
  | "Amazon"
  | "ClickBank"
  | "ShareASale"
  | "CJ"
  | "Impact"
  | "Rakuten"
  | "Custom";

export type CommissionType = "Percentage" | "FixedAmount" | "Hybrid";

export interface Pricing {
  price: number;
  currency: string;
  salePrice?: number;
  salePriceEndDate?: string;
}

export interface AffiliateNetwork {
  name: AffiliateNetworkType;
  trackingId: string;
}

export interface AffiliateProduct {
  _id: string;
  productId: string;
  name: string;
  description: string;
  category: ProductCategory;
  affiliateNetwork: AffiliateNetwork;
  affiliateLink: string;
  trackingId: string;
  commissionRate: number;
  commissionType: CommissionType;
  pricing: Pricing;
  images: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AffiliateClick {
  _id: string;
  clickId: string;
  productId: string;
  eventId: string;
  clickedAt: string;
  referrer?: string;
  userAgent?: string;
  ipAddress?: string;
}

export interface AffiliateConversion {
  _id: string;
  conversionId: string;
  clickId: string;
  productId: string;
  eventId: string;
  orderValue: number;
  commission: number;
  convertedAt: string;
  status: "pending" | "approved" | "rejected";
}

export interface ProductAnalytics {
  productId: string;
  productName: string;
  totalClicks: number;
  totalConversions: number;
  totalRevenue: number;
  totalCommission: number;
  conversionRate: number;
  avgOrderValue: number;
  clicksByDay: Array<{ date: string; clicks: number }>;
  conversionsByDay: Array<{ date: string; conversions: number }>;
}
