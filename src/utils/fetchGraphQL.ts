import { DocumentNode } from "graphql";
import { draftMode } from "next/headers";
import { print } from "graphql/language/printer";

type FetchGraphQLOptions = {
  query: DocumentNode | string;
  variables?: Record<string, unknown>;
};

export async function fetchGraphQL<T>({
  query,
  variables,
}: FetchGraphQLOptions): Promise<{ data: T }> {
  const { isEnabled } = await draftMode();

  const endpoint =
    typeof window === "undefined"
      ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/graphql`
      : "/api/graphql";

  const queryString = typeof query === "string" ? query : print(query);

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // /api/graphql は認証必須。サーバー側でのみ使う共有シークレットを付与する
      "X-Headless-Secret-Key": process.env.HEADLESS_SECRET ?? "",
    },
    body: JSON.stringify({
      query: queryString,
      variables,
    }),
    cache: isEnabled ? "no-store" : "force-cache",
  });

  if (!res.ok) {
    const errorBody = await res.text();
    console.error(`GraphQL fetch failed: ${res.status} ${res.statusText}`, {
      errorBody,
    });
    throw new Error("Failed to fetch API");
  }

  const json = await res.json();
  if (json.errors) {
    console.error("GraphQL Errors:", json.errors);
    throw new Error("Failed to fetch API");
  }

  return json;
}
