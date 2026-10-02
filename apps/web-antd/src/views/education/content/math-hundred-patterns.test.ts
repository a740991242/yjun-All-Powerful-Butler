import type { Answer } from '../learning/types';

import { describe, expect, it } from 'vitest';

import { evaluate } from '../learning/engine';
import { hundredPosition } from '../learning/hundred-chart';
import {
  hundredFragments,
  isHundredFragmentsVisual,
} from '../learning/hundred-fragments';
import { required } from '../learning/required';
import { hundredPracticeLessons } from './math-hundred-practice';
const lesson = (index: number) => required(hundredPracticeLessons[index]);
const q = (index: number, suffix: string) =>
  required(lesson(index).questions.find((q) => q.id.endsWith(`-${suffix}`)));
describe('hundred chart fragments and open comparisons', () => {
  it('retains geometric coordinates, labels and chart bounds for both independent sets', () => {
    for (const [variant, expected] of [
      [
        'main',
        [
          [38, 39, 48, 49],
          [54, 63, 64, 65, 74],
          [18, 19, 20, 28, 29, 38],
        ],
      ],
      [
        'review',
        [
          [72, 73, 82, 83],
          [36, 45, 46, 47, 56],
          [68, 69, 70, 78, 79, 88],
        ],
      ],
    ] as const) {
      hundredFragments(variant).forEach((fragment, i) => {
        expect(fragment.cells.map((c) => c.value)).toEqual(expected[i]);
        const first = required(fragment.cells[0]);
        const origin = hundredPosition(first.value);
        for (const cell of fragment.cells) {
          const position = hundredPosition(cell.value);
          expect(position.row - origin.row).toBe(cell.y - first.y);
          expect(position.column - origin.column).toBe(cell.x - first.x);
        }
      });
    }
    expect(
      isHundredFragmentsVisual({ kind: 'hundred-fragments', variant: 'main' }),
    ).toBe(true);
    expect(
      isHundredFragmentsVisual({
        kind: 'hundred-fragments',
        variant: ['main'],
      }),
    ).toBe(false);
    expect(
      isHundredFragmentsVisual({
        kind: 'hundred-fragments',
        variant: 'main',
        answer: 20,
      }),
    ).toBe(false);
    expect(hundredPosition(20).right).toBeNull();
    expect(hundredPosition(91).left).toBeNull();
    expect(hundredPosition(100).down).toBeNull();
  });
  it('checks digit criteria and fragments without wrapping at row boundaries', () => {
    const answers: Answer[] = [
      ['40', '44', '49'],
      ['4', '14', '44', '54'],
      ['11', '44', '66', '99'],
      [39, 48, 49],
      [54, 63, 65, 74],
      [18, 19, 28, 29, 38],
      '没有格',
      [19, 10, 30],
      '都是没有格',
    ];
    answers.forEach((a, i) =>
      expect(evaluate(q(3, `q${i + 1}`).rule, a)).toBe(true),
    );
    expect(evaluate(q(3, 'q7').rule, '21')).toBe(false);
    expect(evaluate(q(3, 'q6').rule, [18, 19, 21, 22, 31])).toBe(false);
    const review: Answer[] = [
      [73, 82, 83],
      [36, 45, 47, 56],
      [68, 69, 78, 79, 88],
      '没有格',
    ];
    required(lesson(3).reviewQuestions).forEach((q, i) =>
      expect(evaluate(q.rule, required(review[i]))).toBe(true),
    );
  });
  it('accepts every and only legal digit, including zero, in six independent inequalities', () => {
    const predicates = [
      (d: number) => 50 + d < 57,
      (d: number) => 10 * d + 2 < 31,
      (d: number) => 10 * d + 7 < 26,
      (d: number) => 40 + d > 40,
      (d: number) => 10 * d + 8 < 68,
      (d: number) => 10 * d > 29,
    ];
    for (const [i, predicate] of predicates.entries()) {
      const rule = q(4, i < 3 ? 'q5' : 'q6').rule;
      expect(rule.kind).toBe('number-picks');
      if (rule.kind !== 'number-picks') throw new Error('wrong rule');
      expect(rule.fields[i % 3]).toEqual(
        Array.from({ length: 10 }, (_, d) => d).filter((digit) =>
          predicate(digit),
        ),
      );
    }
    expect(evaluate(q(4, 'q5').rule, [0, 0, 0])).toBe(true);
    expect(evaluate(q(4, 'q5').rule, [6, 2, 1])).toBe(true);
    expect(evaluate(q(4, 'q5').rule, [7, 2, 1])).toBe(false);
    expect(() => evaluate(q(4, 'q5').rule, [null, 0, 0])).toThrow(
      'educationLearning.answerRequired',
    );
    expect(evaluate(q(4, 'q6').rule, [1, 0, 3])).toBe(true);
    expect(evaluate(q(4, 'q6').rule, [9, 5, 9])).toBe(true);
    expect(evaluate(q(4, 'q6').rule, [0, 6, 2])).toBe(false);
  });
  it('distinguishes reference quantities, strict ordering and equal nearest tens', () => {
    const answers: Answer[] = [
      [24, 29, 78, 92],
      '<',
      '>',
      ['61', '78', '100'],
      [0, 0, 0],
      [1, 0, 3],
      ['0', '1', '2', '3', '4', '5', '6'],
      '多一些',
      '少得多',
      [3, 7],
      60,
      ['50', '60'],
    ];
    answers.forEach((a, i) =>
      expect(evaluate(q(4, `q${i + 1}`).rule, a)).toBe(true),
    );
    expect(evaluate(q(4, 'q4').rule, ['60', '61', '78', '100'])).toBe(false);
    expect(evaluate(q(4, 'q12').rule, ['50'])).toBe(false);
    const review: Answer[] = [
      [31, 37, 83, 96],
      [3, 3, 2],
      [2, 8],
      ['80', '90'],
    ];
    required(lesson(4).reviewQuestions).forEach((q, i) =>
      expect(evaluate(q.rule, required(review[i]))).toBe(true),
    );
  });
});
