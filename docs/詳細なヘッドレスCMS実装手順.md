# Next.js と WordPress によるヘッドレスCMSの体系的実装ガイド

## 1. 序論

### 1.1. 本ドキュメントの目的
このドキュメントは、Next.js (App Router) をフロントエンド、WordPressをバックエンドとして使用するヘッドレスCMSアーキテクチャの構築における、体系的かつ詳細な実装手順を定義するものである。各ステップにおける技術的背景、具体的なコマンド、設定ファイルの意図、および潜在的な問題点を明確に記述することで、再現性の高い開発プロセスを提供することを目的とする。

### 1.2. アーキテクチャ概要
本プロジェクトで採用するアーキテクチャは、以下のコンポーネントで構成される。
-   **フロントエンド**: Next.js (App Router) を使用し、Vercelにデプロイする。静的サイト生成 (SSG) とインクリメンタル静的再生成 (ISR) を活用し、パフォーマンスとコンテンツの鮮度を両立させる。
-   **バックエンド**: WordPressをヘッドレスCMSとして利用し、Google Cloud Platform (GCP) 上のVMインスタンスで稼働させる。コンテンツ管理とデータ提供のみに責務を限定する。
-   **API**: WPGraphQLプラグインを利用して、WordPressのコンテンツをGraphQL APIとして公開する。フロントエンドは、このAPIを通じてデータを取得する。
-   **データフロー**: フロントエンドはビルド時（SSG）またはリクエスト時（ISR）にGraphQL APIからデータを取得してページを生成する。クライアントサイドでのデータ取得は最小限に留める。

---

## 2. フェーズ1：環境構築と初期設定

### 2.1. フロントエンドプロジェクトの初期化
`create-next-app` を使用して、TypeScriptを有効にしたNext.jsプロジェクトのスケルトンを生成する。

```bash
# 最新のNext.jsバージョンを指定し、TypeScript, ESLint, Tailwind CSSを有効化してプロジェクトを作成
npx create-next-app@latest my-portfolio --typescript --eslint --tailwind --app
```
-   `--typescript`: TypeScriptを導入し、`tsconfig.json` を自動生成する。静的型付けによる開発時のエラー検出とコード補完の強化を目的とする。
-   `--app`: App Routerを有効にする。React Server Components (RSC) を活用した最新のアーキテクチャを採用する。

### 2.2. バックエンド環境の構築 (GCP + Bitnami)
1.  **VMインスタンスの作成**: GCP Marketplaceから「WordPress Certified by Bitnami and Automattic」を選択し、VMインスタンスをデプロイする。この際、固定の外部IPアドレスをインスタンスに割り当てる。このIPアドレス（例: `35.224.211.72`）が、バックエンドの永続的なアドレスとなる。
2.  **ファイアウォールルールの設定**: GCPのVPCネットワーク > ファイアウォール設定で、HTTP (TCP:80) および HTTPS (TCP:443) のトラフィックを許可するルールを作成する。ソースIP範囲を `0.0.0.0/0` に設定し、すべての外部アクセスを許可する。作成したルールをVMインスタンスのネットワークタグに適用する。これにより、外部からWordPressサーバーへのアクセスが可能になる。

### 2.3. WordPressプラグインのセットアップ
WordPressをヘッドレスCMSとして機能させるために不可欠なプラグインをインストールし、有効化する。
-   **WPGraphQL**: WordPressのデータモデル（投稿、固定ページ、ユーザーなど）をGraphQLスキーマに変換し、単一のエンドポイント（`/graphql`）を通じて公開する。
-   **Advanced Custom Fields (ACF)**: WordPressの標準エディタでは表現できない、構造化されたコンテンツ（例: ヒーローセクションの各要素）を定義するためのカスタムフィールドを作成する。
-   **WPGraphQL for Advanced Custom Fields**: ACFで作成したカスタムフィールドグループと各フィールドを、WPGraphQLのスキーマに自動的に追加し、API経由で取得可能にするための連携プラグイン。

