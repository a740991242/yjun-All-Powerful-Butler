import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { initialLibrary } from '../learning/storage';
import { sujiaoNumberUnitArithmeticDraft as lesson } from './sujiao-number-unit-arithmetic';
it('keeps whole values distinct from tens counts and changes all numerical review conditions', () => {
  const expected = [
    34,
    34,
    58,
    58,
    5,
    70,
    [3, 4],
    60,
    90,
    [50, 30],
    'good',
    'good',
  ];
  const review = [
    46,
    46,
    63,
    63,
    7,
    80,
    [4, 6],
    70,
    90,
    [70, 20],
    'good',
    'good',
  ];
  for (const [questions, answers] of [
    [lesson.questions.slice(0, 12), expected],
    [lesson.reviewQuestions!, review],
  ] as const) {
    expect(questions).toHaveLength(12);
    questions.forEach((q, i) =>
      expect(evaluate(q.rule, answers[i]!)).toBe(true),
    );
  }
  expect(evaluate(lesson.questions[5]!.rule, 7)).toBe(false);
  expect(evaluate(lesson.questions[7]!.rule, 6)).toBe(false);
  expect(evaluate(lesson.questions[0]!.rule, 43)).toBe(false);
  expect(evaluate(lesson.reviewQuestions![0]!.rule, 34)).toBe(false);
  expect(evaluate(lesson.reviewQuestions![9]!.rule, [50, 30])).toBe(false);
  expect(new Set(lesson.questions.map((q) => q.id)).size).toBe(16);
});
it('preserves unit errors, manual pending and open reflection through backup', () => {
  const library = initialLibrary('数的组成');
  const session = createSession(
    lesson,
    'sujiao-math-p1-lower-9787574312951',
    library.activeProfileId,
  );
  const index = session.questions.findIndex((q) =>
    q.knowledge.endsWith('-remove-ones'),
  );
  for (const answer of [7, 70]) {
    session.responses[index]!.draft = answer;
    session.responses[index] = submitResponse(
      session.questions[index]!,
      session.responses[index]!,
    );
  }
  expect(session.responses[index]!.submissions.map((s) => s.correct)).toEqual([
    false,
    true,
  ]);
  const r = session.questions.findIndex((q) => q.rule.kind === 'reflection');
  session.responses[r]!.draft = '还没摆纸片，准备练习。';
  session.responses[r] = submitResponse(
    session.questions[r]!,
    session.responses[r]!,
  );
  expect(session.responses[r]!.submissions[0]!.correct).toBeNull();
  expect(
    session.questions.filter((q) => q.rule.kind === 'manual'),
  ).toHaveLength(3);
  expect(
    session.responses
      .filter((_, i) => session.questions[i]!.rule.kind === 'manual')
      .every((r) => r.submissions.length === 0),
  ).toBe(true);
  library.sessions.push(session);
  expect(parseBackup(exportBackup(library)).data.sessions[0]).toEqual(session);
});
