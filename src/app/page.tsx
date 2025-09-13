import { HomePageTemplate } from '@/components/Templates/HomePage/HomePageTemplate';
import { HomePageQuery } from '@/queries/home/HomePageQuery';
import { fetchGraphQL } from '@/utils/fetchGraphQL';
import { HomePageQuery as HomePageQueryType } from '@/gql/graphql';

export const revalidate = 60;

export default async function Home() {
  const { data } = await fetchGraphQL<HomePageQueryType>({
    query: HomePageQuery,
    variables: {},
  });

  const { page, posts, portfolios } = data;

  return (
    <HomePageTemplate
      page={page}
      posts={posts?.nodes}
      portfolios={portfolios?.nodes}
    />
  );
}