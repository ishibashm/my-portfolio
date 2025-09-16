import { BlogListTemplate } from '@/components/Templates/BlogList/BlogListTemplate';
// import { PostsByCategoryQuery } from '@/gql/graphql';
// import { PostsByCategory } from '@/queries/posts/PostsByCategory';
// import { fetchGraphQL } from '@/utils/fetchGraphQL';

const CategoryPage = async ({ params }: { params: { slug: string } }) => {
  // const { data } = await fetchGraphQL<PostsByCategoryQuery>({
  //   query: PostsByCategory,
  //   variables: {
  //     category: params.slug,
  //   },
  // });

  const dummyPosts = [
    {
      __typename: 'Post' as const,
      slug: 'dummy-post-1',
      title: '静的ブログ投稿1',
      excerpt: '<p>これは静的なブログ投稿の抜粋です。</p>',
      date: new Date().toISOString(),
      featuredImage: {
        node: {
          sourceUrl: 'https://via.placeholder.com/400x250',
          altText: 'ダミー画像',
        },
      },
      categories: {
        nodes: [
          {
            __typename: 'Category' as const,
            name: 'お知らせ',
            slug: 'notice',
          },
        ],
      },
    }
  ];

  return (
    <BlogListTemplate
      posts={dummyPosts}
      title={`カテゴリ: ${params.slug}`}
      currentSlug={params.slug}
    />
  );
};

export default CategoryPage;