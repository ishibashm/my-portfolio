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
