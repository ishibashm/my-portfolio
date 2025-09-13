import { PageBySlugQuery } from '@/gql/graphql';
import Image from 'next/image';
import styles from './PageTemplate.module.css';

interface PageTemplateProps {
  page: NonNullable<PageBySlugQuery['page']>;
}

export const PageTemplate = ({ page }: PageTemplateProps) => {
  const { title, content } = page;

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1>{title}</h1>
        <div
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: content || '' }}
        />
      </main>
    </div>
  );
};
