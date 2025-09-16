import { PageTemplate } from '@/components/Templates/Page/PageTemplate';
// import { PageBySlugQuery } from '@/gql/graphql';
// import { PageBySlug } from '@/queries/page/PageBySlug';
// import { fetchGraphQL } from '@/utils/fetchGraphQL';
// import { Metadata } from 'next';
// import { notFound } from 'next/navigation';
// import { seoData } from '@/utils/seoData';

// export const revalidate = 60;

const Page = async ({ params }: { params: { slug: string[] } }) => {
  // const { data } = await fetchGraphQL<PageBySlugQuery>({
  //   query: PageBySlug,
  //   variables: {
  //     uri: params.slug.join('/'),
  //   },
  // });

  // if (!data.page) {
  //   notFound();
  // }

  const dummyPage = {
    __typename: 'Page' as const,
    title: '静的ページ',
    content: '<p>これは静的な固定ページです。</p>',
  };

  return <PageTemplate page={dummyPage} />;
};

export default Page;

// export async function generateMetadata({
//   params,
// }: {
//   params: { slug: string[] };
// }): Promise<Metadata> {
//   const { data } = await fetchGraphQL<PageBySlugQuery>({
//     query: PageBySlug,
//     variables: {
//       uri: params.slug.join('/'),
//     },
//   });

//   const { page } = data;

//   if (!page) {
//     return {};
//   }

//   return seoData(page);
// }