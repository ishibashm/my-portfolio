import { Page } from '@/gql/graphql';
import Image from 'next/image';
import styles from './PageTemplate.module.css';

interface PageTemplateProps {
  page: Page;
}

export const PageTemplate = ({ page }: PageTemplateProps) => {
  const { title, content, pageFields } = page;
  const { subTitle, gallery } = pageFields || {};

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1>{title}</h1>
        {subTitle && <h2>{subTitle}</h2>}
        <div
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: content || '' }}
        />
        {gallery && (
          <div className={styles.gallery}>
            {gallery.map(
              (image) =>
                image?.node?.sourceUrl && (
                  <Image
                    key={image.node.sourceUrl}
                    src={image.node.sourceUrl}
                    alt={image.node.altText || ''}
                    width={300}
                    height={200}
                  />
                )
            )}
          </div>
        )}
      </main>
    </div>
  );
};
