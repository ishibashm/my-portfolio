import { PostBySlugQuery } from '@/gql/graphql';
import Image from 'next/image';
import { formatDate } from '@/utils/formatDate';
// CSSモジュールではなく、グローバルなlp-style.cssを使う
// import styles from './PostTemplate.module.css';

interface PostTemplateProps {
  post: NonNullable<PostBySlugQuery['post']>;
}

export const PostTemplate = ({ post }: PostTemplateProps) => {
  const { title, content, date, author, featuredImage } = post;

  return (
    <section className="post-detail">
      <div className="container">
        {featuredImage?.node?.sourceUrl && (
          <div className="post-eyecatch">
            <Image
              src={featuredImage.node.sourceUrl}
              alt={featuredImage.node.altText || ''}
              width={1280}
              height={720}
              priority
            />
          </div>
        )}
        <h1 className="post-title">{title}</h1>
        <div className="post-meta">
          {date && <time dateTime={date}>{formatDate(date)}</time>}
          {author?.node?.name && <span> by {author.node.name}</span>}
        </div>
        <div
          className="post-content"
          dangerouslySetInnerHTML={{ __html: content || '' }}
        />
      </div>
    </section>
  );
};
