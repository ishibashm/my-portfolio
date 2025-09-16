import { BlogListTemplate } from '@/components/Templates/BlogList/BlogListTemplate';

const BlogPage = async () => {

  const dummyPosts = [
    {
      __typename: 'Post' as const,
      slug: 'dummy-post-1',
      title: '静的ブログ投稿1',
      excerpt: '<p>これは静的なブログ投稿の抜粋です。</p>',
      date: new Date().toISOString(),
      featuredImage: {
        node: {
          sourceUrl: '/images/blog.webp', // 画像パスを更新
          altText: 'ブログ記事のアイキャッチ画像',
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
    },
    {
      __typename: 'Post' as const,
      slug: 'dummy-post-2',
      title: '静的ブログ投稿2',
      excerpt: '<p>これは静的なブログ投稿の抜粋です。</p>',
      date: new Date().toISOString(),
      featuredImage: {
        node: {
          sourceUrl: '/images/blog.webp', // 画像パスを更新
          altText: 'ブログ記事のアイキャッチ画像',
        },
      },
      categories: {
        nodes: [
          {
            __typename: 'Category' as const,
            name: '技術ブログ',
            slug: 'tech',
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