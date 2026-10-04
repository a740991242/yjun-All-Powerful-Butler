import { expect, it } from 'vitest';

import { isTeenStairsVisual, teenStairs } from './teen-stairs';

it('keeps all nineteen source levels, ten givens and nine positions with a genuinely changed review', () => {
  const main = teenStairs({ kind: 'teen-stairs', variant: 'main' });
  expect(main.map(({ level }) => level)).toEqual(
    Array.from({ length: 19 }, (_, i) => i + 1),
  );
  expect(
    main.filter(({ label }) => label === null).map(({ level }) => level),
  ).toEqual([1, 2, 3, 4, 5, 8, 11, 12, 15, 17]);
  expect(
    main
      .filter(({ label }) => label !== null)
      .map(({ label, level }) => [label, level]),
  ).toEqual([
    ['A', 6],
    ['B', 7],
    ['C', 9],
    ['D', 10],
    ['E', 13],
    ['F', 14],
    ['G', 16],
    ['H', 18],
    ['I', 19],
  ]);
  expect(
    teenStairs({ kind: 'teen-stairs', variant: 'review' })
      .filter(({ label }) => label !== null)
      .map(({ level }) => level),
  ).toEqual([5, 6, 8, 9, 12, 13, 15, 17, 18]);
  main.pop();
  expect(teenStairs({ kind: 'teen-stairs', variant: 'main' })).toHaveLength(19);
});
it('allows only fixed scenes and rejects arbitrary positions or answers in backup diagrams', () => {
  for (const variant of ['main', 'review'])
    expect(isTeenStairsVisual({ kind: 'teen-stairs', variant })).toBe(true);
  for (const bad of [
    null,
    [],
    {},
    { kind: 'teen-stairs', variant: [] },
    { kind: 'teen-stairs', variant: 'other' },
    { kind: 'teen-stairs', variant: 'main', answers: [6, 9, 19] },
    { kind: 'teen-stairs', variant: 'main', levels: [0] },
  ])
    expect(isTeenStairsVisual(bad)).toBe(false);
});
