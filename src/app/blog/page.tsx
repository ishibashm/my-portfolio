import BlogListTemplate from '@/components/Templates/BlogList/BlogListTemplate';
import { fetchGraphQL } from '@/utils/fetchGraphQL';
import {
  PostsListDocument,
  PostsListQuery,
} from '@/gql/graphql';

type BlogPageProps = {
  searchParams: {
    after?: string;
  };
};

export const revalidate = 60;

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { after } = searchParams;

  const { data } = await fetchGraphQL<PostsListQuery>({
    query: PostsListDocument,
    variables: {
      first: 10,
      after: after || null,
    },
  });

  return (
    <BlogListTemplate
      posts={data.posts?.nodes}
      pageInfo={data.posts?.pageInfo}
      title="Blog"
      currentSlug="/blog"
    />
  );
}