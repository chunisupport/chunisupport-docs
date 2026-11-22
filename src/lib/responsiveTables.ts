/*
 * Markdown / MDX が生成した <table> HTML を解析し、レスポンシブ表示
 * （デスクトップの説明欄幅確保・モバイルのコンパクトカード型）に必要な
 * data-cs-table / data-label 属性をビルド時に自動付与する。
 */

/** HTML 文字列からタグを取り除き、基本的な実体参照を戻してプレーンテキスト化する。 */
const stripHtml = (html: string): string =>
	html
		.replace(/<[^>]*>/g, '')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#39;|&#x27;/g, "'")
		.replace(/&amp;/g, '&') // 最後に戻して二重デコードを防ぐ
		.replace(/\s+/g, ' ')
		.trim()

/** HTML 属性値向けに特殊文字をエスケープする。 */
const escapeAttr = (value: string): string =>
	value
		.replace(/&/g, '&amp;')
		.replace(/"/g, '&quot;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')

/** テーブルのヘッダー構成からレスポンシブレイアウト種別を判定する。 */
export const resolveTableLayout = (headers: string[]): string => {
	if (headers.length === 3 && headers[2] === '説明') return 'spec-3'
	if (headers.length === 4 && headers[3] === '説明') return 'spec-4'
	if (headers.length === 2) return 'pair'
	return 'stacked'
}

/** レンダリング済み HTML 内の各 <table> へ data-cs-table / data-label を付与する。 */
export const enhanceResponsiveTablesHtml = (html: string): string => {
	if (!html.includes('<table')) return html

	return html.replace(/<table(\b[^>]*)>([\s\S]*?)<\/table>/gi, (fullMatch, tableAttrs: string, innerHtml: string) => {
		if (/\bdata-cs-table\s*=/.test(tableAttrs)) return fullMatch

		const theadMatch = innerHtml.match(/<thead\b[^>]*>([\s\S]*?)<\/thead>/i)
		const tbodyMatch = innerHtml.match(/<tbody\b[^>]*>([\s\S]*?)<\/tbody>/i)
		if (!theadMatch || !tbodyMatch) return fullMatch

		const headers = Array.from(theadMatch[1].matchAll(/<th\b[^>]*>([\s\S]*?)<\/th>/gi)).map((m) =>
			stripHtml(m[1])
		)
		if (headers.length === 0) return fullMatch

		const layout = resolveTableLayout(headers)
		const enhancedInner = innerHtml.replace(
			/(<tbody\b[^>]*>)([\s\S]*?)(<\/tbody>)/i,
			(_tbodyFull, openTag: string, tbodyContent: string, closeTag: string) => {
				const enhancedRows = tbodyContent.replace(
					/(<tr\b[^>]*>)([\s\S]*?)(<\/tr>)/gi,
					(_trFull, trOpen: string, trContent: string, trClose: string) => {
						let cellIndex = 0
						const enhancedCells = trContent.replace(
							/<td(\b[^>]*)>/gi,
							(tdOpen: string, tdAttrs: string) => {
								const label = headers[cellIndex++]
								if (!label || /\bdata-label\s*=/.test(tdAttrs)) return tdOpen
								return `<td${tdAttrs} data-label="${escapeAttr(label)}">`
							}
						)
						return `${trOpen}${enhancedCells}${trClose}`
					}
				)
				return `${openTag}${enhancedRows}${closeTag}`
			}
		)

		return `<table${tableAttrs} data-cs-table="${layout}">${enhancedInner}</table>`
	})
}
