import { PortfolioListTemplate } from '@/components/Templates/PortfolioList/PortfolioListTemplate';

const PortfolioPage = () => {
  // 静的なダミーデータのみを使用
  const dummyPosts = [
    {
      __typename: 'Post' as const,
      slug: 'corporate-site',
      title: '旧コーポレートサイト',
      excerpt: '<p>React, TypeScript, Next.jsで構築した旧コーポレートサイトです。</p>',
      featuredImage: {
        node: {
          sourceUrl: '/images/portfolio.png', // スクリーンショットのパスに変更
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

  return <PortfolioListTemplate posts={dummyPosts} />;
};

export default PortfolioPage;