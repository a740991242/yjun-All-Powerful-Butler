import { expect, it } from 'vitest';

import {
  bnuHundredRow,
  bnuHundredTable,
  isBnuHundredTableVisual,
} from './bnu-hundred-table';

it('keeps all 100 cells, twenty givens and eighty blanks without providing missing values', () => {
  const full = bnuHundredTable({
    kind: 'bnu-hundred-table',
    scene: 'full',
    variant: 'main',
  });
  expect(full).toHaveLength(10);
  for (const row of full) expect(row.cells).toHaveLength(10);
  expect(
    full
      .flatMap((r) => r.cells)
      .filter((c) => c.value !== null)
      .map((c) => c.value),
  ).toEqual([
    1, 10, 12, 19, 23, 28, 34, 37, 45, 46, 55, 56, 64, 67, 73, 78, 82, 89, 91,
    100,
  ]);
  expect(
    full.flatMap((r) => r.cells).filter((c) => c.value === null),
  ).toHaveLength(80);
  expect(full.flatMap((r) => r.cells).every((c) => c.label === null)).toBe(
    true,
  );
  for (let row = 1; row <= 10; row++) {
    const active = bnuHundredTable({
      kind: 'bnu-hundred-table',
      scene: 'full',
      variant: 'main',
      row,
    });
    const labels = active
      .flatMap((r) => r.cells)
      .filter((c) => c.label !== null);
    expect(labels.map((c) => c.label)).toEqual([
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
    ]);
    expect(labels.every((c) => c.row === row && c.value === null)).toBe(true);
  }
});
it('keeps every original fragment given and maps every blank in reading order', () => {
  const cases = [
    [
      'fifty-eight',
      [
        [58, null, 60],
        [null, null, null],
        [78, null, 80],
      ],
      5,
    ],
    [
      'sixty-seven',
      [
        [null, null, null],
        [null, 67, null],
        [null, null, null],
      ],
      8,
    ],
    [
      'practice-one',
      [
        [27, 28, null],
        [null, 38, null],
        [null, null, 49],
      ],
      5,
    ],
    [
      'practice-two',
      [
        [null, 31, null],
        [40, null, 42],
        [null, 51, null],
      ],
      5,
    ],
    [
      'practice-three',
      [
        [null, null, null],
        [null, 85, null],
        [null, null, null],
      ],
      8,
    ],
  ] as const;
  for (const [scene, given, count] of cases) {
    const rows = bnuHundredTable({
      kind: 'bnu-hundred-table',
      scene,
      variant: 'main',
    });
    expect(rows.map((r) => r.cells.map((c) => c.value))).toEqual(given);
    expect(
      rows
        .flatMap((r) => r.cells)
        .filter((c) => c.value === null)
        .map((c) => c.label),
    ).toEqual(
      Array.from({ length: count }, (_, i) => String.fromCodePoint(65 + i)),
    );
  }
});
it('provides a separate complete but unclassified chart and new review givens', () => {
  const complete = bnuHundredTable({
    kind: 'bnu-hundred-table',
    scene: 'complete',
    variant: 'main',
  }).flatMap((r) => r.cells);
  expect(complete.map((c) => c.value)).toEqual(
    Array.from({ length: 100 }, (_, i) => i + 1),
  );
  expect(complete.every((c) => c.label === null)).toBe(true);
  const review = bnuHundredRow(
    { kind: 'bnu-hundred-table', scene: 'full', variant: 'review', row: 2 },
    2,
  );
  expect(review.cells.map((c) => c.value)).toEqual([
    null,
    null,
    13,
    null,
    null,
    null,
    null,
    18,
    null,
    null,
  ]);
  expect(
    bnuHundredTable({
      kind: 'bnu-hundred-table',
      scene: 'fifty-eight',
      variant: 'review',
    }).map((r) => r.cells.map((c) => c.value)),
  ).toEqual([
    [48, null, 50],
    [null, null, null],
    [68, null, 70],
  ]);
});
it('strictly rejects unbounded scenes, coercion, invalid rows and extra fields', () => {
  const good = { kind: 'bnu-hundred-table', scene: 'full', variant: 'main' };
  expect(isBnuHundredTableVisual(good)).toBe(true);
  for (const bad of [
    null,
    [],
    {},
    { ...good, scene: 'unknown' },
    { ...good, scene: { toString: () => 'full' } },
    { ...good, variant: 'other' },
    { ...good, row: 0 },
    { ...good, row: 11 },
    { ...good, row: 1.5 },
    { ...good, row: '1' },
    { ...good, row: null },
    { ...good, answer: 80 },
    { ...good, values: [1, 100] },
    { ...good, scene: 'complete', row: 1 },
    { ...good, scene: 'fifty-eight', row: 1 },
  ])
    expect(isBnuHundredTableVisual(bad)).toBe(false);
});
