import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { query, variables } = await req.json();
  const wordpressApiUrl = process.env.WORDPRESS_API_URL;

  if (!wordpressApiUrl) {
    return NextResponse.json(
      { error: 'WORDPRESS_API_URL is not defined' },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(wordpressApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('WordPress API Error:', errorText);
      return NextResponse.json(
        { error: `WordPress API Error: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Fetch failed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch from WordPress API' },
      { status: 500 }
    );
  }
}