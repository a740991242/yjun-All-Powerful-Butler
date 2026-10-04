import type { Answer } from '../learning/types';

import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  createSession,
  evaluate,
  submitResponse,
  validAnswer,
} from '../learning/engine';
import { initialLibrary } from '../learning/storage';
import { sujiaoCalculationLinksDraft as lesson } from './sujiao-calculation-links';
import { sujiaoLowerLessons } from './sujiao-lower';
it('independently checks linked facts, updated sequential starts and changing operation directions', () => {
  const main: Answer[] = [
    12,
    32,
    52,
    8,
    28,
    58,
    [15, 22, 29],
    [42, 34, 26],
    [46, 76],
    [40, 36],
    'lt',
    'gt',
    'eq',
    'no',
  ];
  const review: Answer[] = [
    14,
    44,
    74,
    8,
    38,
    68,
    [17, 25, 33],
    [53, 46, 39],
    [63, 83],
    [50, 43],
    'lt',
    'gt',
    'eq',
    'no',
  ];
  expect(lesson.questions).toHaveLength(18);
  expect(lesson.reviewQuestions).toHaveLength(14);
  const published = sujiaoLowerLessons.find((item) => item.id === lesson.id)!;
  expect(published.status).toBe('available');
  for (const [questions, answers] of [
    [published.questions.slice(0, 14), main],
    [published.reviewQuestions!, review],
  ] as const) {
    expect(questions).toHaveLength(answers.length);
    questions.forEach((question, index) => {
      const expected = answers[index]!;
      expect(validAnswer(question.rule, null)).toBe(false);
      if (typeof expected === 'number') {
        for (let value = 0; value <= 99; value++)
          expect(evaluate(question.rule, value)).toBe(value === expected);
      } else if (Array.isArray(expected)) {
        const values = expected.map((value) => {
          if (typeof value !== 'number')
            throw new Error('Expected numeric chain');
          return value;
        });
        for (let field = 0; field < values.length; field++) {
          const partial: (null | number)[] = [...values];
          partial[field] = null;
          expect(validAnswer(question.rule, partial)).toBe(false);
          // The literal intermediates above do not call the lesson generator.
          for (let value = 0; value <= 99; value++) {
            const candidate = [...values];
            candidate[field] = value;
            expect(evaluate(question.rule, candidate)).toBe(
              value === values[field],
            );
          }
        }
      } else {
        expect(question.choices?.some((item) => item.id === expected)).toBe(
          true,
        );
        for (const candidate of question.choices!)
          expect(evaluate(question.rule, candidate.id)).toBe(
            candidate.id === expected,
          );
      }
    });
  }
  lesson.questions
    .slice(0, 14)
    .forEach((q, i) => expect(evaluate(q.rule, main[i]!)).toBe(true));
  lesson.reviewQuestions!.forEach((q, i) => {
    expect(evaluate(q.rule, review[i]!)).toBe(true);
    expect(q.prompt).not.toBe(lesson.questions[i]!.prompt);
    expect(q.knowledge).toBe(lesson.questions[i]!.knowledge);
  });
  expect(evaluate(lesson.questions[6]!.rule, [15, 15, 15])).toBe(false);
  expect(evaluate(lesson.questions[8]!.rule, [46, 16])).toBe(false);
  expect(evaluate(lesson.questions[10]!.rule, 'gt')).toBe(false);
  expect(evaluate(lesson.questions[13]!.rule, 'yes')).toBe(false);
});
it('retains a repeated-start mistake and corrected intermediates without confirming paper work', () => {
  const library = initialLibrary('连算');
  const s = createSession(
    lesson,
    'sujiao-math-p1-lower-9787574312951',
    library.activeProfileId,
  );
  const i = s.questions.findIndex((q) => q.id.endsWith('-q-add-chain'));
  for (const draft of [
    [15, 15, 15],
    [15, 22, 29],
  ]) {
    s.responses[i]!.draft = draft;
    s.responses[i] = submitResponse(s.questions[i]!, s.responses[i]!);
  }
  expect(s.responses[i]!.submissions.map((a) => a.correct)).toEqual([
    false,
    true,
  ]);
  library.sessions.push(s);
  expect(parseBackup(exportBackup(library)).data.sessions[0]).toEqual(s);
  expect(
    s.responses
      .filter((_, j) => s.questions[j]!.rule.kind === 'manual')
      .every((r) => r.submissions.length === 0),
  ).toBe(true);
});
