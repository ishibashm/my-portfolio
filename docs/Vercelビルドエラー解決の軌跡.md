# Vercelビルドエラー解決の軌跡

このドキュメントは、Next.jsプロジェクトのVercelへのデプロイ時に発生した一連のビルドエラーと、その解決に至るまでのデバッグプロセスを記録したものである。

## 根本原因：期待値のズレ

すべてのエラーの根底には、**「フロントエンドのコードが持っていた期待値」**と**「バックエンドやビルド環境が提供する現実」**との間のズレが存在した。

-   **データ構造のズレ**: フロントエンドは、実際のWordPressに存在しないカスタムフィールドやカスタム投稿タイプを要求していた。
-   **設定のズレ**: `tsconfig.json` や `codegen.ts` の設定が不完全で、ビルドツールが正しく動作していなかった。
-   **仕様のズレ**: Next.js 15の非同期API（`params`, `searchParams`, `draftMode`）への追従ができていなかった。

## エラーと解決のタイムライン

### 1. `socket hang up` (codegen)

-   **エラー**: `graphql-codegen` がスキーマを取得できずに失敗。
-   **原因**: `codegen.ts` が参照していたスキーマURLが間違っていた。
-   **解決策**: `codegen.ts` の `schema` URLを、正しいWordPressのIPアドレス `http://35.224.211.72/graphql` に修正した。

### 2. `GraphQL Document Validation failed`

-   **エラー**: フロントエンドのクエリと、実際のバックエンドのスキーマが一致しない。
-   **原因**: フロントエンドが、WordPressに存在しないカスタムフィールド（`homeFields`など）やカスタム投稿タイプ（`portfolio`）を要求していた。
-   **解決策**:
    -   プレビュー機能で使われていた `login` ミューテーションを、実際に存在する `loginWithCookies` に修正しようとしたが、認証プラグイン自体が存在しなかった。
    -   **暫定対応**: ビルドを通すため、プレビュー機能の認証処理を一時的に無効化した。
    -   **根本対応**: すべてのGraphQLクエリから、存在しないカスタムフィールドとカスタム投稿タイプへの参照を削除した。

### 3. `Module not found`

-   **エラー**: ビルド時に、指定されたモジュール（ファイル）が見つからない。
-   **原因**:
    1.  `tsconfig.json` のパスエイリアス設定（`baseUrl`, `paths`）が不完全だった。
    2.  GraphQLクエリの管理方法を `.ts` ファイルから `.graphql` ファイルにリファクタリングした際、`import` 文の修正が漏れていた。
-   **解決策**:
    -   `tsconfig.json` に正しい `baseUrl` と `paths` を設定した。
    -   エラーが発生したすべてのページ/コンポーネントで、`import` 文を新しいファイル構造に合わせて修正した。
    -   リファクタリングで不要になった古い `.ts` 形式のクエリファイルを削除した。

### 4. `Type error: ... does not satisfy the constraint`

-   **エラー**: `params` や `searchParams` の型が一致しない。
-   **原因**: Next.js 15の仕様変更により、`params` と `searchParams` が非同期の `Promise` になったことにコードが対応していなかった。
-   **解決策**: 該当するすべてのページコンポーネントで、`props` の型定義を `Promise` でラップし、コンポーネント内で `await` を使って値を取り出すように修正した。

### 5. `You're importing a component that needs "next/headers"`

-   **エラー**: クライアントコンポーネント (`Navigation.tsx`) が、サーバーコンポーネント専用の `draftMode` を間接的に呼び出していた。
-   **原因**: サーバー/クライアント両方から使われる `fetchGraphQL.ts` が、サーバー専用の `draftMode` を含んでいたため。
-   **解決策**:
    -   クライアントサイド専用の `fetchGraphQL-client.ts` を作成。
    -   `Navigation.tsx` が `fetchGraphQL-client.ts` を使うように修正した。

### 6. `405 Method Not Allowed` / `401 Unauthorized` / `500 Internal Server Error` (SSG)

-   **エラー**: 静的ページ生成時にAPIへのアクセスが失敗する。
-   **原因**:
    1.  VercelのDeployment Protectionが、ビルド中の内部APIアクセスをブロックしていた。
    2.  Next.jsのリライト機能（プロキシ）が、サーバーサイドのビルドプロセスではうまく機能しなかった。
-   **解決策**:
    -   **最終的な解決策**: `fetchGraphQL.ts` を修正し、実行環境を判定して、サーバーサイド（ビルド時）ではWordPressのIPアドレスを直接参照し、クライアントサイド（ブラウザ）ではプロキシパスを参照するように動的にURLを切り替えるロジックを実装した。
    -   （この過程で、WordPressの管理画面にアクセスできない問題も特定し、`wp-config.php` の修正やファイアウォール設定の確認を行った。）

### 7. `GraphQL Request must include ... "query"`

-   **エラー**: GraphQL APIに送信するリクエストボディから `query` が欠落している。
-   **原因**: `codegen` が生成した `DocumentNode` オブジェクトを、`print` 関数を使わずに文字列化しようとしていたため。
-   **解決策**: `fetchGraphQL.ts` と `fetchGraphQL-client.ts` で、`graphql/language/printer` の `print` 関数を使って `DocumentNode` を正しくクエリ文字列に変換するように修正した。

## 教訓

この一連のデバッグから得られた最大の教訓は、**モダンなWeb開発における「構成」の重要性**である。コードそのものだけでなく、`tsconfig.json`, `codegen.ts`, `next.config.js` といった設定ファイル、そしてVercelやGCPの環境設定、WordPressのプラグイン構成など、すべてが正しく連携して初めてアプリケーションは安定して動作する。

問題が発生した際は、エラーメッセージを注意深く読み解き、どのレイヤー（フロントエンドのコード、ビルドツールの設定、バックエンドのスキーマ、インフラ環境）で問題が起きているのかを体系的に切り分けることが、迅速な解決への鍵となる。