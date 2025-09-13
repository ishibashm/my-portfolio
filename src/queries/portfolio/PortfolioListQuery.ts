import gql from 'graphql-tag';

export const PortfolioListQuery = gql`
  query PortfolioListQuery {
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