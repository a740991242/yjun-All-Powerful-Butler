import { expect, it } from 'vitest';

import { bnuLowerInterestingSource as source } from './bnu-lower-interesting-source';

it('records all six inspected activities with teaching mapped separately', () => {
  expect(source.status).toBe('source-checked');
  expect(source.readPrintedPages).toEqual([70, 71]);
  expect(source.activities.map((x) => [x.page, x.key])).toEqual([
    [70, 'reversed-addends-and-repeated-result-digits'],
    [70, 'find-reversed-addends-sum44'],
    [71, 'three-reversed-addend-equations-sum99'],
    [71, 'all-eight-addition-rows-and-discovery'],
    [71, 'all-eight-subtraction-rows-and-discovery'],
    [71, 'all-eight-add-eleven-blanks-and-discovery'],
  ]);
});
it('checks originals and all legal reversed two-digit pairs independently', () => {
  expect(source.examples).toEqual([
    [12, 21, 33],
    [23, 32, 55],
  ]);
  expect(source.sum44Examples).toEqual([
    [13, 31, 44],
    [22, 22, 44],
  ]);
  expect(source.sum99Examples).toEqual([
    [18, 81, 99],
    [45, 54, 99],
    [36, 63, 99],
  ]);
  const pairs = (total: number) =>
    Array.from({ length: 90 }, (_, i) => i + 10)
      .map((a) => [a, 10 * (a % 10) + Math.floor(a / 10)])
      .filter(
        ([a, b]) =>
          a !== undefined && b !== undefined && b >= 10 && a + b === total,
      );
  expect(pairs(44)).toEqual([
    [13, 31],
    [22, 22],
    [31, 13],
  ]);
  expect(pairs(99)).toEqual([
    [18, 81],
    [27, 72],
    [36, 63],
    [45, 54],
    [54, 45],
    [63, 36],
    [72, 27],
    [81, 18],
  ]);
});
it('preserves all original known positions and unfilled rows rather than supplying answers as source', () => {
  expect(source.additionGivenRows).toEqual([
    [11, 11, null],
    [12, 21, null],
    [13, 31, null],
    [14, null, null],
    [null, null, null],
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ]);
  expect(source.subtractionGivenRows).toEqual([
    [22, 11, null],
    [33, 21, null],
    [44, 31, null],
    [55, null, null],
    [null, null, null],
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ]);
  expect(source.addElevenEquations).toEqual([
    [1, null, 12],
    [12, null, 23],
    [23, null, 34],
    [34, null, 45],
    [45, null, 56],
    [56, null, 67],
    [67, null, 78],
    [78, null, 89],
  ]);
  for (const [a, unknown, result] of source.addElevenEquations) {
    expect(unknown).toBeNull();
    expect(result - a).toBe(11);
  }
});
