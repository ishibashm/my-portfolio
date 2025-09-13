import { HomePageTemplate } from '@/components/Templates/HomePage/HomePageTemplate';
import { fetchGraphQL } from '@/utils/fetchGraphQL';
import {
  HomePageDocument,
  HomePageQuery,
} from '@/gql/graphql';
import { Metadata } from 'next';
import { seoData } from '@/utils/seoData';

export const revalidate = 60;

export default async function Home() {
  const { data } = await fetchGraphQL<HomePageQuery>({
    query: HomePageDocument,
    variables: {},
  });

  const { page, posts } = data;

  return (
    <HomePageTemplate
      page={page}
      posts={posts?.nodes}
    />
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await fetchGraphQL<HomePageQuery>({
    query: HomePageDocument,
    variables: {},
  });

  const { page } = data;

  if (!page) {
    return {};
  }

  return seoData(page);
}