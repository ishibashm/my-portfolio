'use client';
import Image from 'next/image';
import Link from 'next/link';
import styles from './HomePageTemplate.module.css';

// ダミーデータ
const dummyPage = {
  title: '革新的なウェブで未来を創造する',
  content: '私たちは、デザインとテクノロジーを融合させ、ユーザーの心に響く体験を創造するウェブ制作会社です。ビジネスの課題を解決し、新たな価値を創造するパートナーとして、お客様と共に成長します。',
};

const dummyPosts = [
  {
    slug: 'new-service-launch',
    title: '新サービス「AIウェブ解析ツール」提供開始のお知らせ',
    date: '2025-07-15',
    categories: { nodes: [{ name: 'プレスリリース' }] },
  },
  {
    slug: 'design-award-2024',
    title: '「Global Web Design Award 2025」にて金賞を受賞しました',
    date: '2025-06-28',
    categories: { nodes: [{ name: 'お知らせ' }] },
  },
  {
    slug: 'tech-conference-report',
    title: '「Next.js Conf 2025」参加レポート',
    date: '2025-06-10',
    categories: { nodes: [{ name: '技術ブログ' }] },
  },
];

export const HomePageTemplate = () => {
  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>{dummyPage.title}</h1>
          <p>{dummyPage.content}</p>
          <Link href="/contact" className={styles.ctaButton}>
            プロジェクトの相談をする
          </Link>
        </div>
      </section>

      <section className={styles.services}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Our Services</h2>
          <div className={styles.serviceGrid}>
            <div className={styles.serviceCard}>
              <Image src="https://via.placeholder.com/100" alt="UX/UI Design" width={100} height={100} />
              <h3>UX/UIデザイン</h3>
              <p>ユーザー中心設計に基づき、ビジネス目標を達成するための魅力的で使いやすいインターフェースを設計します。</p>
            </div>
            <div className={styles.serviceCard}>
              <Image src="https://via.placeholder.com/100" alt="Web Development" width={100} height={100} />
              <h3>ウェブ開発</h3>
              <p>最新の技術スタック（Next.js, TypeScript）を駆使し、高速でスケーラブルなウェブサイト・アプリケーションを構築します。</p>
            </div>
            <div className={styles.serviceCard}>
              <Image src="https://via.placeholder.com/100" alt="Branding" width={100} height={100} />
              <h3>ブランディング</h3>
              <p>企業の価値を明確にし、ターゲットに響くブランド戦略の立案からロゴ、コピーライティングまで一貫してサポートします。</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.news}>
        <div className="container">
          <h2 className={styles.sectionTitle}>News & Topics</h2>
          <ul className={styles.newsList}>
            {dummyPosts.map((post) => (
              <li key={post.slug}>
                <Link href={`/blog/${post.slug}`}>
                  <time>{post.date}</time>
                  <span className={styles.newsCategory}>{post.categories.nodes[0].name}</span>
                  <p>{post.title}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};