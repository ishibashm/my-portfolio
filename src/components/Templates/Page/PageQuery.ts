import { gql } from '@apollo/client';

export const PageQuery = gql`
  query PageQuery($slug: ID!) {
    page(id: $slug, idType: URI) {
      title
      content
      pageFields {
        subTitle
        gallery {
          node {
            sourceUrl
            altText
          }
        }
      }
    }
  }
`;
