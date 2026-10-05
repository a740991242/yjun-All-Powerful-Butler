import { expect, it } from 'vitest';

import {
  bnuPatternDesignCards as cards,
  bnuPatternDesignDots as dots,
  bnuPatternDesignScenes as scenes,
  isBnuPatternDesignVisual as valid,
} from './bnu-pattern-design';
import { required } from './required';
it('strictly admits only fixed scenes and variants, keeps generated geometry fresh and contains every edge in the card', () => {
  for (const scene of scenes)
    for (const variant of ['main', 'review'] as const) {
      const v = { kind: 'bnu-pattern-design' as const, scene, variant };
      expect(valid(v)).toBe(true);
      for (const extra of [
        { answer: 'B和D' },
        { points: [] },
        { selected: 'D' },
      ])
        expect(valid({ ...v, ...extra })).toBe(false);
      const first = cards(v);
      expect(first.map((c) => c.label)).toEqual(
        scene === 'dot-grid' ? [] : ['A', 'B', 'C', 'D'],
      );
      for (const c of first)
        for (const [x, y] of [...c.points, ...c.seam]) {
          expect(x).toBeGreaterThan(8);
          expect(x).toBeLessThan(136);
          expect(y).toBeGreaterThan(8);
          expect(y).toBeLessThan(136);
        }
      if (first.length > 0) {
        required(first[0]).points[0] = [999, 999];
        expect(cards(v)[0]?.points[0]).not.toEqual([999, 999]);
      }
    }
  expect(
    valid({ kind: 'bnu-pattern-design', scene: 'unknown', variant: 'main' }),
  ).toBe(false);
  expect(valid(['triangle'])).toBe(false);
});
it('keeps the full contour type under scale and rotation, uses changed matching positions and subdivides the review hexagon into three regions', () => {
  for (const scene of scenes.filter((s) => s !== 'dot-grid')) {
    const main = cards({ kind: 'bnu-pattern-design', scene, variant: 'main' });
    const review = cards({
      kind: 'bnu-pattern-design',
      scene,
      variant: 'review',
    });
    const n = required(main[0]).points.length;
    expect(required(main[1]).points).toHaveLength(n);
    expect(required(main[3]).points).toHaveLength(n);
    expect(required(main[2]).points.length).not.toBe(n);
    expect(required(review[1]).points.length).not.toBe(n);
    expect(required(review[2]).points).toHaveLength(n);
    expect(required(review[3]).points).toHaveLength(n);
    const ratios = (c: (typeof main)[number]) => {
      const ls = c.points.map((p, i) => {
        const q = required(c.points[(i + 1) % c.points.length]);
        return Math.hypot(p[0] - q[0], p[1] - q[1]);
      });
      const max = Math.max(...ls);
      return ls.map((l) => Number((l / max).toFixed(7)));
    };
    for (const c of [
      required(main[1]),
      required(main[3]),
      required(review[2]),
      required(review[3]),
    ])
      expect(ratios(c)).toEqual(ratios(required(main[0])));
  }
  const d = required(
    cards({
      kind: 'bnu-pattern-design',
      scene: 'hexagon',
      variant: 'review',
    })[3],
  );
  expect(d.seam).toEqual([
    required(d.points[2]),
    required(d.points[0]),
    required(d.points[4]),
  ]);
  const triangle = required(
    cards({
      kind: 'bnu-pattern-design',
      scene: 'triangle',
      variant: 'main',
    })[3],
  );
  expect(triangle.seam[0]).toEqual([
    (required(triangle.points[1])[0] + required(triangle.points[2])[0]) / 2,
    (required(triangle.points[1])[1] + required(triangle.points[2])[1]) / 2,
  ]);
});
it('changes grid conditions to five rows while preserving seven columns and never creates hidden drawing strokes', () => {
  const main = dots({
    kind: 'bnu-pattern-design',
    scene: 'dot-grid',
    variant: 'main',
  });
  const review = dots({
    kind: 'bnu-pattern-design',
    scene: 'dot-grid',
    variant: 'review',
  });
  expect(main).toHaveLength(49);
  expect(review).toHaveLength(35);
  expect(new Set(main.map((p) => p[1])).size).toBe(7);
  expect(new Set(review.map((p) => p[1])).size).toBe(5);
  expect(new Set(review.map((p) => p[0])).size).toBe(7);
  expect(new Set(main.map((p) => p.join(','))).size).toBe(49);
});
