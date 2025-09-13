import gql from 'graphql-tag';

export const GetPortfolios = gql`
  query GetPortfolios {
    posts(where: { categoryName: "portfolio" }) {
      nodes {
        title
        slug
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
      }
    }
  }
`;