

# **Next.jsにおけるGraphQL Code Generator統合の包括的診断および解決ガイド：TS2305: Module has no exported memberの解体**

## **序論**

Next.jsプロジェクトのビルドプロセス中に遭遇するFailed to compileというメッセージは、開発ワークフローにおける深刻な障害を示唆します。特に、Type error: Module '"@/gql/graphql"' has no exported member 'PageQuery'というTypeScriptエラー（TS2305）は、単なるコードの構文ミスではなく、自動化された開発ツールチェーン内の根本的な断絶を示唆する重要な兆候です。このエラーは、GraphQL Code Generatorのようなツールによって生成された型定義ファイルから、期待される型をインポートしようとして失敗した典型的なケースです。

本レポートは、この特定のエラーに対する表面的な修正策を提供するだけでなく、その根本原因を深く掘り下げ、関連するツールのメカニズムを解明し、将来的な発生を防ぐための堅牢なベストプラクティスを確立することを目的とします。GraphQL Code Generatorの基本原則を体系的に解説することで、開発者がNext.jsアプリケーションにおいて、自己検証可能でエラー耐性の高いGraphQL統合を構築できるよう支援します。

この問題の核心は、エラーメッセージが表示されるpage.tsxのimport文そのものではなく、その上流のプロセス、すなわちGraphQL Code Generatorが期待される型を生成しなかった点にあります。この視点の転換は、デバッグプロセスをアプリケーションロジックからビルド構成へと正しく方向付け、恒久的な解決策への道筋を照らします。本レポートを通じて、この「症状」の背後にある「病」を診断し、治療するための専門的知見を提供します。

## **第1節 ビルド失敗の解剖学：TS2305エラーの解体**

提供されたエラーログの法医学的分析は、問題の根本原因を特定するための第一歩です。Failed to compile、Type error、そしてModule has no exported memberという一連のメッセージは、ビルドプロセスにおける明確なイベントチェーンを示しています。

TS2305: Module has no exported memberというエラーは、TypeScriptにおける基本的なエラーの一つです。これは、import文がターゲットモジュール内に存在しないエクスポートメンバーにアクセスしようとしていることを意味します 1。つまり、

page.tsxの6行目にあるimport { PageQuery as PageQueryType } from '@/gql/graphql';というコードは、@/gql/graphqlというファイル内にPageQueryという名前でエクスポートされたメンバーが存在しないために失敗しています。

この分析をユーザーのプロジェクトの特定の文脈に適用すると、モジュールパス@/gql/graphqlが「犯行現場」として特定されます。このパスは、GraphQL Code Generatorのようなツールによって生成されたコードの一般的な格納場所です 2。したがって、このファイルは開発者が手動で作成したものではなく、ビルドプロセスの一部として自動生成された成果物であると結論付けられます。

このことから導き出される核心的な結論は、ビルドプロセスが失敗している原因が、GraphQL Code Generatorが実行されたものの、その出力ファイルにPageQuery型を含めなかったことにある、という点です。これにより、問題はランタイムエラーやアプリケーションロジックのエラーではなく、コード生成ステップにおける構成上の問題として明確に特定されます。

コードジェネレータが警告なく失敗することは、「ブラックボックス」的なデバッグの課題を生み出します。開発者は自身が記述していない生成済みファイルを操作することになり、信頼できる情報源（source of truth）がどこにあるのか混乱を招きます。エラーは、その直接的な原因（構成の誤り）から時間的・空間的に離れたビルドプロセス後半で顕在化します。GraphQL Code Generatorは、GraphQL操作のTypeScript型を手動で記述する退屈な作業を抽象化する強力な自動化ツールです 4。この抽象化は諸刃の剣です。正常に機能している間はシームレスですが、失敗すると、開発者は自身が完全には理解していないプロセスの成果物をデバッグすることになります。エラーメッセージは開発者のコンポーネントファイルに表示されますが、修正が必要なのは、その裏で動く自動化ステップを制御する構成ファイル（

codegen.ts）です。この断絶こそが開発における大きな摩擦の原因であり、ツールの内部動作を深く理解することが、単なる応急処置ではなく真の解決に不可欠である理由です。

