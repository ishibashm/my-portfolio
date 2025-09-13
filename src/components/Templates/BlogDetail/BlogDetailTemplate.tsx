'use client';
import Image from 'next/image';
import { PostBySlugQuery } from '@/gql/graphql';
import styles from './BlogDetailTemplate.module.css';
import { formatDate } from '@/utils/formatDate';

interface BlogDetailTemplateProps {
  post: NonNullable<PostBySlugQuery['post']>;
}

export const BlogDetailTemplate = ({ post }: BlogDetailTemplateProps) => {
  return (
    <div className={styles.blogDetail}>
      {post.featuredImage?.node?.sourceUrl && (
        <div className={styles.blogDetail__eyecatch}>
          <Image
            src={post.featuredImage.node.sourceUrl}
            alt={post.featuredImage.node.altText || ''}
            width={1280}
            height={720}
            priority
          />
        </div>
      )}
      <div className={styles.blogDetail__inner}>
        <h1 className={styles.blogDetail__title}>{post.title}</h1>
        <div className={styles.blogDetail__meta}>
          {post.author?.node?.name && (
            <span className={styles.blogDetail__author}>
              {post.author.node.name}
            </span>
          )}
          {post.date && (
            <time className={styles.blogDetail__date} dateTime={post.date}>
              {formatDate(post.date)}
            </time>
          )}
        </div>
        <div
          className={styles.blogDetail__content}
          dangerouslySetInnerHTML={{ __html: post.content || '' }}
        />
      </div>
    </div>
  );
};