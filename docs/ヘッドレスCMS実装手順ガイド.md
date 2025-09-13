# Next.js + WordPress ヘッドレスCMS 実装手順ガイド

このドキュメントは、Next.js (App Router) と WordPress を使用してヘッドレスCMSを構築するための、体系的で詳細な実装手順を時系列順にまとめたものである。

## フェーズ1：プロジェクトの初期設定と環境構築

### 1. Next.js プロジェクトの作成
-   `create-next-app` を使用して、TypeScript対応のNext.jsプロジェクトを初期化する。
    ```bash
    npx create-next-app@latest --typescript
    ```

### 2. WordPress 環境の準備
-   **サーバーの構築**: Google Cloud Platform (GCP) などを使用し、WordPressが稼働するサーバーを構築する。（例: BitnamiによるWordPress環境）
-   **IPアドレスの確認**: 構築したサーバーの固定IPアドレス（例: `35.224.211.72`）を確認する。
-   **ドメインの設定**:
    -   **フロントエンド用**: `www.example.com` のような本番ドメインをVercelに向ける。
    -   **WordPress管理画面用**: IPアドレス `http://35.224.211.72` で直接アクセスするか、`cms.example.com` のようなサブドメインをサーバーのIPアドレスに向ける。

### 3. 必要なプラグインのインストール (WordPress)
-   WordPress管理画面にログインし、以下のプラグインをインストール・有効化する。
    -   **WPGraphQL**: WordPressをGraphQLサーバーにするための必須プラグイン。
    -   **Advanced Custom Fields (ACF)**: 柔軟なコンテンツ管理のためのカスタムフィールドを作成する。
    -   **WPGraphQL for Advanced Custom Fields**: ACFで作成したフィールドをGraphQL APIで公開するための連携プラグイン。

### 4. WordPress の基本設定
-   **パーマリンク設定**: 「設定」>「パーマリンク設定」で、「共通設定」を「**投稿名**」に変更する。これにより、URLがシンプルでわかりやすくなる。
-   **GraphQL設定**:
    -   「GraphQL」>「設定」で、「**Enable Public Introspection**」にチェックを入れる。これにより、外部ツール（`graphql-codegen`など）がスキーマ情報を取得できるようになる。

## フェーズ2：フロントエンドとバックエンドの接続

### 5. GraphQL Code Generator の設定
-   GraphQLクエリからTypeScriptの型を自動生成するためのツールを導入する。
-   **パッケージのインストール**:
    ```bash
    pnpm install -D @graphql-codegen/cli @graphql-codegen/client-preset
    ```
-   **設定ファイルの作成 (`codegen.ts`)**:
    -   `schema`: WordPressのGraphQLエンドポイント（例: `http://35.224.211.72/graphql`）を指定する。
    -   `documents`: 型生成の元となるGraphQLクエリファイルの場所（例: `src/queries/**/*.graphql`）を指定する。
    -   `generates`: 生成される型定義ファイルの出力先（例: `src/gql/`）と設定（`preset: 'client'`）を指定する。
-   **`package.json` にスクリプトを追加**:
    ```json
    "scripts": {
      "codegen": "graphql-codegen --config codegen.ts"
    }
    ```

### 6. データ取得関数の作成 (`fetchGraphQL.ts`)
-   GraphQL APIからデータを取得するための共通関数を作成する。
-   **サーバーサイドとクライアントサイドの考慮**:
    -   サーバーサイド（ビルド時など）では、WordPressのIPアドレスを直接参照する。
    -   クライアントサイド（ブラウザ）では、CORSエラーを回避するためにNext.jsのプロキシ経由でアクセスする。
    -   `typeof window === 'undefined'` で実行環境を判定し、エンドポイントURLを動的に切り替える。
-   **プレビューモードへの対応**: `next/headers` の `draftMode` を使用し、プレビューモードが有効な場合はキャッシュを無効にする（`cache: 'no-store'`）。
-   **クエリのシリアライズ**: `graphql/language/printer` の `print` 関数を使い、`DocumentNode` を正しいクエリ文字列に変換する。

