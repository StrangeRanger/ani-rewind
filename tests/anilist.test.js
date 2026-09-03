import test from 'node:test'
import assert from 'node:assert/strict'
import { collectUniqueEntries, getRewatchSummary } from '../src/api/anilist.js'

test('deduplicates entries that appear in multiple AniList groups', () => {
  const shared = { id: 1, repeat: 4 }
  const entries = collectUniqueEntries([
    { entries: [shared, { id: 2, repeat: 0 }] },
    { entries: [shared, { id: 3, repeat: 2 }] },
  ])

  assert.deepEqual(entries.map((entry) => entry.id), [1, 2, 3])
})

test('counts only positive rewatch totals', () => {
  const summary = getRewatchSummary([
    { id: 1, repeat: 4 },
    { id: 2, repeat: 0 },
    { id: 3, repeat: null },
    { id: 4, repeat: 2 },
  ])

  assert.equal(summary.totalRewatches, 6)
  assert.equal(summary.rewatchedTitles, 2)
  assert.equal(summary.topCount, 4)
  assert.deepEqual(summary.entries.map((entry) => entry.id), [1, 4])
})
