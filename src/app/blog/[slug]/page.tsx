import { notFound } from 'next/navigation';
import { PostTemplate } from '@/components/Templates/Post/PostTemplate';
import { PostQuery } from '@/components/Templates/Post/PostQuery';
import { fetchGraphQL } from '@/utils/fetchGraphQL';
import { PostQuery as PostQueryType } from '@/gql/graphql';
import { Metadata } from 'next';
import { seoData } from '@/utils/seoData';

type PostProps = {
  params: {
    slug: string;
  };
};

export const revalidate = 60;

export default async function Post({ params }: PostProps) {
  const { slug } = params;

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

export async function generateMetadata({ params }: PostProps): Promise<Metadata> {
  const { slug } = params;

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