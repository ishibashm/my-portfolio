"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./BlogDetailTemplate.module.css";
import { Post, Tag } from "@/gql/graphql";

interface BlogDetailTemplateProps {
  post: Post;
}

export default function BlogDetailTemplate({ post }: BlogDetailTemplateProps) {
  return (
    <article className={styles.blogDetail}>
      <div className={styles.blogDetail__header}>
        <div className={styles.blogDetail__container}>
          <div className={styles.blogDetail__meta}>
            {post.date && (
              <time dateTime={post.date} className={styles.blogDetail__date}>
                {new Date(post.date).toLocaleDateString("ja-JP")}
              </time>
            )}
            {post.categories?.edges && post.categories.edges.length > 0 && (
              <div className={styles.blogDetail__categories}>
                {post.categories.edges.map(({ node }) => (
                  <Link
                    key={node.slug}
                    href={`/blog/category/${node.slug}`}
                    className={styles.blogDetail__category}
                  >
                    {node.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <h1 className={styles.blogDetail__title}>{post.title}</h1>

          {post.author?.node && (
            <div className={styles.blogDetail__author}>
              {post.author.node.avatar?.url && (
                <Image
                  src={post.author.node.avatar.url}
                  alt={post.author.node.name || "Author"}
                  width={40}
                  height={40}
                  className={styles.blogDetail__authorAvatar}
                />
              )}
              <span>{post.author.node.name}</span>
            </div>
          )}
        </div>
      </div>

      {post.featuredImage?.node?.sourceUrl && (
        <div className={styles.blogDetail__featuredImage}>
          <Image
            src={post.featuredImage.node.sourceUrl}
            alt={post.featuredImage.node.altText || post.title || ""}
            width={post.featuredImage.node.mediaDetails?.width || 1200}
            height={post.featuredImage.node.mediaDetails?.height || 630}
            className={styles.blogDetail__image}
            priority
          />
        </div>
      )}

      <div className={styles.blogDetail__content}>
        <div
          className={styles.blogDetail__contentText}
          dangerouslySetInnerHTML={{ __html: post.content || "" }}
        />
      </div>

      {post.tags?.edges && post.tags.edges.length > 0 && (
        <div className={styles.blogDetail__tags}>
          <div className={styles.blogDetail__container}>
            <h3>タグ</h3>
            <div className={styles.blogDetail__tagList}>
              {post.tags.edges.map(({ node }) => (
                <Link
                  key={(node as Tag).slug}
                  href={`/blog/tag/${(node as Tag).slug}`}
                  className={styles.blogDetail__tag}
                >
                  {(node as Tag).name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}