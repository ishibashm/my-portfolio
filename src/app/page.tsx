import { HomePageTemplate } from '@/components/Templates/HomePage/HomePageTemplate';
import { fetchGraphQL } from '@/utils/fetchGraphQL';
import {
  HomePageDocument,
  HomePageQuery,
} from '@/gql/graphql';
import { Metadata } from 'next';
import { seoData } from '@/utils/seoData';
import Script from 'next/script';
import { ContactForm } from '@/components/Globals/ContactForm/ContactForm';

export const revalidate = 60;

export default async function Home() {
  const { data } = await fetchGraphQL<HomePageQuery>({
    query: HomePageDocument,
    variables: {},
  });

  const { posts } = data;

  return (
    <>
      <div className="mesh-container">
        <div className="gradient-blob gradient-blob-1"></div>
        <div className="gradient-blob gradient-blob-2"></div>
        <div className="gradient-blob gradient-blob-3"></div>
        <div className="gradient-blob gradient-blob-4"></div>
        <div className="gradient-blob gradient-blob-5"></div>
        <div className="noise-overlay"></div>
        <div className="content">
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
            <HomePageTemplate page={data.page} posts={posts?.nodes} />
          </main>
          <footer id="contact" className="footer">
            <div className="container">
              <h2 className="section-title">Contact</h2>
              <ContactForm />
              <p>© 2025 My Portfolio. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await fetchGraphQL<HomePageQuery>({
    query: HomePageDocument,
    variables: {},
  });

  const { page } = data;

  if (!page) {
    return {};
  }

  return seoData(page);
}