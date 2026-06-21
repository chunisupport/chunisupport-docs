# ChuniSupport Docs

ChuniSupportのドキュメントサイトです。AstroとStarlightで構築しています。

## ローカル開発

Node.js 22.12.0以上が必要です。

```sh
npm install
npm run dev
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
