import { notFound } from 'next/navigation';
import { PageTemplate } from '@/components/Templates/Page/PageTemplate';
import { PageQuery } from '@/components/Templates/Page/PageQuery';
import { fetchGraphQL } from '@/utils/fetchGraphQL';
import { nextSlugToWpSlug } from '@/utils/nextSlugToWpSlug';
import { PageQuery as PageQueryType } from '@/gql/graphql';
import { Metadata, ResolvingMetadata } from 'next';
import { seoData } from '@/utils/seoData';

// Next.js 15の非同期Propsに対応
type PageProps = {
  params: Promise<{ slug: string[] }>;
};

export const revalidate = 60;

// 1. コンポーネントをasyncにする
export default async function Page({ params }: PageProps) {
  // 3. awaitでPromiseを解決する
  const resolvedParams = await params;
  const wpSlug = nextSlugToWpSlug(resolvedParams.slug);

  const { data } = await fetchGraphQL<PageQueryType>({
    query: PageQuery,
    variables: { slug: wpSlug },
  });

  const { page } = data;

  if (!page) {
    notFound();
  }

  return <PageTemplate page={page} />;
}

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const wpSlug = nextSlugToWpSlug(resolvedParams.slug);

  const { data } = await fetchGraphQL<PageQueryType>({
    query: PageQuery,
    variables: { slug: wpSlug },
  });

  const { page } = data;

  if (!page) {
    return {};
  }

  return seoData(page);
}