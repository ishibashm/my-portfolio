'use client';
import Image from 'next/image';
import { PostBySlugQuery } from '@/gql/graphql';
import { formatDate } from '@/utils/formatDate';
import { useEffect, useState, useMemo } from 'react';
import styles from './PortfolioDetailTemplate.module.css';

interface PortfolioDetailTemplateProps {
  portfolio: NonNullable<PostBySlugQuery['post']>;
}

export const PortfolioDetailTemplate = ({
  portfolio,
}: PortfolioDetailTemplateProps) => {
  console.log('WordPress Content:', portfolio.content); // この行を追加
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  const contentWithoutGallery = useMemo(() => {
    if (!portfolio.content) return '';
    // WordPressのギャラリーブロックを正規表現で削除
    return portfolio.content.replace(/<figure class="wp-block-gallery[^>]*>[\s\S]*?<\/figure>/g, '');
  }, [portfolio.content]);

  useEffect(() => {
    if (portfolio.content) {
      const imageUrls = [];
      const regex = /<img[^>]+src="([^">]+)"/g;
      let match;
      while ((match = regex.exec(portfolio.content)) !== null) {
        imageUrls.push(match[1]);
      }
      setGalleryImages(imageUrls);
    }
  }, [portfolio.content]);

  return (
    <section className={styles.postDetail}>
      <div className="container">
        {portfolio.featuredImage?.node?.sourceUrl && (
          <div className={styles.postEyecatch}>
            <Image
              src={portfolio.featuredImage.node.sourceUrl}
              alt={portfolio.featuredImage.node.altText || ''}
              width={1280}
              height={720}
              priority
            />
          </div>
        )}

        <h1 className={styles.postTitle}>{portfolio.title}</h1>

        <div className={styles.postMeta}>
          {portfolio.date && (
            <time dateTime={portfolio.date}>{formatDate(portfolio.date)}</time>
          )}
          {portfolio.author?.node?.name && (
            <span> by {portfolio.author.node.name}</span>
          )}
        </div>

        {galleryImages.length > 0 && (
          <div className={styles.gallery}>
            <h2 className={styles.galleryTitle}>Gallery</h2>
            <div className={styles.galleryGrid}>
              {galleryImages.map((src, index) => (
                <div key={index} className={styles.galleryItem}>
                  <Image src={src} alt={`Gallery image ${index + 1}`} width={500} height={300} style={{ objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          </div>
        )}

        <div
          className={styles.postContent}
          dangerouslySetInnerHTML={{ __html: contentWithoutGallery }}
        />
      </div>
    </section>
  );
};