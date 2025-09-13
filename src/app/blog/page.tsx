import { draftMode } from "next/headers";
import { print } from "graphql/language/printer";
import { fetchGraphQL } from "@/utils/fetchGraphQL";
import { PostsListQuery } from "@/queries/posts/PostsListQuery";
import BlogListTemplate from "@/components/Templates/BlogList/BlogListTemplate";

interface PostsListResponse {
  posts: {
    edges: Array<{
      node: {
        id: string;
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
        categories: {
          edges: Array<{
            node: {
              id: string;
              name: string;
              slug: string;
            };
          }>;
        };
        author: {
          node: {
            name: string;
          };
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

export default async function BlogPage() {
  const { isEnabled } = await draftMode();

  const data = await fetchGraphQL<PostsListResponse>(
    print(PostsListQuery),
    { first: 12 }
  );

  if (!data?.posts) {
    return (
      <div className="error-container">
        <h1>ブログ記事が見つかりません</h1>
        <p>ブログ記事のデータ取得に失敗しました。</p>
      </div>
    );
  }

  return <BlogListTemplate posts={data.posts} />;
}

export async function generateMetadata() {
  return {
    title: "ブログ | Next-Gen Corp.",
    description: "Next-Gen Corp.の技術ブログ。最新の技術トレンドや開発情報をお届けします。",
    openGraph: {
      title: "ブログ | Next-Gen Corp.",
      description: "Next-Gen Corp.の技術ブログ。最新の技術トレンドや開発情報をお届けします。",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "ブログ | Next-Gen Corp.",
      description: "Next-Gen Corp.の技術ブログ。最新の技術トレンドや開発情報をお届けします。",
    },
  };
}