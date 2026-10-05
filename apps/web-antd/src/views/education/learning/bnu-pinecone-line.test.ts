import { expect, it } from 'vitest';

import { bnuPineconeLine, isBnuPineconeLineVisual } from './bnu-pinecone-line';

it('keeps the entire original scales and arrows distinct from their leftmost ticks', () => {
  expect(
    bnuPineconeLine({
      kind: 'bnu-pinecone-line',
      scene: 'add',
      variant: 'main',
    }),
  ).toEqual({
    ticks: [21, 22, 23, 24, 25, 26],
    start: 22,
    jump: 3,
    end: 25,
    operation: '+',
  });
  expect(
    bnuPineconeLine({
      kind: 'bnu-pinecone-line',
      scene: 'subtract',
      variant: 'main',
    }),
  ).toEqual({
    ticks: [49, 59, 69, 79, 89, 99],
    start: 89,
    jump: 30,
    end: 59,
    operation: '−',
  });
});
it('changes review conditions and returns fresh tick arrays', () => {
  const visual = {
    kind: 'bnu-pinecone-line',
    scene: 'add',
    variant: 'review',
  } as const;
  const one = bnuPineconeLine(visual);
  expect(one).toEqual({
    ticks: [21, 22, 23, 24, 25, 26],
    start: 23,
    jump: 2,
    end: 25,
    operation: '+',
  });
  one.ticks[0] = 0;
  expect(bnuPineconeLine(visual).ticks[0]).toBe(21);
  expect(
    bnuPineconeLine({
      kind: 'bnu-pinecone-line',
      scene: 'subtract',
      variant: 'review',
    }),
  ).toEqual({
    ticks: [49, 59, 69, 79, 89, 99],
    start: 99,
    jump: 20,
    end: 79,
    operation: '−',
  });
});
it('rejects unknown, coerced, missing and extra answer fields', () => {
  for (const value of [
    null,
    [],
    {},
    { kind: 'bnu-whole-ten-line', scene: 'add', variant: 'main' },
    { kind: 'bnu-pinecone-line', scene: 'multiply', variant: 'main' },
    { kind: 'bnu-pinecone-line', scene: 'add', variant: 'other' },
    { kind: 'bnu-pinecone-line', scene: 'add' },
    {
      kind: 'bnu-pinecone-line',
      scene: { toString: () => 'add' },
      variant: 'main',
    },
    { kind: 'bnu-pinecone-line', scene: 'add', variant: 'main', end: 25 },
  ])
    expect(isBnuPineconeLineVisual(value)).toBe(false);
});
