"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./PortfolioDetailTemplate.module.css";
import { Portfolio } from "@/types/portfolio";

interface PortfolioDetailTemplateProps {
  portfolio: Portfolio;
}

export default function PortfolioDetailTemplate({ portfolio }: PortfolioDetailTemplateProps) {
  const [selectedImage, setSelectedImage] = useState<number>(0);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const allImages = [
    ...(portfolio.featuredImage ? [portfolio.featuredImage.node] : []),
    ...(portfolio.portfolioFields?.gallery || [])
  ];

  return (
    <article className={styles.portfolioDetail}>
      <div className={styles.portfolioDetail__header}>
        <div className={styles.portfolioDetail__container}>
          <div className={styles.portfolioDetail__meta}>
            {portfolio.portfolioFields?.projectType && (
              <span className={styles.portfolioDetail__type}>
                {portfolio.portfolioFields.projectType}
              </span>
            )}
            <time className={styles.portfolioDetail__date} dateTime={portfolio.date}>
              {formatDate(portfolio.date)}
            </time>
          </div>

          <h1 className={styles.portfolioDetail__title}>{portfolio.title}</h1>

          {portfolio.excerpt && (
            <p className={styles.portfolioDetail__excerpt}>{portfolio.excerpt}</p>
          )}

          {portfolio.categories?.edges && portfolio.categories.edges.length > 0 && (
            <div className={styles.portfolioDetail__categories}>
              {portfolio.categories.edges.map(({ node }) => (
                <Link
                  key={node.slug}
                  href={`/portfolio/category/${node.slug}`}
                  className={styles.portfolioDetail__category}
                >
                  {node.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={styles.portfolioDetail__content}>
        <div className={styles.portfolioDetail__container}>
          <div className={styles.portfolioDetail__main}>
            {allImages.length > 0 && (
              <div className={styles.portfolioDetail__gallery}>
                <div className={styles.portfolioDetail__mainImage}>
                  <Image
                    src={allImages[selectedImage].sourceUrl}
                    alt={allImages[selectedImage].altText || portfolio.title}
                    width={allImages[selectedImage].mediaDetails?.width || 800}
                    height={allImages[selectedImage].mediaDetails?.height || 600}
                    className={styles.portfolioDetail__image}
                    priority
                  />
                </div>

                {allImages.length > 1 && (
                  <div className={styles.portfolioDetail__thumbnails}>
                    {allImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`${styles.portfolioDetail__thumbnail} ${
                          selectedImage === index ? styles.portfolioDetail__thumbnailActive : ""
                        }`}
                      >
                        <Image
                          src={image.sourceUrl}
                          alt={image.altText || portfolio.title}
                          width={100}
                          height={75}
                          className={styles.portfolioDetail__thumbnailImage}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className={styles.portfolioDetail__description}>
              <h2>プロジェクト概要</h2>
              <div 
                dangerouslySetInnerHTML={{ __html: portfolio.content }} 
                className={styles.portfolioDetail__contentText}
              />
            </div>

            {portfolio.portfolioFields?.technologies && portfolio.portfolioFields.technologies.length > 0 && (
              <div className={styles.portfolioDetail__technologies}>
                <h3>使用技術</h3>
                <div className={styles.portfolioDetail__techList}>
                  {portfolio.portfolioFields.technologies.map((tech) => (
                    <span key={tech} className={styles.portfolioDetail__tech}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {portfolio.portfolioFields?.videoUrl && (
              <div className={styles.portfolioDetail__video}>
                <h3>デモ動画</h3>
                <div className={styles.portfolioDetail__videoWrapper}>
                  <iframe
                    src={portfolio.portfolioFields.videoUrl}
                    title={`${portfolio.title} デモ動画`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className={styles.portfolioDetail__videoIframe}
                  />
                </div>
              </div>
            )}
          </div>

          <aside className={styles.portfolioDetail__sidebar}>
            <div className={styles.portfolioDetail__info}>
              <h3>プロジェクト情報</h3>
              
              {portfolio.portfolioFields?.client && (
                <div className={styles.portfolioDetail__infoItem}>
                  <strong>クライアント:</strong>
                  <span>{portfolio.portfolioFields.client}</span>
                </div>
              )}

              {portfolio.portfolioFields?.duration && (
                <div className={styles.portfolioDetail__infoItem}>
                  <strong>期間:</strong>
                  <span>{portfolio.portfolioFields.duration}</span>
                </div>
              )}

              {portfolio.author?.node && (
                <div className={styles.portfolioDetail__infoItem}>
                  <strong>作成者:</strong>
                  <div className={styles.portfolioDetail__author}>
                    {portfolio.author.node.avatar && (
                      <Image
                        src={portfolio.author.node.avatar.url}
                        alt={portfolio.author.node.name}
                        width={32}
                        height={32}
                        className={styles.portfolioDetail__authorAvatar}
                      />
                    )}
                    <span>{portfolio.author.node.name}</span>
                  </div>
                </div>
              )}

              <div className={styles.portfolioDetail__infoItem}>
                <strong>更新日:</strong>
                <span>{formatDate(portfolio.modified)}</span>
              </div>
            </div>

            <div className={styles.portfolioDetail__actions}>
              {portfolio.portfolioFields?.projectUrl && (
                <a
                  href={portfolio.portfolioFields.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.portfolioDetail__button}
                >
                  プロジェクトを見る
                </a>
              )}

              {portfolio.portfolioFields?.demoUrl && (
                <a
                  href={portfolio.portfolioFields.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.portfolioDetail__button}
                >
                  デモを見る
                </a>
              )}

              {portfolio.portfolioFields?.githubUrl && (
                <a
                  href={portfolio.portfolioFields.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.portfolioDetail__button}
                >
                  GitHubで見る
                </a>
              )}

              {portfolio.portfolioFields?.downloadUrl && (
                <a
                  href={portfolio.portfolioFields.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.portfolioDetail__button}
                >
                  ダウンロード
                </a>
              )}
            </div>

            {portfolio.tags?.edges && portfolio.tags.edges.length > 0 && (
              <div className={styles.portfolioDetail__tags}>
                <h3>タグ</h3>
                <div className={styles.portfolioDetail__tagList}>
                  {portfolio.tags.edges.map(({ node }) => (
                    <Link
                      key={node.slug}
                      href={`/portfolio/tag/${node.slug}`}
                      className={styles.portfolioDetail__tag}
                    >
                      {node.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </article>
  );
}