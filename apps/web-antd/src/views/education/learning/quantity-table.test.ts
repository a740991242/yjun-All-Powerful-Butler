import type { QuantityTableVisual } from './types';

import { expect, it } from 'vitest';

import { isQuantityTableVisual, quantityTableMissing } from './quantity-table';
const model: QuantityTableVisual = {
  kind: 'quantity-table',
  columns: ['A', 'B', 'C'],
  parts: ['红球', '白球'],
  values: [
    [3, null, 2],
    [5, 4, null],
    [null, 9, 8],
  ],
};
it('derives each column independently, retaining zero and completed columns', () => {
  expect(isQuantityTableVisual(model)).toBe(true);
  expect(quantityTableMissing(model)).toEqual([8, 5, 6]);
  const zero: QuantityTableVisual = {
    ...model,
    columns: ['A', 'B'],
    values: [
      [null, 0],
      [4, 0],
      [4, 0],
    ],
  };
  expect(isQuantityTableVisual(zero)).toBe(true);
  expect(quantityTableMissing(zero)).toEqual([0]);
});
it('rejects impossible sums, ambiguous blanks, broken dimensions and extra answers', () => {
  for (const values of [
    [
      [3, null, 2],
      [5, null, null],
      [null, 9, 8],
    ],
    [
      [3, 10, 2],
      [5, 4, 6],
      [7, 9, 8],
    ],
    [
      [null, 1, 2],
      [5, 4, 6],
      [4, 5, 8],
    ],
    [
      [19, 1, 2],
      [1, 4, 6],
      [null, 5, 8],
    ],
    [
      [3, 1],
      [5, 4, 6],
      [null, 5, 8],
    ],
    [
      [3.5, 1, 2],
      [5, 4, 6],
      [null, 5, 8],
    ],
  ])
    expect(isQuantityTableVisual({ ...model, values })).toBe(false);
  expect(isQuantityTableVisual({ ...model, parts: ['球', '球'] })).toBe(false);
  expect(isQuantityTableVisual({ ...model, columns: ['A', 'A', 'C'] })).toBe(
    false,
  );
  expect(isQuantityTableVisual({ ...model, answers: [8, 5, 6] })).toBe(false);
});
