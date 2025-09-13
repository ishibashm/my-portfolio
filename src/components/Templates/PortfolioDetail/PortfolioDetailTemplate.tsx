'use client';
import Image from 'next/image';
import { PostBySlugQuery } from '@/gql/graphql';
import styles from './PortfolioDetailTemplate.module.css';
import { formatDate } from '@/utils/formatDate';

interface PortfolioDetailTemplateProps {
  portfolio: NonNullable<PostBySlugQuery['post']>;
}

export const PortfolioDetailTemplate = ({
  portfolio,
}: PortfolioDetailTemplateProps) => {
  return (
    <div className={styles.portfolioDetail}>
      {portfolio.featuredImage?.node?.sourceUrl && (
        <div className={styles.portfolioDetail__eyecatch}>
          <Image
            src={portfolio.featuredImage.node.sourceUrl}
            alt={portfolio.featuredImage.node.altText || ''}
            width={1280}
            height={720}
            priority
          />
        </div>
      )}
      <div className={styles.portfolioDetail__inner}>
        <h1 className={styles.portfolioDetail__title}>{portfolio.title}</h1>
        <div className={styles.portfolioDetail__meta}>
          {portfolio.author?.node?.name && (
            <span className={styles.portfolioDetail__author}>
              {portfolio.author.node.name}
            </span>
          )}
          {portfolio.date && (
            <time
              className={styles.portfolioDetail__date}
              dateTime={portfolio.date}
            >
              {formatDate(portfolio.date)}
            </time>
          )}
        </div>
        <div
          className={styles.portfolioDetail__content}
          dangerouslySetInnerHTML={{ __html: portfolio.content || '' }}
        />
      </div>
    </div>
  );
};