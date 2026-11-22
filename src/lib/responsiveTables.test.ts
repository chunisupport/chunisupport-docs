import assert from 'node:assert/strict'
import test from 'node:test'
import { enhanceResponsiveTablesHtml } from './responsiveTables.ts'

test('3列の説明付きテーブルへ spec-3 と各セルの data-label を付与する', () => {
	const input =
		'<table><thead><tr><th>コード</th><th>HTTP</th><th>説明</th></tr></thead><tbody><tr><td><code>player_metric_history_not_found</code></td><td>404</td><td>履歴が存在しません</td></tr></tbody></table>'

	const output = enhanceResponsiveTablesHtml(input)

	assert.match(output, /<table data-cs-table="spec-3">/)
	assert.match(output, /<td data-label="コード"><code>player_metric_history_not_found<\/code><\/td>/)
	assert.match(output, /<td data-label="HTTP">404<\/td>/)
	assert.match(output, /<td data-label="説明">履歴が存在しません<\/td>/)
})

test('4列の説明付きテーブルへ spec-4 を付与する', () => {
	const input =
		'<table><thead><tr><th>パラメータ</th><th>型</th><th>必須</th><th>説明</th></tr></thead><tbody><tr><td><code>username</code></td><td>string</td><td>○</td><td>ユーザー名</td></tr></tbody></table>'

	const output = enhanceResponsiveTablesHtml(input)

	assert.match(output, /<table data-cs-table="spec-4">/)
	assert.match(output, /<td data-label="必須">○<\/td>/)
})

test('2列テーブルへ pair を付与する', () => {
	const input =
		'<table><thead><tr><th>目的</th><th>エンドポイント</th></tr></thead><tbody><tr><td>楽曲一覧</td><td><code>GET /v1/songs</code></td></tr></tbody></table>'

	const output = enhanceResponsiveTablesHtml(input)

	assert.match(output, /<table data-cs-table="pair">/)
})

test('末尾が説明でない4列比較テーブルへ stacked を付与し、属性値のクォートをエスケープする', () => {
	const input =
		'<table><thead><tr><th>項目</th><th>型</th><th>通常楽曲</th><th>WORLD&#39;S END</th></tr></thead><tbody><tr><td><code>title</code></td><td>string</td><td>曲名</td><td>曲名【属性】</td></tr></tbody></table>'

	const output = enhanceResponsiveTablesHtml(input)

	assert.match(output, /<table data-cs-table="stacked">/)
	assert.match(output, /<td data-label="WORLD'S END">曲名【属性】<\/td>/)
})

test('th 内に code 要素が含まれてもプレーンテキストとして data-label を抽出する', () => {
	const input =
		'<table><thead><tr><th>HTTP / <code>error.code</code></th><th><code>error.message</code></th><th>説明</th></tr></thead><tbody><tr><td>404</td><td><code>not found.</code></td><td>詳細</td></tr></tbody></table>'

	const output = enhanceResponsiveTablesHtml(input)

	assert.match(output, /<table data-cs-table="spec-3">/)
	assert.match(output, /<td data-label="HTTP \/ error\.code">404<\/td>/)
	assert.match(output, /<td data-label="error\.message"><code>not found\.<\/code><\/td>/)
})

test('エスケープ済みの実体参照を二重にデコードしない', () => {
	const input =
		'<table><thead><tr><th><code>&amp;lt;</code></th><th>説明</th></tr></thead><tbody><tr><td>a</td><td>b</td></tr></tbody></table>'

	const output = enhanceResponsiveTablesHtml(input)

	assert.match(output, /<td data-label="&amp;lt;">a<\/td>/)
})
