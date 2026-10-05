import { expect, it } from 'vitest';

import { bnuTwoJumpLine, isBnuTwoJumpLineVisual } from './bnu-two-jump-line';
import { required } from './required';

it('preserves both source arrows and the original labelled ticks without adding final labels', () => {
  expect(
    bnuTwoJumpLine({
      kind: 'bnu-two-jump-line',
      scene: 'add',
      variant: 'main',
    }),
  ).toEqual({
    ticks: [37, 47, 57, 67, 77, 87],
    operation: '+',
    segments: [
      { from: 37, to: 67, jump: 30 },
      { from: 67, to: 69, jump: 2 },
    ],
    finalRange: [67, 77],
  });
  expect(
    bnuTwoJumpLine({
      kind: 'bnu-two-jump-line',
      scene: 'subtract',
      variant: 'main',
    }),
  ).toEqual({
    ticks: [26, 36, 46, 56, 66, 76],
    operation: '−',
    segments: [
      { from: 76, to: 36, jump: 40 },
      { from: 36, to: 33, jump: 3 },
    ],
    finalRange: [26, 36],
  });
});
it('changes both review conditions and returns independent arrays and segment objects', () => {
  const visual = {
    kind: 'bnu-two-jump-line',
    scene: 'add',
    variant: 'review',
  } as const;
  const first = bnuTwoJumpLine(visual);
  expect(first).toEqual({
    ticks: [37, 47, 57, 67, 77, 87],
    operation: '+',
    segments: [
      { from: 47, to: 67, jump: 20 },
      { from: 67, to: 71, jump: 4 },
    ],
    finalRange: [67, 77],
  });
  first.ticks[0] = 0;
  required(first.segments[0]).from = 0;
  expect(bnuTwoJumpLine(visual).ticks[0]).toBe(37);
  expect(bnuTwoJumpLine(visual).segments[0]?.from).toBe(47);
  expect(
    bnuTwoJumpLine({
      kind: 'bnu-two-jump-line',
      scene: 'subtract',
      variant: 'review',
    }),
  ).toEqual({
    ticks: [26, 36, 46, 56, 66, 76],
    operation: '−',
    segments: [
      { from: 76, to: 46, jump: 30 },
      { from: 46, to: 44, jump: 2 },
    ],
    finalRange: [36, 46],
  });
});
it('rejects unknown, missing, coerced or extra tick and answer fields', () => {
  for (const value of [
    null,
    [],
    {},
    { kind: 'bnu-two-jump-line', scene: 'add' },
    { kind: 'bnu-pinecone-line', scene: 'add', variant: 'main' },
    { kind: 'bnu-two-jump-line', scene: 'divide', variant: 'main' },
    { kind: 'bnu-two-jump-line', scene: 'add', variant: 'other' },
    {
      kind: 'bnu-two-jump-line',
      scene: { toString: () => 'add' },
      variant: 'main',
    },
    { kind: 'bnu-two-jump-line', scene: 'add', variant: 'main', end: 69 },
    {
      kind: 'bnu-two-jump-line',
      scene: 'add',
      variant: 'main',
      ticks: [37, 67, 69],
    },
  ])
    expect(isBnuTwoJumpLineVisual(value)).toBe(false);
});
