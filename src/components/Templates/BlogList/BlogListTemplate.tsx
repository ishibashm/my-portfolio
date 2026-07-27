import Link from "next/link";
import styles from "./BlogListTemplate.module.css";
import { formatDate } from "@/utils/formatDate";

export type BlogListPost = {
  slug: string;
  title: string;
  date: string;
  description?: string;
  tags?: string[];
  readingTime: number;
};

interface BlogListTemplateProps {
  posts: BlogListPost[];
  title: string;
}

export const BlogListTemplate = ({ posts, title }: BlogListTemplateProps) => {
  // 記事に付いているタグを重複なく集めて、絞り込み用に上部へ並べる
  const allTags = Array.from(
    new Set(posts.flatMap((post) => post.tags ?? [])),
  ).sort();

  return (
    <section className={styles.blogListSection}>
      <div className="container">
        <h1 className={styles.pageTitle}>{title}</h1>

        {allTags.length > 0 && (
          <div className={styles.tagFilter}>
            {allTags.map((tag) => (
              <Link
                key={tag}
                href={`/blog/tags/${encodeURIComponent(tag)}`}
                className={styles.filterTag}
              >
                {tag}
              </Link>
            ))}
          </div>
        )}

        {posts.length === 0 ? (
          <p className={styles.empty}>まだ記事がありません。</p>
        ) : (
          <ul className={styles.blogGrid}>
            {posts.map((post) => (
              <li key={post.slug}>
                <Link href={`/blog/${post.slug}`} className={styles.blogCard}>
                  <div className={styles.cardContent}>
                    <div className={styles.cardMeta}>
                      {post.date && (
                        <time dateTime={post.date} className={styles.cardDate}>
                          {formatDate(post.date)}
                        </time>
                      )}
                      <span className={styles.dot} aria-hidden="true">
                        ·
                      </span>
                      <span className={styles.cardDate}>
                        約{post.readingTime}分
                      </span>
                    </div>
                    <h2 className={styles.cardTitle}>{post.title}</h2>
                    {post.description && (
                      <p className={styles.cardExcerpt}>{post.description}</p>
                    )}
                    {post.tags && post.tags.length > 0 && (
                      <div className={styles.cardTags}>
                        {post.tags.map((tag) => (
                          <span key={tag} className={styles.cardTag}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};
