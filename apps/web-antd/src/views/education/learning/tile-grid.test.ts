import { expect, it } from 'vitest';

import { isTileGridVisual, tileCounts } from './tile-grid';

it('counts covered cells separately from empty cells and keeps a bounded rectangle', () => {
  const model = {
    kind: 'tile-grid' as const,
    cells: [
      [true, false, false],
      [true, true, true],
    ],
  };
  expect(isTileGridVisual(model)).toBe(true);
  expect(tileCounts(model)).toEqual({ filled: 4, empty: 2 });
  expect(
    isTileGridVisual({
      kind: 'tile-grid',
      cells: [
        [true, true],
        [true, true],
      ],
    }),
  ).toBe(true);
  for (const cells of [
    [],
    [[true, true]],
    [[true, true], [true]],
    [
      [1, 0],
      [true, false],
    ],
    [
      [true, true, true, true, true],
      [true, true, true, true, true],
    ],
    Array.from({ length: 4 }, () => [true, true, true, true]),
    Array.from({ length: 4 }, () => [false, false, false, false]),
    [
      [true, true],
      [true, null],
    ],
  ])
    expect(isTileGridVisual({ kind: 'tile-grid', cells })).toBe(false);
  expect(isTileGridVisual({ ...model, layers: 2 })).toBe(false);
  expect(isTileGridVisual({ ...model, answer: 4 })).toBe(false);
});
