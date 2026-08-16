import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  // Keep Turbopack scoped to this standalone app. A parent-level lockfile
  // exists outside the repository and otherwise triggers Next.js root warnings.
  turbopack: {
    root: process.cwd(),
  },
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  outputFileTracingIncludes: {
    "/*": ["./data/omhas.db"],
  },
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
    remarkPlugins: [
      "remark-frontmatter",
      ["remark-mdx-frontmatter", { name: "frontmatter" }],
      "remark-gfm",
    ],
    rehypePlugins: [],
  },
});

export default withMDX(nextConfig);
