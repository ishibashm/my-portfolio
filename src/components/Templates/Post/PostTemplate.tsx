import { Post } from '@/gql/graphql';
import Image from 'next/image';
import styles from './PostTemplate.module.css';

interface PostTemplateProps {
  post: Post;
}

export const PostTemplate = ({ post }: PostTemplateProps) => {
  const { title, content, date, author, featuredImage, postFields } = post;
  const { relatedLink } = postFields || {};

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1>{title}</h1>
        <div className={styles.meta}>
          <span>{new Date(date).toLocaleDateString()}</span>
          {author?.node?.name && <span> by {author.node.name}</span>}
        </div>
        {featuredImage?.node?.sourceUrl && (
          <Image
            src={featuredImage.node.sourceUrl}
            alt={featuredImage.node.altText || ''}
            width={800}
            height={400}
            priority
          />
        )}
        <div
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: content || '' }}
        />
        {relatedLink && (
          <div className={styles.related}>
            <h4>関連リンク</h4>
            <a href={relatedLink} target="_blank" rel="noopener noreferrer">
              {relatedLink}
            </a>
          </div>
        )}
      </main>
    </div>
  );
};
