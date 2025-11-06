import { notFound } from "next/navigation";
import styles from "./blog-post.module.css";
import { getAllPostSlugs, getPostBySlug } from "@/lib/posts";
import { FC } from "react";

interface BlogPostPageProps {
  params: { slug: string };
}

// MDXファイルのfrontmatterの型
interface Frontmatter {
  title: string;
  date: string;
  description?: string;
  tags?: string[];
}

// MDXファイルからインポートされるモジュールの型
interface MdxModule {
  default: FC; // MDXコンテンツ本体
  frontmatter: Frontmatter;
}

async function getPostComponent(
  slug: string,
): Promise<MdxModule | null> {
  try {
    // 動的インポートを使用して、slugに一致するMDXファイルを読み込む
    return await import(`@/posts/${slug}.mdx`);
  } catch (error) {
    // ファイルが見つからない場合はnullを返す
    return null;
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = params;
  const postModule = await getPostComponent(slug);

  if (!postModule) {
    notFound();
  }

  const { frontmatter, default: Content } = postModule;

  return (
    <section className={styles.blogPost}>
      <div className={styles.container}>
        <div className={styles.articleWrapper}>
          <header className={styles.articleHeader}>
            <h1 className={styles.articleTitle}>{frontmatter.title}</h1>
            {frontmatter.date && (
              <time className={styles.articleDate} dateTime={frontmatter.date}>
                {new Date(frontmatter.date).toLocaleDateString("ja-JP")}
              </time>
            )}
          </header>

          <div className={styles.blogContent}>
            <Content />
          </div>

          {frontmatter.tags && frontmatter.tags.length > 0 && (
            <footer className={styles.articleFooter}>
              <div className={styles.tags}>
                <span>タグ: </span>
                {frontmatter.tags.map((tag) => (
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
  const { slug } = params;
  const postModule = await getPostComponent(slug);

  if (!postModule) {
    return {
      title: "記事が見つかりません",
    };
  }

  const { frontmatter } = postModule;

  return {
    title: frontmatter.title,
    description: frontmatter.description || "",
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.description || "",
      type: "article",
      publishedTime: frontmatter.date,
      authors: ["作者"],
    },
  };
}