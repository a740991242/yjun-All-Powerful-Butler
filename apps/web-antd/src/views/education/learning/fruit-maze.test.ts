import { describe, expect, it } from 'vitest';

import { fruitMazeCells, isFruitMazeVisual } from './fruit-maze';
import { required } from './required';

describe('original maze paths and fruit units', () => {
  it('independently searches all orthogonal simple paths and counts only their fruit', () => {
    for (const variant of ['main', 'review'] as const) {
      const cells = fruitMazeCells(variant);
      expect(cells).toHaveLength(16);
      expect(cells.filter((c) => c.label === null).map((c) => c.index)).toEqual(
        [5, 6, 10, 12],
      );
      const paths: number[][] = [];
      function visit(index: number, path: number[]) {
        const next = [...path, index];
        if (index === 15) {
          paths.push(next);
          return;
        }
        const x = index % 4;
        const y = Math.floor(index / 4);
        for (const [dx, dy] of [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ]) {
          const nx = x + required(dx);
          const ny = y + required(dy);
          if (nx < 0 || nx > 3 || ny < 0 || ny > 3) continue;
          const target = ny * 4 + nx;
          if (next.includes(target) || required(cells[target]).label === null)
            continue;
          visit(target, next);
        }
      }
      visit(0, []);
      expect(
        paths.map((path) => path.map((i) => required(cells[i]).label).join('')),
      ).toEqual(['ABCDFIL', 'AEGHJKL']);
      expect(
        paths.map((path) =>
          path.reduce((sum, i) => sum + required(cells[i]).fruit, 0),
        ),
      ).toEqual(variant === 'main' ? [6, 7] : [8, 7]);
      expect(paths.map((path) => path.length)).toEqual([7, 7]);
      expect(cells.reduce((sum, c) => sum + c.fruit, 0)).toBe(13);
      expect(required(cells[0]).fruit).toBe(variant === 'main' ? 0 : 1);
      expect(required(cells[15]).fruit).toBe(variant === 'main' ? 0 : 1);
    }
  });
  it('accepts only the two fixed readonly variants and rejects answer-bearing fields', () => {
    expect(isFruitMazeVisual({ kind: 'fruit-maze', variant: 'main' })).toBe(
      true,
    );
    expect(isFruitMazeVisual({ kind: 'fruit-maze', variant: 'review' })).toBe(
      true,
    );
    for (const value of [
      null,
      [],
      { kind: 'fruit-maze' },
      { kind: 'fruit-maze', variant: ['main'] },
      { kind: 'fruit-maze', variant: 'other' },
      { kind: 'fruit-maze', variant: 'main', answer: 6 },
    ])
      expect(isFruitMazeVisual(value)).toBe(false);
  });
});
