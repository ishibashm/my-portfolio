import { PageBySlugQuery, PostBySlugQuery } from '@/gql/graphql';
import { Metadata } from 'next';

type PostOrPage =
  | NonNullable<PageBySlugQuery['page']>
  | NonNullable<PostBySlugQuery['post']>;

export function seoData(postOrPage: PostOrPage): Metadata {
  const seo = postOrPage?.seo;
  const title = seo?.title || postOrPage?.title || '';
  const description = seo?.metaDesc || '';
  
  // postOrPageがPost型かチェックしてfeaturedImageを取得
  const ogImage = 'featuredImage' in postOrPage ? postOrPage.featuredImage?.node?.sourceUrl : undefined;

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
