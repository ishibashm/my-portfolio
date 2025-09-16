import { BlogListTemplate } from '@/components/Templates/BlogList/BlogListTemplate';
// import { PostsListQuery } from '@/gql/graphql';
// import { PostsList } from '@/queries/posts/PostsList';
// import { fetchGraphQL } from '@/utils/fetchGraphQL';

const BlogPage = async () => {
  // const { data } = await fetchGraphQL<PostsListQuery>({
  //   query: PostsList,
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
      title="ブログ"
      currentSlug=""
    />
  );
};

export default BlogPage;