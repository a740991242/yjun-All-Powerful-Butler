import { expect, it } from 'vitest';

import {
  embeddedGeometry,
  embeddedPieces,
  embeddedRegions,
  isEmbeddedShapesVisual,
} from './embedded-shapes';

it('keeps every selected region within the filled original figure and distinguishes complete sizes and unit counts', () => {
  expect(embeddedPieces.map((p) => p.length)).toEqual([10, 6, 12, 8, 12, 14]);
  const inside = (x: number, y: number, poly: { x: number; y: number }[]) => {
    const signs = poly.map((a, i) => {
      const b = poly[(i + 1) % poly.length]!;
      return (b.x - a.x) * (y - a.y) - (b.y - a.y) * (x - a.x);
    });
    return (
      signs.every((v) => v >= -0.000001) || signs.every((v) => v <= 0.000001)
    );
  };
  for (const pattern of [0, 1, 2] as const) {
    const geometry = embeddedGeometry({
      kind: 'embedded-shapes',
      pattern,
      highlight: null,
    });
    for (const region of embeddedRegions[pattern]!) {
      const vertices = region.points.map(([x, y]) => ({ x, y }));
      for (let x = 0; x <= 3; x += 0.1)
        for (let y = 0; y <= 3; y += 0.1)
          if (inside(x, y, vertices))
            expect(
              geometry.pieces.some((piece) => inside(x, y, piece)),
              `${pattern}/${region.shape}/${x},${y}`,
            ).toBe(true);
      for (const [x, y] of region.points) {
        expect(35 + 70 * x).toBeGreaterThan(0);
        expect(35 + 70 * x).toBeLessThan(280);
        expect(35 + 70 * y).toBeLessThan(280);
      }
      if (region.shape === 'triangle') expect(region.points).toHaveLength(3);
      else expect(region.points).toHaveLength(4);
    }
  }
  expect(embeddedRegions[0]![0]!.points).not.toEqual(
    embeddedRegions[0]![1]!.points,
  );
});
it('requires known complete pattern/highlight enums and rejects answer-bearing payloads', () => {
  expect(
    isEmbeddedShapesVisual({
      kind: 'embedded-shapes',
      pattern: 0,
      highlight: null,
    }),
  ).toBe(true);
  expect(
    isEmbeddedShapesVisual({
      kind: 'embedded-shapes',
      pattern: 2,
      highlight: 5,
    }),
  ).toBe(true);
  for (const value of [
    null,
    [],
    { kind: 'embedded-shapes', pattern: [0], highlight: null },
    { kind: 'embedded-shapes', pattern: 6, highlight: null },
    { kind: 'embedded-shapes', pattern: 3, highlight: 0 },
    { kind: 'embedded-shapes', pattern: 0, highlight: 6 },
    { kind: 'embedded-shapes', pattern: 0, highlight: [1] },
    { kind: 'embedded-shapes', pattern: 0, highlight: null, answer: 'square' },
  ])
    expect(isEmbeddedShapesVisual(value)).toBe(false);
});
