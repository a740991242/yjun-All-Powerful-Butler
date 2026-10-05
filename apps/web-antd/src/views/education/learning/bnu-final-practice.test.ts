import { expect, it } from 'vitest';

import {
  bnuFinalPracticeCells,
  isBnuFinalPracticeVisual,
} from './bnu-final-practice';

it('preserves all three source rows and leaves all continuation positions genuinely blank', () => {
  for (const [scene, given, changed] of [
    [
      'faces',
      ['happy', 'happy', 'sad', 'happy', 'happy', 'sad'],
      ['sad', 'happy', 'happy', 'sad', 'happy', 'happy'],
    ],
    [
      'cups',
      ['right', 'left', 'right', 'left'],
      ['left', 'right', 'left', 'right'],
    ],
    [
      'divisions',
      ['horizontal', 'vertical', 'horizontal', 'vertical'],
      ['vertical', 'horizontal', 'vertical', 'horizontal'],
    ],
  ] as const) {
    for (const [variant, expected] of [
      ['main', given],
      ['review', changed],
    ] as const) {
      const v = { kind: 'bnu-final-practice', scene, variant } as const;
      expect(bnuFinalPracticeCells(v)).toEqual([...expected, null, null, null]);
      const mutated = bnuFinalPracticeCells(v);
      mutated[0] = null;
      expect(bnuFinalPracticeCells(v)).toEqual([...expected, null, null, null]);
    }
  }
});
it('rejects arbitrary marks, slots, answers and extra fields without relaxing the old visual contracts', () => {
  const v = { kind: 'bnu-final-practice', scene: 'faces', variant: 'main' };
  expect(isBnuFinalPracticeVisual(v)).toBe(true);
  for (const bad of [
    null,
    [],
    { ...v, scene: 'wall' },
    { ...v, variant: 'original' },
    { ...v, cells: [] },
    { ...v, answer: 'happy' },
    { ...v, slots: 3 },
  ])
    expect(isBnuFinalPracticeVisual(bad)).toBe(false);
});
