import { notFound } from 'next/navigation';
import { PostTemplate } from '@/components/Templates/Post/PostTemplate';
import { PostQuery } from '@/components/Templates/Post/PostQuery';
import { fetchGraphQL } from '@/utils/fetchGraphQL';
import { PostQuery as PostQueryType } from '@/gql/graphql';
import { Metadata, ResolvingMetadata } from 'next';
import { seoData } from '@/utils/seoData';

// Next.js 15の非同期Propsに対応
type PostProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 60;

// 1. コンポーネントをasyncにする
export default async function Post({ params }: PostProps) {
  // 3. awaitでPromiseを解決する
  const { slug } = await params;

  const { data } = await fetchGraphQL<PostQueryType>({
    query: PostQuery,
    variables: { slug },
  });

  const { post } = data;

  if (!post) {
    notFound();
  }

  return <PostTemplate post={post} />;
}

export async function generateMetadata(
  { params }: PostProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;

  const { data } = await fetchGraphQL<PostQueryType>({
    query: PostQuery,
    variables: { slug },
  });

  const { post } = data;

  if (!post) {
    return {};
  }

  return seoData(post);
}