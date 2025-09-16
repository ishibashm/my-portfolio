'use client';
import Image from 'next/image';
import Link from 'next/link';
import { PortfoliosQuery } from '@/gql/graphql';
import styles from './PortfolioListTemplate.module.css'; // 専用のCSSモジュールを使用

type Posts = NonNullable<PortfoliosQuery['posts']>['nodes'];

interface PortfolioListTemplateProps {
  posts?: Posts | null;
}

export const PortfolioListTemplate = ({
  posts,
}: PortfolioListTemplateProps) => {
  // 'portfolio' カテゴリを除外して表示するカテゴリを取得
  const getDisplayCategories = (post: Posts[0]) => {
    return post?.categories?.nodes?.filter(cat => cat?.slug !== 'portfolio');
  };

  return (
    <section className={styles.portfolioSection}>
      <div className="container">
        <h1 className={styles.pageTitle}>Portfolio</h1>
        <div className={styles.stylesGrid}>
          {posts?.map(
            (post) =>
              post && (
                <Link href={`/portfolio/${post.slug}`} key={post.slug} className={styles.styleCard}>
                  <div className={styles.cardPreview}>
                    {post.featuredImage?.node?.sourceUrl && (
                      <Image
                        src={post.featuredImage.node.sourceUrl}
                        alt={post.featuredImage.node.altText || ''}
                        width={400}
                        height={250}
                        style={{ objectFit: 'cover' }}
                      />
                    )}
                  </div>
                  <div className={styles.cardContent}>
                    <div className={styles.cardMeta}>
                      {getDisplayCategories(post)?.[0] && (
                        <span className={styles.cardCategory}>
                          {getDisplayCategories(post)?.[0]?.name}
                        </span>
                      )}
                    </div>
                    <h3 className={styles.cardTitle}>{post.title}</h3>
                    {post.excerpt && (
                      <div
                        className={styles.cardDescription}
                        dangerouslySetInnerHTML={{ __html: post.excerpt }}
                      />
                    )}
                    {post.tags?.nodes && post.tags.nodes.length > 0 && (
                      <div className={styles.cardTags}>
                        {post.tags.nodes.map(tag => tag && (
                          <span key={tag.slug} className={styles.cardTag}>
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              )
          )}
        </div>
      </div>
    </section>
  );
};