import type {
  BnuFinalGeometryVisual,
  FinalGeometryPart,
} from './bnu-final-geometry';

import { describe, expect, it } from 'vitest';

import {
  bnuFinalGeometryDots,
  bnuFinalGeometryFrame,
  bnuFinalGeometryParts,
  finalGeometryArea,
  finalGeometryCounts,
  isBnuFinalGeometryVisual,
} from './bnu-final-geometry';
const visual = (
  scene: BnuFinalGeometryVisual['scene'],
  variant: BnuFinalGeometryVisual['variant'] = 'main',
): BnuFinalGeometryVisual => ({ kind: 'bnu-final-geometry', scene, variant });
function geometricShape(p: FinalGeometryPart) {
  if (p.circle) return 'circle';
  if (p.points.length === 3) return 'triangle';
  const lengths = p.points.map(([x, y], i) => {
    const next = p.points[(i + 1) % p.points.length];
    if (!next) throw new Error('missing point');
    return Math.hypot(next[0] - x, next[1] - y);
  });
  const square = lengths.every((n) => Math.abs(n - lengths[0]!) < 1e-8);
  for (let i = 0; i < p.points.length; i++) {
    const a = p.points[i];
    const b = p.points[(i + 1) % p.points.length];
    const c = p.points[(i + 2) % p.points.length];
    if (!a || !b || !c) throw new Error('missing point');
    expect(
      Math.abs((b[0] - a[0]) * (c[0] - b[0]) + (b[1] - a[1]) * (c[1] - b[1])),
    ).toBe(0);
  }
  return square ? 'square' : 'rectangle';
}
describe('closed final geometry diagrams', () => {
  it('derives every collage category from vertices/radii, not stored answer counts; keeps changed review materials and exact zero', () => {
    for (const [scene, variant, expected] of [
      ['robot', 'main', [15, 2, 2, 6]],
      ['robot', 'review', [13, 2, 2, 4]],
      ['train', 'main', [5, 1, 1, 4]],
      ['train', 'review', [5, 1, 0, 4]],
    ] as const) {
      const v = visual(scene, variant);
      const parts = bnuFinalGeometryParts(v);
      const types = parts.map((p) => geometricShape(p));
      expect(
        ['rectangle', 'square', 'triangle', 'circle'].map(
          (s) => types.filter((t) => t === s).length,
        ),
      ).toEqual(expected);
      expect(finalGeometryCounts(v)).toEqual(expected);
      expect(new Set(parts.map((p) => p.id)).size).toBe(parts.length);
      for (const p of parts) {
        expect(p.shape).toBe(geometricShape(p));
        expect(finalGeometryArea(p)).toBeGreaterThan(0);
      }
    }
  });
  it('covers exactly one 240×160 rectangle in all three divisions, with no gap/overlap and orientation-independent categories', () => {
    for (const scene of ['diagonal', 'parallel', 'square-part'] as const)
      for (const variant of ['main', 'review'] as const) {
        const parts = bnuFinalGeometryParts(visual(scene, variant));
        expect(parts).toHaveLength(2);
        expect(parts.reduce((s, p) => s + finalGeometryArea(p), 0)).toBe(
          38_400,
        );
        const categories = {
          diagonal: ['triangle', 'triangle'],
          parallel: ['rectangle', 'rectangle'],
          'square-part': ['square', 'rectangle'],
        };
        expect(parts.map((p) => geometricShape(p))).toEqual(categories[scene]);
        const all = parts.flatMap((p) => p.points);
        expect([
          Math.max(...all.map((p) => p[0])) - Math.min(...all.map((p) => p[0])),
          Math.max(...all.map((p) => p[1])) - Math.min(...all.map((p) => p[1])),
        ]).toEqual(variant === 'main' ? [240, 160] : [160, 240]);
        // Independently sample every interior unit square: exactly one partition covers each centre.
        const left = Math.min(...all.map((p) => p[0]));
        const top = Math.min(...all.map((p) => p[1]));
        const inside = (p: FinalGeometryPart, x: number, y: number) => {
          const signs = p.points.map(([a, b], i) => {
            const n = p.points[(i + 1) % p.points.length];
            if (!n) throw new Error('point');
            return (n[0] - a) * (y - b) - (n[1] - b) * (x - a);
          });
          return signs.every((s) => s > 0) || signs.every((s) => s < 0);
        };
        let badCells = 0;
        for (let y = top + 0.37; y < Math.max(...all.map((p) => p[1])); y += 1)
          for (
            let x = left + 0.23;
            x < Math.max(...all.map((p) => p[0]));
            x += 1
          )
            if (parts.filter((p) => inside(p, x, y)).length !== 1) badCells++;
        expect(badCells).toBe(0);
      }
  });
  it('has every source dot position and a genuinely changed review grid, with no strokes or physical-centimetre claims', () => {
    for (const [variant, rows, columns] of [
      ['main', 6, 11],
      ['review', 5, 9],
    ] as const) {
      const dots = bnuFinalGeometryDots(visual('dots', variant));
      expect(dots).toHaveLength(rows * columns);
      expect(new Set(dots.map((p) => p[0])).size).toBe(columns);
      expect(new Set(dots.map((p) => p[1])).size).toBe(rows);
      expect(bnuFinalGeometryParts(visual('dots', variant))).toEqual([]);
    }
  });
  it('rejects arbitrary counts, coordinates, answers, scenes and variants and returns fresh model arrays', () => {
    for (const scene of [
      'diagonal',
      'parallel',
      'square-part',
      'dots',
      'robot',
      'train',
    ] as const)
      for (const variant of ['main', 'review'] as const) {
        const v = visual(scene, variant);
        expect(isBnuFinalGeometryVisual(v)).toBe(true);
        const parts = bnuFinalGeometryParts(v);
        const dots = bnuFinalGeometryDots(v);
        const old = JSON.stringify({ parts, dots });
        parts.length = 0;
        dots.length = 0;
        expect(
          JSON.stringify({
            parts: bnuFinalGeometryParts(v),
            dots: bnuFinalGeometryDots(v),
          }),
        ).toBe(old);
      }
    for (const extra of [
      { parts: [] },
      { counts: [15, 2, 2, 6] },
      { answer: 2 },
      { scene: ['dots'] },
      { scene: 'unknown' },
      { variant: 'unknown' },
    ])
      expect(
        isBnuFinalGeometryVisual({ ...visual('diagonal'), ...extra }),
      ).toBe(false);
  });
});