## **第2節 GraphQL Code Generatorのワークフロー：スキーマから型安全なコードへ**

TS2305エラーの根本原因を理解するためには、GraphQL Code Generatorがどのように機能するか、その「ブラックボックス」を解明する必要があります。このツールは通常、プロジェクトのルートに配置されたcodegen.ts（または.yml）という構成ファイルによって制御されます。このファイルには、コード生成プロセスを導くためのいくつかの重要なプロパティが含まれています。

### **schemaプロパティ**

schemaプロパティは、APIが提供する能力に関する絶対的な情報源（source of truth）です。GraphQLスキーマは、利用可能なすべての型、フィールド、クエリ、ミューテーションを定義します。codegen.tsファイル内で、このプロパティには通常、リモートのGraphQLエンドポイントのURL、またはローカルに保存された.graphqlスキーマファイルへのパスが指定されます 3。ジェネレータは、このスキーマをイントロスペクション（introspection）することで、APIの「全体像」を把握します。

### **documentsプロパティ**

documentsプロパティは、この文脈において最も重要であり、最も誤解されがちな構成です。schemaがAPIの*すべての可能性*を定義するのに対し、documentsはクライアントアプリケーションが*実際に使用する特定の操作*（クエリ、ミューテーション、フラグメント）がどこに記述されているかをジェネレータに伝えます 9。

PageQueryやPageQueryVariablesといった具体的な型が生成されるのは、ジェネレータがこのdocumentsプロパティで指定されたファイルをスキャンし、そこに記述されたGraphQL操作を処理するからです。このプロパティが正しく設定されていない場合、ジェネレータはどの操作に対する型を生成すればよいかを知ることができず、結果として空または不完全な型定義ファイルが出力されます。

### **generatesプロパティ**

generatesプロパティは、生成されるコードの「レシピ」を定義します。このオブジェクトのキーは出力ファイルのパス（例：src/gql/graphql.ts）となり、その値は生成プロセスを制御する詳細な構成です。最も重要なのはplugins配列で、これによりどの種類のコードを生成するかが決まります。一般的なプラグインには、基本的なTypeScript型を生成するtypescriptや、クエリやミューテーションに基づいた型を生成するtypescript-operationsなどがあります 6。近年では、

client-presetというプリセットが推奨されており、これにより複数の必須プラグインがバンドルされ、最新のクライアントサイドアプリケーション向けの構成が簡素化されます 3。

schemaとdocumentsプロパティの間には、根本的な二元性が存在し、これが構成エラーの主要な原因となっています。GraphQLスキーマファイルにはtype Query {... }のような型定義が含まれていますが、クライアントサイドのドキュメントにはquery MyQuery {... }のような具体的な操作が記述されています。開発者は、論理的ではあるものの誤って、スキーマを提供すれば十分だと考えてしまうことがあります。実際、documentsプロパティにスキーマ定義ファイルを指定してしまうという間違いは頻繁に見られます 10。ここで必要とされる概念的な飛躍は、GraphQL Code Generatorが2つの異なる、しかし関連したタスクを実行することを理解することです。第一に、

schemaを解析して型の「宇宙」全体を理解します。第二に、documentsを解析してアプリケーションが使用する特定の操作を見つけ出し、*それらの操作のためだけ*に最適化された型を生成します。PageQueryが見つからないというエラーは、ジェネレータが型の宇宙全体について教えられたものの、生成すべきPageQueryという特定の操作を見せてもらえなかったことの直接的な結果なのです。この点を理解することが、問題全体を解決するための鍵となります。

## **第3節 根本原因の分析：documentsの構成ミスを特定する**

前節での解説に基づき、ユーザーのビルドが失敗している根本原因は、codegen.tsファイル内のdocumentsプロパティが不適切に構成されていることにあると断定できます。この構成ミスには、いくつかの典型的な失敗パターンが存在します。

### **一般的な失敗パターン**

