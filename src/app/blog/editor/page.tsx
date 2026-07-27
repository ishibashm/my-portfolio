"use client";
import { useState, useEffect } from "react";
import { useSession, signOut, SessionProvider } from "next-auth/react";
import { useRouter } from "next/navigation";
import styles from "./editor.module.css";
import { Session } from "next-auth";

interface BlogPost {
  title: string;
  date: string;
  description: string;
  tags: string[];
  content: string;
}

const defaultPost: BlogPost = {
  title: "",
  date: new Date().toISOString().split("T")[0],
  description: "",
  tags: [],
  content: `---
title: 'ブログ記事のタイトル'
date: '${new Date().toISOString().split("T")[0]}'
description: '記事の説明を入力してください'
tags: ['タグ1', 'タグ2']
---

# こんにちは！

ここにブログ記事の内容を書いてください。

## 見出しの例

- リストの例
- もう一つの項目

\`\`\`javascript
// コードブロックの例
function hello() {
  console.log("Hello, World!");
}
\`\`\`

**太字**や*イタリック*も使えます。
`,
};

// 認証状態を管理し、UIを出し分ける親コンポーネント
function BlogEditorPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>認証を確認しています...</p>
      </div>
    );
  }

  if (session) {
    return <BlogEditor session={session} />;
  }

  return null;
}

// BlogEditorPageをデフォルトエクスポートする
export default function Page() {
  return (
    <SessionProvider>
      <BlogEditorPage />
    </SessionProvider>
  );
}

