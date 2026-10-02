import type { Answer } from '../learning/types';

import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { initialLibrary } from '../learning/storage';
import { sujiaoCalculationReviewDraft as lesson } from './sujiao-calculation-review';
import { sujiaoTwoDigitTensDraft } from './sujiao-two-digit-arithmetic';

it('separates decade predictions, structural comparisons and both subtraction steps', () => {
  const main: Answer[] = [
    '1',
    '1',
    '1',
    '0',
    '1',
    '2',
    7,
    [52, 45],
    '0',
    17,
    '0',
    ['total', 'difference'],
  ];
  const review: Answer[] = [
    '3',
    '3',
    '3',
    '0',
    '1',
    '2',
    6,
    [53, 47],
    '0',
    26,
    '0',
    ['total', 'difference'],
  ];
  expect(lesson.questions).toHaveLength(21);
  expect(lesson.reviewQuestions).toHaveLength(12);
  lesson.questions
    .slice(0, 12)
    .forEach((q, i) => expect(evaluate(q.rule, main[i]!)).toBe(true));
  lesson.reviewQuestions!.forEach((q, i) => {
    expect(evaluate(q.rule, review[i]!)).toBe(true);
    expect(q.knowledge).toBe(lesson.questions[i]!.knowledge);
    expect(q.prompt).not.toBe(lesson.questions[i]!.prompt);
  });
  expect(evaluate(lesson.questions[0]!.rule, '0')).toBe(false);
  expect(evaluate(lesson.questions[4]!.rule, '0')).toBe(false);
  expect(evaluate(lesson.questions[7]!.rule, [52, 52])).toBe(false);
  expect(evaluate(lesson.questions[7]!.rule, [45, 45])).toBe(false);
  expect(
    evaluate(lesson.questions[11]!.rule, ['total', 'difference', 'money']),
  ).toBe(false);
  expect(evaluate(lesson.reviewQuestions![7]!.rule, [52, 45])).toBe(false);
});

it('keeps partial work, intermediate-result mistakes and independent evaluations through backup', () => {
  const state = initialLibrary('计算回顾');
  const old = createSession(
    sujiaoTwoDigitTensDraft,
    'sujiao-math-p1-lower-9787574312951',
    state.activeProfileId,
  );
  const current = createSession(lesson, old.bookId, state.activeProfileId);
  state.sessions.push(old, current);
  const index = current.questions.findIndex((q) =>
    q.knowledge.endsWith('-exploration-steps'),
  );
  current.responses[index]!.draft = [52, null];
  expect(
    parseBackup(exportBackup(state)).data.sessions[1]!.responses[index]!.draft,
  ).toEqual([52, null]);
  for (const answer of [
    [52, 52],
    [52, 45],
  ]) {
    current.responses[index]!.draft = answer;
    current.responses[index] = submitResponse(
      current.questions[index]!,
      current.responses[index]!,
    );
  }
  expect(current.responses[index]!.submissions.map((s) => s.correct)).toEqual([
    false,
    true,
  ]);
  const evaluations = current.questions.filter((q) =>
    q.id.includes('-evaluation-'),
  );
  expect(evaluations).toHaveLength(3);
  for (const q of evaluations) {
    const i = current.questions.findIndex((item) => item.id === q.id);
    current.responses[i]!.draft = '尚未实际摆拨，准备下次请求帮助。这是计划。';
    current.responses[i] = submitResponse(q, current.responses[i]!);
    expect(current.responses[i]!.submissions[0]!.correct).toBeNull();
  }
  expect(
    current.responses
      .filter((_, i) => current.questions[i]!.rule.kind === 'manual')
      .every((r) => r.submissions.length === 0),
  ).toBe(true);
  const restored = parseBackup(exportBackup(state)).data.sessions;
  expect(restored[0]).toEqual(old);
  expect(restored[1]).toEqual(current);
});

it('preserves a mistake for changed-condition review rather than accepting the prior result', () => {
  const state = initialLibrary('换条件复习');
  const session = createSession(
    lesson,
    'sujiao-math-p1-lower-9787574312951',
    state.activeProfileId,
  );
  const index = session.questions.findIndex((q) =>
    q.knowledge.endsWith('-exploration-steps'),
  );
  session.responses[index]!.draft = [52, 52];
  session.responses[index] = submitResponse(
    session.questions[index]!,
    session.responses[index]!,
  );
  const review = createSession(lesson, session.bookId, state.activeProfileId, {
    mode: 'review',
    originalSessionId: session.id,
    questions: lesson.reviewQuestions!.filter(
      (q) => q.knowledge === session.questions[index]!.knowledge,
    ),
  });
  expect(review.questions).toHaveLength(1);
  for (const answer of [
    [52, 45],
    [53, 47],
  ]) {
    review.responses[0]!.draft = answer;
    review.responses[0] = submitResponse(
      review.questions[0]!,
      review.responses[0]!,
    );
  }
  expect(review.responses[0]!.submissions.map((s) => s.correct)).toEqual([
    false,
    true,
  ]);
  state.sessions.push(session, review);
  expect(parseBackup(exportBackup(state)).data.sessions).toEqual(
    state.sessions,
  );
});
