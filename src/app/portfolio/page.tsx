import { PortfolioListTemplate } from '@/components/Templates/PortfolioList/PortfolioListTemplate';

const PortfolioPage = () => {
  // 静的なダミーデータのみを使用
  const dummyPosts = [
    {
      __typename: 'Post' as const,
      slug: 'auris-cosmetics',
      title: 'Auris Cosmetics LP',
      excerpt: '<p>高級エイジングケア美容液の架空LP。オーロラグラデーションやスクロールアニメーションを実装。</p>',
      featuredImage: {
        node: {
          sourceUrl: '/images/auris/gold-ink.png', // ヒーローセクションの背景画像
          altText: 'Auris Cosmetics LPのヒーローイメージ',
        },
      },
      tags: {
        nodes: [
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
          {
            __typename: 'Tag' as const,
            name: 'Swiper.js',
            slug: 'swiperjs',
          },
          {
            __typename: 'Tag' as const,
            name: 'Intersection Observer',
            slug: 'intersection-observer',
          },
        ],
      },
    },
    {
      __typename: 'Post' as const,
      slug: 'corporate-site',
      title: 'コーポレートサイト',
      excerpt: '<p>React, TypeScript, Next.jsで構築したコーポレートサイトです。</p>',
      featuredImage: {
        node: {
          sourceUrl: '/images/portfolio.png', // スクリーンショットのパスに変更
          altText: 'コーポレートサイトのスクリーンショット',
        },
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