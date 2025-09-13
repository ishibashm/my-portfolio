import { HomePageTemplate } from '@/components/Templates/HomePage/HomePageTemplate';
import { fetchGraphQL } from '@/utils/fetchGraphQL';
import {
  HomePageDocument,
  HomePageQuery,
} from '@/gql/graphql';
import { Metadata } from 'next';
import { seoData } from '@/utils/seoData';
import Script from 'next/script';

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
            <section className="hero">
              <div className="container">
                <h1 className="hero-title">未来を創造するテクノロジー</h1>
                <p className="hero-subtitle">
                  私たちは最先端の技術で、新しい価値を提供します。
                </p>
                <div className="controls">
                  <button className="control-btn" id="toggleAnimation">
                    アニメーション切替
                  </button>
                  <button className="control-btn" id="changeColors">
                    配色変更
                  </button>
                  <button className="control-btn" id="toggleNoise">
                    ノイズ切替
                  </button>
                </div>
              </div>
            </section>
            <section id="services" className="services">
              <div className="container">
                <h2 className="section-title">Services</h2>
                <div className="services-grid">
                  <div className="service-item">
                    <h3>Web Development</h3>
                    <p>
                      最新の技術を用いた、高速で魅力的なウェブサイトを構築します。
                    </p>
                  </div>
                  <div className="service-item">
                    <h3>UI/UX Design</h3>
                    <p>
                      ユーザー中心の設計思想に基づき、直感的で使いやすいデザインを提供します。
                    </p>
                  </div>
                  <div className="service-item">
                    <h3>Consulting</h3>
                    <p>
                      技術選定からプロジェクト推進まで、あなたのアイデアを形にするお手伝いをします。
                    </p>
                  </div>
                </div>
              </div>
            </section>
            <section id="about" className="about">
              <div className="container">
                <h2 className="section-title">About Me</h2>
                <div className="about-content">
                  <p>（ここに自己紹介文が入ります）</p>
                </div>
              </div>
            </section>
            <section id="news" className="news">
              <div className="container">
                <h2 className="section-title">Latest Blog</h2>
                <ul className="news-list">
                  {posts?.nodes?.map((post) => (
                    <li key={post?.slug}>
                      {post?.date && (
                        <time dateTime={post.date}>
                          {new Date(post.date).toLocaleDateString('ja-JP', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                          })}
                        </time>
                      )}
                      <a href={`/blog/${post?.slug}`}>{post?.title}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </main>
          <footer id="contact" className="footer">
            <div className="container">
              <p>© 2025 My Portfolio. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}