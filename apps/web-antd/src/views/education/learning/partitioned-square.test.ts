import { expect, it } from 'vitest';

import { isPartitionedSquareVisual, squarePieces } from './partitioned-square';

it('rejects unknown layouts and payload fields rather than trusting imported geometry or answers', () => {
  expect(
    isPartitionedSquareVisual({
      kind: 'partitioned-square',
      layout: 'rectangles',
    }),
  ).toBe(true);
  expect(
    isPartitionedSquareVisual({
      kind: 'partitioned-square',
      layout: 'triangles',
    }),
  ).toBe(true);
  for (const invalid of [
    null,
    [],
    { kind: 'partitioned-square', layout: 'circle' },
    { kind: 'partitioned-square', layout: 'triangles', answer: 5 },
    { kind: 'partitioned-square', layout: 'triangles', points: [] },
  ])
    expect(isPartitionedSquareVisual(invalid)).toBe(false);
});

it('fills the same square exactly once with both original partitions and a genuine central square', () => {
  for (const layout of ['rectangles', 'triangles'] as const) {
    const pieces = squarePieces({ kind: 'partitioned-square', layout });
    expect(pieces.map((p) => p.letter)).toEqual(['A', 'B', 'C', 'D', 'E']);
    let total = 0;
    for (const piece of pieces) {
      let twiceArea = 0;
      for (let i = 0; i < piece.points.length; i++) {
        const a = piece.points[i]!;
        const b = piece.points[(i + 1) % piece.points.length]!;
        twiceArea += a[0] * b[1] - a[1] * b[0];
      }
      total += Math.abs(twiceArea) / 2;
    }
    expect(total).toBe(9);
    for (let x = 0.113; x < 3; x += 0.2)
      for (let y = 0.127; y < 3; y += 0.2) {
        const covering = pieces.filter((piece) => {
          const signs = piece.points.map((a, i) => {
            const b = piece.points[(i + 1) % piece.points.length]!;
            return (b[0] - a[0]) * (y - a[1]) - (b[1] - a[1]) * (x - a[0]);
          });
          return signs.every((s) => s > 0) || signs.every((s) => s < 0);
        });
        expect(covering, `${layout}/${x}/${y}`).toHaveLength(1);
      }
    const centre = pieces[4]!.points;
    const vectors = centre.map((a, i) => {
      const b = centre[(i + 1) % centre.length]!;
      return [b[0] - a[0], b[1] - a[1]];
    });
    expect(new Set(vectors.map(([x, y]) => x! * x! + y! * y!)).size).toBe(1);
    for (let i = 0; i < 4; i++) {
      const a = vectors[i]!;
      const b = vectors[(i + 1) % 4]!;
      expect(a[0]! * b[0]! + a[1]! * b[1]!).toBeCloseTo(0);
    }
    expect(pieces.slice(0, 4).map((p) => p.points.length)).toEqual(
      layout === 'triangles' ? [3, 3, 3, 3] : [4, 4, 4, 4],
    );
  }
});
