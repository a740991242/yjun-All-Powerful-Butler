import { describe, expect, it } from 'vitest';

import { isTenCellsState, isTenCellsVisual, toggleTenCell } from './ten-cells';

describe('blank ten-cell selection board', () => {
  it('accepts only the fixed blank visual without goal, auto answer or extra fields', () => {
    expect(isTenCellsVisual({ kind: 'ten-cells' })).toBe(true);
    for (const bad of [
      null,
      [],
      { kind: 'ten-frame' },
      { kind: 'ten-cells', value: 6 },
      { kind: 'ten-cells', filled: [0] },
    ])
      expect(isTenCellsVisual(bad)).toBe(false);
  });
  it('rejects sparse, duplicate, fractional or out-of-range positions while distinguishing zero from blank', () => {
    expect(isTenCellsState([])).toBe(true);
    expect(isTenCellsState([0])).toBe(true);
    for (const bad of [
      null,
      [null],
      [-1],
      [10],
      [0.5],
      [0, 0],
      Array.from({ length: 11 }, (_, n) => n),
      Array.from({ length: 1 }),
    ])
      expect(isTenCellsState(bad)).toBe(false);
    const sparse: number[] = [];
    sparse.length = 2;
    sparse[1] = 1;
    expect(isTenCellsState(sparse)).toBe(false);
    expect(() => toggleTenCell([], 10)).toThrow('Invalid ten-cell selection');
    expect(() => toggleTenCell([0, 0], 1)).toThrow(
      'Invalid ten-cell selection',
    );
  });
  it('exhausts all 1024 subsets and each position toggle without mutating the old selection', () => {
    for (let mask = 0; mask < 1024; mask++) {
      const selected = Array.from({ length: 10 }, (_, n) => n).filter(
        (n) => (mask & (1 << n)) !== 0,
      );
      const snapshot = [...selected];
      expect(isTenCellsState(selected)).toBe(true);
      for (let n = 0; n < 10; n++) {
        const actual = toggleTenCell(selected, n);
        const expected = Array.from({ length: 10 }, (_, i) => i).filter(
          (i) => ((mask ^ (1 << n)) & (1 << i)) !== 0,
        );
        expect([...actual].toSorted((a, b) => a - b)).toEqual(expected);
        expect([...toggleTenCell(actual, n)].toSorted((a, b) => a - b)).toEqual(
          selected,
        );
      }
      expect(selected).toEqual(snapshot);
    }
  });
});
