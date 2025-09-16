import { BlogDetailTemplate } from '@/components/Templates/BlogDetail/BlogDetailTemplate';
// import { PostBySlugQuery } from '@/gql/graphql';
// import { PostBySlug } from '@/queries/post/PostBySlug';
// import { fetchGraphQL } from '@/utils/fetchGraphQL';
// import { Metadata } from 'next';
// import { seoData } from '@/utils/seoData';

// export const revalidate = 60;

const BlogDetailPage = async ({ params }: { params: { slug: string } }) => {
  // const { data } = await fetchGraphQL<PostBySlugQuery>({
  //   query: PostBySlug,
  //   variables: {
  //     id: params.slug,
  //   },
  // });

  const dummyPost = {
    __typename: 'Post' as const,
    title: '静的ブログ投稿の詳細',
    content: '<p>これは静的なブログ投稿の本文です。</p>',
    date: new Date().toISOString(),
    author: {
      node: {
        __typename: 'User' as const,
        name: '開発者',
      },
    },
    featuredImage: {
      node: {
        __typename: 'MediaItem' as const,
        sourceUrl: 'https://via.placeholder.com/1280x720',
        altText: 'ダミー画像',
      },
    },
  };

  return <BlogDetailTemplate post={dummyPost} />;
};

export default BlogDetailPage;

// export async function generateMetadata({
//   params,
// }: {
//   params: { slug: string };
// }): Promise<Metadata> {
//   const { data } = await fetchGraphQL<PostBySlugQuery>({
//     query: PostBySlug,
//     variables: {
//       id: params.slug,
//     },
//   });

//   const { post } = data;

//   if (!post) {
//     return {};
//   }

//   return seoData(post);
// }