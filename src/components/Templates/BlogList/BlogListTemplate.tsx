'use client';
import Image from 'next/image';
import Link from 'next/link';
import styles from './BlogListTemplate.module.css';
import { formatDate } from '@/utils/formatDate';

// 型定義をコンポーネント内で定義
type Post = {
  __typename?: 'Post';
  slug?: string | null;
  title?: string | null;
  excerpt?: string | null;
  date?: string | null;
  featuredImage?: {
    __typename?: 'NodeWithFeaturedImageToMediaItemConnectionEdge';
    node?: {
      __typename?: 'MediaItem';
      sourceUrl?: string | null;
      altText?: string | null;
    } | null;
  } | null;
  categories?: {
    __typename?: 'PostToCategoryConnection';
    nodes?: Array<{
      __typename?: 'Category';
      name?: string | null;
      slug?: string | null;
    } | null> | null;
  } | null;
};

interface BlogListTemplateProps {
  posts?: (Post | null)[] | null;
  title: string;
  currentSlug: string;
}

export const BlogListTemplate = ({
  posts,
  title,
}: BlogListTemplateProps) => {
  return (
    <section className={styles.blogListSection}>
      <div className="container">
        <h1 className={styles.pageTitle}>{title}</h1>
        <div className={styles.blogGrid}>
          {posts?.map(
            (post) =>
              post && (
                <Link href={`/blog/${post.slug}`} key={post.slug} className={styles.blogCard}>
                  {post.featuredImage?.node?.sourceUrl && (
                    <div className={styles.cardImage}>
                      <Image
                        src={post.featuredImage.node.sourceUrl}
                        alt={post.featuredImage.node.altText || ''}
                        width={400}
                        height={250}
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  )}
                  <div className={styles.cardContent}>
                    <div className={styles.cardMeta}>
                      {post.categories?.nodes?.[0]?.name && (
                        <span className={styles.cardCategory}>
                          {post.categories.nodes[0].name}
                        </span>
                      )}
                      {post.date && (
                        <time dateTime={post.date} className={styles.cardDate}>
                          {formatDate(post.date)}
                        </time>
                      )}
                    </div>
                    <h2 className={styles.cardTitle}>{post.title}</h2>
                    {post.excerpt && (
                      <div
                        className={styles.cardExcerpt}
                        dangerouslySetInnerHTML={{ __html: post.excerpt }}
                      />
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