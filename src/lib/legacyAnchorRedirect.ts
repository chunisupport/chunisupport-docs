/**
 * 旧 /api/#hash を分割後のページへ転送するときの転送先を返す。
 * マップ自身のキーで、値が空でない文字列のときだけ返す。
 * 不正なパーセントエンコードは無効なハッシュとして null（通常表示のまま）にする。
 */
export const legacyAnchorRedirectTarget = (
  anchors: Readonly<Record<string, unknown>>,
  locationHash: string,
  elementExists: (id: string) => boolean,
): string | null => {
  let hash: string
  try {
    hash = decodeURIComponent(locationHash.startsWith('#') ? locationHash.slice(1) : locationHash)
  } catch {
    return null
  }

  if (!hash || !Object.hasOwn(anchors, hash)) return null

  const target = anchors[hash]
  if (typeof target !== 'string' || !target || elementExists(hash)) return null

  return target
}
