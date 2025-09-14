import BlogListTemplate from '@/components/Templates/BlogList/BlogListTemplate';
import { fetchGraphQL } from '@/utils/fetchGraphQL';
import {
  PostsListDocument,
  PostsListQuery,
} from '@/gql/graphql';

type BlogPageProps = {
  searchParams: Promise<{ after?: string }>;
};

export const revalidate = 60;

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { after } = await searchParams;

  const { data } = await fetchGraphQL<PostsListQuery>({
    query: PostsListDocument,
    variables: {
      first: 10,
      after: after || null,
    },
  });

  return (
    <div className="content gradient-mesh-background">
      <header className="header">
        <div className="container">
          <div className="header-inner">
            <a href="/" className="logo">
              My Portfolio
            </a>
            <nav className="nav">
              <ul>
                <li>
                  <a href="/portfolio">Portfolio</a>
                </li>
                <li>
                  <a href="/about">About</a>
                </li>
                <li>
                  <a href="/blog">Blog</a>
                </li>
                <li>
                  <a href="#contact" className="contact-button">
                    Contact
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
      <main>
        <BlogListTemplate
          posts={data.posts?.nodes}
          pageInfo={data.posts?.pageInfo}
          title="Blog"
          currentSlug="/blog"
        />
      </main>
      <footer id="contact" className="footer">
        <div className="container">
          <p>© 2025 My Portfolio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}