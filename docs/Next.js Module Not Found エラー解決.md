

# **Next.jsにおけるモジュール解決の習得：パスエイリアスに関する「Module Not Found」エラーの診断と修正のための決定版ガイド**

## **序論：「Module Not Found」の謎を解き明かす**

Next.jsアプリケーションの開発において、Module not foundというビルドエラーは、多くの開発者が直面する一般的でありながらも極めて重要な課題です。特に、@/components/...のようなパスエイリアス（path alias）に関連するこのエラーは、開発プロセスを停滞させる可能性があります。このエラーはNext.js自体のバグではなく、プロジェクトのファイル構造に対する各ツールの理解が同期していないことの現れです。

この問題の核心には、**設計時（design-time）の解決**と**ビルド時（build-time）の解決**という2つの異なるコンテキストが存在します。設計時の解決とは、Visual Studio Code（VS Code）などの統合開発環境（IDE）がTypeScript Language Serverを利用して行うもので、コード補完や定義へのジャンプといった機能を提供します 1。これにより、開発者はエイリアスが正しく機能しているかのような印象を受けがちです。しかし、実際に問題が発生するのはビルド時の解決、つまりNext.jsのコンパイラ（WebpackまたはTurbopack）がコードをバンドルしようとする段階です。提供されたエラーログが示すように、問題は明確にこのビルドプロセスに起因しています。

本レポートでは、TypeScriptのパス解決の基本原則から、Next.jsのビルドシステムにおける実践的なニュアンスに至るまで、この問題を包括的に解説します。最終的には、このエラーを単なる厄介なバグとしてではなく、プロジェクト設定の透明で管理可能な側面として理解し、自信を持って対処できるようになることを目指します。

## **第1章：Next.jsにおけるモジュール解決の構造**

これらのエラーがなぜ発生するのかを根本的に理解するためには、その背後にある理論的基盤を確立することが不可欠です。この章では、単なる修正方法を超えて、堅牢なメンタルモデルを構築することを目指します。

### **1.1 パス解決の2つの世界：エディタ vs. コンパイラ**

モジュールパスの解決は、開発サイクルの2つの異なる段階で行われます。この違いを理解することが、混乱を避けるための第一歩です。

#### **1.1.1 エディタ（設計時）**

VS CodeのようなIDEは、tsconfig.jsonやjsconfig.jsonファイルを読み取り、TypeScript Language Serverを介してパスエイリアスを解釈します。これにより、開発者は@/のようなエイリアスを入力すると、自動的に関連ファイルが候補として表示され、スムーズな開発体験が提供されます 1。しかし、これはあくまでエディタ上での支援機能に過ぎません。エディタがパスを解決できたとしても、それがビルドの成功を保証するものではないという点が、しばしば誤解の原因となります。

#### **1.1.2 コンパイラ（ビルド時）**

ユーザーが直面しているエラーの直接的な原因は、このビルド時の解決プロセスにあります。pnpm run buildコマンドが実行されると、Next.jsは内部的にWebpackまたはTurbopackといったバンドラを起動し、アプリケーションのコードを本番用にコンパイルおよび最適化します。このプロセスにおいて、バンドラは独自のモジュール解決ロジックを実行します。Next.jsはtsconfig.jsonのパスエイリアス設定を読み取るための組み込みサポートを提供していますが 3、設定にわずかでも不備があれば、バンドラは指定されたモジュールを見つけることができず、

Module not foundエラーをスローしてビルドを中断させます。

### **1.2 設定の礎：tsconfig.jsonとjsconfig.json**

パスエイリアスに関する問題のほとんどは、tsconfig.json（TypeScriptプロジェクトの場合）またはjsconfig.json（JavaScriptプロジェクトの場合）の設定不備に帰着します。このファイルは、TypeScriptコンパイラ、ひいてはNext.jsのビルドプロセスにとって、パスエイリアスに関する唯一の信頼できる情報源（single source of truth）となります。特に重要なのはcompilerOptions内の2つのプロパティです。

#### **1.2.1 baseUrl**

