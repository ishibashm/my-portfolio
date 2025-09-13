import gql from 'graphql-tag';

export const HomePageQuery = gql`
  query HomePageQuery {
    page(id: "home", idType: URI) {
      title
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
  }
`;