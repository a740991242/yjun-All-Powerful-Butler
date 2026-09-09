import { expect, it } from 'vitest';

import { moveOrder, reconcileOrder } from './watchlist-order';
it('restores saved order, removes stale and duplicate codes, and appends new stocks', () => {
  expect(reconcileOrder(['b', 'old', 'b'], ['a', 'b', 'c'])).toEqual([
    'b',
    'a',
    'c',
  ]);
  expect(reconcileOrder(null, ['a', 'b'])).toEqual(['a', 'b']);
});
it('moves a filtered stock to the global top without dropping other stocks', () => {
  expect(moveOrder(['a', 'b', 'c', 'd'], ['b', 'd'], 'd', 'top')).toEqual([
    'd',
    'a',
    'b',
    'c',
  ]);
});
it('moves within filtered results and preserves hidden rows', () => {
  expect(moveOrder(['a', 'b', 'c', 'd'], ['b', 'd'], 'd', 'up')).toEqual([
    'a',
    'd',
    'c',
    'b',
  ]);
  expect(moveOrder(['a', 'b', 'c', 'd'], ['b', 'd'], 'b', 'down')).toEqual([
    'a',
    'd',
    'c',
    'b',
  ]);
  expect(moveOrder(['a', 'b'], ['a', 'b'], 'a', 'up')).toEqual(['a', 'b']);
});
