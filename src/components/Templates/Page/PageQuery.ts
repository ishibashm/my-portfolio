import { gql } from 'graphql-tag';

export const PageQuery = gql`
  query PageQuery($slug: ID!) {
    page(id: $slug, idType: URI) {
      title
      content
    }
  }
`;
