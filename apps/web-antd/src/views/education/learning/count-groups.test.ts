import { describe, expect, it } from 'vitest';

import { countGroupsTotal, isCountGroupsVisual } from './count-groups';
import { fold } from './fold';

describe('grouped objects', () => {
  it('counts contained objects independently from the number of containers, including empty groups', () => {
    for (const groups of [
      [3, 3, 3],
      [2, 2, 2, 2],
      [0, 6],
      [0, 0],
      [2, 2, 2, 2, 2],
      [5, 5],
      [10, 0],
    ]) {
      const model = { kind: 'count-groups' as const, groups };
      expect(isCountGroupsVisual(model)).toBe(true);
      expect(countGroupsTotal(model)).toBe(
        fold(groups, 0, (sum, value) => sum + value),
      );
    }
    expect(
      countGroupsTotal({ kind: 'count-groups', groups: [3, 3, 3] }),
    ).not.toBe(3);
  });
  it('rejects malformed containers, unsafe sizes and hidden extra answer fields', () => {
    for (const groups of [
      [],
      [3],
      [1, 1, 1, 1, 1, 1],
      [6, 5],
      [11, 0],
      [-1, 2],
      [1.5, 2],
      ['2', 2],
      [null, 2],
      [Number.NaN, 2],
      [Infinity, 0],
    ])
      expect(isCountGroupsVisual({ kind: 'count-groups', groups })).toBe(false);
    expect(
      isCountGroupsVisual({ kind: 'count-groups', groups: [3, 3], total: 6 }),
    ).toBe(false);
    expect(isCountGroupsVisual(null)).toBe(false);
    expect(isCountGroupsVisual([])).toBe(false);
  });
});
