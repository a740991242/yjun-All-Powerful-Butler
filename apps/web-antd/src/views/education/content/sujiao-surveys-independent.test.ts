import { expect, it } from 'vitest';

import { evaluate, validAnswer } from '../learning/engine';
import { sujiaoLowerBook } from './sujiao-lower';

const cases = [
  {
    id: 'sj-lower-surveys',
    main: [
      [5, 4, 9],
      [7, 3, 10],
      [6, 0, 6],
      [4, 2, 3, 9],
    ],
    review: [
      [7, 5, 12],
      [4, 8, 12],
      [0, 6, 6],
      [4, 4, 2, 10],
    ],
    mainMost: [['0'], ['0'], ['0'], ['0']],
    reviewMost: [['0'], ['1'], ['1'], ['0', '1']],
  },
  {
    id: 'sj-lower-class-surveys',
    main: [
      [4, 5, 9],
      [3, 6, 9],
      [2, 7, 9],
      [0, 9, 9],
    ],
    review: [
      [6, 4, 10],
      [7, 3, 10],
      [0, 10, 10],
      [5, 5, 10],
    ],
    mainMost: [['1'], ['1'], ['1'], ['1']],
    reviewMost: [['0'], ['0'], ['1'], ['0', '1']],
  },
];

for (const example of cases)
  for (const review of [false, true])
    it(`${example.id} ${review ? 'review' : 'main'} grades every published read, total and complete maximum independently`, () => {
      const lesson = sujiaoLowerBook.units
        .flatMap((unit) => unit.lessons)
        .find((item) => item.id === example.id)!;
      expect(lesson.status).toBe('available');
      const questions = review ? lesson.reviewQuestions! : lesson.questions;
      const prefix = `${example.id}-${review ? 'r' : 'q'}`;
      const expected = (review ? example.review : example.main).flatMap(
        (row, index) =>
          row.map((answer, position) => ({
            id: `${prefix}-${index}-${position === row.length - 1 ? 'total' : `read-${position}`}`,
            answer,
          })),
      );
      expect(
        questions
          .filter((q) => q.rule.kind === 'number')
          .map((q) => q.id)
          .toSorted((left, right) => left.localeCompare(right)),
      ).toEqual(
        expected
          .map((q) => q.id)
          .toSorted((left, right) => left.localeCompare(right)),
      );
      for (const item of expected) {
        const question = questions.find((q) => q.id === item.id)!;
        expect(validAnswer(question.rule, null)).toBe(false);
        for (let answer = 0; answer <= 20; answer++)
          expect(evaluate(question.rule, answer), `${item.id}: ${answer}`).toBe(
            answer === item.answer,
          );
      }
      const maxima = review ? example.reviewMost : example.mainMost;
      expect(
        questions
          .filter((q) => q.rule.kind === 'set')
          .map((q) => q.id)
          .toSorted((left, right) => left.localeCompare(right)),
      ).toEqual(
        maxima
          .map((_, index) => `${prefix}-${index}-most`)
          .toSorted((left, right) => left.localeCompare(right)),
      );
      for (const [index, maximum] of maxima.entries()) {
        const question = questions.find(
          (q) => q.id === `${prefix}-${index}-most`,
        )!;
        const ids = question.choices!.map((choice) => choice.id);
        expect(validAnswer(question.rule, null)).toBe(false);
        for (let mask = 0; mask < 2 ** ids.length; mask++) {
          const selected = ids.filter((_, bit) => (mask & (1 << bit)) !== 0);
          expect(
            validAnswer(question.rule, selected) &&
              evaluate(question.rule, selected),
            `${question.id}: ${selected.join(',')}`,
          ).toBe(
            selected.length === maximum.length &&
              maximum.every((id) => selected.includes(id)),
          );
        }
      }
    });
