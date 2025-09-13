'use client';
import Image from 'next/image';
import Link from 'next/link';
import { HomePageQuery } from '@/gql/graphql';
import styles from './HomePageTemplate.module.css';

type Page = NonNullable<HomePageQuery['page']>;
type Posts = NonNullable<HomePageQuery['posts']>['nodes'];

interface HomePageTemplateProps {
  page?: Page | null;
  posts?: Posts | null;
  // portfolios は削除
}

export const HomePageTemplate = ({
  page,
  posts,
}: HomePageTemplateProps) => {
  const heroTitle = page?.title || '静的タイトル';
  const heroMessage = '静的なヒーローメッセージ';

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroText}>
            <h1 className={styles.title}>{heroTitle}</h1>
            <p className={styles.description}>{heroMessage}</p>
          </div>
        </section>

        <section className={styles.section}>
          <h2>最新のブログ記事</h2>
          <div className={styles.grid}>
            {posts?.map(
              (post) =>
                post && (
                  <Link
                    href={`/blog/${post.slug}`}
                    key={post.slug}
                    className={styles.card}
                  >
                    {post.featuredImage?.node?.sourceUrl && (
                      <Image
                        src={post.featuredImage.node.sourceUrl}
                        alt={post.featuredImage.node.altText || ''}
                        width={200}
                        height={150}
                      />
                    )}
                    <h3>{post.title}</h3>
                    {post.date && (
                      <small>{new Date(post.date).toLocaleDateString()}</small>
                    )}
                  </Link>
                )
            )}
          </div>
        </section>
      </main>
    </div>
  );
};