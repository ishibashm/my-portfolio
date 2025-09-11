import { gql } from "graphql-tag";

export const GetPortfoliosQuery = gql`
  query GetPortfolios {
    posts(first: 10, where: { categoryName: "portfolio" }) {
      nodes {
        ... on Post {
          title
          content
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          portfolioInfo {
            siteUrl
            techStack
            githubUrl
          }
        }
      }
    }
  }
`;