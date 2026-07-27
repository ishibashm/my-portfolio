import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "https://www.cloud-palette.com";

// 記事はMDXファイルから読むため、外部APIに問い合わせる必要はない
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, priority: 1 },
    { url: `${BASE_URL}/blog`, lastModified: now, priority: 0.8 },
    { url: `${BASE_URL}/portfolio`, lastModified: now, priority: 0.8 },
  ];

  const posts = getAllPosts();

  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : now,
    priority: 0.6,
  }));

  const tagPages: MetadataRoute.Sitemap = Array.from(
    new Set(posts.flatMap((post) => post.tags ?? [])),
  ).map((tag) => ({
    url: `${BASE_URL}/blog/tags/${encodeURIComponent(tag)}`,
    lastModified: now,
    priority: 0.4,
  }));

  return [...staticPages, ...postPages, ...tagPages];
}
