import { expect, it } from 'vitest';

import {
  isTeenAdditionTableVisual,
  teenAdditionRows,
} from './teen-addition-table';
it('matches every fixed source row, all ten givens and twenty-six independent position blanks', () => {
  const rows = teenAdditionRows({
    kind: 'teen-addition-table',
    variant: 'main',
  });
  expect(
    rows.map((row) => row.cells.map(({ left, right }) => [left, right])),
  ).toEqual([
    [
      [9, 2],
      [8, 3],
      [7, 4],
      [6, 5],
      [5, 6],
      [4, 7],
      [3, 8],
      [2, 9],
    ],
    [
      [9, 3],
      [8, 4],
      [7, 5],
      [6, 6],
      [5, 7],
      [4, 8],
      [3, 9],
    ],
    [
      [9, 4],
      [8, 5],
      [7, 6],
      [6, 7],
      [5, 8],
      [4, 9],
    ],
    [
      [9, 5],
      [8, 6],
      [7, 7],
      [6, 8],
      [5, 9],
    ],
    [
      [9, 6],
      [8, 7],
      [7, 8],
      [6, 9],
    ],
    [
      [9, 7],
      [8, 8],
      [7, 9],
    ],
    [
      [9, 8],
      [8, 9],
    ],
    [[9, 9]],
  ]);
  expect(
    rows.flatMap((row) =>
      row.cells
        .filter((c) => c.label === null)
        .map((c) => [row.total, c.left, c.right]),
    ),
  ).toEqual([
    [11, 9, 2],
    [11, 8, 3],
    [11, 7, 4],
    [11, 5, 6],
    [11, 3, 8],
    [12, 9, 3],
    [14, 9, 5],
    [14, 7, 7],
    [15, 8, 7],
    [18, 9, 9],
  ]);
  expect(
    rows
      .flatMap((row) =>
        row.cells.filter((c) => c.label !== null).map((c) => c.label),
      )
      .join(''),
  ).toBe('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
  const reverse = teenAdditionRows({
    kind: 'teen-addition-table',
    variant: 'review',
  });
  expect(reverse.map((row) => row.cells.map((c) => [c.left, c.right]))).toEqual(
    rows.map((row) => row.cells.map((c) => [c.left, c.right]).toReversed()),
  );
  expect(reverse[0]?.cells[0]).toEqual({ left: 2, right: 9, label: 'A' });
  expect(reverse.map((row) => row.cells[0]?.right)).toEqual([
    9, 9, 9, 9, 9, 9, 9, 9,
  ]);
  rows[0]?.cells.pop();
  expect(
    teenAdditionRows({ kind: 'teen-addition-table', variant: 'main' })[0]
      ?.cells,
  ).toHaveLength(8);
});
it('rejects unknown variants and arbitrary answer or equation fields in historical snapshots', () => {
  for (const variant of ['main', 'review'])
    expect(
      isTeenAdditionTableVisual({ kind: 'teen-addition-table', variant }),
    ).toBe(true);
  for (const bad of [
    null,
    [],
    {},
    { kind: 'teen-addition-table', variant: 'other' },
    { kind: 'teen-addition-table', variant: [] },
    { kind: 'teen-addition-table', variant: 'main', answers: [6, 5] },
    { kind: 'teen-addition-table', variant: 'main', equations: [[1, 10]] },
  ])
    expect(isTeenAdditionTableVisual(bad)).toBe(false);
});
