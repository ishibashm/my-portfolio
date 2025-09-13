import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  // ローカルのプロキシ経由でスキーマを取得
  schema: 'http://localhost:3000/api/graphql',
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
