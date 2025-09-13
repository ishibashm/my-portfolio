'use client';
import Image from 'next/image';
import { PostBySlugQuery } from '@/gql/graphql';
import { formatDate } from '@/utils/formatDate';
// CSSモジュールではなく、グローバルなlp-style.cssを使う
// import styles from './PortfolioDetailTemplate.module.css';

interface PortfolioDetailTemplateProps {
  portfolio: NonNullable<PostBySlugQuery['post']>;
}

export const PortfolioDetailTemplate = ({
  portfolio,
}: PortfolioDetailTemplateProps) => {
  return (
    <section className="post-detail">
      <div className="container">
        {portfolio.featuredImage?.node?.sourceUrl && (
          <div className="post-eyecatch">
            <Image
              src={portfolio.featuredImage.node.sourceUrl}
              alt={portfolio.featuredImage.node.altText || ''}
              width={1280}
              height={720}
              priority
            />
          </div>
        )}
        <h1 className="post-title">{portfolio.title}</h1>
        <div className="post-meta">
          {portfolio.date && (
            <time dateTime={portfolio.date}>{formatDate(portfolio.date)}</time>
          )}
          {portfolio.author?.node?.name && (
            <span> by {portfolio.author.node.name}</span>
          )}
        </div>
        <div
          className="post-content"
          dangerouslySetInnerHTML={{ __html: portfolio.content || '' }}
        />
      </div>
    </section>
  );
};