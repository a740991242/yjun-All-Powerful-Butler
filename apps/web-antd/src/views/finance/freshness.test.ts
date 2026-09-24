import { expect, it } from 'vitest';

import { dateOnly, freshness } from './freshness';
it('checks timestamps, calendar boundaries and missing values separately', () => {
  expect(dateOnly('20260924161459')).toBe('2026-09-24');
  expect(dateOnly('2026-02-30')).toBeNull();
  expect(freshness('2026-09-20', true, '2026-09-24', 4)).toBe('fresh');
  expect(freshness('2026-09-19', true, '2026-09-24', 4)).toBe('stale');
  expect(freshness('2026-09-25', true, '2026-09-24', 4)).toBe('future');
  expect(freshness('2026-09-24', false, '2026-09-24', 4)).toBe('missing');
  expect(freshness(null, true, '2026-09-24', 4)).toBe('missing');
});
