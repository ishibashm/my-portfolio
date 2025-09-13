import gql from "graphql-tag";

export const PostsListQuery = gql`
  query PostsListQuery($first: Int = 10, $after: String = null) {
    posts(first: $first, after: $after, where: { orderby: { field: DATE, order: DESC } }) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          id
          databaseId
          title
          excerpt
          slug
          date
          featuredImage {
            node {
              sourceUrl
              altText
              mediaDetails {
                width
                height
              }
            }
          }
          author {
            node {
              id
              name
              avatar {
                url
              }
            }
          }
          categories {
            edges {
              node {
                name
                slug
              }
            }
          }
          tags {
            edges {
              node {
                name
                slug
              }
            }
          }
        }
      }
    }
  }
`;