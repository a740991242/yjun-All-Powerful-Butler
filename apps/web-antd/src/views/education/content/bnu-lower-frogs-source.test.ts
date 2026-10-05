import { expect, it } from 'vitest';

import { bnuLowerFrogsSource as source } from './bnu-lower-frogs-source';

it('records only the two read pages and all seven activities, separate from the teaching implementation', () => {
  expect(source.status).toBe('source-checked');
  expect(source.readPrintedPages).toEqual([66, 67]);
  expect(source.pageImages).toEqual([
    { printedPage: 66, suffix: '070.jpg' },
    { printedPage: 67, suffix: '071.jpg' },
  ]);
  expect(source.activities.map((a) => [a.page, a.key])).toEqual([
    [66, 'addition-three-methods'],
    [66, 'comparison-three-methods'],
    [67, 'four-calculations-and-place-discussion'],
    [67, 'four-counter-calculations'],
    [67, 'both-two-jump-lines'],
    [67, 'piano-key-parts-total'],
    [67, 'bus-departure-remaining'],
  ]);
});
it('keeps sequential, counter and separated-place methods and the direction of comparison', () => {
  expect(source.frogs).toEqual({ large: 65, small: 32, unit: '只' });
  expect(source.addition.values).toEqual([65, 32, 97]);
  expect(source.addition.sequential).toEqual([
    [65, 30, 95],
    [95, 2, 97],
  ]);
  expect(source.addition.byPlace).toEqual([
    [60, 30, 90],
    [5, 2, 7],
    [90, 7, 97],
  ]);
  expect([
    source.addition.counterBefore,
    source.addition.counterAdded,
    source.addition.counterAfter,
  ]).toEqual([
    [6, 5],
    [3, 2],
    [9, 7],
  ]);
  expect(source.comparison.values).toEqual([65, 32, 33]);
  expect(source.comparison.sequential).toEqual([
    [65, 30, 35],
    [35, 2, 33],
  ]);
  expect(source.comparison.byPlace).toEqual([
    [60, 30, 30],
    [5, 2, 3],
    [30, 3, 33],
  ]);
  expect([
    source.comparison.counterBefore,
    source.comparison.counterRemoved,
    source.comparison.counterAfter,
  ]).toEqual([
    [6, 5],
    [3, 2],
    [3, 3],
  ]);
});
it('checks all eight practice calculations and both full two-jump arrows independently', () => {
  expect(source.fourDiscussionCalculations.map((q) => q.values)).toEqual([
    [36, 3, 39],
    [57, 4, 53],
    [65, 31, 34],
    [41, 47, 88],
  ]);
  expect(source.fourCounterCalculations.map((q) => q.values)).toEqual([
    [46, 23, 69],
    [37, 25, 12],
    [45, 24, 21],
    [56, 42, 98],
  ]);
  expect(source.numberLines).toEqual([
    {
      labels: [37, 47, 57, 67, 77, 87],
      start: 37,
      firstJump: 30,
      intermediate: 67,
      secondJump: 2,
      end: 69,
      combinedChange: 32,
      operation: '+',
    },
    {
      labels: [26, 36, 46, 56, 66, 76],
      start: 76,
      firstJump: 40,
      intermediate: 36,
      secondJump: 3,
      end: 33,
      combinedChange: 43,
      operation: '−',
    },
  ]);
  for (const q of [
    ...source.fourDiscussionCalculations,
    ...source.fourCounterCalculations,
  ]) {
    const [a, b, result] = q.values;
    expect(q.operation === '+' ? a + b : a - b).toBe(result);
  }
});
it('keeps keyboard parts and bus departure quantities in their stated units', () => {
  expect(source.piano).toEqual({ black: 36, white: 52, total: 88, unit: '个' });
  expect(source.bus).toEqual({
    before: 23,
    left: 12,
    remaining: 11,
    unit: '人',
  });
});
