import { notFound } from "next/navigation";
import { MDXComponents } from "@/components/MDX/MDXComponents";
import { MDXRemote } from "next-mdx-remote/rsc";
import styles from "./blog-post.module.css";
import { getAllPostSlugs, getPostBySlug } from "@/lib/posts";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <section className={styles.blogPost}>
      <div className={styles.container}>
        <div className={styles.articleWrapper}>
          <header className={styles.articleHeader}>
            <h1 className={styles.articleTitle}>{post.title}</h1>
            {post.date && (
              <time className={styles.articleDate} dateTime={post.date}>
                {new Date(post.date).toLocaleDateString("ja-JP")}
              </time>
            )}
          </header>

          <div className={styles.blogContent}>
            <MDXRemote {...post.mdxSource} components={MDXComponents} />
          </div>

          {post.tags && post.tags.length > 0 && (
            <footer className={styles.articleFooter}>
              <div className={styles.tags}>
                <span>タグ: </span>
                {post.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </footer>
          )}
        </div>
      </div>
    </section>
  );
}

// 静的生成のためのパラメータ
export async function generateStaticParams() {
  const slugs = getAllPostSlugs();

  return slugs.map((slug) => ({
    slug,
  }));
}

// メタデータ生成
export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "記事が見つかりません",
    };
  }

  return {
    title: post.title,
    description: post.description || "",
    openGraph: {
      title: post.title,
      description: post.description || "",
      type: "article",
      publishedTime: post.date,
      authors: ["作者"],
    },
  };
}
