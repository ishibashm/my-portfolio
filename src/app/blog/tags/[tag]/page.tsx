import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BlogListTemplate } from "@/components/Templates/BlogList/BlogListTemplate";
import { getAllPosts, getReadingTime } from "@/lib/posts";
import styles from "./tag-page.module.css";

interface TagPageProps {
  params: Promise<{ tag: string }>;
}

// 記事に登場する全タグ分のページを静的生成する
export function generateStaticParams() {
  const tags = new Set(getAllPosts().flatMap((post) => post.tags ?? []));
  return Array.from(tags).map((tag) => ({ tag: encodeURIComponent(tag) }));
}

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  return {
    title: `${decoded} の記事 | Cloud Palette`,
    description: `${decoded} に関する記事の一覧です。`,
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);

  const posts = getAllPosts()
    .filter((post) => post.tags?.includes(decoded))
    .map(({ slug, title, date, description, tags, content }) => ({
      slug,
      title,
      date,
      description,
      tags,
      readingTime: getReadingTime(content),
    }));

  // 該当タグの記事が1件もなければ404にする
  if (posts.length === 0) {
    notFound();
  }

  return (
    <>
      <BlogListTemplate posts={posts} title={`#${decoded}`} />
      <div className={styles.backLinkWrapper}>
        <Link href="/blog" className={styles.backLink}>
          ← すべての記事
        </Link>
      </div>
    </>
  );
}
