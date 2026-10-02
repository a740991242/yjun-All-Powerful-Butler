import type { Answer } from '../learning/types';

import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { initialLibrary } from '../learning/storage';
import { sujiaoPlaneReviewDraft as lesson } from './sujiao-plane-review';

it('distinguishes classified cards, five material pieces and the whole outline with changed review conditions', () => {
  const main: Answer[] = [3, 3, 2, 2, 5, 4, 1, '0', 0, '0', '0', '0'];
  const review: Answer[] = [2, 2, 3, 3, 5, 0, 1, '0', 0, '0', '0', '0'];
  expect(lesson.questions).toHaveLength(21);
  expect(lesson.reviewQuestions).toHaveLength(12);
  lesson.questions
    .slice(0, 12)
    .forEach((q, i) => expect(evaluate(q.rule, main[i]!)).toBe(true));
  lesson.reviewQuestions!.forEach((q, i) => {
    expect(evaluate(q.rule, review[i]!)).toBe(true);
    expect(q.knowledge).toBe(lesson.questions[i]!.knowledge);
  });
  expect(evaluate(lesson.questions[4]!.rule, 6)).toBe(false);
  expect(evaluate(lesson.questions[5]!.rule, 5)).toBe(false);
  expect(evaluate(lesson.questions[6]!.rule, 2)).toBe(false);
  expect(evaluate(lesson.questions[9]!.rule, '1')).toBe(false);
  expect(evaluate(lesson.reviewQuestions![0]!.rule, 3)).toBe(false);
  expect(evaluate(lesson.reviewQuestions![5]!.rule, 4)).toBe(false);
});

it('preserves mistakes, independent evaluations and unconfirmed actual stamping through backup', () => {
  const state = initialLibrary('图形回顾');
  const s = createSession(
    lesson,
    'sujiao-math-p1-lower-9787574312951',
    state.activeProfileId,
  );
  state.sessions.push(s);
  const index = s.questions.findIndex((q) =>
    q.knowledge.endsWith('-count-circle'),
  );
  for (const answer of [4, 3]) {
    s.responses[index]!.draft = answer;
    s.responses[index] = submitResponse(
      s.questions[index]!,
      s.responses[index]!,
    );
  }
  expect(s.responses[index]!.submissions.map((a) => a.correct)).toEqual([
    false,
    true,
  ]);
  for (const q of s.questions.filter((q) => q.id.includes('-evaluation-'))) {
    const i = s.questions.findIndex((item) => item.id === q.id);
    s.responses[i]!.draft = '尚未真正印面，准备下次请家长协助，这是计划。';
    s.responses[i] = submitResponse(q, s.responses[i]!);
    expect(s.responses[i]!.submissions[0]!.correct).toBeNull();
  }
  expect(
    s.responses
      .filter((_, i) => s.questions[i]!.rule.kind === 'manual')
      .every((r) => r.submissions.length === 0),
  ).toBe(true);
  expect(parseBackup(exportBackup(state)).data.sessions[0]).toEqual(s);
  const invalid = JSON.parse(exportBackup(state));
  const visual = invalid.data.sessions[0].questions.find(
    (q: { visual?: { kind: string } }) =>
      q.visual?.kind === 'partitioned-square',
  ).visual;
  visual.answer = 5;
  expect(() => parseBackup(JSON.stringify(invalid))).toThrow(
    'educationLearning.invalidBackup',
  );
});
