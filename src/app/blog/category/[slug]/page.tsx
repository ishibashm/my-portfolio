import { print } from "graphql/language/printer";
import gql from "graphql-tag";
import { fetchGraphQL } from "@/utils/fetchGraphQL";
import { PostsByCategoryQuery } from "@/queries/posts/PostsByCategoryQuery";
import BlogListTemplate from "@/components/Templates/BlogList/BlogListTemplate";
import { Metadata } from "next";

interface PostsByCategoryResponse {
  category: {
    name: string;
    slug: string;
    description?: string;
    seo?: {
      title?: string;
      metaDesc?: string;
      canonical?: string;
      opengraphTitle?: string;
      opengraphDescription?: string;
      opengraphImage?: {
        sourceUrl: string;
      };
      twitterTitle?: string;
      twitterDescription?: string;
      twitterImage?: {
        sourceUrl: string;
      };
    };
    posts: {
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
          author?: {
            node: {
              name: string;
              avatar?: {
                url: string;
              };
            };
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
  };
}

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { after, before } = await searchParams;

  const data = await fetchGraphQL<PostsByCategoryResponse>(
    print(PostsByCategoryQuery),
    {
      slug,
      first: 10,
      after: after || null,
      before: before || null,
    }
  );

  if (!data?.category) {
    return (
      <div className="error-container">
        <h1>カテゴリーが見つかりません</h1>
        <p>お探しのカテゴリーは見つかりませんでした。</p>
      </div>
    );
  }

  const { category } = data;

  return (
    <div className="category-page">
      <header className="category-page__header">
        <h1 className="category-page__title">{category.name}</h1>
        {category.description && (
          <p className="category-page__description">{category.description}</p>
        )}
      </header>
      
      <BlogListTemplate posts={category.posts} />
    </div>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const data = await fetchGraphQL<PostsByCategoryResponse>(
    print(PostsByCategoryQuery),
    { slug, first: 1 }
  );

  if (!data?.category) {
    return {
      title: "カテゴリーが見つかりません",
      description: "お探しのカテゴリーは見つかりませんでした。",
    };
  }

  const category = data.category;

  return {
    title: category.seo?.title || `${category.name} - ブログカテゴリー`,
    description: category.seo?.metaDesc || category.description || `${category.name}に関するブログ記事一覧`,
    alternates: {
      canonical: category.seo?.canonical || `/blog/category/${category.slug}`,
    },
    openGraph: {
      title: category.seo?.opengraphTitle || `${category.name} - ブログカテゴリー`,
      description: category.seo?.opengraphDescription || category.description || `${category.name}に関するブログ記事一覧`,
      type: "website",
      url: `/blog/category/${category.slug}`,
      images: category.seo?.opengraphImage?.sourceUrl
        ? [category.seo.opengraphImage.sourceUrl]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: category.seo?.twitterTitle || `${category.name} - ブログカテゴリー`,
      description: category.seo?.twitterDescription || category.description || `${category.name}に関するブログ記事一覧`,
      images: category.seo?.twitterImage?.sourceUrl
        ? [category.seo.twitterImage.sourceUrl]
        : [],
    },
  };
}

export async function generateStaticParams() {
  const data = await fetchGraphQL<{
    categories: {
      edges: Array<{
        node: {
          slug: string;
        };
      }>;
    };
  }>(
    print(gql`
      query AllCategoriesSlugs {
        categories(first: 100) {
          edges {
            node {
              slug
            }
          }
        }
      }
    `)
  );

  return data?.categories?.edges?.map(({ node }) => ({
    slug: node.slug,
  })) || [];
}