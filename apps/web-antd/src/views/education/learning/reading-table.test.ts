import { expect, it } from 'vitest';

import { sujiaoReadingTable } from '../content/sujiao-reading-table';
import { isReadingTableVisual } from './reading-table';

it('accepts independent daily counts including zero, without imposing part-plus-total relations', () => {
  expect(isReadingTableVisual(sujiaoReadingTable)).toBe(true);
  expect(
    isReadingTableVisual({
      ...sujiaoReadingTable,
      pages: [
        [0, 19, 0],
        [1, 0, 19],
      ],
    }),
  ).toBe(true);
});
it('rejects incomplete cells, wrong dimensions, duplicate labels and hidden result fields', () => {
  for (const patch of [
    {
      pages: [
        [4, 3, null],
        [6, 4, 5],
      ],
    },
    { pages: [[4, 3, 6]] },
    {
      pages: [
        [4, 3],
        [6, 4, 5],
      ],
    },
    {
      pages: [
        [-1, 3, 6],
        [6, 4, 5],
      ],
    },
    {
      pages: [
        [20, 3, 6],
        [6, 4, 5],
      ],
    },
    {
      pages: [
        [1.5, 3, 6],
        [6, 4, 5],
      ],
    },
    { names: ['小禾', '小禾'] },
    { days: ['第一天', '第一天', '第三天'] },
    { names: ['小禾', ''] },
    { totals: [13, 15] },
  ])
    expect(isReadingTableVisual({ ...sujiaoReadingTable, ...patch })).toBe(
      false,
    );
  const sparse = structuredClone(sujiaoReadingTable);
  Reflect.deleteProperty(sparse.pages[0], '1');
  expect(isReadingTableVisual(sparse)).toBe(false);
});

it('accepts numbered blank display while preserving existing filled snapshots and rejecting unknown modes or hidden extra answers', () => {
  expect(
    isReadingTableVisual({ ...sujiaoReadingTable, display: 'blanks' }),
  ).toBe(true);
  expect(isReadingTableVisual(sujiaoReadingTable)).toBe(true);
  for (const display of ['filled', 'answers', true, null, ['blanks']])
    expect(isReadingTableVisual({ ...sujiaoReadingTable, display })).toBe(
      false,
    );
  expect(
    isReadingTableVisual({
      ...sujiaoReadingTable,
      display: 'blanks',
      answers: [1, 2, 3, 4, 5, 6],
    }),
  ).toBe(false);
});
