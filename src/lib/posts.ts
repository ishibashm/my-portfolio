import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemoteSerializeResult } from "next-mdx-remote";

// MDX用の型定義
export interface MDXPost {
  slug: string;
  title: string;
  date: string;
  description?: string;
  tags?: string[];
  content: string;
  mdxSource: MDXRemoteSerializeResult;
}

// MDX記事のディレクトリパス
const postsDirectory = path.join(process.cwd(), "src", "posts");

// 記事の一覧を取得
export function getAllPostSlugs(): string[] {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => fileName.replace(/\.mdx?$/, ""));
}

// 記事のメタデータとコンテンツを取得
export async function getPostBySlug(slug: string): Promise<MDXPost | null> {
  try {
    const mdxPath = path.join(postsDirectory, `${slug}.mdx`);
    const markdownPath = path.join(postsDirectory, `${slug}.md`);

    let filePath: string;
    if (fs.existsSync(mdxPath)) {
      filePath = mdxPath;
    } else if (fs.existsSync(markdownPath)) {
      filePath = markdownPath;
    } else {
      return null;
    }

    const fileContent = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContent);

    // MDXをシリアライズ
    const mdxSource = await serialize(content, {
      mdxOptions: {
        remarkPlugins: [],
        rehypePlugins: [],
      },
    });

    return {
      slug,
      title: data.title || "",
      date: data.date || "",
      description: data.description || "",
      tags: data.tags || [],
      content,
      mdxSource,
      ...data,
    } as MDXPost;
  } catch (error) {
    console.error("Error reading post:", error);
    return null;
  }
}

// すべての記事を取得
export async function getAllPosts(): Promise<MDXPost[]> {
  const slugs = getAllPostSlugs();
  const posts = await Promise.all(
    slugs.map(async (slug) => await getPostBySlug(slug)),
  );

  // nullを除外し、日付順でソート
  return posts
    .filter((post): post is MDXPost => post !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
