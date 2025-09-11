# ポートフォリオサイト

Next.jsとTypeScriptで構築された、ヘッドレスCMSとしてWordPressを使用したポートフォリオサイトです。

## 🚀 現在の状態

- **デプロイ**: Vercelにデプロイ済み
- **フロントエンド**: Next.js 15.5.3
- **言語**: TypeScript
- **スタイリング**: CSS Modules
- **CMS**: WordPress（ヘッドレスCMSとして使用予定）

## 📋 技術スタック

### フロントエンド
- **Next.js** - Reactフレームワーク
- **TypeScript** - 型安全なJavaScript
- **GraphQL** - WordPressとの通信
- **CSS Modules** - スコープ付きCSS

### CMS（計画中）
- **WordPress** - ヘッドレスCMSとして使用
- **WP GraphQL** - WordPressのGraphQL APIプラグイン

## 🔧 開発環境のセットアップ

### 必要な環境
- Node.js 18以上
- npmまたはyarn

### インストール
```bash
# リポジトリのクローン
git clone [repository-url]
cd my-portfolio

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

### 環境変数の設定
`.env.local`ファイルを作成し、以下の環境変数を設定：

```env
NEXT_PUBLIC_WORDPRESS_API_URL="http://your-wordpress-site.com"
NEXT_PUBLIC_WORDPRESS_API_HOSTNAME="your-wordpress-site.com"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

## 🏗️ プロジェクト構造

```
src/
├── app/                    # Next.js App Router
│   ├── [...slug]/         # 動的ページルート
│   ├── api/               # APIルート
│   ├── not-found.tsx      # 404ページ
│   └── page.tsx           # トップページ
├── components/            # Reactコンポーネント
│   ├── Templates/         # ページテンプレート
│   └── UI/                # UIコンポーネント
├── queries/               # GraphQLクエリ
├── utils/                 # ユーティリティ関数
└── gql/                   # GraphQL生成ファイル
```

## 🎯 主な機能

### 現在実装済み
- ✅ レスポンシブデザイン
- ✅ ダークモード対応
- ✅ 404エラーページ
- ✅ プレビューモード
- ✅ サイトマップ生成

### WordPress連携（計画中）
- 🔄 コンテンツ管理
- 🔄 メディア管理
- 🔄 カスタム投稿タイプ
- 🔄 カスタムフィールド
- 🔄 SEO設定

## 🚀 デプロイメント

### Vercel（現在）
現在はVercelにデプロイされています：
- 自動デプロイ：mainブランチへのプッシュ時
- プレビューデプロイ：プルリクエスト時

### WordPress移行計画
将来的には以下の構成に移行予定：

```
WordPress（バックエンド）
↓ GraphQL API
Next.js（フロントエンド）
↓
Vercel（ホスティング）
```

## 📊 パフォーマンス

- **静的サイト生成（SSG）**: ビルド時にページを事前生成
- **画像最適化**: Next.js Imageコンポーネント使用
- **コード分割**: 自動的に最適化
- **キャッシング**: 効率的なキャッシング戦略

## 🔒 セキュリティ

- GraphQLクエリの検証
- 環境変数による機密情報の保護
- セキュアヘッダーの設定

## 📝 ライセンス

このプロジェクトはプライベートリポジトリです。

## 📞 お問い合わせ

ご質問やご提案がございましたら、お気軽にお問い合わせください。

---


