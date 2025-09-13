import { PortfolioListTemplate } from '@/components/Templates/PortfolioList/PortfolioListTemplate';
import { fetchGraphQL } from '@/utils/fetchGraphQL';
import {
  PortfoliosDocument,
  PortfoliosQuery,
} from '@/gql/graphql';

export const revalidate = 60;

export default async function PortfolioPage() {
  const { data } = await fetchGraphQL<PortfoliosQuery>({
    query: PortfoliosDocument,
    variables: {},
  });

  return <PortfolioListTemplate posts={data.posts?.nodes} />;
}