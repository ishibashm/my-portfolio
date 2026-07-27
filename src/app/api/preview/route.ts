import { draftMode } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const slug = searchParams.get("slug");

  const expectedSecret = process.env.WORDPRESS_PREVIEW_SECRET;

  // シークレット未設定の環境では、誰でもプレビューに入れる状態を避けるため拒否する
  if (!expectedSecret) {
    console.error("WORDPRESS_PREVIEW_SECRET is not configured");
    return new Response("Preview is not configured", { status: 503 });
  }

  if (secret !== expectedSecret) {
    return new Response("Invalid token", { status: 401 });
  }

  // Cookieを手書きせず draftMode() を使う。
  // __prerender_bypass はNext.jsがサーバー側で生成するトークンと突き合わせるため、
  // 固定値を自前でセットする実装ではプレビューが正しく有効にならない。
  const draft = await draftMode();
  draft.enable();

  // slugはユーザー入力。先頭のスラッシュを全て取り除いてから組み立てることで、
  // "//evil.com" のようなプロトコル相対URLで外部サイトへ飛ばされるのを防ぐ
  const safePath = `/${(slug ?? "").replace(/^\/+/, "")}`;

  return NextResponse.redirect(new URL(safePath, request.url));
}
