import { print } from "graphql/language/printer";
import { fetchGraphQL } from "@/utils/fetchGraphQL";
import { PortfolioBySlugQuery } from "@/queries/portfolio/PortfolioBySlugQuery";
import PortfolioDetailTemplate from "@/components/Templates/PortfolioDetail/PortfolioDetailTemplate";
import { PostTypeSeo as Seo } from "@/gql/graphql";
import { Metadata } from "next";
import { Portfolio } from "@/types/portfolio";

interface PortfolioResponse {
  portfolio?: Portfolio;
}

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function PortfolioDetailPage({ params }: Props) {
  const { slug } = await params;

  const data = await fetchGraphQL<PortfolioResponse>(
    print(PortfolioBySlugQuery),
    {
      slug,
    }
  );

  if (!data?.portfolio) {
    return (
      <div className="error-container">
        <h1>ポートフォリオが見つかりません</h1>
        <p>お探しのポートフォリオは存在しないか、削除された可能性があります。</p>
        <a href="/portfolio">ポートフォリオ一覧に戻る</a>
      </div>
    );
  }

  return (
    <div className="portfolio-detail-page">
      <PortfolioDetailTemplate portfolio={data.portfolio} />
    </div>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const data = await fetchGraphQL<PortfolioResponse>(
    print(PortfolioBySlugQuery),
    {
      slug,
    }
  );

  if (!data?.portfolio) {
    return {
      title: "ポートフォリオが見つかりません",
      description: "お探しのポートフォリオは存在しません。",
    };
  }

  const portfolio = data.portfolio;
  const seo = portfolio.seo;

  return {
    title: seo?.title || portfolio.title || "ポートフォリオ",
    description: seo?.metaDesc || portfolio.excerpt || "Next-Gen Corp.のポートフォリオ",
    alternates: {
      canonical: seo?.canonical || `/portfolio/${portfolio.slug}`,
    },
    openGraph: {
      title: seo?.opengraphTitle || portfolio.title || "ポートフォリオ",
      description: seo?.opengraphDescription || portfolio.excerpt || "Next-Gen Corp.のポートフォリオ",
      type: "article",
      url: `/portfolio/${portfolio.slug}`,
      images: seo?.opengraphImage?.sourceUrl
        ? [seo.opengraphImage.sourceUrl]
        : portfolio.featuredImage?.node?.sourceUrl
        ? [portfolio.featuredImage.node.sourceUrl]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: seo?.twitterTitle || portfolio.title || "ポートフォリオ",
      description: seo?.twitterDescription || portfolio.excerpt || "Next-Gen Corp.のポートフォリオ",
      images: seo?.twitterImage?.sourceUrl
        ? [seo.twitterImage.sourceUrl]
        : portfolio.featuredImage?.node?.sourceUrl
        ? [portfolio.featuredImage.node.sourceUrl]
        : [],
    },
  };
}

export async function generateStaticParams() {
  try {
    const query = `
      query GetPortfolioSlugs {
        portfolios(first: 100) {
          edges {
            node {
              slug
            }
          }
        }
      }
    `;

    const data = await fetchGraphQL<{ portfolios: { edges: Array<{ node: { slug: string } }> } }>(query);

    return data?.portfolios?.edges?.map(({ node }) => ({
      slug: node.slug,
    })) || [];
  } catch (error) {
    console.error("ポートフォリオのスラッグ取得エラー:", error);
    return [];
  }
}