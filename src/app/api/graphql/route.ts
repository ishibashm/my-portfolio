import { NextRequest, NextResponse } from "next/server";

// このルートは WordPress への GraphQL プロキシ。無認証で公開すると、
// インターネット上の誰でも WordPress へ任意のクエリを送れてしまう
// （ユーザー情報の列挙や、高負荷クエリによるDoSの恐れ）。
// そのためサーバー間通信用の共有シークレットを必須にしている。
// 呼び出し側は X-Headless-Secret-Key ヘッダに HEADLESS_SECRET を付与すること。
export async function POST(req: NextRequest) {
  const expectedSecret = process.env.HEADLESS_SECRET;

  // シークレット未設定の環境で、誤って口を開けたままにしないよう拒否する
  if (!expectedSecret) {
    console.error("HEADLESS_SECRET is not configured");
    return NextResponse.json(
      { error: "GraphQL proxy is not configured" },
      { status: 503 },
    );
  }

  if (req.headers.get("X-Headless-Secret-Key") !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { query, variables } = await req.json();
  const wordpressApiUrl = process.env.WORDPRESS_API_URL;

  if (!wordpressApiUrl) {
    return NextResponse.json(
      { error: "WORDPRESS_API_URL is not defined" },
      { status: 500 },
    );
  }

  try {
    const response = await fetch(wordpressApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("WordPress API Error:", errorText);
      return NextResponse.json(
        { error: `WordPress API Error: ${response.statusText}` },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Fetch failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch from WordPress API" },
      { status: 500 },
    );
  }
}