baseUrlは、すべての絶対パスインポートの基点（アンカーポイント）を定義します。この設定はコンパイラに対して、「相対パスでない（./や../で始まらない）すべてのモジュールパスの探索は、このディレクトリから開始せよ」と指示するものです。多くの事例で、このbaseUrlの欠落または誤設定がエラーの根本原因となっています 1。一般的には、プロジェクトのルートディレクトリを示す

.に設定されます。

#### **1.2.2 paths**

pathsは、baseUrlに完全に依存するマッピング、つまり書き換えルールを定義します。ここで重要なのは、pathsオブジェクトの右辺で指定されるパスは、baseUrlからの相対パスとして解釈されるという点です 3。

例えば、{"@/\*": \["./src/\*"\]}という設定を分解してみましょう。

1. @/\*：@/で始まるすべてのインポートパスに一致するパターンです。  
2. \["./src/\*"\]：一致したパスを解決するための場所を指定します。\*の部分は、元のパスの@/以降の部分に置き換えられます。  
3. このパス./src/\*は、baseUrlを基準として解決されます。もし"baseUrl": "."であれば、プロジェクトルート直下のsrcディレクトリ内を探索することを意味します。

開発者が陥りがちな最大の誤解は、pathsが単独で機能すると考えてしまうことです。しかし、データは圧倒的に、pathsが正しく設定されたbaseUrlなしではコンパイラにとって無意味であることを示しています。baseUrlがコンテキストを提供し、pathsがそのコンテキスト内での具体的な書き換えルールを提供するのです。この因果関係は直接的です。baseUrlが省略されたり誤っていたりすると、pathsオブジェクトの構文自体が正しくても、コンパイラはエイリアスを解決できず、ビルドは失敗します。これを理解することが、問題解決の最も基本的な鍵となります。

## **第2章：主要な原因：標準的なtsconfig.jsonの設定**

この章では、トラブルシューティングの基準となる、実用的で正しい設定例を提供します。これにより、開発者は自身の設定を「信頼できる情報源」と比較し、問題を特定することができます。

### **2.1 srcディレクトリがないプロジェクトの設定**

比較的小規模なプロジェクトや、特定の構成を好む場合に採用される構造です。この場合、baseUrlをプロジェクトルート（.）に設定し、pathsはルートレベルのディレクトリ（例：components、queries、lib）を直接指すようにマッピングします。

JSON

// tsconfig.json  
{  
  "compilerOptions": {  
    "baseUrl": ".",  
    "paths": {  
      "@/\*": \["\*"\]  
    }  
    //... その他の設定  
  }  
}

この設定は、@/components/Templates/Post/PostQueryのようなインポートを、プロジェクトルートからの相対パス./components/Templates/Post/PostQueryとして解決するようコンパイラに指示します。

### **2.2 srcディレクトリがあるプロジェクトの設定**

アプリケーションのソースコードを設定ファイルから分離するためにsrcディレクトリを使用するのは、Next.jsにおける一般的な慣習です。この構造には、有効な設定アプローチが2つ存在します。

**アプローチ1：baseUrlをプロジェクトルートに設定**

baseUrlを.に設定し、pathsエイリアスがsrcディレクトリ内を指すようにします。これは非常に一般的で直感的な方法です。

JSON

// tsconfig.json  
{  
  "compilerOptions": {  
    "baseUrl": ".",  
    "paths": {  
      "@/\*": \["src/\*"\]  
    }  
    //... その他の設定  
  }  
}

**アプローチ2：baseUrlをsrcディレクトリに設定**

baseUrl自体をsrcに設定することで、pathsの定義をより簡潔にできます。この場合、paths内のパスはsrcディレクトリからの相対パスとなります。

JSON

// tsconfig.json  
{  
  "compilerOptions": {  
    "baseUrl": "src",  
    "paths": {  
      "@/\*": \["\*"\]  
    }  
    //... その他の設定  
  }  
}

どちらのアプローチも最終的な結果は同じですが、プロジェクトの規約やチームの好みに応じて選択することが推奨されます 3。

### **2.3 表1：標準的なtsconfig.jsonパスエイリアス設定**

以下の表は、最も一般的なプロジェクトレイアウトに対応する設定をまとめたものです。これは、自身の設定を検証し、問題を迅速に特定するための中心的なリソースとなります。

