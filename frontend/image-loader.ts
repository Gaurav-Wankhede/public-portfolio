/**
 * Custom image loader for Next.js
 * Works with Cloudflare Pages and other edge deployments
 */

interface ImageLoaderProps {
  src: string;
  width: number;
  quality?: number;
}

export default function imageLoader({ src, width, quality }: ImageLoaderProps): string {
  // If already a full URL, return as-is with width param
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }

  // For local images, return the path directly
  return src;
}