1. **不正確なGlobパターン**: documentsに指定されたglobパターンが、PageQuery操作を含むファイルの実際の場所と一致していません。Next.jsのappルーターとpagesルーターではディレクトリ構造が異なるため、プロジェクトの構成に合わせた正確なパス指定が必要です。例えば、appルーター内のコンポーネントにクエリを配置している場合、documents: \["src/\*\*/\*.tsx"\]のようなパターンでは不十分かもしれません。  
2. **対象ファイルの欠落**: globパターン自体は正しいものの、PageQueryがスキャン対象外のファイルに定義されているケースです。例えば、globが.ts(x)ファイルのみを対象としている場合に、クエリが.jsファイルに記述されていると、ジェネレータはその操作を発見できません。  
3. **スキーマとドキュメントの混同**: これが最も致命的な誤解です。開発者がdocumentsプロパティに、クライアントサイドの操作ファイルではなく、GraphQLスキーマ定義ファイル（例：schema.graphql）へのパスを指定してしまうことがあります 10。前述の通り、  
   documentsはアプリケーションが使用する具体的なクエリやミューテーションを指し示すためのものであり、スキーマ定義を指すものではありません。

### **graphql-tag-pluckの役割**

.tsxのようなコードファイルからGraphQL操作を抽出する際、GraphQL Code Generatorは内部的にgraphql-tag-pluckというライブラリを使用します 9。このツールは、ファイル内のコードを解析し、特定の形式で記述されたGraphQLクエリ文字列を見つけ出します。発見の対象となるのは、主に以下の2つの形式です。

