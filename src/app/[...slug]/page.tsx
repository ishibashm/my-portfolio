import { notFound } from 'next/navigation';
import { PageTemplate } from '@/components/Templates/Page/PageTemplate';
import { fetchGraphQL } from '@/utils/fetchGraphQL';
import { nextSlugToWpSlug } from '@/utils/nextSlugToWpSlug';
import {
  PageBySlugDocument,
  PageBySlugQuery,
} from '@/gql/graphql';
import { Metadata, ResolvingMetadata } from 'next';
import { seoData } from '@/utils/seoData';

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

export const revalidate = 60;

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const wpSlug = nextSlugToWpSlug(resolvedParams.slug);

  const { data } = await fetchGraphQL<PageBySlugQuery>({
    query: PageBySlugDocument,
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

  const { data } = await fetchGraphQL<PageBySlugQuery>({
    query: PageBySlugDocument,
    variables: { slug: wpSlug },
  });

  const { page } = data;

  if (!page) {
    return {};
  }

  return seoData(page);
}