import { notFound } from "next/navigation";
import Link from "next/link";
import styles from "./blog-post.module.css";
import { getAllPostSlugs, getAllPosts, getReadingTime } from "@/lib/posts";
import { formatDate } from "@/utils/formatDate";
import { FC } from "react";

// Next.js 15 では動的ルートの params は Promise で渡される
interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
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

async function getPostComponent(slug: string): Promise<MdxModule | null> {
  try {
    // 動的インポートを使用して、slugに一致するMDXファイルを読み込む
    return await import(`@/posts/${slug}.mdx`);
  } catch {
    // ファイルが見つからない場合はnullを返す
    return null;
  }
}

// 日付順に並んだ一覧から、前後の記事を取り出す
function getSiblings(slug: string) {
  const posts = getAllPosts();
  const index = posts.findIndex((post) => post.slug === slug);
  if (index === -1) {
    return { newer: null, older: null, current: null };
  }
  return {
    // getAllPosts は新しい順なので、ひとつ前の要素がより新しい記事になる
    newer: index > 0 ? posts[index - 1] : null,
    older: index < posts.length - 1 ? posts[index + 1] : null,
    current: posts[index],
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const postModule = await getPostComponent(slug);

  if (!postModule) {
    notFound();
  }

  const { frontmatter, default: Content } = postModule;
  const { newer, older, current } = getSiblings(slug);
  const readingTime = current ? getReadingTime(current.content) : null;

  return (
    <section className={styles.blogPost}>
      <div className={styles.container}>
        <div className={styles.articleWrapper}>
          <header className={styles.articleHeader}>
            <h1 className={styles.articleTitle}>{frontmatter.title}</h1>
            <div className={styles.articleMeta}>
              {frontmatter.date && (
                <time
                  className={styles.articleDate}
                  dateTime={frontmatter.date}
                >
                  {formatDate(frontmatter.date)}
                </time>
              )}
              {readingTime !== null && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>約{readingTime}分で読めます</span>
                </>
              )}
            </div>
          </header>

          <div className={styles.blogContent}>
            <Content />
          </div>

          {frontmatter.tags && frontmatter.tags.length > 0 && (
            <footer className={styles.articleFooter}>
              <div className={styles.tags}>
                <span>タグ: </span>
                {frontmatter.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog/tags/${encodeURIComponent(tag)}`}
                    className={styles.tag}
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </footer>
          )}

          {/* 前後の記事へのナビゲーション */}
          {(newer || older) && (
            <nav className={styles.postNav} aria-label="前後の記事">
              {older ? (
                <Link href={`/blog/${older.slug}`} className={styles.navPrev}>
                  <span className={styles.navLabel}>← 前の記事</span>
                  <span className={styles.navTitle}>{older.title}</span>
                </Link>
              ) : (
                <span />
              )}
              {newer && (
                <Link href={`/blog/${newer.slug}`} className={styles.navNext}>
                  <span className={styles.navLabel}>次の記事 →</span>
                  <span className={styles.navTitle}>{newer.title}</span>
                </Link>
              )}
            </nav>
          )}

          <div className={styles.backLinkWrapper}>
            <Link href="/blog" className={styles.backLink}>
              ← 記事一覧へ
            </Link>
          </div>
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
    },
  };
}
