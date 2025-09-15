'use client';
import { HomePageQuery } from '@/gql/graphql';
import styles from './HomePageTemplate.module.css';
import { formatDate } from '@/utils/formatDate';

type Page = NonNullable<HomePageQuery['page']>;
type Posts = NonNullable<HomePageQuery['posts']>['nodes'];

interface HomePageTemplateProps {
  page?: Page | null;
  posts?: Posts | null;
}

export const HomePageTemplate = ({
  page,
  posts,
}: HomePageTemplateProps) => {
  const heroTitle = page?.title || 'Welcome';

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <h1 className={styles.title}>{heroTitle}</h1>
          {page?.content && (
            <div
              className={styles.description}
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          )}
        </div>
      </section>

      <section id="news" className="news">
        <div className="container">
          <h2 className="section-title">Blog</h2>
          <ul className="news-list">
            {posts?.map(
              (post) =>
                post && (
                  <li key={post.slug}>
                    {post.date && (
                      <time dateTime={post.date}>{formatDate(post.date)}</time>
                    )}
                    <a href={`/blog/${post.slug}`}>{post.title}</a>
                  </li>
                )
            )}
          </ul>
        </div>
      </section>
    </>
  );
};