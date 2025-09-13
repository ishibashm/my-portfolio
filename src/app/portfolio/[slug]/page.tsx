import { notFound } from 'next/navigation';
import { PostTemplate } from '@/components/Templates/Post/PostTemplate';
import { fetchGraphQL } from '@/utils/fetchGraphQL';
import {
  PostBySlugDocument,
  PostBySlugQuery,
} from '@/gql/graphql';
import { Metadata, ResolvingMetadata } from 'next';
import { seoData } from '@/utils/seoData';

type PortfolioProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 60;

export default async function Portfolio({ params }: PortfolioProps) {
  const { slug } = await params;

  const { data } = await fetchGraphQL<PostBySlugQuery>({
    query: PostBySlugDocument,
    variables: { slug },
  });

  const { post } = data;

  if (!post) {
    notFound();
  }

  // ポートフォリオもPostTemplateを再利用する
  return <PostTemplate post={post} />;
}

export async function generateMetadata(
  { params }: PortfolioProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;

  const { data } = await fetchGraphQL<PostBySlugQuery>({
    query: PostBySlugDocument,
    variables: { slug },
  });

  const { post } = data;

  if (!post) {
    return {};
  }

  return seoData(post);
}