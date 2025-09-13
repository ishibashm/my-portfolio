'use client';
import Image from 'next/image';
import Link from 'next/link';
import {
  Page,
  Post,
  Portfolio,
  Maybe,
} from '@/gql/graphql';
import styles from './HomePageTemplate.module.css';

interface HomePageTemplateProps {
  page?: Maybe<
    Pick<Page, 'title'> & {
      homeFields?: Maybe<
        Pick<Page['homeFields'], 'heroTitle' | 'heroMessage'> & {
          heroImage?: Maybe<{
            node: Pick<NonNullable<Page['homeFields']['heroImage']>['node'], 'sourceUrl' | 'altText'>;
          }>;
        }
      >;
    }
  >;
  posts?: Maybe<
    Array<
      Maybe<
        Pick<Post, 'title' | 'slug' | 'date'> & {
          featuredImage?: Maybe<{
            node: Pick<NonNullable<Post['featuredImage']>['node'], 'sourceUrl' | 'altText'>;
          }>;
        }
      >
    >
  >;
  portfolios?: Maybe<
    Array<
      Maybe<
        Pick<Portfolio, 'title' | 'slug'> & {
          featuredImage?: Maybe<{
            node: Pick<NonNullable<Portfolio['featuredImage']>['node'], 'sourceUrl' | 'altText'>;
          }>;
        }
      >
    >
  >;
}

export const HomePageTemplate = ({
  page,
  posts,
  portfolios,
}: HomePageTemplateProps) => {
  const { homeFields } = page || {};
  const { heroTitle, heroMessage, heroImage } = homeFields || {};

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroText}>
            <h1 className={styles.title}>{heroTitle || '静的タイトル'}</h1>
            <p className={styles.description}>
              {heroMessage || '静的なヒーローメッセージ'}
            </p>
          </div>
          {heroImage?.node?.sourceUrl && (
            <div className={styles.heroImage}>
              <Image
                src={heroImage.node.sourceUrl}
                alt={heroImage.node.altText || 'ヒーロー画像'}
                width={500}
                height={300}
                priority
              />
            </div>
          )}
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
                    <small>{new Date(post.date).toLocaleDateString()}</small>
                  </Link>
                )
            )}
          </div>
        </section>

        <section className={styles.section}>
          <h2>ポートフォリオ</h2>
          <div className={styles.grid}>
            {portfolios?.map(
              (item) =>
                item && (
                  <Link
                    href={`/portfolio/${item.slug}`}
                    key={item.slug}
                    className={styles.card}
                  >
                    {item.featuredImage?.node?.sourceUrl && (
                      <Image
                        src={item.featuredImage.node.sourceUrl}
                        alt={item.featuredImage.node.altText || ''}
                        width={200}
                        height={150}
                      />
                    )}
                    <h3>{item.title}</h3>
                  </Link>
                )
            )}
          </div>
        </section>
      </main>
    </div>
  );
};