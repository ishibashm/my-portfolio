'use client';
import Image from 'next/image';
import Link from 'next/link';
import { PostsByCategoryQuery } from '@/gql/graphql';
import styles from './BlogListTemplate.module.css';

type Posts = NonNullable<PostsByCategoryQuery['category']>['posts']['nodes'];
type PageInfo = NonNullable<PostsByCategoryQuery['category']>['posts']['pageInfo'];

interface BlogListTemplateProps {
  posts?: Posts | null;
  pageInfo?: PageInfo | null;
  title: string;
  currentSlug: string;
}

export const BlogListTemplate = ({
  posts,
  pageInfo,
  title,
  currentSlug,
}: BlogListTemplateProps) => {
  return (
    <div className={styles.container}>
      <h1>{title}</h1>
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
                    width={300}
                    height={200}
                  />
                )}
                <h3>{post.title}</h3>
                <small>{new Date(post.date).toLocaleDateString()}</small>
              </Link>
            )
        )}
      </div>
      {pageInfo?.hasNextPage && (
        <div className={styles.pagination}>
          <Link href={`${currentSlug}?after=${pageInfo.endCursor}`}>
            Next Page
          </Link>
        </div>
      )}
    </div>
  );
};