import gql from 'graphql-tag';

export const PortfolioBySlugQuery = gql`
  query PortfolioBySlugQuery($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      title
      content
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
    }
  }
`;