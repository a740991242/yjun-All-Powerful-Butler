import { expect, it } from 'vitest';

import { compareOpportunity, matchesOpportunity } from './opportunity';
import { evaluate } from './wishlist/model';
it('filters using the same gap and strict target rule as hearts', () => {
  const target = {
    code: '600900',
    price: 98,
    rule: 'below' as const,
    near: 3,
    note: '',
  };
  const value = evaluate(
    target,
    { price: 100, date: '2026-09-24' },
    '2026-09-24',
  );
  expect(matchesOpportunity(value, 'within2')).toBe(true);
  expect(matchesOpportunity(value, 'reached')).toBe(false);
  expect(
    matchesOpportunity(
      evaluate(target, { price: 98, date: '2026-09-24' }, '2026-09-24'),
      'reached',
    ),
  ).toBe(false);
  expect(
    matchesOpportunity(
      evaluate(target, { price: 97, date: '2026-09-24' }, '2026-09-24'),
      'reached',
    ),
  ).toBe(true);
  expect(
    matchesOpportunity(
      evaluate(target, { price: 97, date: '2026-09-01' }, '2026-09-24'),
      'within5',
    ),
  ).toBe(false);
  expect(compareOpportunity(undefined, undefined)).toBe(0);
  expect(compareOpportunity(value, undefined)).toBe(-1);
});
