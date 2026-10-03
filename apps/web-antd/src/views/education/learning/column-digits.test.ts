import type { ColumnDigitsRule } from './column-digits';

import { describe, expect, it } from 'vitest';

import {
  columnDigitBlankCount,
  isColumnDigitsRule,
  matchesColumnDigits,
} from './column-digits';
import { evaluate } from './engine';

const addition: ColumnDigitsRule = {
  kind: 'column-digits',
  operator: '+',
  left: [5, null],
  right: [null, 4],
  result: [8, 7],
};
const subtraction: ColumnDigitsRule = {
  kind: 'column-digits',
  operator: '-',
  left: [null, null],
  right: [2, null],
  result: [6, 8],
};

describe('bounded joint column digit constraints', () => {
  it('checks all 100 two-blank combinations against independently formed full numbers', () => {
    expect(columnDigitBlankCount(addition)).toBe(2);
    for (let a = 0; a <= 9; a++)
      for (let b = 0; b <= 9; b++) {
        expect(matchesColumnDigits(addition, [a, b])).toBe(
          b !== 0 && 50 + a + 10 * b + 4 === 87,
        );
      }
  });
  it('accepts exactly all 10 valid solutions among 1000 three-blank candidates', () => {
    const found: number[][] = [];
    for (let a = 0; a <= 9; a++)
      for (let b = 0; b <= 9; b++)
        for (let c = 0; c <= 9; c++) {
          const expected = a !== 0 && 10 * a + b - (20 + c) === 68;
          expect(matchesColumnDigits(subtraction, [a, b, c])).toBe(expected);
          if (expected) found.push([a, b, c]);
        }
    expect(found).toEqual([
      [8, 8, 0],
      [8, 9, 1],
      [9, 0, 2],
      [9, 1, 3],
      [9, 2, 4],
      [9, 3, 5],
      [9, 4, 6],
      [9, 5, 7],
      [9, 6, 8],
      [9, 7, 9],
    ]);
  });
  it('distinguishes zero result tens from missing input and does not permit zero-leading operands', () => {
    const rule: ColumnDigitsRule = {
      kind: 'column-digits',
      operator: '-',
      left: [null, 7],
      right: [2, null],
      result: [null, 2],
    };
    expect(evaluate(rule, [2, 5, 0])).toBe(true);
    expect(evaluate(rule, [9, 5, 7])).toBe(true);
    expect(evaluate(rule, [0, 5, 0])).toBe(false);
    expect(() => evaluate(rule, [2, 5, null])).toThrow(
      'educationLearning.answerRequired',
    );
    expect(() => evaluate(rule, [2, 5])).toThrow(
      'educationLearning.answerRequired',
    );
    expect(matchesColumnDigits(rule, ['2', 5, 0])).toBe(false);
    expect(matchesColumnDigits(rule, [2, 5, 0, 1])).toBe(false);
  });
  it('rejects malformed, unbounded and impossible model snapshots without coercion', () => {
    for (const model of [
      null,
      [],
      { ...addition, answer: [3, 3] },
      { ...addition, operator: '×' },
      { ...addition, left: [5, undefined] },
      { ...addition, left: [5, 1.5] },
      { ...addition, left: [5, -1] },
      { ...addition, left: [5, 10] },
      { ...addition, result: [1, 1] },
      { ...addition, left: [0, null] },
      { ...addition, left: [5, 3], right: [3, 4] },
      {
        ...addition,
        left: [null, null],
        right: [null, null],
        result: [null, null],
      },
      { ...addition, left: Array.from({ length: 2 }) },
    ]) {
      expect(isColumnDigitsRule(model)).toBe(false);
    }
    expect(isColumnDigitsRule(addition)).toBe(true);
    expect(isColumnDigitsRule(subtraction)).toBe(true);
  });
});
