import assert from 'node:assert/strict'
import { test } from 'node:test'

import { legacyAnchorRedirectTarget } from './legacyAnchorRedirect.ts'

const anchors: Record<string, unknown> = {
  'chunirec互換api-compatchunirec20': '/api/compat-chunirec/',
  'get-v1songs': '/api/songs/#get-v1songs',
}

const absent = () => false

test('#toString / #constructor / #__proto__ は継承プロパティでも転送しない', () => {
  assert.equal(legacyAnchorRedirectTarget(anchors, '#toString', absent), null)
  assert.equal(legacyAnchorRedirectTarget(anchors, '#constructor', absent), null)
  assert.equal(legacyAnchorRedirectTarget(anchors, '#__proto__', absent), null)
})

test('#%ZZ など不正なパーセントエンコードは例外にせず無効なハッシュにする', () => {
  let calls = 0
  const elementExists = () => {
    calls += 1
    return false
  }

  assert.equal(legacyAnchorRedirectTarget(anchors, '#%ZZ', elementExists), null)
  assert.equal(legacyAnchorRedirectTarget(anchors, '#%', elementExists), null)
  assert.equal(calls, 0)
})

test('登録済みの旧アンカーは転送する', () => {
  assert.equal(
    legacyAnchorRedirectTarget(anchors, '#chunirec互換api-compatchunirec20', absent),
    '/api/compat-chunirec/',
  )
  assert.equal(
    legacyAnchorRedirectTarget(
      anchors,
      `#${encodeURIComponent('chunirec互換api-compatchunirec20')}`,
      absent,
    ),
    '/api/compat-chunirec/',
  )
  assert.equal(
    legacyAnchorRedirectTarget(anchors, '#get-v1songs', absent),
    '/api/songs/#get-v1songs',
  )
})

test('ページ上に同じ id がある見出しは転送しない', () => {
  assert.equal(legacyAnchorRedirectTarget(anchors, '#get-v1songs', () => true), null)
})

test('自身のキーでも値が文字列でなければ転送しない', () => {
  const ownNonString: Record<string, unknown> = { toString: Object.prototype.toString }
  assert.equal(legacyAnchorRedirectTarget(ownNonString, '#toString', absent), null)
})
