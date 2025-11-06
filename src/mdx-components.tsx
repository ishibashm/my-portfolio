import type { MDXComponents } from "mdx/types";
import Image from "next/image";
import Link from "next/link";
import { ComponentProps, FC } from "react";

// This file allows you to provide custom React components
// to be used in MDX files. You can import and use any
// React component you want, including components from
// other libraries.

// This file is required to use MDX in `app` directory.
export function useMDXComponents(components: MDXComponents): MDXComponents {
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

  return {
    // Allows customizing built-in components, e.g. to add styling.
    h1: ({ children }) => <h1 className="mdx-h1">{children}</h1>,
    h2: ({ children }) => <h2 className="mdx-h2">{children}</h2>,
    h3: ({ children }) => <h3 className="mdx-h3">{children}</h3>,
    h4: ({ children }) => <h4 className="mdx-h4">{children}</h4>,
    h5: ({ children }) => <h5 className="mdx-h5">{children}</h5>,
    h6: ({ children }) => <h6 className="mdx-h6">{children}</h6>,
    p: ({ children }) => <p className="mdx-p">{children}</p>,
    a: LinkComponent,
    img: (props) => (
      <Image
        sizes="100vw"
        style={{ width: "100%", height: "auto" }}
        {...(props as any)}
      />
    ),
    ul: ({ children }) => <ul className="mdx-ul">{children}</ul>,
    ol: ({ children }) => <ol className="mdx-ol">{children}</ol>,
    li: ({ children }) => <li className="mdx-li">{children}</li>,
    blockquote: ({ children }) => (
      <blockquote className="mdx-blockquote">{children}</blockquote>
    ),
    code: ({ children, ...props }) => (
      <code className={`mdx-code`} {...props}>
        {children}
      </code>
    ),
    pre: ({ children }) => <pre className="mdx-pre">{children}</pre>,
    hr: () => <hr className="mdx-hr" />,
    strong: ({ children }) => <strong className="mdx-strong">{children}</strong>,
    em: ({ children }) => <em className="mdx-em">{children}</em>,
    ...components,
  };
}