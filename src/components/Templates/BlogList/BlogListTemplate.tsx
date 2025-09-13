'use client';
import Image from 'next/image';
import Link from 'next/link';
import { PostsByCategoryQuery, PostsListQuery } from '@/gql/graphql';
import { formatDate } from '@/utils/formatDate';
// CSSモジュールではなく、グローバルなlp-style.cssを使う
// import styles from './BlogListTemplate.module.css';

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
    <section className="news">
      <div className="container">
        <h2 className="section-title">{title}</h2>
        <ul className="news-list">
          {posts?.map(
            (post) =>
              post && (
                <li key={post.slug}>
                  {post.date && (
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                  )}
                  <a href={`/blog/${post.slug}`}>{post.title}</a>
                </li>
              )
          )}
        </ul>
        {pageInfo?.hasNextPage && (
          <div className="pagination">
            <Link href={`${currentSlug}?after=${pageInfo.endCursor}`}>
              Next Page
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogListTemplate;