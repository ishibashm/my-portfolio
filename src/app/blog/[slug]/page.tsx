import { notFound } from 'next/navigation';
import { PostTemplate } from '@/components/Templates/Post/PostTemplate';
import { fetchGraphQL } from '@/utils/fetchGraphQL';
import {
  PostBySlugDocument,
  PostBySlugQuery,
} from '@/gql/graphql';
import { Metadata, ResolvingMetadata } from 'next';
import { seoData } from '@/utils/seoData';

type PostProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 60;

export default async function Post({ params }: PostProps) {
  const { slug } = await params;

  const { data } = await fetchGraphQL<PostBySlugQuery>({
    query: PostBySlugDocument,
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