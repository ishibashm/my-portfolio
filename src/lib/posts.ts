import fs from "fs";
import path from "path";
import matter from "gray-matter";

// MDX用の型定義
export interface MDXPost {
  slug: string;
  title: string;
  date: string;
  description?: string;
  tags?: string[];
  content: string;
}

// MDX記事のディレクトリパス
const postsDirectory = path.join(process.cwd(), "src", "posts");

// 記事の一覧を取得
export function getAllPostSlugs(): string[] {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => fileName.replace(/\.mdx?$/, ""));
}

// 本文からおおよその読了時間（分）を求める。
// 日本語は単語で区切れないため文字数、英数字は単語数で数え、
// それぞれ 400文字/分・200語/分 として合算する
export function getReadingTime(content: string): number {
  const japanese = (content.match(/[぀-ヿ一-鿿]/g) ?? []).length;
  const words = (content.match(/[A-Za-z0-9]+/g) ?? []).length;
  return Math.max(1, Math.round(japanese / 400 + words / 200));
}

// 記事のメタデータとコンテンツを取得
export function getPostBySlug(slug: string): Omit<MDXPost, "slug"> | null {
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

    return {
      title: data.title || "",
      date: data.date || "",
      description: data.description || "",
      tags: data.tags || [],
      content,
      ...data,
    };
  } catch (error) {
    console.error("Error reading post:", error);
    return null;
  }
}

// すべての記事を取得
export function getAllPosts(): MDXPost[] {
  const slugs = getAllPostSlugs();
  const posts = slugs
    .map((slug) => {
      const postData = getPostBySlug(slug);
      if (!postData) {
        return null;
      }
      return {
        slug,
        ...postData,
      };
    })
    .filter((post): post is MDXPost => post !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}
