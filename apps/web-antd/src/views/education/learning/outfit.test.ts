import { expect, it } from 'vitest';

import { isOutfitRule, matchesOutfit, outfitConditions } from './outfit';

it('independently checks every pair including all five source and three changed review outfits', () => {
  for (const variant of ['main', 'review'] as const) {
    const valid =
      variant === 'main'
        ? ['1,4', '1,5', '2,5', '3,4', '3,5']
        : ['1,5', '3,4', '3,5'];
    const accepted: string[] = [];
    for (let a = 0; a <= 7; a++)
      for (let b = 0; b <= 7; b++) {
        const actual = matchesOutfit({ kind: 'outfit', variant }, [a, b]);
        expect(actual).toBe(valid.includes(`${a},${b}`));
        if (actual) accepted.push(`${a},${b}`);
      }
    expect(accepted).toEqual(valid);
  }
  expect(outfitConditions('main')).toEqual({
    budget: 100,
    prices: [46, 52, 34, 53, 41],
  });
  expect(outfitConditions('review')).toEqual({
    budget: 70,
    prices: [31, 42, 24, 45, 33],
  });
});
it('rejects coercion, holes, extra fields and arbitrary budgets while returning fresh prices', () => {
  const rule = { kind: 'outfit', variant: 'main' } as const;
  const sparse = Array.from({ length: 2 }, () => 1);
  Reflect.deleteProperty(sparse, 1);
  expect(Object.hasOwn(sparse, 1)).toBe(false);
  for (const answer of [
    null,
    sparse,
    [1],
    ['1', 4],
    [true, 4],
    [1, 4, 5],
    [1.5, 4],
    [4, 1],
    [1, null],
    [Number.NaN, 4],
  ])
    expect(matchesOutfit(rule, answer)).toBe(false);
  for (const value of [
    null,
    [],
    {},
    { kind: 'outfit', variant: 'other' },
    { ...rule, budget: 100 },
    { ...rule, answers: [1, 4] },
  ])
    expect(isOutfitRule(value)).toBe(false);
  const changed = outfitConditions('main');
  changed.prices[0] = 0;
  expect(outfitConditions('main').prices[0]).toBe(46);
});
