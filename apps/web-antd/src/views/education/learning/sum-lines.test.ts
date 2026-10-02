import { expect, it } from 'vitest';

import { isSumLinesVisual, sumLineAnswers } from './sum-lines';

it('checks each line independently for every bounded set of given values', () => {
  for (const layout of ['triangle', 'cross'] as const)
    for (let top = 0; top <= 10; top++)
      for (let left = 0; left <= 10; left++)
        for (let third = 0; third <= 10; third++) {
          const model = {
            kind: 'sum-lines' as const,
            layout,
            given: [top, left, third] as [number, number, number],
          };
          const valid =
            top + third <= 10 &&
            left + third <= 10 &&
            (layout === 'cross' || top + left <= 10);
          expect(isSumLinesVisual(model)).toBe(valid);
          if (!valid) continue;
          const answers = sumLineAnswers(model);
          expect(
            answers.every((n) => Number.isInteger(n) && n >= 0 && n <= 10),
          ).toBe(true);
          if (layout === 'triangle') {
            expect(top + answers[0]! + left).toBe(10);
            expect(left + answers[1]! + third).toBe(10);
            expect(top + answers[2]! + third).toBe(10);
          } else {
            expect(top + third + answers[0]!).toBe(10);
            expect(left + third + answers[1]!).toBe(10);
          }
        }
});

it('rejects damaged layouts, hidden answers and noninteger values', () => {
  const model = { kind: 'sum-lines', layout: 'triangle', given: [1, 2, 3] };
  for (const invalid of [
    null,
    [],
    { ...model, layout: 'circle' },
    { ...model, layout: { toString: () => 'cross' } },
    { ...model, given: [1, 2] },
    { ...model, given: [1, 2, 3, 4] },
    { ...model, given: [-1, 2, 3] },
    { ...model, given: [1.5, 2, 3] },
    { ...model, given: ['1', 2, 3] },
    { ...model, given: [Infinity, 2, 3] },
    { ...model, given: [Number.NaN, 2, 3] },
    { ...model, given: [7, 8, 1] },
    { ...model, answer: [7, 5, 6] },
  ])
    expect(isSumLinesVisual(invalid)).toBe(false);
  expect(
    sumLineAnswers({ kind: 'sum-lines', layout: 'triangle', given: [4, 6, 1] }),
  ).toEqual([0, 3, 5]);
});