### 7. Next.js のプロキシ設定 (`next.config.js`)
-   クライアントサイドからのCORSエラーを回避するため、APIリクエストをプロキシする設定を追加する。
    ```javascript
    // next.config.js
    async rewrites() {
      return [
        {
          source: '/api/graphql',
          destination: 'http://35.224.211.72/graphql',
        },
      ];
    },
    ```

### 8. パスエイリアスの設定 (`tsconfig.json`)
-   `@/` のような絶対パスでのインポートを可能にするため、`tsconfig.json` を設定する。
    ```json
    // tsconfig.json
    "compilerOptions": {
      "baseUrl": ".",
      "paths": {
        "@/*": ["src/*"]
      }
    }
    ```

## フェーズ3：コンテンツの実装

### 9. GraphQLクエリの作成 (中央集権型)
-   `src/queries` ディレクトリを作成し、その中に機能ごと（`page`, `post`, `home`など）にサブディレクトリを作成する。
-   各GraphQLクエリを、意味のある名前（例: `PageBySlug.graphql`）を付けた `.graphql` ファイルとして保存する。
    -   この時点で、WordPressに存在するフィールドのみをクエリするように注意する。

### 10. 型定義の生成
-   `.graphql` ファイルを作成・更新するたびに、以下のコマンドを実行してTypeScriptの型を再生成する。
    ```bash
    pnpm run codegen
    ```

### 11. ページとコンポーネントの実装
-   **動的ページの作成**:
    -   `src/app/blog/[slug]/page.tsx` のような動的ルートを作成する。
    -   `generateMetadata` とページコンポーネントの両方で `fetchGraphQL` を呼び出し、データを取得する。
-   **Next.js 15への対応**:
    -   ページコンポーネントを `async` 関数として宣言する。
    -   `params` と `searchParams` の型を `Promise` でラップし、`await` で値を取り出す。
-   **コンポーネントの作成**:
    -   取得したデータを表示するためのReactコンポーネント（例: `PostTemplate.tsx`）を作成する。
    -   `props` の型は、`codegen` が生成した型（例: `PostBySlugQuery`）を利用して定義する。

## フェーズ4：デプロイと運用

### 12. Vercel へのデプロイ
-   **プロジェクトのインポート**: GitHubリポジトリをVercelにインポートする。
-   **環境変数の設定**:
    -   `NEXT_PUBLIC_WORDPRESS_API_URL`: **プロキシのURL**（例: `https://your-project.vercel.app/api/graphql`）を設定する。
    -   `WORDPRESS_PREVIEW_SECRET` など、プレビュー機能に必要なシークレットキーを設定する。
-   **ビルドとデプロイ**: `git push` をトリガーとして、自動ビルドとデプロイを実行する。

### 13. ビルドエラーのトラブルシューティング
-   ビルドエラーが発生した場合は、Vercelのログを注意深く読み解き、原因を特定する。
    -   **`Module not found`**: `tsconfig.json` の設定や `import` パスが正しいか確認する。
    -   **`has no exported member`**: `codegen` が成功しているか、`documents` の設定が正しいか確認する。
    -   **`Cannot query field`**: WordPress側のスキーマとフロントエンドのクエリが一致しているか確認する。
    -   **`... does not satisfy the constraint`**: Next.jsのバージョンアップによる仕様変更（非同期APIなど）に対応できているか確認する。
    -   **CORS / 401 / 500 エラー**: APIへのアクセス経路（プロキシ、直接アクセス）や、WordPress側の設定（CORS, ファイアウォール）を見直す。

### 14. 動作確認
-   デプロイされたサイトにアクセスし、すべてのページが正しく表示・動作することを確認する。
-   ISR（Incremental Static Regeneration）が機能しているか、WordPressでコンテンツを更新して確認する。

## フェーズ5：機能拡張（デザイン復元など）

### 15. カスタムフィールドによるデザイン復元
-   **WordPress側**: ACFでカスタムフィールド（`heroTitle`など）を作成し、GraphQLで公開する設定を行う。
-   **フロントエンド側**:
    1.  対応する `.graphql` ファイルを更新し、カスタムフィールドを取得するクエリを追加する。
    2.  `pnpm run codegen` を実行して型定義を更新する。
    3.  コンポーネントを修正し、取得したカスタムフィールドのデータを表示してデザインを復元する。
    4.  `git push` して変更をデプロイする。