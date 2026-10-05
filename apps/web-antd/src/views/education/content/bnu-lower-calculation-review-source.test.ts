import { expect, it } from 'vitest';

import { bnuLowerCalculationReviewSource as source } from './bnu-lower-calculation-review-source';

it('keeps all four harvests, four counter calculations and four written calculations, while the problem bank stays open', () => {
  expect(source.readPrintedPages).toEqual([74, 75]);
  expect(source.status).toBe('source-checked');
  for (const [group, results] of [
    [source.harvest, [19, 59, 11, 11]],
    [source.counterPractice, [67, 62, 63, 54]],
    [source.verticalPractice, [46, 99, 79, 64]],
  ] as const) {
    expect(group.map((x) => x.result)).toEqual(results);
    for (const equation of group)
      expect(
        equation.operation === '+'
          ? equation.left + equation.right
          : equation.left - equation.right,
      ).toBe(equation.result);
  }
  expect(source.problemBank.status).toBe('original-open-question');
  expect(source.problemBank.siteExplorationResult).toBe(30 - 4);
  expect(source.activities.map((a) => [a.page, a.key])).toEqual([
    [74, 'harvest-four-equations-and-own-method-map'],
    [74, 'open-problem-bank-thirty-minus-four'],
    [74, 'four-counter-practice-equations'],
    [74, 'all-four-written-equations'],
    [75, 'all-eight-baskets-and-six-matches'],
    [75, 'all-six-comparisons'],
    [75, 'four-prices-buy-two-and-shortfall-and-own-question'],
    [75, 'one-outfit-within-hundred-budget'],
  ]);
});
it('checks all eight baskets and all six comparisons rather than only examples', () => {
  expect(source.baskets.expressions.map((x) => x.result)).toEqual([
    68, 64, 68, 68, 78, 68, 68, 68,
  ]);
  expect(
    source.baskets.expressions.flatMap((x, index) =>
      (x.operation === '+' ? x.left + x.right : x.left - x.right) === 68
        ? [index + 1]
        : [],
    ),
  ).toEqual([1, 3, 4, 6, 7, 8]);
  const compute = ([left, operation, right]: readonly [
    number,
    string,
    number,
  ]) => (operation === '+' ? left + right : left - right);
  expect(source.comparisons.map((x) => x.sign)).toEqual([
    '>',
    '<',
    '>',
    '=',
    '<',
    '<',
  ]);
  for (const pair of source.comparisons) {
    const left = compute(pair.left);
    const right = compute(pair.right);
    let sign = '=';
    if (left > right) sign = '>';
    if (left < right) sign = '<';
    expect(sign).toBe(pair.sign);
  }
});
it('keeps the shopping shortfall positive and independently enumerates every valid upper-and-trousers outfit', () => {
  expect(source.shopping.prices).toEqual([42, 30, 23, 6]);
  expect(source.shopping.buyTotal).toBe(42 + 6);
  expect(source.shopping.shortfall).toBe(23 - 20);
  const prices = [46, 52, 34, 53, 41];
  const pairs: number[][] = [];
  for (const upper of [1, 2, 3])
    for (const trousers of [4, 5]) {
      if (prices[upper - 1]! + prices[trousers - 1]! <= 100)
        pairs.push([upper, trousers]);
    }
  expect(source.clothes.prices).toEqual(prices);
  expect(source.clothes.legalPositionPairs).toEqual(pairs);
  expect(
    pairs.map(
      ([upper, trousers]) => prices[upper! - 1]! + prices[trousers! - 1]!,
    ),
  ).toEqual([99, 87, 93, 87, 75]);
  expect(source.clothes.changes).toEqual([1, 13, 7, 13, 25]);
  expect(source.clothes.originalTask).toBe('想出一种买法');
});
