import { DocumentNode } from 'graphql';
import { draftMode } from 'next/headers';

type FetchGraphQLOptions<T> = {
  query: DocumentNode;
  variables?: Record<string, any>;
  isDraft?: boolean;
};

export async function fetchGraphQL<T>({
  query,
  variables,
}: FetchGraphQLOptions<T>): Promise<{ data: T }> {
  const { isEnabled } = draftMode();

  const res = await fetch(
    process.env.NEXT_PUBLIC_WORDPRESS_API_URL!,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: query.loc?.source.body,
        variables,
      }),
      // isEnabled (プレビューモード) の場合はキャッシュしない
      cache: isEnabled ? 'no-store' : 'force-cache',
    }
  );

  if (!res.ok) {
    // エラーハンドリングを改善
    const errorBody = await res.text();
    console.error(`GraphQL fetch failed: ${res.status} ${res.statusText}`, {
      errorBody,
    });
    throw new Error('Failed to fetch API');
  }

  const json = await res.json();
  if (json.errors) {
    console.error('GraphQL Errors:', json.errors);
    throw new Error('Failed to fetch API');
  }

  return json;
}