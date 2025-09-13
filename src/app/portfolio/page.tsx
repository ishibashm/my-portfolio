import { print } from "graphql/language/printer";
import { fetchGraphQL } from "@/utils/fetchGraphQL";
import { PortfolioListQuery } from "@/queries/portfolio/PortfolioListQuery";
import PortfolioListTemplate from "@/components/Templates/PortfolioList/PortfolioListTemplate";

interface PortfolioListResponse {
  portfolios: {
    edges: Array<{
      node: {
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
      };
    }>;
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor?: string;
      endCursor?: string;
    };
  };
}

interface PageProps {
  searchParams: Promise<{
    after?: string;
    before?: string;
  }>;
}

export default async function PortfolioPage({ searchParams }: PageProps) {
  const { after, before } = await searchParams;

  const data = await fetchGraphQL<PortfolioListResponse>(
    print(PortfolioListQuery),
    {
      first: 12,
      after: after || null,
      before: before || null,
    }
  );

  if (!data?.portfolios) {
    return (
      <div className="error-container">
        <h1>ポートフォリオが見つかりません</h1>
        <p>ポートフォリオの読み込み中にエラーが発生しました。</p>
      </div>
    );
  }

  return (
    <div className="portfolio-page">
      <PortfolioListTemplate portfolios={data.portfolios} />
    </div>
  );
}

export async function generateMetadata() {
  return {
    title: "ポートフォリオ - 制作実績",
    description: "これまでに携わったWeb制作プロジェクトのポートフォリオをご紹介します。",
    openGraph: {
      title: "ポートフォリオ - 制作実績",
      description: "これまでに携わったWeb制作プロジェクトのポートフォリオをご紹介します。",
      type: "website",
      url: "/portfolio",
    },
    twitter: {
      card: "summary_large_image",
      title: "ポートフォリオ - 制作実績",
      description: "これまでに携わったWeb制作プロジェクトのポートフォリオをご紹介します。",
    },
  };
}