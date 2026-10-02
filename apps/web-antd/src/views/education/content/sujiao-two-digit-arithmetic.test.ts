import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { initialLibrary } from '../learning/storage';
import {
  sujiaoTwoDigitOnesDraft as ones,
  sujiaoTwoDigitTensDraft as tens,
} from './sujiao-two-digit-arithmetic';

it('distinguishes tens from ones with independently calculated sums, differences and intermediate quantities', () => {
  const expected = [
    [
      tens,
      [55, 15, '0', 50, 10, '1', 55, '0', 55, 15, 35, '0'],
      [76, 16, '0', 70, 10, '1', 76, '0', 76, 16, 46, '0'],
    ],
    [
      ones,
      [49, 45, '1', 9, 5, '0', 40, '0', 49, 45, 47, '0'],
      [67, 61, '1', 7, 1, '0', 60, '0', 67, 61, 64, '0'],
    ],
  ] as const;
  for (const [lesson, main, review] of expected) {
    expect(lesson.questions).toHaveLength(16);
    expect(lesson.reviewQuestions).toHaveLength(12);
    const questions = lesson.questions.slice(0, 12);
    questions.forEach((q, index) =>
      expect(evaluate(q.rule, main[index]!)).toBe(true),
    );
    lesson.reviewQuestions!.forEach((q, index) => {
      expect(evaluate(q.rule, review[index]!)).toBe(true);
      expect(q.prompt).not.toBe(questions[index]!.prompt);
      expect(q.knowledge).toBe(questions[index]!.knowledge);
    });
    expect(questions[0]!.visual).toEqual({
      kind: 'digit-counter',
      tens: lesson === tens ? 3 : 4,
      ones: lesson === tens ? 5 : 7,
    });
    expect(lesson.reviewQuestions![0]!.visual).not.toEqual(
      questions[0]!.visual,
    );
  }
});
it('does not silently introduce carrying or borrowing into the one-digit lesson', () => {
  // 67+4 would carry: use 64+3 instead in the authored review.
  const sum = ones.reviewQuestions![0]!;
  expect(sum.prompt).toContain('64＋3');
  expect(evaluate(sum.rule, 67)).toBe(true);
  expect(evaluate(ones.questions[6]!.rule, 4)).toBe(false);
  expect(evaluate(ones.questions[6]!.rule, 40)).toBe(true);
  expect(evaluate(tens.questions[0]!.rule, 37)).toBe(false);
});
it('preserves wrong-unit attempts and corrections without confirming physical tasks', () => {
  const library = initialLibrary('同单位');
  const s = createSession(
    tens,
    'sujiao-math-p1-lower-9787574312951',
    library.activeProfileId,
  );
  const i = s.questions.findIndex((q) => q.id.endsWith('-q-add'));
  for (const draft of [37, 55]) {
    s.responses[i]!.draft = draft;
    s.responses[i] = submitResponse(s.questions[i]!, s.responses[i]!);
  }
  expect(s.responses[i]!.submissions.map((x) => x.correct)).toEqual([
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
  const bad = JSON.parse(exportBackup(library));
  bad.data.sessions[0].questions[i].visual.ones = 10;
  expect(() => parseBackup(JSON.stringify(bad))).toThrow(Error);
});