| プロジェクト構造 | tsconfig.json (compilerOptions) | インポート例 | 解決されるパス |
| :---- | :---- | :---- | :---- |
| **srcディレクトリなし** | {"baseUrl": ".", "paths": {"@/\*": \["\*"\]}} | import PostQuery from '@/components/Templates/Post/PostQuery' | ./components/Templates/Post/PostQuery |
| **srcディレクトリあり (baseUrl: ".")** | {"baseUrl": ".", "paths": {"@/\*": \["src/\*"\]}} | import PostQuery from '@/components/Templates/Post/PostQuery' | ./src/components/Templates/Post/PostQuery |
| **srcディレクトリあり (baseUrl: "src")** | {"baseUrl": "src", "paths": {"@/\*": \["\*"\]}} | import PostQuery from '@/components/Templates/Post/PostQuery' | ./src/components/Templates/Post/PostQuery |

開発者が直面している問題は、多くの場合、自身の設定とこの表の標準的な設定との間の微妙な構文エラーや、baseUrlとpathsが自身のフォルダ構造とどのように相互作用するかについての誤解に起因します。この表は、曖昧さを排除し、即座に実行可能な解決策を提供することで、認知的な負荷を軽減します。

## **第3章：体系的なトラブルシューティング手順**

Module not foundエラーをデバッグする際には、場当たり的な対応ではなく、体系的なアプローチを取ることが重要です。ここでは、最も単純で一般的な修正から、より複雑な診断へと進む、明確な順序のチェックリストを提供します。

### **3.1 ステップ1：設定の検証**

最初に行うべきは、tsconfig.jsonファイルの内容を細心の注意を払って確認することです。

1. プロジェクトのtsconfig.jsonを開きます。  
2. 前述の**表1**を参照し、自身のプロジェクト構造（srcディレクトリの有無）に最も一致する設定例と比較します。  
3. 以下のよくある間違いがないか確認します：  
   * baseUrlプロパティがcompilerOptions内に存在するか。存在しない場合、これがエラーの最も可能性の高い原因です 1。  
   * pathsオブジェクトのキー（例：@/\*）と値（例：\["src/\*"\]）にタイプミスがないか。  
   * パスの指定が正しいか（例：srcディレクトリがあるのに\["\*"\]と指定していないか）。

### **3.2 ステップ2：積極的なキャッシュの無効化**

設定ファイルが正しくても、Next.jsが古い設定のキャッシュを保持しているためにエラーが続くことがあります。.nextディレクトリには、ビルドプロセスを高速化するためのキャッシュされたビルド成果物が含まれています。tsconfig.jsonのような設定ファイルを変更した場合、このキャッシュが古くなり、ビルドプロセスが古い、誤った解決情報を使用してしまう可能性があります。

この問題を解決するには、キャッシュを強制的にクリアする必要があります。

1. 実行中の開発サーバーを停止します（ターミナルで Ctrl \+ C）。  
2. プロジェクトのルートにある.nextディレクトリを完全に削除します。これは、多くの開発者コミュニティで繰り返し効果が報告されている確実な方法です 5。  
3. 開発サーバーを再起動します（pnpm run dev）。Next.jsは、新しく正しい設定を読み込んで.nextディレクトリを再生成します。

### **3.3 ステップ3：jsconfig.json vs. tsconfig.jsonの競合**

この問題は、特にJavaScriptプロジェクトからTypeScriptへ移行している途中のプロジェクトで発生する、微妙ながらも一般的な落とし穴です。

この問題が発生する因果関係は以下の通りです。

1. プロジェクトは純粋なJavaScriptとして開始され、パスエイリアスはjsconfig.jsonに正しく設定されています。  
2. 開発者が最初の.tsまたは.tsxファイルをプロジェクトに追加します 9。  
3. Next.jsはこの変更を検出し、TypeScriptサポートを有効にするために、デフォルトのtsconfig.jsonを自動的に生成します 7。  
4. この新しく生成されたtsconfig.jsonには、jsconfig.jsonにあったカスタムのpaths設定が含まれていません。そして、ビルドプロセス全体において、tsconfig.jsonがjsconfig.jsonよりも優先されるようになります。  
5. 結果として、エイリアスがもはや認識されなくなり、ビルドは突然失敗します。

