import { describe, expect, it } from 'vitest';

import {
  sujiaoMainPaths,
  sujiaoReviewPaths,
} from '../content/sujiao-first-unit-review';
import { gridPathLength, isGridPathsVisual } from './grid-paths';

describe('bounded grid paths', () => {
  it('counts every segment through turns and preserves length when tracing backwards', () => {
    expect(
      sujiaoMainPaths.paths.map((path) => gridPathLength(path.points)),
    ).toEqual([4, 5, 2]);
    expect(
      sujiaoReviewPaths.paths.map((path) => gridPathLength(path.points)),
    ).toEqual([5, 4, 3]);
    for (const model of [sujiaoMainPaths, sujiaoReviewPaths]) {
      expect(isGridPathsVisual(model)).toBe(true);
      for (const path of model.paths)
        expect(gridPathLength([...path.points].toReversed())).toBe(
          gridPathLength(path.points),
        );
    }
  });

  it('rejects diagonals, loops, overlap, out-of-grid coordinates, wrong styles and extra fields', () => {
    for (const points of [
      [
        [0, 0],
        [1, 1],
      ],
      [
        [0, 0],
        [0, 0],
      ],
      [
        [0, 0],
        [2, 0],
        [0, 0],
      ],
      [
        [0, 0],
        [2, 0],
        [2, 4],
      ],
      [
        [0, 0],
        [6, 0],
      ],
      [
        [0, 0],
        [1.5, 0],
      ],
      [
        [0, 0],
        [2, 0],
        [2, 3],
        [3, 3],
      ],
    ]) {
      const model = structuredClone(sujiaoMainPaths);
      model.paths[0]!.points = points as [number, number][];
      expect(isGridPathsVisual(model)).toBe(false);
    }
    const overlap = structuredClone(sujiaoMainPaths);
    overlap.paths[2]!.points = [
      [2, 0],
      [2, 1],
    ];
    expect(isGridPathsVisual(overlap)).toBe(false);
    expect(isGridPathsVisual({ ...sujiaoMainPaths, selected: 'B' })).toBe(
      false,
    );
    const reorder = structuredClone(sujiaoMainPaths);
    reorder.paths.reverse();
    expect(isGridPathsVisual(reorder)).toBe(false);
    const extra = {
      ...sujiaoMainPaths,
      paths: sujiaoMainPaths.paths.map((path) => ({ ...path, color: 'red' })),
    };
    expect(isGridPathsVisual(extra)).toBe(false);
  });
});
