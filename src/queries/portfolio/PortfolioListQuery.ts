import gql from "graphql-tag";

export const PortfolioListQuery = gql`
  query PortfolioList($first: Int = 10, $after: String = null, $before: String = null) {
    portfolios(first: $first, after: $after, before: $before) {
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
          portfolioFields {
            projectUrl
            githubUrl
            technologies
            projectType
            client
            duration
          }
          categories {
            edges {
              node {
                name
                slug
              }
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;