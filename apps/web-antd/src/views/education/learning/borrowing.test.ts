import { describe, expect, it } from 'vitest';

import { breakTen } from './borrowing';

describe('physical break-ten subtraction', () => {
  it('preserves quantity when exchanging and matches subtraction for every supported calculation', () => {
    for (let left = 11; left <= 19; left++) {
      for (let right = (left % 10) + 1; right <= 9; right++) {
        expect(breakTen(left, right).remaining).toBe(left);
        const exchanged = breakTen(left, right, { broken: true });
        expect(exchanged.tenRemaining + exchanged.originalOnes).toBe(left);
        for (let removed = 0; removed <= right; removed++) {
          const value = breakTen(left, right, { broken: true, removed });
          expect(value.tenRemaining + value.originalOnes).toBe(left - removed);
          expect(value.remaining).toBe(left - removed);
          expect(value.complete).toBe(removed === right);
        }
      }
    }
  });
  it('requires exchanging before removal, bounds imported state, and rejects unsupported calculations', () => {
    expect(breakTen(13, 8, { removed: 8 }).removed).toBe(0);
    expect(breakTen(13, 8, { broken: true, removed: 99 }).removed).toBe(8);
    expect(breakTen(13, 8, { broken: true, removed: -2 }).removed).toBe(0);
    expect(breakTen(13, 8, { broken: true, removed: 1.5 }).removed).toBe(0);
    for (const [left, right] of [
      [10, 9],
      [20, 9],
      [13, 2],
      [13, 10],
      [13.5, 8],
    ])
      expect(() => breakTen(left!, right!)).toThrow(Error);
  });
});
