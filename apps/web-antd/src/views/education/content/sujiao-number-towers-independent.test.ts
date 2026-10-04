import { expect, it } from 'vitest';

import { evaluate, validAnswer } from '../learning/engine';
import { towerSolutions } from '../learning/number-tower';
import { sujiaoLowerBook } from './sujiao-lower';

it('checks every published tower against independent main and review fillings, including every open solution', () => {
  const lesson = sujiaoLowerBook.units
    .flatMap((unit) => unit.lessons)
    .find((item) => item.id === 'sj-lower-number-towers');
  expect(lesson?.status).toBe('available');
  if (!lesson) throw new Error('Published tower lesson is missing');

  for (const review of [false, true]) {
    const questions = review ? lesson.reviewQuestions! : lesson.questions;
    const prefix = `sj-lower-number-towers-${review ? 'r' : 'q'}`;
    expect(
      questions
        .filter((question) => question.rule.kind !== 'manual')
        .map((question) => question.id),
    ).toEqual([
      ...Array.from({ length: 5 }, (_, index) => `${prefix}-fill-${index}`),
      `${prefix}-zero`,
      `${prefix}-middle`,
      `${prefix}-many`,
    ]);

    // Expected A-first fillings come from the stated adjacent sums, not the
    // lesson's rule or the production solver. The free bottom middle is b.
    const expected: number[][][] = review
      ? [
          [[12, 5, 7]],
          [[19, 11, 4]],
          Array.from({ length: 9 }, (_, b) => [8, 10 - b, b, 8 - b]),
          [[9, 4]],
          [[11, 5, 6]],
        ]
      : [
          [[16, 7, 9]],
          [[16, 10, 4]],
          Array.from({ length: 8 }, (_, b) => [7, 9 - b, b, 7 - b]),
          [[7, 3]],
          [[12, 5, 7]],
        ];

    for (const [index, solutions] of expected.entries()) {
      const question = questions.find(
        (item) => item.id === `${prefix}-fill-${index}`,
      )!;
      expect(question.rule.kind).toBe('tower');
      if (question.rule.kind !== 'tower') throw new Error('Not a tower');
      const compare = (a: number[], b: number[]) =>
        JSON.stringify(a).localeCompare(JSON.stringify(b));
      expect(towerSolutions(question.rule.rows).toSorted(compare)).toEqual(
        solutions.toSorted(compare),
      );
      expect(question.visual).toEqual({
        kind: 'number-tower',
        rows: question.rule.rows,
      });
      for (const solution of solutions) {
        expect(evaluate(question.rule, solution)).toBe(true);
        for (const position of solution.keys()) {
          for (let candidate = 0; candidate <= 19; candidate++) {
            const changed = [...solution];
            changed[position] = candidate;
            expect(evaluate(question.rule, changed)).toBe(
              candidate === solution[position],
            );
          }
          const partial: (null | number)[] = [...solution];
          partial[position] = null;
          expect(validAnswer(question.rule, partial)).toBe(false);
        }
        expect(validAnswer(question.rule, [...solution, 0])).toBe(false);
      }
    }
    const zero = questions.find((item) => item.id === `${prefix}-zero`)!;
    for (let value = 0; value <= 19; value++)
      expect(evaluate(zero.rule, value)).toBe(value === (review ? 7 : 5));
    for (const [suffix, answer] of [
      ['middle', 'twice'],
      ['many', 'no'],
    ]) {
      const question = questions.find(
        (item) => item.id === `${prefix}-${suffix}`,
      )!;
      for (const choice of question.choices!)
        expect(evaluate(question.rule, choice.id)).toBe(choice.id === answer);
    }
  }
});
