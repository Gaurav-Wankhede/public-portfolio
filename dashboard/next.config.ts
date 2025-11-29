import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    unoptimized: true, // Required for Cloudflare Pages
  },
  reactStrictMode: true,
  // Output standalone for better Cloudflare compatibility
  output: "standalone",
  // Disable experimental features that may not work on Cloudflare
  experimental: {
    // Runtime compatible with Cloudflare Workers
  },
};

export default nextConfig;
