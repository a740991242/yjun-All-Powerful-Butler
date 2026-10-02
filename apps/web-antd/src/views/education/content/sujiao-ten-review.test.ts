import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  countGroupsTotal,
  isCountGroupsVisual,
} from '../learning/count-groups';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { sujiaoTenReviewLesson as lesson } from './sujiao-ten-review';

it('separates groups from objects and checks strict inequalities without accepting equality', () => {
  for (const [index, questions] of [
    lesson.questions,
    lesson.reviewQuestions!,
  ].entries()) {
    const review = index === 1;
    const q = (suffix: string) =>
      questions.find((item) => item.id.endsWith(suffix))!;
    const visual = q('-groups').visual!;
    expect(isCountGroupsVisual(visual)).toBe(true);
    if (visual.kind !== 'count-groups') throw new Error('Missing groups');
    expect(countGroupsTotal(visual)).toBe(10);
    expect(evaluate(q('-groups').rule, review ? 2 : 5)).toBe(true);
    expect(evaluate(q('-groups').rule, 10)).toBe(false);
    expect(evaluate(q('-objects').rule, 10)).toBe(true);
    expect(evaluate(q('-objects').rule, visual.groups.length)).toBe(false);
    const threshold = review ? 6 : 8;
    const small = Array.from({ length: threshold }, (_, n) => String(n));
    expect(evaluate(q('-less-than').rule, small)).toBe(true);
    expect(evaluate(q('-less-than').rule, [...small, String(threshold)])).toBe(
      false,
    );
    const subtract = review ? 4 : 3;
    const large = Array.from({ length: subtract }, (_, n) =>
      String(11 - subtract + n),
    );
    expect(evaluate(q('-sub-less').rule, large)).toBe(true);
    expect(
      evaluate(q('-sub-less').rule, [...large, String(10 - subtract)]),
    ).toBe(false);
    expect(evaluate(q('-equality').rule, review ? 2 : 4)).toBe(true);
    expect(evaluate(q('-equality').rule, review ? 6 : 10)).toBe(false);
    for (const answer of [
      [0, 10],
      [5, 5],
      [10, 0],
      [4, 6],
    ])
      expect(evaluate(q('-partition').rule, answer)).toBe(true);
    expect(evaluate(q('-partition').rule, [5, 6])).toBe(false);
    expect(evaluate(q('-partition').rule, [-1, 11])).toBe(false);
    expect(() => evaluate(q('-partition').rule, [4.5, 5.5])).toThrow(
      'educationLearning.answerRequired',
    );
  }
});

it('changes review contexts and preserves five-group diagrams, first mistakes and drafts in backup', () => {
  const main = lesson.questions.filter((q) => q.rule.kind !== 'manual');
  expect(main).toHaveLength(10);
  expect(lesson.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
    4,
  );
  for (const [index, question] of main.entries()) {
    const review = lesson.reviewQuestions![index]!;
    expect(review.knowledge).toBe(question.knowledge);
    expect(review.prompt).not.toBe(question.prompt);
  }
  const now = '2026-10-01T15:00:00.000Z';
  const session = createSession(lesson, 'sujiao-math-p1-upper-2024', 'child', {
    now,
    seed: 17,
  });
  session.phase = 'practice';
  const index = session.questions.findIndex((q) => q.id.endsWith('-groups'));
  session.responses[index] = submitResponse(
    session.questions[index]!,
    { ...session.responses[index]!, draft: 10 },
    now,
  );
  session.responses[index] = submitResponse(
    session.questions[index]!,
    { ...session.responses[index]!, draft: 5 },
    now,
  );
  const partial = session.questions.findIndex((q) => q.id.endsWith('-family'));
  session.responses[partial]!.draft = [10, null, 4];
  const state = {
    schemaVersion: 1 as const,
    activeProfileId: 'child',
    profiles: [{ id: 'child', nickname: '孩子', createdAt: now }],
    sessions: [session],
  };
  const restored = parseBackup(exportBackup(state, now)).data.sessions[0]!;
  expect(restored).toEqual(session);
  expect(restored.responses[index]!.submissions.map((s) => s.correct)).toEqual([
    false,
    true,
  ]);
  const invalid = JSON.parse(exportBackup(state, now));
  invalid.data.sessions[0].questions[index].visual.groups = [2, 2, 2, 2, 3];
  expect(() => parseBackup(JSON.stringify(invalid))).toThrow(Error);
});
