import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // WebP is the Next.js default; prefer AVIF (20% smaller) with WebP fallback
    // for browsers that support each. The optimizer still serves the original
    // format if neither matches.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
