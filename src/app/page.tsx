import type { Metadata } from "next";
import {
  HomePageTemplate,
  type HomePost,
} from "@/components/Templates/HomePage/HomePageTemplate";
import { getAllPosts, getReadingTime } from "@/lib/posts";

// トップに載せる最新記事の件数
const LATEST_POST_COUNT = 5;

export const metadata: Metadata = {
  title: "Cloud Palette",
  description:
    "Next.js・TypeScript を中心としたWeb制作の記録と、制作実績をまとめたサイトです。",
};

export default function Home() {
  const posts: HomePost[] = getAllPosts()
    .slice(0, LATEST_POST_COUNT)
    .map(({ slug, title, date, description, tags, content }) => ({
      slug,
      title,
      date,
      description,
      tags,
      readingTime: getReadingTime(content),
    }));

  return <HomePageTemplate posts={posts} />;
}
