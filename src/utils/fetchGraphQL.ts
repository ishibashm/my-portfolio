import { DocumentNode } from 'graphql';
import { draftMode } from 'next/headers';
import { print } from 'graphql/language/printer'; // printをインポート

type FetchGraphQLOptions<T> = {
  query: DocumentNode;
  variables?: Record<string, any>;
};

export async function fetchGraphQL<T>({
  query,
  variables,
}: FetchGraphQLOptions<T>): Promise<{ data: T }> {
  const { isEnabled } = await draftMode();

  const endpoint =
    typeof window === 'undefined'
      ? 'http://35.224.211.72/graphql'
      : '/api/graphql';

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: print(query), // print関数でクエリ文字列に変換
      variables,
    }),
    cache: isEnabled ? 'no-store' : 'force-cache',
  });

  if (!res.ok) {
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