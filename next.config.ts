import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  images: {
    // WebP is the Next.js default; prefer AVIF (20% smaller) with WebP fallback
    // for browsers that support each. The optimizer still serves the original
    // format if neither matches.
    formats: ["image/avif", "image/webp"],
  },
};

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
  options: {
    remarkPlugins: ["remark-gfm"],
    rehypePlugins: [],
  },
});

export default withMDX(nextConfig);
