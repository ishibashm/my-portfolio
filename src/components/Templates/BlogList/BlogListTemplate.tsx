"use client";

import Link from "next/link";
import Image from "next/image";
import { Post, PostConnectionEdge, PageInfo } from "@/gql/graphql";
import styles from "./BlogListTemplate.module.css";

interface BlogListTemplateProps {
  posts: {
    edges: Array<{
      node: Partial<Post> & {
        id: string;
        title?: string | null;
        excerpt?: string | null;
        slug?: string | null;
        date?: string | null;
        featuredImage?: {
          node: {
            sourceUrl: string;
            altText?: string | null;
            mediaDetails?: {
              width?: number | null;
              height?: number | null;
            } | null;
          };
        } | null;
        categories?: {
          edges: Array<{
            node: {
              name?: string | null;
              slug?: string | null;
            };
          }>;
        } | null;
        author?: {
          node: {
            name?: string | null;
            avatar?: {
              url?: string | null;
            } | null;
          };
        } | null;
      };
    }>;
    pageInfo: PageInfo;
  };
}

export default function BlogListTemplate({ posts }: BlogListTemplateProps) {
  return (
    <div className={styles.blogList}>
      <div className={styles.blogList__container}>
        {posts.edges.map(({ node }) => (
          <article key={node.id} className={styles.blogList__item}>
            <div className={styles.blogList__imageContainer}>
              {node.featuredImage?.node?.sourceUrl && (
                <Link href={`/blog/${node.slug}`}>
                  <Image
                    src={node.featuredImage.node.sourceUrl}
                    alt={node.featuredImage.node.altText || node.title || ""}
                    width={400}
                    height={250}
                    className={styles.blogList__image}
                  />
                </Link>
              )}
            </div>
            <div className={styles.blogList__content}>
              <div className={styles.blogList__meta}>
                {node.date && (
                  <time dateTime={node.date} className={styles.blogList__date}>
                    {new Date(node.date).toLocaleDateString("ja-JP")}
                  </time>
                )}
                {node.categories?.edges && node.categories.edges.length > 0 && (
                  <div className={styles.blogList__categories}>
                    {node.categories.edges.map(({ node: categoryNode }) => (
                      <Link
                        key={categoryNode.slug}
                        href={`/blog/category/${categoryNode.slug}`}
                        className={styles.blogList__category}
                      >
                        {categoryNode.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <h2 className={styles.blogList__title}>
                <Link href={`/blog/${node.slug}`}>{node.title}</Link>
              </h2>
              {node.author?.node && (
                <div className={styles.blogList__author}>
                  {node.author.node.avatar?.url && (
                    <Image
                      src={node.author.node.avatar.url}
                      alt={node.author.node.name || "Author"}
                      width={32}
                      height={32}
                      className={styles.blogList__authorAvatar}
                    />
                  )}
                  <span>{node.author.node.name}</span>
                </div>
              )}
              {node.excerpt && (
                <div
                  className={styles.blogList__excerpt}
                  dangerouslySetInnerHTML={{ __html: node.excerpt }}
                />
              )}
            </div>
          </article>
        ))}
      </div>

      <div className={styles.blogList__pagination}>
        {posts.pageInfo.hasPreviousPage && (
          <Link
            href={`/blog?before=${posts.pageInfo.startCursor}`}
            className={styles.blogList__paginationLink}
          >
            前へ
          </Link>
        )}
        {posts.pageInfo.hasNextPage && (
          <Link
            href={`/blog?after=${posts.pageInfo.endCursor}`}
            className={styles.blogList__paginationLink}
          >
            次へ
          </Link>
        )}
      </div>
    </div>
  );
}