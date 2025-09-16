import { PortfolioListTemplate } from '@/components/Templates/PortfolioList/PortfolioListTemplate';
// import { fetchGraphQL } from '@/utils/fetchGraphQL';
// import { PortfoliosQuery } from '@/gql/graphql';
// import Portfolios from '@/queries/portfolio/Portfolios.graphql';

const PortfolioPage = async () => {
  // const { data } = await fetchGraphQL<PortfoliosQuery>({
  //   query: Portfolios,
  // });

  // 静的なダミーデータのみを使用
  const dummyPosts = [
    {
      __typename: 'Post' as const,
      slug: 'corporate-site',
      title: '旧コーポレートサイト',
      excerpt: '<p>React, TypeScript, Next.jsで構築した旧コーポレートサイトです。</p>',
      featuredImage: {
        node: {
          sourceUrl: 'https://via.placeholder.com/400x250',
          altText: '旧コーポレートサイトのスクリーンショット',
        },
      },
      categories: {
        nodes: [
          {
            __typename: 'Category' as const,
            name: 'Webサイト制作',
            slug: 'web-production',
          },
        ],
      },
      tags: {
        nodes: [
          {
            __typename: 'Tag' as const,
            name: 'React',
            slug: 'react',
          },
          {
            __typename: 'Tag' as const,
            name: 'Next.js',
            slug: 'nextjs',
          },
          {
            __typename: 'Tag' as const,
            name: 'TypeScript',
            slug: 'typescript',
          },
        ],
      },
    },
    // 他の静的なポートフォリオ項目をここに追加できます
  ];

  // const posts = data?.posts?.nodes ? [...data.posts.nodes, ...dummyPosts] : dummyPosts;


  return <PortfolioListTemplate posts={dummyPosts} />;
};

export default PortfolioPage;