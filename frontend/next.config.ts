import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // ✅ SECURITY: Enable TypeScript checking during builds
    // Note: Fix TypeScript errors before deploying to production
    ignoreBuildErrors: false,
  },
  images: {
    loader: "custom",
    loaderFile: "./image-loader.ts",
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "yt3.ggpht.com" },
      { protocol: "https", hostname: "yt3.googleusercontent.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "via.placeholder.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "res.cloudflare.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "localhost" },
    ],
  },
  reactStrictMode: true,
  // NOTE: Rewrites removed - they don't work on Cloudflare Pages
  // API routes in app/api/* handle backend proxying instead
};

export default nextConfig;
