"use client";

import { useEffect } from "react";
import { onCLS, onFCP, onLCP, onTTFB, onINP, type Metric } from "web-vitals";

/**
 * Web Vitals monitoring component
 * Tracks Core Web Vitals and sends them to console (can be extended to send to analytics)
 *
 * Metrics tracked:
 * - CLS: Cumulative Layout Shift

 * - FCP: First Contentful Paint
 * - LCP: Largest Contentful Paint
 * - TTFB: Time to First Byte
 * - INP: Interaction to Next Paint
 */

function sendToAnalytics(metric: Metric) {
  // In development, log to console
  if (process.env.NODE_ENV === "development") {
    console.log("[Web Vitals]", {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
    });
  }

  // In production, you can send to your analytics service
  // Example: Send to Cloudflare Web Analytics or custom endpoint
  if (
    typeof window !== "undefined" &&
    typeof window.navigator.sendBeacon === "function"
  ) {
    const body = JSON.stringify({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
      navigationType: metric.navigationType,
    });

    // Uncomment to send to your analytics endpoint
    // window.navigator.sendBeacon('/api/analytics/vitals', body);
  }
}

export default function WebVitals() {
  useEffect(() => {
    // Track all Core Web Vitals
    onCLS(sendToAnalytics);
    onFCP(sendToAnalytics);
    onLCP(sendToAnalytics);
    onTTFB(sendToAnalytics);
    onINP(sendToAnalytics);
  }, []);

  return null; // This component doesn't render anything
}
