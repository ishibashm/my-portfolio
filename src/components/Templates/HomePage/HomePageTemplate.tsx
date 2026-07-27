import Link from "next/link";
import styles from "./HomePageTemplate.module.css";
import { formatDate } from "@/utils/formatDate";

export type HomePost = {
  slug: string;
  title: string;
  date: string;
  description?: string;
  tags?: string[];
  readingTime: number;
};

interface HomePageTemplateProps {
  posts: HomePost[];
}

export const HomePageTemplate = ({ posts }: HomePageTemplateProps) => {
  return (
    <div className={styles.home}>
      {/* 冒頭は名乗りだけの簡潔な構成にして、すぐ下の記事一覧へ視線を送る */}
      <section className={styles.hero}>
        <div className="container">
          <p className={styles.heroEyebrow}>Web Developer</p>
          <h1 className={styles.heroTitle}>Cloud Palette</h1>
          <p className={styles.heroLead}>
            Next.js・TypeScript を中心に、Webサイトやアプリを作っています。
            制作の記録や学んだことを書き留めています。
          </p>
          <div className={styles.heroLinks}>
            <Link href="/blog" className={styles.primaryButton}>
              記事を読む
            </Link>
            <Link href="/portfolio" className={styles.secondaryButton}>
              制作実績
            </Link>
            <a
              href="https://github.com/ishibashm"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.secondaryButton}
            >
              GitHub
            </a>
          </div>
        </div>
      </section>

      <section className={styles.latest}>
        <div className="container">
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>最新の記事</h2>
            <Link href="/blog" className={styles.sectionLink}>
              すべて見る →
            </Link>
          </div>

          {posts.length === 0 ? (
            <p className={styles.empty}>まだ記事がありません。</p>
          ) : (
            <ul className={styles.postList}>
              {posts.map((post) => (
                <li key={post.slug}>
                  <Link href={`/blog/${post.slug}`} className={styles.postCard}>
                    <div className={styles.postMeta}>
                      {post.date && (
                        <time dateTime={post.date}>
                          {formatDate(post.date)}
                        </time>
                      )}
                      <span className={styles.dot} aria-hidden="true">
                        ·
                      </span>
                      <span>約{post.readingTime}分</span>
                    </div>
                    <h3 className={styles.postTitle}>{post.title}</h3>
                    {post.description && (
                      <p className={styles.postExcerpt}>{post.description}</p>
                    )}
                    {post.tags && post.tags.length > 0 && (
                      <div className={styles.tagRow}>
                        {post.tags.map((tag) => (
                          <span key={tag} className={styles.tag}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
};
