import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const slug = searchParams.get('slug');

  if (secret !== process.env.WORDPRESS_PREVIEW_SECRET) {
    return new Response('Invalid token', { status: 401 });
  }

  const response = NextResponse.redirect(new URL(`/${slug || ''}`, request.url));

  // プレビューモードを有効にするCookieを設定
  response.cookies.set('__prerender_bypass', '1');
  response.cookies.set('__next_preview_data', '{"preview":true}');

  return response;
}
