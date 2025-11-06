import Image from "next/image";
import Link from "next/link";
import { ComponentProps, FC } from "react";

// リンクコンポーネントを外で定義
const LinkComponent: FC<
  Omit<ComponentProps<"a">, "href"> & { href?: string }
> = ({ href, children, ...props }) => {
  const isExternal = href?.startsWith("http");

  if (isExternal) {
    return (
      <a
        href={href}
        className="mdx-a-external"
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href || "#"} className="mdx-a-internal" {...props}>
      {children}
    </Link>
  );
};

type MDXComponent<T extends keyof JSX.IntrinsicElements> = FC<
  ComponentProps<T>
>;

export const MDXComponents = {
  // h1からh6までのヘッダー要素
  h1: (({ children, ...props }: ComponentProps<"h1">) => (
    <h1 className="mdx-h1" {...props}>
      {children}
    </h1>
  )) as MDXComponent<"h1">,
  h2: (({ children, ...props }: ComponentProps<"h2">) => (
    <h2 className="mdx-h2" {...props}>
      {children}
    </h2>
  )) as MDXComponent<"h2">,
  h3: (({ children, ...props }: ComponentProps<"h3">) => (
    <h3 className="mdx-h3" {...props}>
      {children}
    </h3>
  )) as MDXComponent<"h3">,
  h4: (({ children, ...props }: ComponentProps<"h4">) => (
    <h4 className="mdx-h4" {...props}>
      {children}
    </h4>
  )) as MDXComponent<"h4">,
  h5: (({ children, ...props }: ComponentProps<"h5">) => (
    <h5 className="mdx-h5" {...props}>
      {children}
    </h5>
  )) as MDXComponent<"h5">,
  h6: (({ children, ...props }: ComponentProps<"h6">) => (
    <h6 className="mdx-h6" {...props}>
      {children}
    </h6>
  )) as MDXComponent<"h6">,

  // 段落
  p: (({ children, ...props }: ComponentProps<"p">) => (
    <p className="mdx-p" {...props}>
      {children}
    </p>
  )) as MDXComponent<"p">,

  // リンク
  a: LinkComponent,

  // 画像
  img: (({ src, alt, width, height, ...props }: ComponentProps<"img">) => (
    <Image
      src={src || ""}
      alt={alt || ""}
      width={Number(width) || 500}
      height={Number(height) || 300}
      className="mdx-img"
      {...props}
    />
  )) as FC<ComponentProps<"img">>,

  // リスト
  ul: (({ children, ...props }: ComponentProps<"ul">) => (
    <ul className="mdx-ul" {...props}>
      {children}
    </ul>
  )) as MDXComponent<"ul">,
  ol: (({ children, ...props }: ComponentProps<"ol">) => (
    <ol className="mdx-ol" {...props}>
      {children}
    </ol>
  )) as MDXComponent<"ol">,
  li: (({ children, ...props }: ComponentProps<"li">) => (
    <li className="mdx-li" {...props}>
      {children}
    </li>
  )) as MDXComponent<"li">,

  // 引用
  blockquote: (({ children, ...props }: ComponentProps<"blockquote">) => (
    <blockquote className="mdx-blockquote" {...props}>
      {children}
    </blockquote>
  )) as MDXComponent<"blockquote">,

  // コードブロック
  code: (({ children, className, ...props }: ComponentProps<"code">) => (
    <code className={`mdx-code ${className || ""}`} {...props}>
      {children}
    </code>
  )) as MDXComponent<"code">,

  // コードブロック（preでラップされている場合）
  pre: (({ children, ...props }: ComponentProps<"pre">) => (
    <pre className="mdx-pre" {...props}>
      {children}
    </pre>
  )) as MDXComponent<"pre">,

  // 区切り線
  hr: ({ ...props }: ComponentProps<"hr">) => (
    <hr className="mdx-hr" {...props} />
  ),

  // 強調
  strong: (({ children, ...props }: ComponentProps<"strong">) => (
    <strong className="mdx-strong" {...props}>
      {children}
    </strong>
  )) as MDXComponent<"strong">,
  em: (({ children, ...props }: ComponentProps<"em">) => (
    <em className="mdx-em" {...props}>
      {children}
    </em>
  )) as MDXComponent<"em">,
};