import { notFound } from 'next/navigation';
import { PageTemplate } from '@/components/Templates/Page/PageTemplate';
import { PageQuery } from '@/components/Templates/Page/PageQuery';
import { fetchGraphQL } from '@/utils/fetchGraphQL';
import { nextSlugToWpSlug } from '@/utils/nextSlugToWpSlug';
import { PageQuery as PageQueryType } from '@/gql/graphql';
import { Metadata, ResolvingMetadata } from 'next';
import { seoData } from '@/utils/seoData';

type PageProps = {
  params: {
    slug: string[];
  };
};

export const revalidate = 60;

export default async function Page({ params }: PageProps) {
  const wpSlug = nextSlugToWpSlug(params.slug);

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
  const wpSlug = nextSlugToWpSlug(params.slug);

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