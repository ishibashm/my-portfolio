import { CodegenConfig } from '@graphql-codegen/cli';

// Vercelのビルド環境ではNEXT_PUBLIC_WORDPRESS_API_URLを使い、
// ローカルではプロキシ（localhost）を使うように動的に切り替え
const schema =
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
  'http://localhost:3000/api/graphql';

const config: CodegenConfig = {
  schema,
  documents: ['src/queries/**/*.graphql'],
  generates: {
    './src/gql/': {
      preset: 'client',
      plugins: [],
      presetConfig: {
        gqlTagName: 'gql',
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
