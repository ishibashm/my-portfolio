"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./PortfolioListTemplate.module.css";

interface Portfolio {
  id: string;
  databaseId: number;
  title: string;
  excerpt: string;
  slug: string;
  date: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
      altText?: string;
      mediaDetails?: {
        width: number;
        height: number;
      };
    };
  };
  portfolioFields?: {
    projectUrl?: string;
    githubUrl?: string;
    technologies?: string[];
    projectType?: string;
    client?: string;
    duration?: string;
  };
  categories?: {
    edges: Array<{
      node: {
        name: string;
        slug: string;
      };
    }>;
  };
}

interface PortfolioListTemplateProps {
  portfolios: {
    edges: Array<{
      node: Portfolio;
    }>;
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor?: string;
      endCursor?: string;
    };
  };
}

export default function PortfolioListTemplate({ portfolios }: PortfolioListTemplateProps) {
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const allPortfolios = portfolios.edges.map(({ node }) => node);

  const filteredPortfolios = allPortfolios.filter((portfolio) => {
    const matchesFilter = filter === "all" || 
      portfolio.portfolioFields?.projectType?.toLowerCase() === filter.toLowerCase();
    
    const matchesSearch = searchTerm === "" || 
      portfolio.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      portfolio.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      portfolio.portfolioFields?.technologies?.some(tech => 
        tech.toLowerCase().includes(searchTerm.toLowerCase())
      );

    return matchesFilter && matchesSearch;
  });

  const projectTypes = Array.from(
    new Set(
      allPortfolios
        .map(p => p.portfolioFields?.projectType)
        .filter(Boolean)
    )
  );

  return (
    <div className={styles.portfolioList}>
      <div className={styles.portfolioList__header}>
        <h1 className={styles.portfolioList__title}>ポートフォリオ</h1>
        <p className={styles.portfolioList__subtitle}>
          これまでに携わったプロジェクトの一部をご紹介します
        </p>
      </div>

      <div className={styles.portfolioList__filters}>
        <div className={styles.portfolioList__search}>
          <input
            type="text"
            placeholder="プロジェクトを検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.portfolioList__searchInput}
          />
        </div>

        <div className={styles.portfolioList__filterButtons}>
          <button
            onClick={() => setFilter("all")}
            className={`${styles.portfolioList__filterButton} ${
              filter === "all" ? styles.portfolioList__filterButtonActive : ""
            }`}
          >
            すべて
          </button>
          {projectTypes.map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type!)}
              className={`${styles.portfolioList__filterButton} ${
                filter === type ? styles.portfolioList__filterButtonActive : ""
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.portfolioList__grid}>
        {filteredPortfolios.map((portfolio) => (
          <article key={portfolio.id} className={styles.portfolioList__item}>
            <Link href={`/portfolio/${portfolio.slug}`} className={styles.portfolioList__link}>
              <div className={styles.portfolioList__imageWrapper}>
                {portfolio.featuredImage?.node ? (
                  <Image
                    src={portfolio.featuredImage.node.sourceUrl}
                    alt={portfolio.featuredImage.node.altText || portfolio.title}
                    width={portfolio.featuredImage.node.mediaDetails?.width || 400}
                    height={portfolio.featuredImage.node.mediaDetails?.height || 300}
                    className={styles.portfolioList__image}
                  />
                ) : (
                  <div className={styles.portfolioList__imagePlaceholder}>
                    <span>No Image</span>
                  </div>
                )}
                <div className={styles.portfolioList__overlay}>
                  <span className={styles.portfolioList__viewButton}>詳細を見る</span>
                </div>
              </div>

              <div className={styles.portfolioList__content}>
                <h2 className={styles.portfolioList__itemTitle}>
                  {portfolio.title}
                </h2>
                
                {portfolio.portfolioFields?.projectType && (
                  <span className={styles.portfolioList__type}>
                    {portfolio.portfolioFields.projectType}
                  </span>
                )}

                <p className={styles.portfolioList__excerpt}>
                  {portfolio.excerpt}
                </p>

                {portfolio.portfolioFields?.technologies && (
                  <div className={styles.portfolioList__technologies}>
                    {portfolio.portfolioFields.technologies.slice(0, 3).map((tech) => (
                      <span key={tech} className={styles.portfolioList__tech}>
                        {tech}
                      </span>
                    ))}
                    {portfolio.portfolioFields.technologies.length > 3 && (
                      <span className={styles.portfolioList__techMore}>
                        +{portfolio.portfolioFields.technologies.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {portfolio.categories?.edges && portfolio.categories.edges.length > 0 && (
                  <div className={styles.portfolioList__categories}>
                    {portfolio.categories.edges.slice(0, 2).map(({ node }) => (
                      <span key={node.slug} className={styles.portfolioList__category}>
                        {node.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          </article>
        ))}
      </div>

      {filteredPortfolios.length === 0 && (
        <div className={styles.portfolioList__empty}>
          <p>該当するプロジェクトが見つかりませんでした。</p>
        </div>
      )}
    </div>
  );
}