import { DocumentNode } from 'graphql';

type FetchGraphQLOptions<T> = {
  query: DocumentNode;
  variables?: Record<string, any>;
};

export async function fetchGraphQLClient<T>({
  query,
  variables,
}: FetchGraphQLOptions<T>): Promise<{ data: T }> {
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
      // クライアントサイドでは常にキャッシュしない
      cache: 'no-store',
    }
  );

  if (!res.ok) {
    const errorBody = await res.text();
    console.error(`GraphQL client fetch failed: ${res.status} ${res.statusText}`, {
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