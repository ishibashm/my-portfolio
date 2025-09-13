'use client';
import Image from 'next/image';
import Link from 'next/link';
import { PortfoliosQuery } from '@/gql/graphql';
// CSSモジュールではなく、グローバルなlp-style.cssを使う
// import styles from './PortfolioListTemplate.module.css';

type Posts = NonNullable<PortfoliosQuery['posts']>['nodes'];

interface PortfolioListTemplateProps {
  posts?: Posts | null;
}

export const PortfolioListTemplate = ({
  posts,
}: PortfolioListTemplateProps) => {
  return (
    <section className="services">
      <div className="container">
        <h2 className="section-title">Portfolio</h2>
        <div className="services-grid">
          {posts?.map(
            (post) =>
              post && (
                <Link
                  href={`/portfolio/${post.slug}`}
                  key={post.slug}
                  className="service-item" // service-itemスタイルを再利用
                >
                  {post.featuredImage?.node?.sourceUrl && (
                    <Image
                      src={post.featuredImage.node.sourceUrl}
                      alt={post.featuredImage.node.altText || ''}
                      width={400}
                      height={250}
                    />
                  )}
                  <h3>{post.title}</h3>
                </Link>
              )
          )}
        </div>
      </div>
    </section>
  );
};