import { expect, it } from 'vitest';

import { bnuRecyclingConditions, isBnuRecyclingVisual } from './bnu-recycling';

it('uses only fixed source and changed review diagrams, keeping result out of the model', () => {
  for (const scene of ['circles', 'rods'] as const) {
    expect(
      bnuRecyclingConditions({ kind: 'bnu-recycling', scene, variant: 'main' }),
    ).toEqual({ matched: 13, extra: 3, bundle: 10, loose: 3 });
    expect(
      bnuRecyclingConditions({
        kind: 'bnu-recycling',
        scene,
        variant: 'review',
      }),
    ).toEqual({ matched: 17, extra: 2, bundle: 10, loose: 7 });
  }
});
it('rejects arbitrary quantities, hidden answers, unknown scenes, arrays and incomplete models', () => {
  for (const value of [
    null,
    [],
    {},
    { kind: 'bnu-recycling', scene: 'circles' },
    { kind: 'bnu-recycling', scene: 'equation', variant: 'main' },
    { kind: 'bnu-recycling', scene: 'rods', variant: 'other' },
    { kind: 'bnu-recycling', scene: 'circles', variant: 'main', answer: 16 },
    { kind: 'bnu-recycling', scene: 'rods', variant: 'review', loose: 3 },
  ])
    expect(isBnuRecyclingVisual(value)).toBe(false);
});
