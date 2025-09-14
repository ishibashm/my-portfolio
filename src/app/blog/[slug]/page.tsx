import { notFound } from 'next/navigation';
import { PostTemplate } from '@/components/Templates/Post/PostTemplate';
import { fetchGraphQL } from '@/utils/fetchGraphQL';
import {
  PostBySlugDocument,
  PostBySlugQuery,
} from '@/gql/graphql';
import { Metadata, ResolvingMetadata } from 'next';
import { seoData } from '@/utils/seoData';

type PostProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 60;

export default async function Post({ params }: PostProps) {
  const { slug } = await params;

  const { data } = await fetchGraphQL<PostBySlugQuery>({
    query: PostBySlugDocument,
    variables: { slug },
  });

  const { post } = data;

  if (!post) {
    notFound();
  }

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
        <PostTemplate post={post} />
      </main>
      <footer id="contact" className="footer">
        <div className="container">
          <p>© 2025 My Portfolio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export async function generateMetadata(
  { params }: PostProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;

  const { data } = await fetchGraphQL<PostBySlugQuery>({
    query: PostBySlugDocument,
    variables: { slug },
  });

  const { post } = data;

  if (!post) {
    return {};
  }

  return seoData(post);
}