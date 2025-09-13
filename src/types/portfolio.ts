import { Post } from "@/gql/graphql";

export interface Portfolio extends Post {
  portfolioFields?: {
    projectUrl?: string;
    githubUrl?: string;
    technologies?: string[];
    projectType?: string;
    client?: string;
    duration?: string;
    demoUrl?: string;
    downloadUrl?: string;
    videoUrl?: string;
    gallery?: Array<{
      sourceUrl: string;
      altText?: string;
      mediaDetails?: {
        width: number;
        height: number;
      };
    }>;
  };
}