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
  // Hide the dev-only on-screen route indicator that otherwise appears in every
  // visual QA capture (bottom-left by default). Errors still surface normally.
  // Next.js dev blocks static chunks for non-allowlisted origins; allow the
  // loopback IP form so hydration doesn't silently break for 127.0.0.1 loads.
  allowedDevOrigins: ["127.0.0.1"],
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