### 2.4. WordPressの基本設定
1.  **パーマリンク設定**: 「設定」>「パーマリンク設定」で、「共通設定」を「**投稿名**」に変更する。これにより、REST APIやGraphQLのスラッグ解決が安定し、URL構造が `http://<IP_ADDRESS>/<POST_SLUG>/` のように予測可能になる。
2.  **GraphQL設定**:
    -   「GraphQL」>「設定」で、「**Enable Public Introspection**」を有効化する。GraphQLのイントロスペクション機能は、APIスキーマ自体を問い合わせるためのメカニズムである。これを公開することで、外部のツール（`graphql-codegen`など）が認証なしでスキーマ定義を取得できるようになり、型生成プロセスが簡素化される。本番環境ではセキュリティリスクになり得るが、ヘッドレス構成ではスキーマの公開が開発効率を大幅に向上させる。

---

## 3. フェーズ2：フロントエンド・バックエンド間の接続確立

### 3.1. GraphQL Code Generator の導入と設定
GraphQLクエリからTypeScriptの型定義を自動生成し、型安全なデータアクセスを実現する。
1.  **パッケージのインストール**:
    ```bash
    # CLI本体と、最新のクライアント向け設定プリセットをインストール
    pnpm install -D @graphql-codegen/cli @graphql-codegen/client-preset
    # DocumentNodeを文字列に変換するために必要
    pnpm install graphql
    ```
2.  **設定ファイル (`codegen.ts`) の作成**:
    ```typescript
    import { CodegenConfig } from '@graphql-codegen/cli';

    const config: CodegenConfig = {
      // スキーマの取得先。WordPressのIPアドレスを直接指定する
      schema: 'http://35.224.211.72/graphql',
      // 型生成の対象となるクエリが記述されたファイルの場所をglobパターンで指定
      documents: ['src/queries/**/*.graphql'],
      generates: {
        './src/gql/': {
          // Reactクライアント向けの最適な設定を自動で行うプリセット
          preset: 'client',
          plugins: [],
          presetConfig: {
            gqlTagName: 'gql',
          },
        },
      },
      // documentsで指定した場所にファイルがなくてもエラーにしない
      ignoreNoDocuments: true,
    };

    export default config;
    ```
3.  **`package.json` へのスクリプト追加**:
    -   `build` スクリプトの前に `codegen` を実行するよう設定し、ビルドが常に最新の型定義に基づいて行われることを保証する。
    ```json
    "scripts": {
      "codegen": "graphql-codegen --config codegen.ts",
      "build": "pnpm run codegen && next build"
    }
    ```

### 3.2. データ取得ロジックの実装
APIリクエストを一元管理し、環境差異を吸収するための共通関数を実装する。
1.  **サーバーサイド用 (`src/utils/fetchGraphQL.ts`)**:
    -   `next/headers` の `draftMode` を `await` で解決し、プレビューモードの状態を取得する。
    -   `cache` オプションを、プレビューモードでは `'no-store'`、通常時は `'force-cache'` に設定し、Next.jsのデータキャッシュ機構を制御する。
    -   `graphql/language/printer` の `print` 関数を使用し、`DocumentNode` 型のクエリを文字列にシリアライズしてリクエストボディに含める。
2.  **クライアントサイド用 (`src/utils/fetchGraphQL-client.ts`)**:
    -   サーバー専用API（`next/headers`）への依存を完全に排除する。
    -   `cache` オプションは常に `'no-store'` とし、クライアントからの動的なリクエストに対応する。
    -   エンドポイントとして、後述するNext.jsのプロキシパス (`/api/graphql`) を使用する。

### 3.3. APIプロキシとパスエイリアスの設定
ビルド環境とコードの可読性を整備する。
1.  **APIプロキシ (`next.config.js`)**:
    -   クライアントサイドから外部API（WordPress）への直接リクエストは、ブラウザの同一オリジンポリシーによりCORSエラーを引き起こす。これを回避するため、Next.jsの `rewrites` 機能を利用してプロキシを設定する。`/api/graphql` へのリクエストを、サーバーサイドで `http://35.224.211.72/graphql` に転送する。
2.  **パスエイリアス (`tsconfig.json`)**:
    -   `"baseUrl": "."` と `"paths": { "@/*": ["src/*"] }` を設定する。これにより、`../../components/` のような深い相対パスの代わりに `@/components/` という直感的な絶対パスでのモジュールインポートが可能になり、コードの可読性と保守性が向上する。

---

## 4. フェーズ3：コア機能の実装

### 4.1. GraphQLクエリの中央集権化
-   **ディレクトリ構造**: `src/queries` ディレクトリを作成し、`page`, `post`, `home` のように、関連するデータごとにサブディレクトリを設ける。
-   **ファイル形式**: すべてのGraphQLクエリを、操作名（例: `PageBySlug`）をファイル名とした `.graphql` ファイルとして保存する (`PageBySlug.graphql`)。このアプローチにより、`codegen.ts` の `documents` 設定が単純化され、クエリの再利用性と管理性が向上する。