**修正方法：** プロジェクトルートにjsconfig.jsonとtsconfig.jsonの両方が存在するか確認します。もし両方が存在する場合、jsconfig.jsonのcompilerOptionsの内容をtsconfig.jsonに移行（コピー＆ペースト）し、その後jsconfig.jsonを安全に削除して競合を解消する必要があります 5。

### **3.4 ステップ4：完全な依存関係の再構築**

上記の手順をすべて試しても問題が解決しない稀なケースでは、依存関係の破損やパッケージマネージャのキャッシュの問題が考えられます。最終手段として、依存関係を完全にクリーンアップして再インストールします。

1. 開発サーバーを停止します。  
2. node\_modulesディレクトリを削除します。  
3. パッケージマネージャのロックファイル（この場合はpnpm-lock.yaml）を削除します。  
4. pnpm installコマンドを実行して、すべての依存関係をクリーンな状態から再インストールします。

このトラブルシューティング手順は、ランダムな試行錯誤ではありません。ビルドパイプラインの依存関係を反映した論理的な除外プロセスです。まず情報源（設定ファイル）を検証し、次にビルドキャッシュ（.next）、設定の競合（jsconfig vs tsconfig）、そして最後にビルドを実行するツール自体（node\_modules）の整合性を確認します。この論理的な進行により、トラブルシューティングは効率的かつ教育的なものになります。

## **第4章：高度なシナリオとエッジケース**

標準的な解決策では不十分な、より複雑なプロジェクトアーキテクチャやツールに関する問題に対処します。これは、一般的なケースを超えた深い専門知識を示すものです。

### **4.1 Turbopackの要因：新しい解決パラダイム**

Turbopackは、Next.jsの次世代Rustベースバンドラであり、Webpackよりも高速ですが、同時により厳格な動作をします。特に、パフォーマンスとキャッシュ可能性を最大化するために設計された、サンドボックス化されたファイルシステムアクセスモデルを採用しています。このモデルは、エイリアスがメインのプロジェクトルート外を指している場合（例えばモノレポ構成）に問題を引き起こす可能性があります 10。

Turbopackは標準的なエイリアスについてはtsconfig.jsonを尊重しますが、モノレポのような複雑なシナリオでは、next.config.jsでの明示的な設定が必要になることがあります。  
next.config.jsでTurbopackのエイリアス解決を設定するには、experimental.turbo.resolveAliasオプションを使用します。特に、モノレポのルートを正しく認識させるためにrootプロパティを設定することが重要になる場合があります 10。

JavaScript

// next.config.js  
const path \= require('path');

/\*\* @type {import('next').NextConfig} \*/  
const nextConfig \= {  
  experimental: {  
    turbo: {  
      // モノレポのルートディレクトリを指定  
      root: path.join(\_\_dirname, '../..'),   
      resolveAlias: {  
        // tsconfig.jsonのパスが解決しない場合に、ここで明示的に設定  
        // 例：'@/ui/\*': '../packages/ui/src/\*'  
      },  
    },  
  },  
};

module.exports \= nextConfig;

### **4.2 モノレポとワークスペースアーキテクチャ**

モノレポ構成では、パッケージ間の境界を越えるエイリアス（例：apps/webにあるNext.jsアプリがpackages/uiのUIライブラリをインポートする）の解決が特有の課題となります。

この場合、モノレポのルートに置かれたtsconfig.base.jsonで共通の設定（特にpaths）を定義し、各アプリケーション（apps/webなど）のtsconfig.jsonでextendsプロパティを使ってそれを継承するのが一般的なパターンです 12。

JSON

// \<monorepo-root\>/tsconfig.base.json  
{  
  "compilerOptions": {  
    "baseUrl": ".",  
    "paths": {  
      "@acme/ui/\*": \["packages/ui/src/\*"\]  
    }  
  }  
}

