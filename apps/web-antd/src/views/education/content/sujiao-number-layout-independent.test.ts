import { expect, it } from 'vitest';

import { evaluate, validAnswer } from '../learning/engine';
import { sujiaoLowerBook } from './sujiao-lower';

const cases: {
  id: string;
  numbers: Record<string, [number, number]>;
  choices: Record<string, [string, string]>;
  sets: Record<string, [string[], string[]]>;
}[] = [
  {
    id: 'sj-lower-zero-chart',
    numbers: {
      'neighbor-0': [46, 61],
      'neighbor-1': [48, 63],
      'neighbor-2': [37, 52],
      'neighbor-3': [57, 72],
      'first-row': [0, 9],
      'last-row': [99, 90],
      horizontal: [1, 1],
      vertical: [10, 10],
      'position-count': [100, 100],
    },
    choices: { 'right-edge': ['none', 'none'], 'left-edge': ['none', 'none'] },
    sets: {
      'same-row': [
        ['30', '34', '39'],
        ['60', '64', '69'],
      ],
      'same-column': [
        ['7', '27', '97'],
        ['4', '24', '94'],
      ],
    },
  },
  {
    id: 'sj-lower-circular-numbers',
    numbers: {
      'blank-K': [22, 42],
      'blank-L': [35, 55],
      'blank-M': [48, 68],
      'blank-N': [50, 70],
      outward: [36, 56],
      clockwise: [39, 59],
      wrap: [30, 50],
      'outer-max': [59, 79],
      'inner-max': [29, 49],
      'radial-difference': [10, 10],
    },
    choices: {
      'ring-order': ['out', 'out'],
      'wrap-rule': ['same', 'same'],
      'blank-value': ['no', 'no'],
      centre: ['no', 'no'],
      'not-rectangle': ['no', 'no'],
      'changed-array': ['recheck', 'recheck'],
    },
    sets: {},
  },
];

for (const example of cases)
  for (const variant of [0, 1] as const)
    it(`${example.id} ${variant === 0 ? 'main' : 'review'} checks every published answer against independent layout values`, () => {
      const lesson = sujiaoLowerBook.units
        .flatMap((unit) => unit.lessons)
        .find((item) => item.id === example.id)!;
      expect(lesson.status).toBe('available');
      const questions =
        variant === 0 ? lesson.questions : lesson.reviewQuestions!;
      const prefix = `${example.id}-${variant === 0 ? 'q' : 'r'}`;
      for (const [kind, expected] of [
        ['number', example.numbers],
        ['choice', example.choices],
        ['set', example.sets],
      ] as const)
        expect(
          questions
            .filter((q) => q.rule.kind === kind)
            .map((q) => q.id)
            .toSorted((a, b) => a.localeCompare(b)),
        ).toEqual(
          Object.keys(expected)
            .map((key) => `${prefix}-${key}`)
            .toSorted((a, b) => a.localeCompare(b)),
        );
      for (const [key, answers] of Object.entries(example.numbers)) {
        const question = questions.find((q) => q.id === `${prefix}-${key}`)!;
        expect(validAnswer(question.rule, null)).toBe(false);
        for (let answer = 0; answer <= 100; answer++)
          expect(
            evaluate(question.rule, answer),
            `${question.id}: ${answer}`,
          ).toBe(answer === answers[variant]);
      }
      for (const [key, answers] of Object.entries(example.choices)) {
        const question = questions.find((q) => q.id === `${prefix}-${key}`)!;
        expect(question.choices!.map((choice) => choice.id)).toContain(
          answers[variant],
        );
        expect(validAnswer(question.rule, null)).toBe(false);
        for (const choice of question.choices!)
          expect(
            evaluate(question.rule, choice.id),
            `${question.id}: ${choice.id}`,
          ).toBe(choice.id === answers[variant]);
      }
      for (const [key, answers] of Object.entries(example.sets)) {
        const question = questions.find((q) => q.id === `${prefix}-${key}`)!;
        const expected = answers[variant];
        const ids = question.choices!.map((choice) => choice.id);
        expect(expected.every((id) => ids.includes(id))).toBe(true);
        expect(validAnswer(question.rule, null)).toBe(false);
        for (let mask = 0; mask < 2 ** ids.length; mask++) {
          const selected = ids.filter((_, bit) => (mask & (1 << bit)) !== 0);
          expect(
            validAnswer(question.rule, selected) &&
              evaluate(question.rule, selected),
            `${question.id}: ${selected.join(',')}`,
          ).toBe(
            selected.length === expected.length &&
              expected.every((id) => selected.includes(id)),
          );
        }
      }
    });
