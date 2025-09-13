import { gql } from '@apollo/client';

export const HomePageQuery = gql`
  query HomePageQuery {
    page(id: "home", idType: URI) {
      title
      homeFields {
        heroTitle
        heroMessage
        heroImage {
          node {
            sourceUrl
            altText
          }
        }
      }
    }
    posts(first: 3) {
      nodes {
        title
        slug
        date
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
      }
    }
    portfolios(first: 3) {
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