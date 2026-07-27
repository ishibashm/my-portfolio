import type { Metadata } from "next";
import { BlogListTemplate } from "@/components/Templates/BlogList/BlogListTemplate";
import { getAllPosts, getReadingTime } from "@/lib/posts";

export const metadata: Metadata = {
  title: "ブログ | Cloud Palette",
  description: "Web制作で学んだことや、作ったものの記録です。",
};

// 記事の読み込みは lib/posts.ts に集約している（一覧・トップで同じ実装を使う）
const BlogPage = () => {
  const posts = getAllPosts().map(
    ({ slug, title, date, description, tags, content }) => ({
      slug,
      title,
      date,
      description,
      tags,
      readingTime: getReadingTime(content),
    }),
  );

  return <BlogListTemplate posts={posts} title="ブログ" />;
};

export default BlogPage;
