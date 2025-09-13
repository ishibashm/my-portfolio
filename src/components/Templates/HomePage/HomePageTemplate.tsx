'use client';
import Image from 'next/image';
import Link from 'next/link';
import { HomePageQuery } from '@/gql/graphql';
import styles from './HomePageTemplate.module.css';
import { formatDate } from '@/utils/formatDate';

type Page = NonNullable<HomePageQuery['page']>;
type Posts = NonNullable<HomePageQuery['posts']>['nodes'];

interface HomePageTemplateProps {
  page?: Page | null;
  posts?: Posts | null;
}

export const HomePageTemplate = ({
  page,
  posts,
}: HomePageTemplateProps) => {
  const heroTitle = page?.title || 'Welcome';
  // 本文をヒーローメッセージとして使用
  const heroMessage = page?.content ? <div dangerouslySetInnerHTML={{ __html: page.content }} /> : 'This is my portfolio site.';

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroText}>
            <h1 className={styles.title}>{heroTitle}</h1>
            <div className={styles.description}>{heroMessage}</div>
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
                    {post.date && <small>{formatDate(post.date)}</small>}
                  </Link>
                )
            )}
          </div>
        </section>
      </main>
    </div>
  );
};