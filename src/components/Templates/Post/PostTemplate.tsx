import { PostBySlugQuery } from '@/gql/graphql';
import Image from 'next/image';
import styles from './PostTemplate.module.css';

interface PostTemplateProps {
  post: NonNullable<PostBySlugQuery['post']>;
}

export const PostTemplate = ({ post }: PostTemplateProps) => {
  const { title, content, date, author, featuredImage } = post;

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
      </main>
    </div>
  );
};