* gqlタグで囲まれたテンプレートリテラル:  
  TypeScript  
  import { gql } from '@apollo/client';

  const PAGE\_QUERY \= gql\`  
    query PageQuery($slug: String\!) {  
      page(where: { slug: $slug }) {  
        id  
        title  
      }  
    }  
  \`;

* /\* GraphQL \*/というマジックコメントが前に付いたテンプレートリテラル:  
  TypeScript  
  const PAGE\_QUERY \= /\* GraphQL \*/\`  
    query PageQuery($slug: String\!) {  
      page(where: { slug: $slug }) {  
        id  
        title  
      }  
    }  
  \`;

これらの規約に従っていないクエリ文字列は、たとえファイルがdocumentsのglobパターンに一致していても、graphql-tag-pluckによって無視され、結果として型が生成されません 9。

### **documents構成の診断リファレンス**

以下の表は、Next.jsプロジェクトにおける一般的なdocuments構成の誤りとその修正方法をまとめたものです。これにより、迅速な診断と修正が可能になります。

| シナリオ / クエリの場所 | 不適切なdocuments構成の例 | 正しいdocuments構成の例 | 根拠と主な考慮事項 |
| :---- | :---- | :---- | :---- |
| クエリを.graphqlファイルで管理 (src/graphql/内) | documents: "src/\*\*/\*.tsx" | documents: "src/graphql/\*\*/\*.graphql" | .graphqlファイルのみをスキャン対象とすることで、スキャンが高速かつ正確になります。コードファイルのスキャンが不要なため、graphql-tag-pluckのオーバーヘッドもありません。 |
| Next.js appルーターのコンポーネントにクエリを併記 | documents: "src/pages/\*\*/\*.tsx" | documents: "src/app/\*\*/\*.{ts,tsx}" | appルーターのディレクトリ構造に合わせてglobパターンを更新する必要があります。pagesルーター用の古いパターンではファイルを見つけられません。 |
| Next.js pagesルーターのコンポーネントにクエリを併記 | documents: "src/app/\*\*/\*.tsx" | documents: "src/pages/\*\*/\*.tsx" | pagesルーターの規約に従い、pagesディレクトリ内をスキャン対象とします。 |
| プロジェクト全体（app, components等）をスキャン | documents: "src/\*\*/\*.ts" | documents: "src/\*\*/\!(\*.d).{ts,tsx}" | プロジェクト全体を対象とする場合、より広範なglobパターンが必要です。\!(\*.d)は、型定義ファイル（.d.ts）をスキャン対象から除外するための一般的なプラクティスです 9。 |
| スキーマ定義ファイルを誤って指定 | documents: "src/schema.graphql" | documents: "src/\*\*/\*.{ts,tsx}" | documentsはクライアントサイドの操作を指すべきです。スキーマファイルはschemaプロパティで指定します。この混同が、型が一切生成されない一般的な原因です 10。 |

この表は、開発者が直面する可能性のある最も一般的な構成ミスを網羅し、それぞれのプロジェクト構造に合わせた具体的で実行可能な解決策を提供します。これにより、抽象的な「globが間違っている」という知識が、コピー＆ペースト可能な具体的な解決策へと変換され、問題解決のプロセスを大幅に加速させます。

## **第4節 診断と解決への体系的アプローチ**

根本原因がdocumentsプロパティの構成ミスにあると特定された今、問題を恒久的に解決するための体系的な手順を以下に示します。このステップバイステップのガイドは、実践的で具体的なチェックリストとして機能します。

1. ステップ1: PageQueryの定義場所を特定する  
   プロジェクトのコードベース全体を検索し、query PageQuery {... }というGraphQL操作が記述されているファイルを正確に特定します。そのファイルの完全なパス（例：src/app/\[...slug\]/page.tsx）をメモします。  
2. ステップ2: codegen.tsを検査する  
   プロジェクトのルートディレクトリにあるGraphQL Code Generatorの構成ファイル（codegen.tsまたはcodegen.yml）を開き、documentsプロパティを見つけます。  
3. ステップ3: Globパターンを検証する  
   ステップ1で特定したファイルのパスと、documentsプロパティに設定されているglobパターンを比較します。パターンがファイルパスと一致するかどうかを確認してください。必要であれば、オンラインのglobテスターなどを使用して、パターンが意図通りに機能しているか検証します。例えば、パターンがsrc/pages/\*\*/\*.tsxで、ファイルがsrc/app/page.tsxにある場合、一致しないことは明らかです。  
4. ステップ4: 構成を修正する  
   documentsプロパティのglobパターンを、ステップ1のファイルを明確に含むように修正します。前節の診断リファレンス表を参考に、プロジェクトのディレクトリ構造に適したパターンを選択してください。  
   同時に、そのファイル内のPageQueryが、graphql-tag-pluckによって発見可能な形式（gqlタグまたは/\* GraphQL \*/マジックコメント）で記述されていることを確認します 9。  
5. ステップ5: 手動で型を再生成する  
   ターミナルで、package.jsonに定義されているコード生成スクリプトを実行します（例：pnpm run generate、npm run codegen、または直接pnpm graphql-codegen）。コマンドの実行中にエラーや警告が表示されないか注意深く観察します。特に「Unable to find any GraphQL type definitions」のようなメッセージは、documentsのパスが依然として間違っていることを示唆しています 10。  
6. ステップ6: 出力ファイルを検証する  
   生成されたファイル（エラーメッセージによれば@/gql/graphql.ts）を開き、export type PageQueryという文字列を検索します。このエクスポート文が存在すれば、修正が成功したことの確たる証拠となります。もし存在しない場合は、ステップ3と4に戻り、globパターンとクエリの形式を再確認してください。  
7. ステップ7: サーバーを再起動し、再ビルドする  
   最終的な手段として、IDEのTypeScript言語サーバーを再起動します（VS Codeでは、コマンドパレットからTypeScript: Restart TS serverを実行）1。これにより、IDEが新しい型定義を確実に認識するようになります。その後、  
   pnpm run buildコマンドを再度実行し、ビルドが正常に完了することを確認します。

これらの手順を体系的に実行することで、TS2305エラーを確実に解決し、GraphQL Code Generatorのパイプラインを正常な状態に復元することができます。

## **第5節 GraphQLワークフローの強化：ベストプラクティスと高度な構成**

TS2305エラーを解決することは重要ですが、それは対症療法に過ぎません。真の目標は、この種のエラーが将来的に発生するのを防ぐ、堅牢で保守性の高いGraphQLワークフローを構築することです。以下に、コード生成パイプラインを強化するためのアーキテクチャ上のベストプラクティスを詳述します。

### **GraphQL操作の整理**

GraphQLクエリやフラグメントをプロジェクト内でどのように整理するかは、保守性とジェネレータの効率に大きな影響を与えます。主に2つの戦略があります。

* **中央集権型**: すべての.graphqlファイルを専門のディレクトリ（例：src/graphql/）に集約します。このアプローチは、documentsの構成をsrc/graphql/\*\*/\*.graphqlのように非常にシンプルかつ高速にできるという利点があります。どこにクエリがあるかが一目瞭然で、管理が容易です。  
* **コロケーション型**: クエリやフラグメントを、それらを使用するReactコンポーネントと同じファイルまたは同じディレクトリに配置します。これはコンポーネントのモジュール性と再利用性を高めますが、documentsのglobパターンをsrc/\*\*/\!(\*.d).{ts,tsx}のように広範に設定する必要があり、スキャンに時間がかかる可能性があります 2。

どちらの戦略を選択するかはプロジェクトの規模やチームの好みによりますが、重要なのは一貫したルールを適用することです。

### **命名規則の力**

すべてのGraphQL操作に一意の名前を付けることは、極めて重要な規律です。ユーザーのクエリはPageQueryと名付けられていますが、もし別の開発者が他のファイルで異なる内容のクエリに同じPageQueryという名前を付けてしまった場合、何が起こるでしょうか。GraphQL Code Generatorの動作は予測不能になり、片方の型が静かに上書きされ、デバッグが困難なバグを引き起こす可能性があります。

GraphQLの仕様自体は操作名の一意性を強制しませんが、Apollo ClientのDevToolsや永続化クエリ、メトリクス追跡など、GraphQLを取り巻くツーリングエコシステムは、操作名の一意性に大きく依存しています 11。したがって、

\[Feature\]By\[Param\]Query（例：PageBySlugQuery）のような命名規則をチーム全体で強制することは、単なる「推奨事項」ではなく、スケーラブルで安定したコードベースを維持するための必須のプラクティスです。この規律は、documentsパスの修正が解決する当面のエラーの次にチームが遭遇するであろう、より巧妙な問題を未然に防ぎます。また、named-operations-objectのようなプラグインは、この一意な命名規則から多大な恩恵を受けます 12。

### **生成プロセスの自動化**

コードと生成された型の間の乖離を防ぐ最善の方法は、生成プロセスを自動化することです。package.jsonのスクリプトを次のように構成することが推奨されます 4。

JSON

"scripts": {  
  "dev": "graphql-codegen \--watch & next dev",  
  "build": "graphql-codegen && next build",  
  "generate": "graphql-codegen"  
}

\--watchフラグ（または-w）をdevスクリプトに追加することで、GraphQL操作を含むファイルを保存するたびに、型が自動的に再生成されます。これにより、開発サイクル中に型が常に最新の状態に保たれ、ビルド時までエラーが発覚しないという事態を回避できます。また、buildスクリプトの前にgraphql-codegenを実行することで、本番ビルドが常に最新の型定義に基づいて行われることが保証されます。

### **プリセットの活用**

GraphQL Code Generatorの構成は複雑になる可能性があります。この複雑さを軽減するために、client-presetの利用が強く推奨されます 3。このプリセットは、

typescript、typescript-operations、typescript-react-apollo（または他のクライアントライブラリ用プラグイン）など、クライアントサイド開発に不可欠な複数のプラグインをインテリジェントにバンドルし、最適なデフォルト設定を提供します。これにより、codegen.tsファイルが大幅に簡素化され、構成ミスが発生する可能性が低減します。

TypeScript

// codegen.ts  
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig \= {  
  schema: 'http://localhost:4000/graphql',  
  documents: \['src/\*\*/\*.tsx'\],  
  generates: {  
    './src/gql/': {  
      preset: 'client',  
      plugins: // プリセットが最適なプラグインを自動的に選択  
    }  
  }  
};

export default config;

これらのベストプラクティスを導入することで、GraphQL Code Generatorは予測不能な「ブラックボックス」から、開発ワークフローの信頼性が高く予測可能な基盤へと変わります。

## **結論**

本レポートで分析したTS2305: Module has no exported member 'PageQuery'というビルドエラーは、アプリケーションコードのバグではなく、GraphQL Code Generatorの構成パイプライン、特にdocumentsプロパティの不備に起因するものであることが明らかになりました。このエラーは、自動化されたツールチェーンが期待通りに機能しなかった場合に発生する典型的な症状であり、その解決にはツールの内部動作への深い理解が不可欠です。

最終的な結論として、現代のWeb開発において「構成はコードである（configuration as code）」という原則を強調する必要があります。ビルドツールやコードジェネレータの設定は、アプリケーションロジックそのものと同じくらい重要であり、同等の注意と規律をもって管理されるべきです。GraphQL Code Generatorのようなツールが、APIスキーマと型安全なクライアントコードとの間のギャップをどのように埋めるかを深く理解することは、この種のエラーに対する最も効果的な防御策となります。

documentsプロパティの役割を正しく理解し、操作の一意な命名規則を徹底し、生成プロセスを自動化することで、開発者はこのツールを単なる魔法の「ブラックボックス」から、開発ワークフローの信頼できる予測可能な礎石へと昇華させることができます。これにより、ビルド時の予期せぬ失敗を排除し、より迅速で安定した開発サイクルを実現することが可能となるのです。

#### **引用文献**

1. What causes the typescript Module has no exported member .ts(2305) error and how do you fix it? \- Stack Overflow, 9月 13, 2025にアクセス、 [https://stackoverflow.com/questions/68899565/what-causes-the-typescript-module-has-no-exported-member-ts2305-error-and-how](https://stackoverflow.com/questions/68899565/what-causes-the-typescript-module-has-no-exported-member-ts2305-error-and-how)  
2. How to use GraphQL Codegen with Payload and React Query in Nextjs \- nouance, 9月 13, 2025にアクセス、 [https://nouance.io/articles/how-to-use-graphql-codegen-with-payload-and-react-query-in-nextjs](https://nouance.io/articles/how-to-use-graphql-codegen-with-payload-and-react-query-in-nextjs)  
3. Introduction to GraphQL Code Generator, 9月 13, 2025にアクセス、 [https://the-guild.dev/graphql/codegen/docs/getting-started](https://the-guild.dev/graphql/codegen/docs/getting-started)  
4. GraphQL CodeGen with Next.js \- Webkul Blog, 9月 13, 2025にアクセス、 [https://webkul.com/blog/nextjs-graphql-codegen/](https://webkul.com/blog/nextjs-graphql-codegen/)  
5. Next.js Storefront: GraphQL Codegen, TypeScript & TypedDocumentString \- YouTube, 9月 13, 2025にアクセス、 [https://www.youtube.com/watch?v=AjAij2j81Js](https://www.youtube.com/watch?v=AjAij2j81Js)  
6. GraphQL Codegen, 9月 13, 2025にアクセス、 [https://the-guild.dev/graphql/codegen](https://the-guild.dev/graphql/codegen)  
7. Codegen with GraphQL, Typescript, and Apollo, 9月 13, 2025にアクセス、 [https://www.apollographql.com/tutorials/lift-off-part1/09-codegen](https://www.apollographql.com/tutorials/lift-off-part1/09-codegen)  
8. codegen.ts file \- GraphQL (The Guild), 9月 13, 2025にアクセス、 [https://the-guild.dev/graphql/codegen/docs/config-reference/codegen-config](https://the-guild.dev/graphql/codegen/docs/config-reference/codegen-config)  
9. documents field \- GraphQL (The Guild), 9月 13, 2025にアクセス、 [https://the-guild.dev/graphql/codegen/docs/config-reference/documents-field](https://the-guild.dev/graphql/codegen/docs/config-reference/documents-field)  
10. "The query argument is unknown error" for query types generated by graphql-codegen \- Stack Overflow, 9月 13, 2025にアクセス、 [https://stackoverflow.com/questions/76000093/the-query-argument-is-unknown-error-for-query-types-generated-by-graphql-codeg](https://stackoverflow.com/questions/76000093/the-query-argument-is-unknown-error-for-query-types-generated-by-graphql-codeg)  
11. Why does codegen:generate require query names to be unique? · Issue \#670 · apollographql/apollo-tooling \- GitHub, 9月 13, 2025にアクセス、 [https://github.com/apollographql/apollo-tooling/issues/670](https://github.com/apollographql/apollo-tooling/issues/670)  
12. Named Operations Object \- Codegen \- GraphQL (The Guild), 9月 13, 2025にアクセス、 [https://the-guild.dev/graphql/codegen/plugins/typescript/named-operations-object](https://the-guild.dev/graphql/codegen/plugins/typescript/named-operations-object)