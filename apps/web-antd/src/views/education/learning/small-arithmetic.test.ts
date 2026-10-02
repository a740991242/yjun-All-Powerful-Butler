import { expect, it } from 'vitest';

import { finalSmallTable } from '../content/sujiao-final-equations';
import {
  isSmallArithmeticVisual,
  smallArithmeticCell,
} from './small-arithmetic';
import { sparseArray } from './sparse-array';

it('uses the actual row and column headings for all cells, preserving the subtraction direction', () => {
  expect(finalSmallTable('add').hidden).toHaveLength(9);
  const cases = [
    ['add', false, [15, 17, 19, 13, 15, 17, 11, 13, 15]],
    ['subtract', false, [9, 10, 11, 8, 9, 10, 7, 8, 9]],
    ['add', true, [9, 13, 11, 13, 17, 15, 11, 15, 13]],
    ['subtract', true, [9, 11, 10, 11, 13, 12, 10, 12, 11]],
  ] as const;
  for (const [operation, review, values] of cases) {
    const model = finalSmallTable(operation, review);
    expect(isSmallArithmeticVisual(model)).toBe(true);
    expect(
      model.hidden.map(([row, column]) =>
        smallArithmeticCell(model, row, column),
      ),
    ).toEqual(values);
    expect(smallArithmeticCell(model, 3, 0)).toBeNull();
    expect(smallArithmeticCell(model, 0, -1)).toBeNull();
  }
  expect(finalSmallTable('add', false, true).hidden).toHaveLength(7);
});
it('bounds all imported axes, operations and blanks, rejecting sparse data, negative results and hidden answer payloads', () => {
  const valid = finalSmallTable('subtract');
  expect(isSmallArithmeticVisual({ ...valid, hidden: [] })).toBe(true);
  for (const invalid of [
    null,
    [],
    { ...valid, operation: 'multiply' },
    {
      kind: 'small-arithmetic',
      operation: ['add'],
      rows: [1, 2, 3],
      columns: [5, 6, 7],
      hidden: [],
    },
    { ...valid, rows: [7, 7, 9] },
    { ...valid, columns: [6, 7, 8] },
    { ...valid, rows: sparseArray(3) },
    { ...valid, hidden: sparseArray(1) },
    {
      ...valid,
      hidden: [
        [0, 0],
        [0, 0],
      ],
    },
    { ...valid, hidden: [[0, 3]] },
    { ...valid, hidden: [[0, 0, 1]] },
    { ...valid, hidden: [[0, 0.5]] },
    { ...valid, answer: 9 },
    { ...valid, columns: [16, 17, 21] },
    { ...valid, rows: [0, 8, 9] },
    { ...valid, rows: ['7', 8, 9] },
    { ...finalSmallTable('add'), columns: [16, 17, 18] },
  ])
    expect(isSmallArithmeticVisual(invalid)).toBe(false);
});
