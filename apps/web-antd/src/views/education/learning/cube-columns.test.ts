import { describe, expect, it } from 'vitest';

import {
  cubeColumnsSolid,
  cubeColumnsTotal,
  isCubeColumnsVisual,
} from './cube-columns';
import { fold } from './fold';

describe('one-cube-deep stacks', () => {
  it('counts each cube and distinguishes a square front from a complete cube', () => {
    for (const heights of [
      [1],
      [1, 1],
      [2, 2],
      [3, 3],
      [2, 1],
      [1, 2, 3],
      [2, 1, 3, 1, 2],
      [4, 3, 2, 1],
    ]) {
      const model = { kind: 'cube-columns' as const, heights };
      expect(isCubeColumnsVisual(model)).toBe(true);
      expect(cubeColumnsTotal(model)).toBe(
        fold(heights, 0, (sum, n) => sum + n),
      );
    }
    expect(cubeColumnsSolid({ kind: 'cube-columns', heights: [1] })).toBe(
      'cube',
    );
    expect(cubeColumnsSolid({ kind: 'cube-columns', heights: [2, 2] })).toBe(
      'cuboid',
    );
    expect(cubeColumnsSolid({ kind: 'cube-columns', heights: [3] })).toBe(
      'cuboid',
    );
    expect(
      cubeColumnsSolid({ kind: 'cube-columns', heights: [2, 1] }),
    ).toBeNull();
  });
  it('rejects gaps, excessive depth or total, nonintegers and hidden extra fields', () => {
    for (const heights of [
      [],
      [0],
      [2, 0, 2],
      [1, 1, 1, 1, 1, 1],
      [5],
      [3, 3, 3, 3],
      [-1],
      [1.5],
      ['1'],
      [null],
      [Number.NaN],
      [Infinity],
    ])
      expect(isCubeColumnsVisual({ kind: 'cube-columns', heights })).toBe(
        false,
      );
    expect(
      isCubeColumnsVisual({ kind: 'cube-columns', heights: [2, 2], depth: 2 }),
    ).toBe(false);
    expect(isCubeColumnsVisual(null)).toBe(false);
  });
});
