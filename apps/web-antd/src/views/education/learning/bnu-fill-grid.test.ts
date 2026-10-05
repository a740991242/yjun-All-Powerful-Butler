import { expect, it } from 'vitest';

import { bnuFillGrid, isBnuFillGridVisual } from './bnu-fill-grid';

it('preserves all original cells, givens and row-major blank letters in four fixed scenes', () => {
  const fixtures = [
    [
      'three',
      [
        [1, null, null],
        [null, 1, null],
        [null, 2, 1],
      ],
      5,
    ],
    [
      'five',
      [
        [5, 1, null, null, 3],
        [1, 3, null, null, 4],
        [4, 2, null, 1, 5],
        [2, null, 4, 3, 1],
        [3, 4, 1, null, 2],
      ],
      7,
    ],
    [
      'five-stage',
      [
        [5, 1, null, null, 3],
        [1, 3, null, null, 4],
        [4, 2, 3, 1, 5],
        [2, 5, 4, 3, 1],
        [3, 4, 1, 5, 2],
      ],
      4,
    ],
    [
      'five-next',
      [
        [5, 1, 2, null, 3],
        [1, 3, null, null, 4],
        [4, 2, 3, 1, 5],
        [2, 5, 4, 3, 1],
        [3, 4, 1, 5, 2],
      ],
      3,
    ],
  ] as const;
  for (const [scene, givens, count] of fixtures) {
    const model = bnuFillGrid({
      kind: 'bnu-fill-grid',
      scene,
      variant: 'main',
    });
    expect(model.givens).toEqual(givens);
    expect(model.size).toBe(givens.length);
    expect(model.labels.flat().filter((n) => n !== null)).toEqual(
      Array.from({ length: count }, (_, i) => String.fromCodePoint(65 + i)),
    );
    model.givens.forEach((row, r) =>
      row.forEach((n, c) => {
        expect(model.labels[r]?.[c] === null).toBe(n !== null);
      }),
    );
    expect(Object.keys(model).toSorted()).toEqual(['givens', 'labels', 'size']);
  }
});
it('uses separately specified new review givens and never leaks fill answers', () => {
  const fixtures = [
    [
      'three',
      [
        [2, null, null],
        [null, 2, null],
        [null, 3, 2],
      ],
    ],
    [
      'five',
      [
        [1, 2, null, null, 4],
        [2, 4, null, null, 5],
        [5, 3, null, 2, 1],
        [3, null, 5, 4, 2],
        [4, 5, 2, null, 3],
      ],
    ],
    [
      'five-stage',
      [
        [1, 2, null, null, 4],
        [2, 4, null, null, 5],
        [5, 3, 4, 2, 1],
        [3, 1, 5, 4, 2],
        [4, 5, 2, 1, 3],
      ],
    ],
    [
      'five-next',
      [
        [1, 2, 3, null, 4],
        [2, 4, null, null, 5],
        [5, 3, 4, 2, 1],
        [3, 1, 5, 4, 2],
        [4, 5, 2, 1, 3],
      ],
    ],
  ] as const;
  for (const [scene, givens] of fixtures)
    expect(
      bnuFillGrid({ kind: 'bnu-fill-grid', scene, variant: 'review' }).givens,
    ).toEqual(givens);
  const one = bnuFillGrid({
    kind: 'bnu-fill-grid',
    scene: 'three',
    variant: 'main',
  });
  one.givens[0]![0] = 99;
  expect(
    bnuFillGrid({ kind: 'bnu-fill-grid', scene: 'three', variant: 'main' })
      .givens[0]?.[0],
  ).toBe(1);
});
it('rejects unknown, coerced or answer-bearing models without widening the existing rules', () => {
  for (const value of [
    null,
    [],
    { kind: 'bnu-fill-grid', scene: 'three' },
    { kind: 'bnu-fill-grid', scene: 'unknown', variant: 'main' },
    { kind: 'bnu-fill-grid', scene: 'three', variant: 'MAIN' },
    {
      kind: 'bnu-fill-grid',
      scene: { toString: () => 'three' },
      variant: 'main',
    },
    {
      kind: 'bnu-fill-grid',
      scene: 'three',
      variant: 'main',
      answers: [3, 2, 2, 3, 3],
    },
    { kind: 'bnu-fill-grid', scene: 'three', variant: 'main', givens: [[1]] },
  ])
    expect(isBnuFillGridVisual(value)).toBe(false);
});