it('frames every entire part/dot with a margin while preserving coordinates and scale, so the initial phone view does not hide the second region', () => {
  for (const scene of [
    'diagonal',
    'parallel',
    'square-part',
    'dots',
    'robot',
    'train',
  ] as const)
    for (const variant of ['main', 'review'] as const) {
      const v = visual(scene, variant);
      const frame = bnuFinalGeometryFrame(v);
      expect(
        Number.isFinite(frame.width) && frame.width > 0 && frame.height > 0,
      ).toBe(true);
      const all = bnuFinalGeometryParts(v).flatMap((p) =>
        p.circle
          ? [
              [p.circle.x - p.circle.r, p.circle.y - p.circle.r],
              [p.circle.x + p.circle.r, p.circle.y + p.circle.r],
            ]
          : p.points,
      );
      for (const [x, y] of bnuFinalGeometryDots(v))
        all.push([x - 3, y - 3], [x + 3, y + 3]);
      for (const p of all) {
        expect(p[0]).toBeGreaterThanOrEqual(frame.x + 12);
        expect(p[0]).toBeLessThanOrEqual(frame.x + frame.width - 12);
        expect(p[1]).toBeGreaterThanOrEqual(frame.y + 12);
        expect(p[1]).toBeLessThanOrEqual(frame.y + frame.height - 12);
      }
      if (['diagonal', 'parallel', 'square-part'].includes(scene))
        expect(28 * Math.min(1, 211 / frame.width)).toBeGreaterThanOrEqual(20);
    }
});