// \<monorepo-root\>/apps/web/tsconfig.json  
{  
  "extends": "../../tsconfig.base.json",  
  "compilerOptions": {  
    // アプリ固有の設定  
  },  
  "include": \["next-env.d.ts", "\*\*/\*.ts", "\*\*/\*.tsx"\],  
  "exclude": \["node\_modules"\]  
}

この構成はTurbopackの議論と関連しており、このようなパッケージ間エイリアスが、next.config.jsでのオーバーライドが必要となる主要なシナリオの一つです 10。

### **4.3 表2：Webpack vs. Turbopack エイリアス解決戦略**

Next.jsはTurbopackを将来のデフォルトとして積極的に推進しており、開発者が遭遇する機会は増えていくでしょう。Webpackで機能していたtsconfig.jsonの設定が、next dev \--turboで実行した途端に壊れるという事態は十分に考えられます。以下の表は、両者の主な違いを明確にし、将来発生しうる問題に備えるためのものです。

| 機能 | Webpack (デフォルト) | Turbopack |
| :---- | :---- | :---- |
| **主要な設定ソース** | tsconfig.json / jsconfig.json | tsconfig.json / jsconfig.json |
| **標準的なエイリアス** | tsconfig.jsonのpathsでネイティブにサポート | tsconfig.jsonのpathsでネイティブにサポート |
| **モノレポのエイリアス** | tsconfig.jsonのpathsで他パッケージを指す設定（例：../packages/ui）が一般的に機能する | より厳格。アプリの検出ルート外のパスで失敗することがある。多くの場合next.config.jsでのオーバーライドが必要 10。 |
| **設定のオーバーライド** | next.config.js (webpack.resolve.alias) | next.config.js (experimental.turbo.resolveAlias と root) 11 |

この表は、開発者の知識を将来にわたって有効なものにし、異なるツールチェーン下でのModule not foundエラーの再発を防ぐのに役立ちます。

## **第5章：堅牢なパス管理のためのベストプラクティス**

問題解決のリアクティブなアプローチから、よりメンテナンス性が高くスケーラブルなアプリケーションを構築するためのプロアクティブな戦略へと移行します。

### **5.1 唯一の信頼できる情報源を確立する**

プロジェクト内に設定ファイルを一つだけ持つことの重要性を再確認します。TypeScriptを含むプロジェクトではtsconfig.jsonを、純粋なJavaScriptプロジェクトではjsconfig.jsonを使用し、もう一方は削除して曖昧さを排除します。

### **5.2 baseUrlを意図的に設定する**

プロジェクトの構造とチームの規約に基づき、baseUrlに.とsrcのどちらを選択するかを戦略的に決定します。どちらを選択するにしても、その決定は一貫して適用されるべきです。

### **5.3 エイリアスは最小限かつ意味のあるものに保つ**

多数の特定のエイリアス（例：@components/\*, @lib/\*, @styles/\*）を作成する代わりに、@/\*のような単一で強力なエイリアスを使用することを推奨します。これにより、設定が簡素化され、メンテナンスが容易になります。多くの成功例で、この単一の@/\*エイリアスが効果的に使用されています 5。

### **5.4 設定ファイルをバージョン管理する**

tsconfig.jsonやnext.config.jsといった設定ファイルは、必ずGitなどのバージョン管理システムにコミットすることを徹底します。これは、「自分のマシンでは動く」といった典型的な問題を未然に防ぐための、単純かつ極めて重要な習慣です。

## **結論：モジュールパスの完全な習得**

本レポートで詳述したように、Module not foundエラーは不可解なバグではなく、設定の不一致によって引き起こされる予測可能な結果です。この問題を克服するための鍵となる要点を以下に要約します。

1. **解決の二重性**：エディタ（設計時）とコンパイラ（ビルド時）でのパス解決は別物であり、ビルド時の解決こそが最終的な成否を決定します。  
2. **baseUrlへの依存**：pathsエイリアスは、baseUrlが正しく設定されていなければ機能しません。この2つは不可分な関係にあります。  
3. **キャッシュのクリア**：設定変更後は、.nextディレクトリを削除してビルドキャッシュをクリアすることが、問題を解決するための確実な手順です。  
4. **設定ファイルの競合**：jsconfig.jsonとtsconfig.jsonの共存は、予期せぬ動作の原因となります。設定をtsconfig.jsonに一本化することが不可欠です。  
5. **進化するツール**：Turbopackのような新しいツールは、異なる、より厳格なルールを持つ可能性があり、それに応じた設定の調整が必要になる場合があります。

