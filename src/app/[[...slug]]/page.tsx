import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { print } from "graphql/language/printer";

import { setSeoData } from "@/utils/seoData";
import { fetchGraphQL } from "@/utils/fetchGraphQL";
import { ContentInfoQuery } from "@/queries/general/ContentInfoQuery";
import { ContentNode } from "@/gql/graphql";
import PageTemplate from "@/components/Templates/Page/PageTemplate";
import { nextSlugToWpSlug } from "@/utils/nextSlugToWpSlug";
import PostTemplate from "@/components/Templates/Post/PostTemplate";
import { SeoQuery } from "@/queries/general/SeoQuery";
import { GetPortfoliosQuery } from '@/queries/portfolio/GetPortfolios';

export async function generateMetadata({
  params,
}: {
  params: { slug?: string[] };
}): Promise<Metadata> {
  // slugが存在しない場合は "home" を使う
  const slug = params.slug ? nextSlugToWpSlug(params.slug) : "home";
  const isPreview = slug.includes("preview");

  const { contentNode } = await fetchGraphQL<{ contentNode: ContentNode }>(
    print(SeoQuery),
    {
      slug: isPreview ? slug.split("preview/")[1] : slug,
      idType: isPreview ? "DATABASE_ID" : "URI",
    },
  );

  if (!contentNode) {
    return notFound();
  }

  const metadata = setSeoData({ seo: contentNode.seo });

  return {
    ...metadata,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL}${slug}`,
    },
  } as Metadata;
}

export default async function Page({ params }: { params: { slug?: string[] } }) {
  // slugが存在しない場合はホームページなので、LPをレンダリング
  if (!params.slug) {
    let portfolios = null;
    try {
      const portfolioData = await fetchGraphQL<{ posts: { nodes: any[] } }>(print(GetPortfoliosQuery));
      portfolios = portfolioData.posts;
    } catch (error) {
      console.error("ポートフォリオの取得に失敗しました:", error);
    }

    return (
      <main>
        <section className="bg-gray-800 text-white text-center py-20">
          <h1 className="text-5xl font-bold">Ishibashi's Portfolio</h1>
          <p className="mt-4 text-xl">モダン技術で構築したポートフォリオサイトへようこそ。</p>
        </section>
        <section className="container mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl font-bold">About Me</h2>
          <p className="mt-4 max-w-2xl mx-auto">ここに自己紹介文を記述します。</p>
        </section>
        <section className="bg-gray-100 py-16">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold">Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
              {portfolios && portfolios.nodes.map((item: any) => (
                <div key={item.title} className="border rounded-lg bg-white shadow-lg text-left">
                  <img
                    src={item.featuredImage?.node.sourceUrl}
                    alt={item.featuredImage?.node.altText || item.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-bold">{item.title}</h3>
                    <div className="text-sm mt-2 text-gray-700" dangerouslySetInnerHTML={{ __html: item.content }} />
                    <p className="mt-4"><strong>使用技術:</strong> {item.portfolioInfo?.techStack}</p>
                    <div className="mt-4">
                      {item.portfolioInfo?.siteUrl && (
                        <a href={item.portfolioInfo.siteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                          サイトを見る
                        </a>
                      )}
                      {item.portfolioInfo?.githubUrl && (
                        <a href={item.portfolioInfo.githubUrl} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:underline ml-4">
                          GitHub
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="container mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl font-bold">Skills</h2>
          <p className="mt-4">ここに保有スキルを記載します。</p>
        </section>
      </main>
    );
  }

  // slugが存在する場合は、これまで通りの処理
  const slug = nextSlugToWpSlug(params.slug);
  const isPreview = slug.includes("preview");

  const { contentNode } = await fetchGraphQL<{ contentNode: ContentNode }>(
    print(ContentInfoQuery),
    {
      slug: isPreview ? slug.split("preview/")[1] : slug,
      idType: isPreview ? "DATABASE_ID" : "URI",
    },
  );

  if (!contentNode) return notFound();

  switch (contentNode.contentTypeName) {
    case "page":
      return <PageTemplate node={contentNode} />;
    case "post":
      return <PostTemplate node={contentNode} />;
    default:
      return <p>{contentNode.contentTypeName} not implemented</p>;
  }
}