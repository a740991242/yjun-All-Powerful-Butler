import type { PairArrangement, PairPoint } from './two-piece-join';

import { expect, it } from 'vitest';

import { fold } from './fold';
import {
  isTwoPieceJoinVisual,
  pairJoinArea,
  pairJoinCanvasPolygons,
  pairJoinPolygons,
  pairJoinResult,
} from './two-piece-join';
const layouts: PairArrangement[] = [
  'square-rectangle',
  'rectangle-square',
  'rectangle-long',
  'triangle-square',
  'triangle-parallelogram',
  'triangle-big',
];
function area(p: PairPoint[]) {
  return Math.abs(
    fold(p, 0, (sum, [x, y], i) => {
      const next = p[(i + 1) % p.length]!;
      return sum + x * next[1] - y * next[0];
    }) / 2,
  );
}
function edges(p: PairPoint[]) {
  return p
    .map(([x, y], i) => {
      const next = p[(i + 1) % p.length]!;
      return (x - next[0]) ** 2 + (y - next[1]) ** 2;
    })
    .toSorted((a, b) => a - b);
}
it('uses exactly two congruent pieces, a shared full edge and opposite interiors without overlap', () => {
  const expected = [
    'rectangle',
    'square',
    'rectangle',
    'square',
    'parallelogram',
    'triangle',
  ];
  layouts.forEach((arrangement, i) => {
    const [a, b] = pairJoinPolygons(arrangement);
    expect(area(a!)).toBe(area(b!));
    expect(edges(a!)).toEqual(edges(b!));
    expect(area(a!) + area(b!)).toBe(pairJoinArea(arrangement));
    const common = a!.filter((p) =>
      b!.some((q) => p[0] === q[0] && p[1] === q[1]),
    );
    expect(common).toHaveLength(2);
    const [left, right] = common;
    const side = ([x, y]: PairPoint) =>
      (right![0] - left![0]) * (y - left![1]) -
      (right![1] - left![1]) * (x - left![0]);
    const aside = a!.map((point) => side(point)).filter((n) => n !== 0);
    const bside = b!.map((point) => side(point)).filter((n) => n !== 0);
    expect(aside.length).toBeGreaterThan(0);
    expect(bside.length).toBeGreaterThan(0);
    expect(aside.every((n) => Math.sign(n) === Math.sign(aside[0]!))).toBe(
      true,
    );
    expect(bside.every((n) => Math.sign(n) === -Math.sign(aside[0]!))).toBe(
      true,
    );
    expect(pairJoinResult(arrangement)).toBe(expected[i]);
  });
});
it('keeps every complete joined outline and its mirror inside the actual SVG viewBox', () => {
  for (const arrangement of layouts)
    for (const polygon of pairJoinCanvasPolygons(arrangement))
      for (const [x, y] of polygon) {
        expect(x).toBeGreaterThan(2);
        expect(x).toBeLessThan(308);
        expect(310 - x).toBeGreaterThan(2);
        expect(310 - x).toBeLessThan(308);
        expect(y).toBeGreaterThan(2);
        expect(y).toBeLessThan(208);
      }
});
it('keeps mirrored examples valid while rejecting unknown layouts, array enums and extra answer fields', () => {
  for (const arrangement of layouts)
    for (const reflected of [false, true])
      expect(
        isTwoPieceJoinVisual({
          kind: 'two-piece-join',
          arrangement,
          reflected,
        }),
      ).toBe(true);
  for (const value of [
    null,
    [],
    {
      kind: 'two-piece-join',
      arrangement: ['triangle-square'],
      reflected: false,
    },
    { kind: 'two-piece-join', arrangement: 'triangle', reflected: false },
    { kind: 'two-piece-join', arrangement: 'triangle-square', reflected: 0 },
    {
      kind: 'two-piece-join',
      arrangement: 'triangle-square',
      reflected: false,
      result: 'square',
    },
  ])
    expect(isTwoPieceJoinVisual(value)).toBe(false);
});