これらの原則を理解し、本レポートで示した体系的なトラブルシューティング手順を適用することで、開発者はもはやビルドエラーの被害者ではなく、プロジェクトのアーキテクチャとビルドパイプラインを完全に制御する主体となることができます。モジュールパスの管理は、堅牢でスケーラブルなNext.jsアプリケーションを構築するための基礎的なスキルであり、この知識はそのための確固たる土台となるでしょう。

#### **引用文献**

1. Getting "Module not found" when renaming path in \`tsconfig.json\` · vercel next.js · Discussion \#32141 \- GitHub, 9月 13, 2025にアクセス、 [https://github.com/vercel/next.js/discussions/32141](https://github.com/vercel/next.js/discussions/32141)  
2. Can't resolve path alias : r/reactjs \- Reddit, 9月 13, 2025にアクセス、 [https://www.reddit.com/r/reactjs/comments/x5ndy4/cant\_resolve\_path\_alias/](https://www.reddit.com/r/reactjs/comments/x5ndy4/cant_resolve_path_alias/)  
3. Configuring: Absolute Imports and Module Path Aliases | Next.js, 9月 13, 2025にアクセス、 [https://nextjs.org/docs/14/app/building-your-application/configuring/absolute-imports-and-module-aliases](https://nextjs.org/docs/14/app/building-your-application/configuring/absolute-imports-and-module-aliases)  
4. Using baseUrl in jsconfig.json is not working with Next.js \- Stack Overflow, 9月 13, 2025にアクセス、 [https://stackoverflow.com/questions/59474480/using-baseurl-in-jsconfig-json-is-not-working-with-next-js](https://stackoverflow.com/questions/59474480/using-baseurl-in-jsconfig-json-is-not-working-with-next-js)  
5. Module not found: Can't resolve Next.js \- TypeScript \- Stack Overflow, 9月 13, 2025にアクセス、 [https://stackoverflow.com/questions/71433951/module-not-found-cant-resolve-next-js-typescript](https://stackoverflow.com/questions/71433951/module-not-found-cant-resolve-next-js-typescript)  
6. Resolving TypeScript Import Errors in Next.js | Peter Kellner's Blog, 9月 13, 2025にアクセス、 [https://peterkellner.net/2023-09-15-resolving-typescript-errors-in-nextjs/](https://peterkellner.net/2023-09-15-resolving-typescript-errors-in-nextjs/)  
7. Getting Started: Installation \- Next.js, 9月 13, 2025にアクセス、 [https://nextjs.org/docs/app/getting-started/installation](https://nextjs.org/docs/app/getting-started/installation)  
8. TSConfig Option: paths \- TypeScript, 9月 13, 2025にアクセス、 [https://www.typescriptlang.org/tsconfig/paths.html](https://www.typescriptlang.org/tsconfig/paths.html)  
9. Alias Imports Suddenly Caused Module Not Found Errors in NextJS \- Stack Overflow, 9月 13, 2025にアクセス、 [https://stackoverflow.com/questions/78350166/alias-imports-suddenly-caused-module-not-found-errors-in-nextjs](https://stackoverflow.com/questions/78350166/alias-imports-suddenly-caused-module-not-found-errors-in-nextjs)  
10. Next.js 15 import alias not working with turbopack · Issue \#71886 \- GitHub, 9月 13, 2025にアクセス、 [https://github.com/vercel/next.js/issues/71886](https://github.com/vercel/next.js/issues/71886)  
11. turbopack \- next.config.js, 9月 13, 2025にアクセス、 [https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack](https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack)  
12. Solving the Module Not Found error when using NextJS and MonoRepos | Jelani Harris, 9月 13, 2025にアクセス、 [https://jelaniharris.com/blog/solving-the-module-not-found-error-when-using-nextjs-and-monorepos/](https://jelaniharris.com/blog/solving-the-module-not-found-error-when-using-nextjs-and-monorepos/)