// 編集機能に特化した子コンポーネント
function BlogEditor({ session }: { session: Session }) {
  const [post, setPost] = useState<BlogPost>(defaultPost);
  const [preview, setPreview] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [sandboxCode, setSandboxCode] = useState("");
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [previewContent, setPreviewContent] = useState("");

  // MDXコンテンツの生成
  const generateMDXContent = () => {
    const frontmatter = `---
title: '${post.title}'
date: '${post.date}'
description: '${post.description}'
tags: [${post.tags.map((tag) => `'${tag}'`).join(", ")}]
---

`;
    return frontmatter + post.content;
  };

  // プレビュー生成ロジック
  useEffect(() => {
    if (preview) {
      setIsPreviewLoading(true);
      let content = post.content;
      content = content.replace(/^# (.*$)/gm, '<h1 class="preview-h1">$1</h1>');
      content = content.replace(
        /^## (.*$)/gm,
        '<h2 class="preview-h2">$1</h2>',
      );
      content = content.replace(
        /^### (.*$)/gm,
        '<h3 class="preview-h3">$1</h3>',
      );
      content = content.replace(/^- (.*$)/gm, '<li class="preview-li">$1</li>');
      content = content.replace(
        /(<li.*<\/li>)/gms,
        '<ul class="preview-ul">$1</ul>',
      );
      content = content.replace(
        /```(\w+)?\n([\s\S]*?)```/g,
        '<pre class="preview-code"><code>$2</code></pre>',
      );
      content = content.replace(
        /\*\*(.*?)\*\*/g,
        '<strong class="preview-strong">$1</strong>',
      );
      content = content.replace(/\*(.*?)\*/g, '<em class="preview-em">$1</em>');
      content = content.replace(
        /^(?!<[h|ul|pre|li])(.*)$/gm,
        '<p class="preview-p">$1</p>',
      );
      setPreviewContent(content);
      const timer = setTimeout(() => setIsPreviewLoading(false), 300);
      return () => clearTimeout(timer);
    }
  }, [post.content, preview]);

  // 自動保存機能
  const autoSave = async () => {
    if (!session?.user?.id) return;
    setIsAutoSaving(true);
    try {
      const response = await fetch("/api/blog/save-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.user.id,
          post: {
            ...post,
            slug: post.title.toLowerCase().replace(/[^a-z0-9]/g, "-"),
          },
        }),
      });
      if (response.ok) {
        setLastSaved(new Date());
      }
    } catch (error) {
      console.error("Auto-save failed:", error);
    } finally {
      setIsAutoSaving(false);
    }
  };

  // デバウンス付きオートセーブ
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (post.title && post.content) {
        autoSave();
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [post.title, post.content, session?.user?.id]);

  // ファイルとしてダウンロード
  const downloadPost = () => {
    const content = generateMDXContent();
    const filename = post.title
      ? post.title.replace(/[^a-zA-Z0-9あ-ん]/g, "_")
      : "blog-post";
    const blob = new Blob([content], { type: "text/markdown" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.mdx`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const sandboxTemplates = {
    basic: `import React from 'react';\n\nfunction BlogComponent() {\n  return (\n    <div style={{ padding: '20px', background: '#f5f5f5', borderRadius: '8px', border: '1px solid #ddd' }}>\n      <h2>カスタムコンポーネント</h2>\n      <p>このコンポーネントをMDXの中で使用できます</p>\n    </div>\n  );\n}\n\nexport default BlogComponent;`,
    interactive: `import React, { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  \n  return (\n    <div style={{ padding: '20px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '12px', color: 'white', textAlign: 'center' }}>\n      <h3>インタラクティブカウンター</h3>\n      <p>カウント: {count}</p>\n      <button onClick={() => setCount(count + 1)} style={{ padding: '10px 20px', background: 'white', color: '#667eea', border: 'none', borderRadius: '6px', cursor: 'pointer', margin: '5px' }}>+1</button>\n      <button onClick={() => setCount(count - 1)} style={{ padding: '10px 20px', background: 'white', color: '#667eea', border: 'none', borderRadius: '6px', cursor: 'pointer', margin: '5px' }}>-1</button>\n    </div>\n  );\n}\n\nexport default Counter;`,
    chart: `import React from 'react';\n\nfunction SimpleChart({ data = [40, 70, 20, 90, 30] }) {\n  const maxValue = Math.max(...data);\n  \n  return (\n    <div style={{ padding: '20px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', border: '1px solid #e0e0e0' }}>\n      <h4>シンプルチャート</h4>\n      <div style={{ display: 'flex', alignItems: 'end', height: '150px', gap: '8px', padding: '10px 0' }}>\n        {data.map((value, index) => (\n          <div key={index} style={{ background: \`hsl(\${index * 60}, 70%, 60%)\`, height: \`\${(value / maxValue) * 100}%\`, width: '30px', borderRadius: '4px 4px 0 0', display: 'flex', alignItems: 'end', justifyContent: 'center', fontSize: '12px', color: 'white', fontWeight: 'bold' }}>\n            {value}\n          </div>\n        ))}\n      </div>\n    </div>\n  );\n}\n\nexport default SimpleChart;`,
  };

  return (
    <div className={styles.editorContainer}>
      <div className={styles.editorHeader}>
        <div className={styles.headerLeft}>
          <h1>ブログエディター</h1>
          <div className={styles.userInfo}>
            <img
              src={session.user?.image || "/default-avatar.png"}
              alt={session.user?.name || "User"}
              className={styles.userAvatar}
            />
            <span className={styles.userName}>{session.user?.name}</span>
          </div>
        </div>
        <div className={styles.editorControls}>
          <div className={styles.saveStatus}>
            {isAutoSaving ? (
              <span className={styles.saving}>💾 保存中...</span>
            ) : lastSaved ? (
              <span className={styles.saved}>✅ 保存済み</span>
            ) : null}
          </div>
          <button
            onClick={() => setPreview(!preview)}
            className={`${styles.button} ${styles.previewButton}`}
          >
            {preview ? "編集モード" : "プレビュー"}
          </button>
          <button
            onClick={downloadPost}
            className={`${styles.button} ${styles.downloadButton}`}
          >
            ファイルをダウンロード
          </button>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className={`${styles.button} ${styles.logoutButton}`}
          >
            ログアウト
          </button>
        </div>
      </div>
      <div className={styles.editorLayout}>
        {preview ? (
          <div className={styles.previewContainer}>
            <div className={styles.previewHeader}>
              <h2>プレビュー</h2>
              {isPreviewLoading && (
                <div className={styles.loading}>読み込み中...</div>
              )}
            </div>
            <div className={styles.previewContent}>
              <div className={`${styles.postHeader} ${styles.previewMeta}`}>
                <h1>{post.title || "記事タイトル"}</h1>
                <p>{post.description || "記事の説明"}</p>
                <div className={styles.previewTags}>
                  <span className={styles.label}>タグ:</span>
                  {post.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
                <time className={styles.date}>
                  {new Date(post.date).toLocaleDateString("ja-JP")}
                </time>
              </div>
              <div
                dangerouslySetInnerHTML={{ __html: previewContent }}
                className={styles.markdownContent}
              />
            </div>
          </div>
        ) : (
          <>
            <div className={styles.formContainer}>
              <div className={styles.formSection}>
                <label className={styles.label}>記事タイトル</label>
                <input
                  type="text"
                  value={post.title}
                  onChange={(e) => setPost({ ...post, title: e.target.value })}
                  className={styles.input}
                  placeholder="記事のタイトルを入力..."
                />
              </div>
              <div className={styles.formSection}>
                <label className={styles.label}>公開日</label>
                <input
                  type="date"
                  value={post.date}
                  onChange={(e) => setPost({ ...post, date: e.target.value })}
                  className={styles.input}
                />
              </div>
              <div className={styles.formSection}>
                <label className={styles.label}>記事の説明</label>
                <textarea
                  value={post.description}
                  onChange={(e) =>
                    setPost({ ...post, description: e.target.value })
                  }
                  className={styles.textarea}
                  placeholder="記事の説明を入力..."
                  rows={3}
                />
              </div>
              <div className={styles.formSection}>
                <label className={styles.label}>タグ（カンマ区切り）</label>
                <input
                  type="text"
                  value={post.tags.join(", ")}
                  onChange={(e) =>
                    setPost({
                      ...post,
                      tags: e.target.value
                        .split(",")
                        .map((tag) => tag.trim())
                        .filter((tag) => tag),
                    })
                  }
                  className={styles.input}
                  placeholder="タグ1, タグ2, タグ3"
                />
              </div>
            </div>
            <div className={styles.editorContainer}>
              <div className={styles.editorHeader}>
                <h3>記事内容</h3>
                <div className={styles.editorFeatures}>
                  <button
                    className={`${styles.buttonSmall} ${styles.insertButton}`}
                    onClick={() => {
                      const textarea = document.querySelector(
                        "textarea",
                      ) as HTMLTextAreaElement;
                      const start = textarea.selectionStart;
                      const end = textarea.selectionEnd;
                      const text = textarea.value;
                      const beforeText = text.substring(0, start);
                      const afterText = text.substring(end);
                      const selectedText = text.substring(start, end);
                      const newText =
                        beforeText + `**${selectedText}**` + afterText;
                      setPost({ ...post, content: newText });
                    }}
                  >
                    太字
                  </button>
                </div>
              </div>
              <textarea
                value={post.content}
                onChange={(e) => setPost({ ...post, content: e.target.value })}
                className={styles.textareaLarge}
                placeholder="記事の内容をMarkdown形式で入力..."
                style={{ minHeight: "400px" }}
              />
            </div>
          </>
        )}
        <div className={styles.sandboxContainer}>
          <div className={styles.sandboxHeader}>
            <h3>サンドボックス</h3>
            <p>カスタムコンポーネントを作成してMDX記事で使用できます</p>
          </div>
          <div className={styles.templateButtons}>
            {Object.entries(sandboxTemplates).map(([name, template]) => (
              <button
                key={name}
                onClick={() => setSandboxCode(template)}
                className={`${styles.buttonSmall} ${styles.templateButton}`}
              >
                {name === "basic"
                  ? "基本コンポーネント"
                  : name === "interactive"
                    ? "インタラクティブ"
                    : "チャート"}
              </button>
            ))}
          </div>
          <div className={styles.codeEditor}>
            <label className={styles.label}>Reactコンポーネントコード</label>
            <textarea
              value={sandboxCode}
              onChange={(e) => setSandboxCode(e.target.value)}
              className={styles.codeBox}
              placeholder="Reactコンポーネントのコードを入力..."
              style={{ minHeight: "200px" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
