# ChuniSupport Docs

ChuniSupportのドキュメントサイトです。AstroとStarlightで構築しています。

## ローカル開発

Node.js 22.12.0以上が必要です。

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

## Cloudflare Pages

Cloudflare PagesでGitリポジトリを接続し、次の値を設定します。

| 設定 | 値 |
| --- | --- |
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Environment variable | `NODE_VERSION=22.12.0` |

このサイトは静的出力です。Cloudflare Workers用のAstroアダプターやWrangler設定は使用しません。

## 環境変数

- `PUBLIC_BOOKMARKLET_URL`: JavaScriptファイルを配信するベースURL
- `PUBLIC_BOOKMARKLET_ENTRYPOINT`: 読み込むJavaScriptファイル名

未設定時は `astro.config.mjs` の既定値を使用します。Cloudflare Pagesで変更する場合は、ビルド時の環境変数として設定してください。