### 4.2. ページの動的生成 (App Router)
1.  **型定義の生成**: `.graphql` ファイルを作成・更新後、`pnpm run codegen` を実行し、`src/gql/` ディレクトリに最新の型定義を生成する。
2.  **ページコンポーネントの実装 (`src/app/blog/[slug]/page.tsx`)**:
    -   `codegen` が生成した `...Document`（クエリ本体）と `...Query`（クエリ結果の型）を `@/gql/graphql` からインポートする。
    -   ページコンポーネントを `async` 関数として定義する。
    -   `params` プロパティの型を `Promise` でラップし (`{ params: Promise<{ slug: string }> }`)、`await` で値を取得する。
    -   `fetchGraphQL` を使用してデータを取得し、結果を表示用のテンプレートコンポーネントに `props` として渡す。
    -   `generateMetadata` 関数も同様に `async` とし、`params` を `await` してデータを取得し、動的なメタデータ（タイトル、ディスクリプション）を生成する。

---

## 5. フェーズ4：デプロイとトラブルシューティング

### 5.1. Vercelへのデプロイ
1.  **GitHubリポジトリの連携**: Vercelのダッシュボードから、プロジェクトのGitHubリポジトリをインポートする。
2.  **環境変数の設定**:
    -   `NEXT_PUBLIC_WORDPRESS_API_URL`: **プロキシのURL** (`https://<your-project>.vercel.app/api/graphql`) を設定する。これはクライアントサイドで参照される。
    -   `WORDPRESS_PREVIEW_SECRET`: プレビューモード用の推測されにくい秘密の文字列を設定する。
3.  **デプロイの実行**: `git push` をトリガーとして、VercelのCI/CDパイプラインが自動的にビルドとデプロイを実行する。

### 5.2. ビルドエラーの体系的トラブルシューティング
ビルドエラーは、ログを精読し、どのプロセスで失敗したかを特定することが重要である。
-   **`codegen` 段階のエラー**:
    -   `socket hang up`, `ECONNREFUSED`: `codegen.ts` の `schema` URLが間違っているか、バックエンドサーバーに到達できない。IPアドレスやファイアウォール設定を確認する。
    -   `Validation failed`: `documents` 内のクエリがスキーマ定義に違反している。WordPress側のプラグイン設定（ACFのGraphQL公開設定など）や、クエリ内のフィールド名を確認する。
-   **`next build` 段階のエラー**:
    -   `Module not found`: `tsconfig.json` のパスエイリアス設定や、`import` 文のパスが正しいか確認する。
    -   `Type error`: `codegen` が最新でない可能性がある。ローカルで `pnpm run codegen` を実行し、生成された型とコンポーネントの `props` の型が一致しているか確認する。Next.jsのバージョンアップに伴う破壊的変更（非同期APIなど）も疑う。
    -   `fetch failed`: SSG/ISRプロセス中にAPIアクセスで失敗している。`fetchGraphQL` のURL切り替えロジックや、VercelのDeployment Protectionなどのインフラ設定を確認する。

---

## 6. フェーズ5：機能拡張と運用

### 6.1. WordPressバックエンドのヘッドレス化
-   **テーマの無効化**: SSHでサーバーに接続し、`wp-content/themes` 内のテーマディレクトリ名を変更する (`mv <theme> <theme>_disabled`)。これにより、WordPressのフロントエンド表示機能が無効化され、純粋なAPIサーバーとしてのみ機能するようになり、意図しないコンテンツの公開を防ぐ。

### 6.2. 機能追加（例: お問い合わせフォーム）
1.  **ライブラリのインストール**: `pnpm install react-hook-form`
2.  **外部サービスの利用**: Formspreeなどのフォームバックエンドサービスに登録し、エンドポイントURLを取得する。
3.  **コンポーネント作成**: `react-hook-form` を使用してフォームのUIとバリデーションを実装し、`onSubmit` で `fetch` を使ってFormspreeのエンドポイントにデータを送信するクライアントコンポーネントを作成する。
4.  **組み込み**: 作成したフォームコンポーネントを、任意のページ（例: `page.tsx` のフッター）に配置する。