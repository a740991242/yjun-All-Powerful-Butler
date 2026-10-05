import { expect, it } from 'vitest';

import { bnuWrittenPanels, isBnuWrittenVisual } from './bnu-written';

it('keeps missing tens distinct from zero and final stage, hides all exercise answers', () => {
  const main = (scene: 'add-final' | 'add-stage' | 'practice' | 'sub-blank') =>
    bnuWrittenPanels({ kind: 'bnu-written', scene, variant: 'main' });
  expect(main('add-stage')[0]?.rows).toEqual([
    [1, 2],
    [3, 1],
    [null, 3],
  ]);
  expect(main('add-final')[0]?.rows).toEqual([
    [1, 2],
    [3, 1],
    [4, 3],
  ]);
  expect(main('sub-blank')[0]?.rows).toEqual([
    [3, 4],
    [2, 2],
    [null, null],
  ]);
  expect(main('practice').map((p) => [p.operator, ...p.rows])).toEqual([
    ['+', [4, 4], [3, 2], [null, null]],
    ['−', [5, 4], [2, 3], [null, null]],
    ['+', [7, 6], [2, 3], [null, null]],
    ['−', [6, 8], [1, 1], [null, null]],
  ]);
});
it('preserves matching positions and independently checks both main and new pairings', () => {
  const main = bnuWrittenPanels({
    kind: 'bnu-written',
    scene: 'matching',
    variant: 'main',
  });
  expect(main.map((p) => p.id)).toEqual(['A', 'C', 'B', 'D']);
  expect(main.map((p) => p.rows)).toEqual([
    [
      [2, 3],
      [2, 1],
      [4, 4],
    ],
    [
      [3, 3],
      [2, 1],
      [1, 2],
    ],
    [
      [3, 3],
      [2, 1],
      [1, 2],
    ],
    [
      [2, 3],
      [2, 1],
      [4, 4],
    ],
  ]);
  expect(main.map((p) => p.operator)).toEqual(['', '−', '', '+']);
  const review = bnuWrittenPanels({
    kind: 'bnu-written',
    scene: 'matching',
    variant: 'review',
  });
  expect(review.map((p) => p.rows)).toEqual([
    [
      [1, 2],
      [2, 1],
      [3, 3],
    ],
    [
      [1, 2],
      [2, 1],
      [3, 3],
    ],
    [
      [3, 4],
      [1, 3],
      [2, 1],
    ],
    [
      [3, 4],
      [1, 3],
      [2, 1],
    ],
  ]);
});
it('checks fixed scenes, fresh rows and limits rods to source-supported numeral forms', () => {
  for (const variant of ['main', 'review'] as const)
    for (const scene of [
      'rods-add',
      'add-stage',
      'add-final',
      'rods-sub',
      'sub-blank',
      'sub-final',
      'matching',
      'practice',
    ] as const) {
      const visual = { kind: 'bnu-written', scene, variant } as const;
      expect(isBnuWrittenVisual(visual)).toBe(true);
      const first = bnuWrittenPanels(visual);
      const second = bnuWrittenPanels(visual);
      expect(first).toEqual(second);
      expect(first).not.toBe(second);
      expect(first[0]?.rows[0]).not.toBe(second[0]?.rows[0]);
      for (const p of first.filter((p) => p.kind === 'rods'))
        for (const digit of p.rows.flat()) {
          expect(digit).not.toBeNull();
          expect(digit).toBeGreaterThanOrEqual(1);
          expect(digit).toBeLessThanOrEqual(4);
        }
    }
  for (const bad of [
    null,
    [],
    {},
    {
      kind: 'bnu-written',
      scene: 'practice',
      variant: 'main',
      answers: [76, 31, 99, 57],
    },
    {
      kind: 'bnu-written',
      scene: { toString: () => 'practice' },
      variant: 'main',
    },
    { kind: 'bnu-written', scene: 'other', variant: 'main' },
    { kind: 'bnu-written', scene: 'practice', variant: 'other' },
    { kind: 'bnu-written', scene: 'practice' },
  ])
    expect(isBnuWrittenVisual(bad)).toBe(false);
});
