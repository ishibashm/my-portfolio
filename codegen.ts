import { CodegenConfig } from '@graphql-codegen/cli';

// Vercelのビルド環境でも、認証不要なオリジナルのIPアドレスを直接参照する
const schema = 'http://35.224.211.72/graphql';

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
