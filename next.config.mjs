import createMDX from "@next/mdx";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
  // Configure `pageExtensions` to include MDX files
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.microcms-assets.io",
      },
      {
        protocol: "http",
        hostname: "35.224.211.72",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

const withMDX = createMDX({
  options: {
    // MDX冒頭のYAML（--- で囲まれた部分）を本文から取り除き、
    // `frontmatter` という名前付きエクスポートとして取り出せるようにする
    remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
  },
});

// Merge MDX config with Next.js config
export default withMDX(nextConfig);
