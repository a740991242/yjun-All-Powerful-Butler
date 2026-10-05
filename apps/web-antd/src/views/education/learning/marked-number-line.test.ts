import { expect, it } from 'vitest';

import { isMarkedNumberLineVisual, numberLineX } from './marked-number-line';

it('maps every integer to one fixed scale and keeps adjacent points distinct', () => {
  for (let n = 0; n <= 100; n++) {
    expect(
      isMarkedNumberLineVisual({ kind: 'marked-number-line', values: [n] }),
    ).toBe(true);
    expect(numberLineX(n)).toBeCloseTo(44 + 9.12 * n, 9);
    if (n < 100)
      expect(numberLineX(n + 1) - numberLineX(n)).toBeCloseTo(9.12, 9);
  }
  expect(numberLineX(0)).toBe(44);
  expect(numberLineX(100)).toBe(956);
  expect(
    isMarkedNumberLineVisual({
      kind: 'marked-number-line',
      values: [10, 38, 50, 51, 98],
    }),
  ).toBe(true);
  expect(numberLineX(50)).toBeLessThan(numberLineX(51));
});
it('rejects sparse, repeated or altered points and hidden answers without coercion', () => {
  const sparse: number[] = [];
  sparse.length = 2;
  sparse[1] = 100;
  for (const bad of [
    null,
    [],
    { kind: 'marked-number-line', values: [] },
    { kind: 'marked-number-line', values: [0, 1, 2, 3, 4, 5] },
    { kind: 'marked-number-line', values: [50, 50] },
    { kind: 'marked-number-line', values: sparse },
    { kind: 'marked-number-line', values: [null] },
    { kind: 'marked-number-line', values: ['50'] },
    { kind: 'marked-number-line', values: [-1] },
    { kind: 'marked-number-line', values: [101] },
    { kind: 'marked-number-line', values: [1.5] },
    { kind: 'marked-number-line', values: [Number.NaN] },
    { kind: 'marked-number-line', values: [50], answer: 50 },
  ])
    expect(isMarkedNumberLineVisual(bad)).toBe(false);
  for (const n of [-1, 101, 1.5, Number.NaN])
    expect(() => numberLineX(n)).toThrow('educationLearning.invalidRecord');
});
