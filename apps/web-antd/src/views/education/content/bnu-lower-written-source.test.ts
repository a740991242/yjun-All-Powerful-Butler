import { expect, it } from 'vitest';

import { bnuLowerWrittenSource as source } from './bnu-lower-written-source';

it('records the two inspected pages and all six source activities with separate teaching audit', () => {
  expect(source.status).toBe('source-checked');
  expect(source.readPrintedPages).toEqual([68, 69]);
  expect(source.pageImages).toEqual([
    { printedPage: 68, suffix: '072.jpg' },
    { printedPage: 69, suffix: '073.jpg' },
  ]);
  expect(source.activities.map((a) => [a.page, a.key])).toEqual([
    [68, 'rods-read-addition-and-places'],
    [68, 'written-addition-stages-and-alignment'],
    [69, 'subtraction-rods-counter-written'],
    [69, 'both-cross-matches'],
    [69, 'all-four-written-calculations'],
    [69, 'one-bottle-per-person-remaining'],
  ]);
});
it('distinguishes ancient rod orientation, partial written stage and completed addition', () => {
  expect(source.rodConvention.ones).toBe('纵式');
  expect(source.rodConvention.tens).toBe('横式');
  expect(source.addition.values).toEqual([12, 31, 43]);
  expect(source.addition.rodRows).toEqual([
    [1, 2],
    [3, 1],
    [4, 3],
  ]);
  expect(source.addition.onesCalculation).toEqual([2, 1, 3]);
  expect(source.addition.tensCalculation).toEqual([1, 3, 4]);
  expect(source.addition.writtenIntermediateResult).toEqual([null, 3]);
  expect(source.addition.writtenFinalResult).toEqual([4, 3]);
  expect(source.subtraction.values).toEqual([34, 22, 12]);
  expect(source.subtraction.rodRows).toEqual([
    [3, 4],
    [2, 2],
    [1, 2],
  ]);
  expect([
    source.subtraction.counterBefore,
    source.subtraction.counterRemoved,
    source.subtraction.counterAfter,
  ]).toEqual([
    [3, 4],
    [2, 2],
    [1, 2],
  ]);
});
it('checks both cross-matches rather than assigning by vertical position', () => {
  expect(source.matching.rodTop).toEqual({
    operation: '+',
    values: [23, 21, 44],
    rows: [
      [2, 3],
      [2, 1],
      [4, 4],
    ],
  });
  expect(source.matching.rodBottom).toEqual({
    operation: '−',
    values: [33, 21, 12],
    rows: [
      [3, 3],
      [2, 1],
      [1, 2],
    ],
  });
  expect(source.matching.rodTop.values).toEqual(
    source.matching.writtenBottom.values,
  );
  expect(source.matching.rodBottom.values).toEqual(
    source.matching.writtenTop.values,
  );
  expect(source.matching.rodTop.values).not.toEqual(
    source.matching.writtenTop.values,
  );
});
it('checks all four written calculations and the per-person bottle condition independently', () => {
  expect(source.fourWrittenCalculations.map((q) => q.values)).toEqual([
    [44, 32, 76],
    [54, 23, 31],
    [76, 23, 99],
    [68, 11, 57],
  ]);
  for (const q of source.fourWrittenCalculations) {
    const [a, b, result] = q.values;
    expect(q.operation === '+' ? a + b : a - b).toBe(result);
  }
  expect(source.water).toEqual({
    bottlesBefore: 48,
    people: 36,
    bottlesPerPerson: 1,
    bottlesGiven: 36,
    bottlesRemaining: 12,
    unit: '瓶',
  });
});
