'use client';
import Image from 'next/image';
import Link from 'next/link';
import { PostsByCategoryQuery, PostsListQuery } from '@/gql/graphql';
import styles from './BlogListTemplate.module.css';

// 複数のクエリに対応できるよう、より汎用的な型を定義
type PostNode =
  | NonNullable<NonNullable<PostsByCategoryQuery['category']>['posts']>['nodes'][0]
  | NonNullable<PostsListQuery['posts']>['nodes'][0];

type PageInfo =
  | NonNullable<NonNullable<PostsByCategoryQuery['category']>['posts']>['pageInfo']
  | NonNullable<PostsListQuery['posts']>['pageInfo'];

interface BlogListTemplateProps {
  posts?: (PostNode | null)[] | null;
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

export default BlogListTemplate;