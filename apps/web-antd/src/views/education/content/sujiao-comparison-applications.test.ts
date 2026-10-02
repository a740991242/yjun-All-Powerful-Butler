import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { initialLibrary } from '../learning/storage';
import { sujiaoComparisonApplicationsDraft as lesson } from './sujiao-comparison-applications';
it('separates every sufficient vehicle from the least spare seats and preserves strict ordering', () => {
  const q = (key: string) =>
    lesson.questions.find((q) => q.id.endsWith(`-q-${key}`))!;
  expect(evaluate(q('enough').rule, ['40', '50'])).toBe(true);
  expect(evaluate(q('enough').rule, ['40'])).toBe(false);
  expect(evaluate(q('enough').rule, ['30', '40', '50'])).toBe(false);
  expect(evaluate(q('suitable').rule, '40')).toBe(true);
  expect(evaluate(q('suitable').rule, '50')).toBe(false);
  expect(evaluate(q('sort').rule, [26, 27, 57, 62, 72])).toBe(true);
  expect(evaluate(q('sort').rule, [72, 62, 57, 27, 26])).toBe(false);
  for (let n = 0; n <= 100; n++)
    expect(evaluate(q('choose').rule, [n])).toBe(n > 45 && n <= 99);
  const expected = ['less', 'greater', 'less', 'equal', 'near', 'far'];
  expected.forEach((answer, i) =>
    expect(evaluate(lesson.questions[i]!.rule, answer)).toBe(true),
  );
  for (const review of lesson.reviewQuestions!) {
    const main = lesson.questions.find(
      (q) => q.knowledge === review.knowledge,
    )!;
    expect(review.prompt).not.toBe(main.prompt);
  }
  expect(lesson.questions).toHaveLength(15);
  expect(lesson.reviewQuestions).toHaveLength(11);
});
it('restores a wrong sufficient-only attempt and its correction while leaving physical tasks unconfirmed', () => {
  const library = initialLibrary('比较');
  const session = createSession(
    lesson,
    'sujiao-math-p1-lower-9787574312951',
    library.activeProfileId,
  );
  const i = session.questions.findIndex((q) => q.id.endsWith('-q-enough'));
  for (const draft of [['40'], ['40', '50']]) {
    session.responses[i]!.draft = draft;
    session.responses[i] = submitResponse(
      session.questions[i]!,
      session.responses[i]!,
    );
  }
  expect(session.responses[i]!.submissions.map((s) => s.correct)).toEqual([
    false,
    true,
  ]);
  library.sessions.push(session);
  expect(parseBackup(exportBackup(library)).data.sessions[0]).toEqual(session);
  expect(
    session.responses
      .filter((_, i) => session.questions[i]!.rule.kind === 'manual')
      .every((r) => r.submissions.length === 0),
  ).toBe(true);
});
