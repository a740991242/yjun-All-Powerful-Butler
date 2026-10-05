import { expect, it } from 'vitest';

import { evaluate, validAnswer } from './engine';
import {
  isReversedAddendsRule,
  matchesReversedAddends,
  reversedAddendPairs,
} from './reversed-addends';

it('exhaustively matches all two-digit pairs, including equal addends and both written orders', () => {
  for (let result = 0; result <= 110; result++) {
    const rule = { kind: 'reversed-addends', result, count: 1 } as const;
    const expected: [number, number][] = [];
    const mismatches: [number, number][] = [];
    for (let a = 0; a <= 100; a++)
      for (let b = 0; b <= 100; b++) {
        const legal =
          result >= 22 &&
          result <= 99 &&
          a >= 10 &&
          a <= 99 &&
          b >= 10 &&
          b <= 99 &&
          a + b === result &&
          Math.floor(a / 10) === b % 10 &&
          a % 10 === Math.floor(b / 10);
        if (legal) expected.push([a, b]);
        if (matchesReversedAddends(rule, [a, b]) !== legal)
          mismatches.push([a, b]);
      }
    expect(mismatches, `sum ${result}`).toEqual([]);
    expect(reversedAddendPairs(result).filter(() => result <= 99)).toEqual(
      expected,
    );
  }
  expect(
    evaluate({ kind: 'reversed-addends', result: 44, count: 1 }, [22, 22]),
  ).toBe(true);
});
it('accepts every three-equation selection and order, rejects exact repeats and copied conditions', () => {
  const rule = { kind: 'reversed-addends', result: 99, count: 3 } as const;
  const pairs = [
    [18, 81],
    [27, 72],
    [36, 63],
    [45, 54],
    [54, 45],
    [63, 36],
    [72, 27],
    [81, 18],
  ];
  for (const a of pairs)
    for (const b of pairs)
      for (const c of pairs) {
        const distinct =
          new Set([a.join('+'), b.join('+'), c.join('+')]).size === 3;
        expect(evaluate(rule, [...a, ...b, ...c])).toBe(distinct);
      }
  expect(evaluate(rule, [18, 81, 81, 18, 45, 54])).toBe(true);
  expect(evaluate(rule, [13, 31, 22, 22, 31, 13])).toBe(false);
});
it('strictly validates rules and dense numeric answers without coercing holes or zero', () => {
  for (const invalid of [
    null,
    [],
    {},
    { kind: 'reversed-addends', result: 44, count: 1, answers: [13, 31] },
    { kind: 'reversed-addends', result: '44', count: 1 },
    { kind: 'reversed-addends', result: 44, count: 4 },
    { kind: 'reversed-addends', result: 22, count: 2 },
    { kind: 'reversed-addends', result: 43, count: 1 },
    { kind: 'reversed-addends', result: 110, count: 1 },
  ])
    expect(isReversedAddendsRule(invalid)).toBe(false);
  const rule = { kind: 'reversed-addends', result: 44, count: 1 } as const;
  for (const invalid of [
    null,
    [13],
    ['13', 31],
    [13, null],
    [0, 44],
    [40, 4],
    [13, 31, 0],
  ])
    expect(matchesReversedAddends(rule, invalid)).toBe(false);
  const sparse = [13, 31];
  Reflect.deleteProperty(sparse, '1');
  expect(Object.hasOwn(sparse, 1)).toBe(false);
  expect(matchesReversedAddends(rule, sparse)).toBe(false);
  expect(validAnswer(rule, sparse)).toBe(false);
  expect(() => evaluate(rule, sparse)).toThrow(
    'educationLearning.answerRequired',
  );
});
