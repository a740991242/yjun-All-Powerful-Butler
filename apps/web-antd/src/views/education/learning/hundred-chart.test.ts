import { describe, expect, it } from 'vitest';

import { hundredPosition } from './hundred-chart';

describe('hundred-chart boundaries and number relationships', () => {
  it('maps every number to ten rows and columns, with reversible valid neighbors', () => {
    for (let value = 1; value <= 100; value++) {
      const cell = hundredPosition(value);
      expect((cell.row - 1) * 10 + cell.column).toBe(value);
      if (cell.right !== null) {
        expect(cell.right - value).toBe(1);
        expect(hundredPosition(cell.right).left).toBe(value);
      }
      if (cell.left !== null) {
        expect(value - cell.left).toBe(1);
        expect(hundredPosition(cell.left).right).toBe(value);
      }
      if (cell.down !== null) {
        expect(cell.down - value).toBe(10);
        expect(hundredPosition(cell.down).up).toBe(value);
      }
      if (cell.up !== null) {
        expect(value - cell.up).toBe(10);
        expect(hundredPosition(cell.up).down).toBe(value);
      }
    }
  });
  it('never wraps 10→11 or 20→21 horizontally and handles 100 without producing 101', () => {
    expect(hundredPosition(10)).toMatchObject({
      row: 1,
      column: 10,
      right: null,
      down: 20,
    });
    expect(hundredPosition(21)).toMatchObject({
      row: 3,
      column: 1,
      left: null,
      up: 11,
    });
    expect(hundredPosition(100)).toMatchObject({
      row: 10,
      column: 10,
      right: null,
      down: null,
      up: 90,
      left: 99,
    });
    for (const value of [0, 101, -1, 2.5, Number.NaN])
      expect(() => hundredPosition(value)).toThrow(Error);
  });
});
