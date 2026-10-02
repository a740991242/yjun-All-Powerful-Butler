import { expect, it } from 'vitest';

import {
  sujiaoMainBuild,
  sujiaoReviewBuild,
} from '../content/sujiao-solid-build';
import { fold } from './fold';
import {
  isSolidBuildVisual,
  solidBuildCount,
  solidBuildSlots,
} from './solid-build';
it('counts nine independent pieces in both original arrangements', () => {
  for (const [model, counts] of [
    [sujiaoMainBuild, [2, 1, 5, 1]],
    [sujiaoReviewBuild, [1, 5, 3, 0]],
  ] as const) {
    expect(isSolidBuildVisual(model)).toBe(true);
    expect(
      ['cube', 'cuboid', 'cylinder', 'sphere'].map((shape) =>
        solidBuildCount(
          model,
          shape as 'cube' | 'cuboid' | 'cylinder' | 'sphere',
        ),
      ),
    ).toEqual(counts);
    expect(fold(counts, 0, (sum, n) => sum + n)).toBe(solidBuildSlots.length);
  }
});
it('rejects unsupported shapes, missing parts, extra depth and hidden answers', () => {
  for (const value of [
    { ...sujiaoMainBuild, shapes: sujiaoMainBuild.shapes.slice(1) },
    { ...sujiaoMainBuild, shapes: [...sujiaoMainBuild.shapes, 'cube'] },
    {
      ...sujiaoMainBuild,
      shapes: ['circle', ...sujiaoMainBuild.shapes.slice(1)],
    },
    { ...sujiaoMainBuild, depth: 2 },
    { ...sujiaoMainBuild, totals: [2, 1, 5, 1] },
  ])
    expect(isSolidBuildVisual(value)).toBe(false);
  const sparse = structuredClone(sujiaoMainBuild);
  Reflect.deleteProperty(sparse.shapes, '1');
  expect(isSolidBuildVisual(sparse)).toBe(false);
});
