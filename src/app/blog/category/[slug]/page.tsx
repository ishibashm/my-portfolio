import { notFound } from 'next/navigation';
import BlogListTemplate from '@/components/Templates/BlogList/BlogListTemplate';
import { fetchGraphQL } from '@/utils/fetchGraphQL';
import {
  PostsByCategoryDocument,
  PostsByCategoryQuery,
} from '@/gql/graphql';
import { Metadata, ResolvingMetadata } from 'next';

// Next.js 15の非同期Propsに対応
type CategoryPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ after?: string }>;
};

export const revalidate = 60;

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const { after } = await searchParams;

  const { data } = await fetchGraphQL<PostsByCategoryQuery>({
    query: PostsByCategoryDocument,
    variables: {
      slug,
      first: 10,
      after: after || null,
    },
  });

  if (!data.category) {
    notFound();
  }

  return (
    <BlogListTemplate
      posts={data.category.posts?.nodes}
      pageInfo={data.category.posts?.pageInfo}
      title={`Category: ${data.category.name}`}
      currentSlug={`/blog/category/${slug}`}
    />
  );
}

export async function generateMetadata(
  { params }: CategoryPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Category: ${slug}`,
  };
}