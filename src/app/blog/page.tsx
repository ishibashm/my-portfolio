import { BlogListTemplate } from "@/components/Templates/BlogList/BlogListTemplate";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";

// MDX記事を取得するためのユーティリティ関数
async function getMDXPosts() {
  const postsDirectory = path.join(process.cwd(), "src", "posts");

  try {
    const fileNames = fs.readdirSync(postsDirectory);
    const posts = await Promise.all(
      fileNames.map(async (fileName) => {
        const slug = fileName.replace(/\.mdx?$/, "");
        const filePath = path.join(postsDirectory, fileName);
        const fileContent = fs.readFileSync(filePath, "utf8");
        const { data } = matter(fileContent);

        return {
          __typename: "Post" as const,
          slug,
          title: data.title || "タイトルなし",
          excerpt: data.description ? `<p>${data.description}</p>` : "",
          date: data.date || new Date().toISOString(),
          featuredImage: {
            node: {
              sourceUrl: "/images/blog.webp",
              altText: "ブログ記事のアイキャッチ画像",
            },
          },
          categories: {
            nodes: data.tags
              ? data.tags.map((tag: string) => ({
                  __typename: "Category" as const,
                  name: tag,
                  slug: tag.toLowerCase(),
                }))
              : [
                  {
                    __typename: "Category" as const,
                    name: "ブログ",
                    slug: "blog",
                  },
                ],
          },
        };
      }),
    );

    // 日付順でソート
    return posts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  } catch (error) {
    console.error("Error reading MDX posts:", error);
    return [];
  }
}

const BlogPage = async () => {
  const posts = await getMDXPosts();

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          position: "absolute",
          top: "2rem",
          right: "2rem",
          zIndex: 10,
        }}
      >
        <Link
          href="/blog/editor"
          style={{
            background: "#45B7D1",
            color: "white",
            padding: "0.75rem 1.5rem",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "500",
            transition: "all 0.3s ease",
            border: "none",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          ✏️ ブログ作成
        </Link>
      </div>

      <BlogListTemplate posts={posts} title="ブログ" currentSlug="" />
    </div>
  );
};

export default BlogPage;
