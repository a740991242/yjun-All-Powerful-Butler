import { expect, it } from 'vitest';

import {
  isTeenArithmeticGridVisual,
  teenArithmeticRodState,
  teenArithmeticRows,
} from './teen-arithmetic-grid';
it('rejects injected tables, answers and unknown layouts while accepting eight fixed diagrams', () => {
  for (const display of ['tables', 'join', 'take', 'ten'])
    for (const variant of ['main', 'review'])
      expect(
        isTeenArithmeticGridVisual({
          kind: 'teen-arithmetic-grid',
          display,
          variant,
        }),
      ).toBe(true);
  for (const v of [
    null,
    [],
    {},
    { kind: 'teen-arithmetic-grid', display: 'tables', variant: 'other' },
    { kind: 'teen-arithmetic-grid', display: 'unknown', variant: 'main' },
    {
      kind: 'teen-arithmetic-grid',
      display: 'tables',
      variant: 'main',
      answers: [11, 13, 15, 17],
    },
  ])
    expect(isTeenArithmeticGridVisual(v)).toBe(false);
});
it('keeps each of eight rows independent and all rods within non-carry non-borrow scope', () => {
  expect(
    teenArithmeticRows('main').map((r) => [
      r.add[0] + r.add[1],
      r.subtract[0] - r.subtract[1],
    ]),
  ).toEqual([
    [11, 16],
    [13, 14],
    [15, 12],
    [17, 10],
  ]);
  expect(
    teenArithmeticRows('review').map((r) => [
      r.add[0] + r.add[1],
      r.subtract[0] - r.subtract[1],
    ]),
  ).toEqual([
    [12, 18],
    [14, 16],
    [16, 14],
    [18, 12],
  ]);
  for (const variant of ['main', 'review'] as const)
    for (const display of ['join', 'take', 'ten'] as const) {
      const r = teenArithmeticRodState({
        kind: 'teen-arithmetic-grid',
        display,
        variant,
      });
      if (r.operation === '+')
        expect(r.start - 10 + r.operand).toBeLessThanOrEqual(9);
      else if (r.operand === 10) expect(r.start - r.operand).toBeLessThan(10);
      else expect(r.start - 10).toBeGreaterThanOrEqual(r.operand);
    }
});
