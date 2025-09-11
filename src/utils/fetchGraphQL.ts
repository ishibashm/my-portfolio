import { draftMode } from "next/headers";

// "default" を削除し、関数の前に "export" を付ける
export async function fetchGraphQL<T>(
  query: string,
  variables?: Record<string, any>
): Promise<T> {
  const { isEnabled } = await draftMode();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/graphql`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      cache: isEnabled ? "no-store" : "force-cache",
      body: JSON.stringify({
        query,
        variables,
      }),
    }
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(
      `${res.status} ${res.statusText}: ${body}`
    );
  }

  const json = await res.json();
  if (json.errors) {
    console.error("GraphQL Errors:", json.errors);
    throw new Error("Failed to fetch API");
  }

  return json.data;
}