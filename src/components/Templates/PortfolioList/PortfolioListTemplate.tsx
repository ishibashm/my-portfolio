'use client';
import Image from 'next/image';
import Link from 'next/link';
import { PortfoliosQuery } from '@/gql/graphql';
import styles from './PortfolioListTemplate.module.css';

type Posts = NonNullable<PortfoliosQuery['posts']>['nodes'];

interface PortfolioListTemplateProps {
  posts?: Posts | null;
}

export const PortfolioListTemplate = ({
  posts,
}: PortfolioListTemplateProps) => {
  return (
    <div className={styles.container}>
      <h1>Portfolio</h1>
      <div className={styles.grid}>
        {posts?.map(
          (post) =>
            post && (
              <Link
                href={`/portfolio/${post.slug}`}
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
              </Link>
            )
        )}
      </div>
    </div>
  );
};