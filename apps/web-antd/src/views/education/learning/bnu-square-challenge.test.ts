import type { TangramPoint } from './bnu-tangram';

import { expect, it } from 'vitest';

import {
  bnuSquareChallengePieces as pieces,
  bnuSquareChallengeScenes as scenes,
} from './bnu-square-challenge';
import { bnuTangramPieces } from './bnu-tangram';
import { fold } from './fold';
import { required } from './required';
import { hull, overlaps } from './shape-join';
const asPoints = (ps: TangramPoint[]) => ps.map(([x, y]) => ({ x, y }));
const sides = (ps: TangramPoint[]) =>
  ps
    .map((p, i) => {
      const q = required(ps[(i + 1) % ps.length]);
      return (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2;
    })
    .toSorted((a, b) => a - b);
const area = (ps: TangramPoint[]) =>
  Math.abs(
    fold(ps, 0, (sum, p, i) => {
      const q = required(ps[(i + 1) % ps.length]);
      return sum + p[0] * q[1] - p[1] * q[0];
    }),
  ) / 2;
it('constructs all five source-supported square examples with congruent numbered pieces, disjoint interiors and complete square boundaries', () => {
  const original = new Map(
    bnuTangramPieces({
      kind: 'bnu-tangram',
      scene: 'square',
      variant: 'main',
    }).map((p) => [p.id, p]),
  );
  const ids = [
    [1, 2],
    [4, 6],
    [7, 4, 6],
    [1, 5, 4, 6],
    [1, 7, 4, 6],
  ];
  scenes.forEach((scene, i) => {
    const ps = pieces(scene);
    expect(ps.map((p) => p.id)).toEqual(ids[i]);
    for (const p of ps) {
      const source = required(original.get(p.id));
      expect(sides(p.points)).toEqual(sides(source.points));
      expect(area(p.points)).toBe(area(source.points));
      for (const [x, y] of [...p.points, p.label]) {
        expect(x).toBeGreaterThanOrEqual(20);
        expect(x).toBeLessThanOrEqual(340);
        expect(y).toBeGreaterThanOrEqual(20);
        expect(y).toBeLessThanOrEqual(340);
      }
    }
    for (let a = 0; a < ps.length; a++)
      for (let b = a + 1; b < ps.length; b++)
        expect(
          overlaps(
            asPoints(required(ps[a]).points),
            asPoints(required(ps[b]).points),
          ),
        ).toBe(false);
    const boundary = hull(ps.flatMap((p) => asPoints(p.points))).map(
      ({ x, y }): TangramPoint => [x, y],
    );
    expect(boundary).toHaveLength(4);
    expect(new Set(sides(boundary)).size).toBe(1);
    for (let j = 0; j < 4; j++) {
      const a = required(boundary[j]);
      const b = required(boundary[(j + 1) % 4]);
      const c = required(boundary[(j + 2) % 4]);
      expect(
        Math.abs((a[0] - b[0]) * (c[0] - b[0]) + (a[1] - b[1]) * (c[1] - b[1])),
      ).toBe(0);
    }
    expect(area(boundary)).toBe(fold(ps, 0, (n, p) => n + area(p.points)));
  });
});
it('keeps the two-piece square sizes different, the two four-piece methods distinct and generated positions isolated from mutation', () => {
  expect(
    fold(pieces('square-two-large'), 0, (n, p) => n + area(p.points)),
  ).toBe(20_000);
  expect(
    fold(pieces('square-two-small'), 0, (n, p) => n + area(p.points)),
  ).toBe(5000);
  expect(pieces('square-four-square').map((p) => p.id)).toContain(5);
  expect(pieces('square-four-triangle').map((p) => p.id)).toContain(7);
  const first = pieces('square-four-square');
  required(first[0]).points[0] = [999, 999];
  expect(pieces('square-four-square')[0]?.points[0]).toEqual([80, 160]);
});

it('checks both assembled other halves by complete congruent boundaries and an exact half-turn rather than area alone', () => {
  for (const scene of ['square-four-square', 'square-four-triangle'] as const) {
    const ps = pieces(scene);
    const large = required(ps.find((p) => p.id === 1));
    const others = ps.filter((p) => p.id !== 1);
    const boundary = hull(others.flatMap((p) => asPoints(p.points))).map(
      ({ x, y }): TangramPoint => [x, y],
    );
    expect(boundary).toHaveLength(3);
    expect(sides(boundary)).toEqual(sides(large.points));
    expect(area(boundary)).toBe(area(large.points));
    const turned = large.points.map(([x, y]) => [360 - x, 320 - y].join(','));
    expect(new Set(turned)).toEqual(new Set(boundary.map((p) => p.join(','))));
  }
});
