# ChuniSupport ガイド

ChuniSupportのガイドサイトです。AstroとStarlightで構築しています。

## ローカル開発

Node.js 22.23.4以上が必要です（Astro 7.4系の要件）。

```sh
npm install
npm run dev
```

ブックマークレットの配布先をローカルで変更する場合は、`.env.example` を `.env` にコピーして値を編集します。

```powershell
Copy-Item .env.example .env
```

本番ビルドは次のコマンドで確認できます。

```sh
npm run build
npm run preview
```

## コンテンツの更新

- [お知らせの書き方](docs/announcements.md)

## Cloudflare Workers

このサイトはAstroの静的出力をWorkers Static Assetsで配信します。SSR用のAstroアダプターやWorkerスクリプトは使用しません。配信設定は `wrangler.jsonc` で管理します。

| 環境 | Workersの公開URL |
| --- | --- |
| 本番Worker | `https://chunisupport-docs.qmc.workers.dev` |
| developプレビュー | `https://develop-chunisupport-docs.qmc.workers.dev` |

1つのWorkerで、本番（`main`）とブランチプレビュー（`develop`など）を運用します。ステージング専用の別Workerは作成しません。

独自ドメインの切り替え前も、上記URLで確認できます。本番の公開先は`docs.chunisupport.net`、ステージングの公開先は`docs.chunisup-dev.f5.si`です。ただし、既存ステージングドメインをdevelopプレビューに割り当てる方法は未確定です。環境変数の設定だけではドメインの割り当ては変更されません。切り替え確認が完了するまでは既存Pagesのドメインを維持します。

### ローカルでWorkersの配信を確認する

```sh
npm run preview:workers
```

ビルド後にWranglerのローカルサーバーが起動します。Astroのみのプレビューと異なり、`public/_headers`、`public/_redirects`、独自404ページの配信も確認できます。

### 手動デプロイ

初回はCloudflareにログインします。

```sh
npx wrangler login
```

本番Workerを作成・更新する場合：

```sh
npm run deploy
```

現在のGitブランチをプレビューに公開する場合（初回は本番Workerの作成後に実行）：

```sh
npm run deploy:preview
```

どちらもビルド後にデプロイします。`deploy`は本番更新、`deploy:preview`はブランチプレビューの作成・更新です。公開URLはWranglerの出力で確認します。

ローカルの`.env`もビルドに使用されます。公開前に`SITE_URL`と`PUBLIC_*`の値を確認し、ローカル開発用URLを公開しないようにしてください。本番の`SITE_URL`を明示してデプロイする場合（PowerShell）：

```powershell
$env:SITE_URL = 'https://docs.chunisupport.net'
npm run deploy
Remove-Item Env:SITE_URL
```

`PUBLIC_*`にもローカル開発用の値がある場合は、同様に公開先の値を指定してください。プレビューのデプロイ時は、`SITE_URL`にプレビュー側のURLを指定します。

### Git連携（Workers Builds）

CloudflareでWorkerにGitリポジトリを接続し、次の値を設定します。

| 設定 | 値 |
| --- | --- |
| Root directory | リポジトリルート |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Preview command | `npx wrangler preview` |
| Build variable | `NODE_VERSION=22.23.4` |

本番ブランチは既存Pagesと同じ`main`を指定します。`develop`は本番ブランチには指定せず、**Builds for Preview branches**を有効にしてプレビュービルドの対象に含めます。ビルド時の環境変数は次の節の値を本番・プレビューそれぞれに設定します。

- 本番ブランチへのpush：本番Workerを更新
- その他の対象ブランチへのpush：ブランチプレビューを更新

`previews`と`preview_urls`はWrangler設定で有効にしています。Git連携側のプレビュービルドも別途有効にする必要があります。旧方式のWorkers Buildsを使用している場合は、Worker Previewsへの切り替えも必要です。

### 本番・プレビューの環境変数

`SITE_URL`と`PUBLIC_*`は、HTML・JSONを生成する**ビルド時**の環境変数です。Workersの実行時変数や`previews.vars`を変更するだけでは、静的出力に反映されません。

本番とプレビューのビルドトリガーごとに、次の値を設定してください。Pages側の変数やドメインは自動では引き継がれません。

本番（`main`）：

```dotenv
SITE_URL=https://docs.chunisupport.net
PUBLIC_APP_URL=https://chunisupport.net
PUBLIC_BOOKMARKLET_URL=https://dist.chunisupport.net
PUBLIC_BOOKMARKLET_ENTRYPOINT=main.js
PUBLIC_STATIC_API_BASE_URL=https://static.chunisupport.net
```

ステージング（`develop`）：

```dotenv
SITE_URL=https://docs.chunisup-dev.f5.si
PUBLIC_APP_URL=https://chunisup-dev.f5.si
PUBLIC_BOOKMARKLET_URL=https://dist.chunisup-dev.f5.si
PUBLIC_BOOKMARKLET_ENTRYPOINT=dhq.js
PUBLIC_STATIC_API_BASE_URL=https://static.chunisup-dev.f5.si
```

`PUBLIC_API_BASE_URL`は上記の設定には含めていません。未設定の場合は、本番・プレビューともに`https://api.chunisupport.net`を使用します。APIドキュメント内のURLもステージングに切り替える場合は、確認済みのAPI公開先をビルド時変数に追加してください。

`SITE_URL`はビルド時に固定されるため、ブランチごとにURLを変える場合は、ビルド時変数も対応させてください。特に`/announcements.json`内のリンク先を確認してください。ステージングドメインの切り替え前は、プレビューで生成したリンクが既存Pagesのステージングを指すことに注意してください。

### Pagesからの切り替え

1. 既存Pagesを残したまま、Workersの本番・プレビューURLで配信を確認します。
2. 表示、`/announcements.json`のCORS・キャッシュヘッダー、`/changelog`からの301転送、存在しないURLの404を確認します。
3. Workers BuildsのGit連携と環境変数を設定し、本番・プレビュー両方のビルドを確認します。
4. Pagesから`docs.chunisupport.net`の割り当てを外し、WorkersのCustom Domainとして設定します。
5. 独自ドメインでも確認後、不要になったPagesの自動ビルドを停止します。切り戻しが不要と判断するまではPagesプロジェクトを残します。

Wrangler設定には独自ドメインを含めていません。最初のデプロイで既存Pagesのドメイン設定を変更することはありません。

参考：[Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/)／[プレビュービルド](https://developers.cloudflare.com/workers/ci-cd/builds/build-branches/)／[Preview設定](https://developers.cloudflare.com/workers/previews/configuration/)

## 環境変数

- `SITE_URL`: サイトの公開URL。お知らせフィード内のリンク生成などに使用します。
- `PUBLIC_APP_URL`: ChuniSupport本体の公開URL。「ChuniSupportを開く」リンクに使用します。
- `PUBLIC_BOOKMARKLET_URL`: JavaScriptファイルを配信するベースURL
- `PUBLIC_BOOKMARKLET_ENTRYPOINT`: 読み込むJavaScriptファイル名（本番は`main.js`、ステージングは`dhq.js`）
- `PUBLIC_API_BASE_URL`: APIドキュメントに掲載するAPIのベースURL
- `PUBLIC_STATIC_API_BASE_URL`: キャッシュ済み静的APIデータのベースURL

未設定時は `astro.config.mjs` の既定値を使用します。Cloudflare Workersで変更する場合は、Workers Buildsのビルド時の環境変数として設定してください。
