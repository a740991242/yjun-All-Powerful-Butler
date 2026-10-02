import { expect, it } from 'vitest';

import { finalCurvedPieces } from '../content/sujiao-final-four-shapes';
import { isQuarterCircleVisual, quarterCircleSectors } from './quarter-circle';
it('uses equal-radius true circular arcs, a common assembled center and quarter turns without filling missing pieces', () => {
  for (const count of [1, 2, 3, 4] as const)
    for (const separate of [false, true])
      for (const review of [false, true]) {
        const model = finalCurvedPieces(count, separate, review);
        const parts = quarterCircleSectors(model);
        expect(isQuarterCircleVisual(model)).toBe(true);
        expect(parts).toHaveLength(count);
        expect(new Set(parts.map((p) => p.radius)).size).toBe(1);
        expect(
          parts.every((p) =>
            p.path.includes(` A${p.radius} ${p.radius} 0 0 1 `),
          ),
        ).toBe(true);
        if (separate)
          expect(new Set(parts.map((p) => `${p.x},${p.y}`)).size).toBe(count);
        else {
          expect(new Set(parts.map((p) => `${p.x},${p.y}`)).size).toBe(1);
          expect(parts.map((p) => p.angle)).toEqual(
            Array.from({ length: count }, (_, i) => (review ? 90 : 0) + i * 90),
          );
        }
      }
});
it('rejects malformed counts, array enums, non-quarter turns and imported answer or radius overrides', () => {
  const model = finalCurvedPieces();
  for (const patch of [
    { count: 0 },
    { count: 5 },
    { count: 3.5 },
    { count: '4' },
    { layout: ['assembled'] },
    { layout: 'gapless' },
    { turn: 45 },
    { turn: 360 },
    { radius: 80 },
    { answer: 'circle' },
  ])
    expect(isQuarterCircleVisual({ ...model, ...patch })).toBe(false);
  expect(isQuarterCircleVisual(null)).toBe(false);
  expect(isQuarterCircleVisual([])).toBe(false);
});
