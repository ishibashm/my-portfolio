import { notFound } from 'next/navigation';
import { PageTemplate } from '@/components/Templates/Page/PageTemplate';
import { fetchGraphQL } from '@/utils/fetchGraphQL';
import {
  PageBySlugDocument,
  PageBySlugQuery,
} from '@/gql/graphql';
import { Metadata } from 'next';
import { seoData } from '@/utils/seoData';

export const revalidate = 60;

export default async function AboutPage() {
  const { data } = await fetchGraphQL<PageBySlugQuery>({
    query: PageBySlugDocument,
    variables: { slug: 'about' },
  });

  const { page } = data;

  if (!page) {
    notFound();
  }

  return <PageTemplate page={page} />;
}

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await fetchGraphQL<PageBySlugQuery>({
    query: PageBySlugDocument,
    variables: { slug: 'about' },
  });

  const { page } = data;

  if (!page) {
    return {};
  }

  return seoData(page);
}
