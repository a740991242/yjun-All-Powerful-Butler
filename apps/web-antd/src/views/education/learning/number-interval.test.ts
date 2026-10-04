import { expect, it } from 'vitest';

import { evaluate } from './engine';
import { isNumberChainRule } from './number-chain';
import { isNumberIntervalRule, matchesNumberInterval } from './number-interval';
import { isNumberPicksRule } from './number-picks';

it('accepts every nonempty inclusive integer interval through one hundred without changing old ninety-nine contracts', () => {
  for (let minimum = 0; minimum <= 100; minimum++)
    for (let maximum = minimum; maximum <= 100; maximum++) {
      const rule = { kind: 'number-interval' as const, minimum, maximum };
      expect(isNumberIntervalRule(rule)).toBe(true);
      expect(matchesNumberInterval(rule, minimum)).toBe(true);
      expect(matchesNumberInterval(rule, maximum)).toBe(true);
      expect(matchesNumberInterval(rule, minimum - 1)).toBe(false);
      expect(matchesNumberInterval(rule, maximum + 1)).toBe(false);
    }
  expect(
    isNumberChainRule({
      kind: 'number-chain',
      minimum: 0,
      maximum: 100,
      direction: 'ascending',
      values: [99, null],
    }),
  ).toBe(false);
  expect(
    isNumberPicksRule({
      kind: 'number-picks',
      fields: [[100]],
      distinct: false,
    }),
  ).toBe(false);
});
it('rejects coercion, unknown fields, inverted intervals and non-integer answers while preserving real zero', () => {
  const rule = { kind: 'number-interval' as const, minimum: 0, maximum: 29 };
  for (const bad of [
    null,
    [],
    { ...rule, minimum: -1 },
    { ...rule, maximum: 101 },
    { ...rule, minimum: 30 },
    { ...rule, maximum: '29' },
    { ...rule, minimum: 0.5 },
    { ...rule, maximum: Number.NaN },
    { ...rule, answer: 0 },
    Object.assign(Object.create({ kind: 'number-interval' }), {
      minimum: 0,
      maximum: 29,
      hidden: 0,
    }),
  ])
    expect(isNumberIntervalRule(bad)).toBe(false);
  for (const answer of [
    null,
    '0',
    [],
    [0],
    false,
    0.5,
    Number.NaN,
    Number.POSITIVE_INFINITY,
  ])
    expect(matchesNumberInterval(rule, answer)).toBe(false);
  expect(evaluate(rule, 0)).toBe(true);
  expect(evaluate(rule, 29)).toBe(true);
  expect(evaluate(rule, 30)).toBe(false);
  expect(() => evaluate(rule, null)).toThrow(
    'educationLearning.answerRequired',
  );
  expect(() => evaluate(rule, Number.NaN)).toThrow(
    'educationLearning.answerRequired',
  );
  expect(
    evaluate({ kind: 'number-interval', minimum: 100, maximum: 100 }, 100),
  ).toBe(true);
});
