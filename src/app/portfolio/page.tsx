import { PortfolioListTemplate } from '@/components/Templates/PortfolioList/PortfolioListTemplate';
import { fetchGraphQL } from '@/utils/fetchGraphQL';
import {
  PortfoliosDocument,
  PortfoliosQuery,
} from '@/gql/graphql';

export const revalidate = 60;

export default async function PortfolioPage() {
  const { data } = await fetchGraphQL<PortfoliosQuery>({
    query: PortfoliosDocument,
    variables: {},
  });

  return (
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
        <PortfolioListTemplate posts={data.posts?.nodes} />
      </main>
      <footer id="contact" className="footer">
        <div className="container">
          <p>© 2025 My Portfolio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}