import { Page, Post } from '@/gql/graphql';
import { Metadata } from 'next';

// WordPressのYoast SEOなどから取得したSEO情報を想定
type Seo = {
  title: string;
  metaDesc: string;
  opengraphImage?: {
    sourceUrl: string;
  };
};

type PostOrPage =
  | (Pick<Page, 'title'> & { seo?: Seo | null })
  | (Pick<Post, 'title'> & { seo?: Seo | null });

export function seoData(postOrPage: PostOrPage): Metadata {
  const seo = postOrPage.seo;
  const title = seo?.title || postOrPage.title || '';
  const description = seo?.metaDesc || '';
  const ogImage = seo?.opengraphImage?.sourceUrl;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      ...(ogImage && { images: [ogImage] }),
    },
  };
}
