import { describe, expect, it } from 'vitest';

import { sujiaoMainSeats, sujiaoReviewSeats } from '../content/sujiao-position';
import { isSeatGridVisual, seatNeighbour, seatPosition } from './seat-grid';

describe('fixed-orientation seats', () => {
  it('finds every seat and reciprocal neighbours without wrapping at an edge', () => {
    for (const model of [sujiaoMainSeats, sujiaoReviewSeats]) {
      expect(isSeatGridVisual(model)).toBe(true);
      for (const [row, names] of model.rows.entries()) {
        for (const [column, name] of names.entries()) {
          expect(seatPosition(model, name)).toEqual({
            row: row + 1,
            column: column + 1,
          });
          expect(seatNeighbour(model, name, 'front')).toBe(
            model.rows[row - 1]?.[column],
          );
          expect(seatNeighbour(model, name, 'rear')).toBe(
            model.rows[row + 1]?.[column],
          );
          expect(seatNeighbour(model, name, 'left')).toBe(names[column - 1]);
          expect(seatNeighbour(model, name, 'right')).toBe(names[column + 1]);
          const right = seatNeighbour(model, name, 'right');
          if (right) expect(seatNeighbour(model, right, 'left')).toBe(name);
          const front = seatNeighbour(model, name, 'front');
          if (front) expect(seatNeighbour(model, front, 'rear')).toBe(name);
        }
      }
      expect(seatPosition(model, '不存在')).toBeUndefined();
      expect(seatNeighbour(model, '不存在', 'front')).toBeUndefined();
    }
  });
  it('rejects incorrect dimensions, duplicate or malformed names, and extra orientation fields', () => {
    expect(isSeatGridVisual({ ...sujiaoMainSeats, front: 'right' })).toBe(
      false,
    );
    for (const replacement of ['小林', '', ' 太长名字 ', '小\n禾', 1]) {
      const rows = sujiaoMainSeats.rows.map((row) => [...row]);
      const corrupt = { kind: 'seat-grid', rows: rows as unknown[][] };
      corrupt.rows[0]![0] = replacement;
      expect(isSeatGridVisual(corrupt)).toBe(false);
    }
    expect(
      isSeatGridVisual({
        kind: 'seat-grid',
        rows: sujiaoMainSeats.rows.slice(1),
      }),
    ).toBe(false);
    expect(isSeatGridVisual({ kind: 'seat-grid', rows: [[], [], []] })).toBe(
      false,
    );
  });
});
