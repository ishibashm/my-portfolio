'use client';
import Image from 'next/image';
import Link from 'next/link';
import styles from './HomePageTemplate.module.css';

// ダミーデータ
const portfolioItems = [
  {
    slug: 'corporate-site',
    title: '旧コーポレートサイト',
    description: 'React, TypeScript, Next.jsで構築した静的サイト。',
    imageUrl: '/images/portfolio.png',
    tags: ['React', 'Next.js', 'TypeScript'],
  },
];

const blogPosts = [
  {
    slug: 'dummy-post-1',
    title: '静的ブログ投稿1',
    date: '2025-09-16',
    category: 'お知らせ',
  }
];

export const HomePageTemplate = () => {
  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <div className="container">
          <Link href="/portfolio" className={styles.ctaButton}>
            ポートフォリオを見る
          </Link>
        </div>
      </section>

      <section id="portfolio" className={styles.portfolio}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Portfolio</h2>
          <div className={styles.portfolioGrid}>
            {portfolioItems.map((item) => (
              <Link href={`/portfolio/${item.slug}`} key={item.slug} className={styles.portfolioCard}>
                <div className={styles.cardImage}>
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    width={500}
                    height={300}
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className={styles.cardContent}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <div className={styles.cardTags}>
                    {item.tags.map(tag => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="blog" className={styles.blog}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Blog</h2>
          <div className={styles.blogList}>
            {blogPosts.map((post) => (
              <Link href={`/blog/${post.slug}`} key={post.slug} className={styles.blogPostItem}>
                <time>{post.date}</time>
                <span className={styles.blogCategory}>{post.category}</span>
                <h3>{post.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className={styles.about}>
        <div className="container">
          <h2 className={styles.sectionTitle}>About Me</h2>
          <div className={styles.aboutContent}>
            <div className={styles.socialLinks}>
              <a href="https://github.com/ishibashm" target="_blank" rel="noopener noreferrer" className={styles.socialButton}>
                GitHub
              </a>
              <a href="https://www.cloud-palette.com/" target="_blank" rel="noopener noreferrer" className={styles.socialButton}>
                技術ブログ
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};