import { gql } from '@apollo/client';

export const PostQuery = gql`
  query PostQuery($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      title
      content
      date
      author {
        node {
          name
        }
      }
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      # ACFフィールドグループ'postFields'を取得
      postFields {
        relatedLink
      }
    }
  }
`;
