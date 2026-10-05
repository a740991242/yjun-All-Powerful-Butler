import { expect, it } from 'vitest';

import { bnuWholeTenLine, isBnuWholeTenLineVisual } from './bnu-whole-ten-line';

it('keeps all original ticks and the original directed arrows, not the leftmost tick as start', () => {
  expect(
    bnuWholeTenLine({
      kind: 'bnu-whole-ten-line',
      scene: 'add',
      variant: 'main',
    }),
  ).toEqual({
    ticks: [20, 30, 40, 50, 60, 70, 80, 90],
    start: 30,
    jump: 50,
    end: 80,
    operation: '+',
  });
  expect(
    bnuWholeTenLine({
      kind: 'bnu-whole-ten-line',
      scene: 'subtract',
      variant: 'main',
    }),
  ).toEqual({
    ticks: [50, 60, 70, 80, 90, 100],
    start: 90,
    jump: 30,
    end: 60,
    operation: '−',
  });
});
it('changes review starts or jump amounts while retaining complete fixed scales and fresh arrays', () => {
  expect(
    bnuWholeTenLine({
      kind: 'bnu-whole-ten-line',
      scene: 'add',
      variant: 'review',
    }),
  ).toEqual({
    ticks: [20, 30, 40, 50, 60, 70, 80, 90],
    start: 20,
    jump: 50,
    end: 70,
    operation: '+',
  });
  expect(
    bnuWholeTenLine({
      kind: 'bnu-whole-ten-line',
      scene: 'subtract',
      variant: 'review',
    }),
  ).toEqual({
    ticks: [50, 60, 70, 80, 90, 100],
    start: 100,
    jump: 40,
    end: 60,
    operation: '−',
  });
  const first = bnuWholeTenLine({
    kind: 'bnu-whole-ten-line',
    scene: 'add',
    variant: 'main',
  });
  first.ticks[0] = 0;
  expect(
    bnuWholeTenLine({
      kind: 'bnu-whole-ten-line',
      scene: 'add',
      variant: 'main',
    }).ticks[0],
  ).toBe(20);
});
it('rejects unknown, coerced and arbitrary-answer-bearing visual inputs', () => {
  for (const value of [
    null,
    [],
    { kind: 'bnu-whole-ten-line', scene: 'add' },
    { kind: 'bnu-whole-ten-line', scene: 'add', variant: 'unknown' },
    { kind: 'bnu-whole-ten-line', scene: 'ADD', variant: 'main' },
    {
      kind: 'bnu-whole-ten-line',
      scene: { toString: () => 'add' },
      variant: 'main',
    },
    { kind: 'bnu-whole-ten-line', scene: 'add', variant: 'main', end: 80 },
    { kind: 'bnu-whole-ten-line', scene: 'add', variant: 'main', answer: 80 },
  ])
    expect(isBnuWholeTenLineVisual(value)).toBe(false);
});
