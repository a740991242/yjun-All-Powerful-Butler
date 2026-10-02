import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
} from '../learning/engine';
import { sujiaoUpperExplorationReviewLesson as lesson } from './sujiao-upper-exploration-review';

it('checks five whole boards and both symbol constraints, changing review order and numbers', () => {
  const task = (key: string, review = false) =>
    (review ? lesson.reviewQuestions! : lesson.questions).find(
      (q) => q.knowledge === `${lesson.id}-${key}`,
    )!;
  expect(lesson.questions).toHaveLength(17);
  expect(lesson.reviewQuestions).toHaveLength(8);
  expect(evaluate(task('five-counts').rule, [1, 3, 5, 7, 9])).toBe(true);
  expect(evaluate(task('five-empty-counts').rule, [9, 7, 5, 3, 1])).toBe(true);
  expect(evaluate(task('five-counts', true).rule, [1, 3, 5, 7, 9])).toBe(false);
  expect(evaluate(task('same-symbols').rule, [4, 7])).toBe(true);
  expect(evaluate(task('same-symbols').rule, [4, 6])).toBe(false);
  expect(evaluate(task('same-symbols', true).rule, [4, 7])).toBe(false);
  expect(evaluate(task('same-symbols', true).rule, [3, 5])).toBe(true);
  expect(evaluate(task('substitute-both').rule, [8, 3])).toBe(true);
  for (const tasks of [lesson.questions, lesson.reviewQuestions!])
    for (const q of tasks)
      if (q.rule.kind === 'choice')
        expect(q.choices!.filter((c) => evaluate(q.rule, c.id))).toHaveLength(
          1,
        );
  for (const key of ['numbers', 'arithmetic', 'habits']) {
    expect(task(`actual-evaluation-${key}`).rule.kind).toBe('manual');
    expect(task(`reflection-${key}`).rule.kind).toBe('reflection');
  }
});

it('preserves five-field partial drafts, wrong attempts and three null self-evaluations without real activity claims', () => {
  const now = '2026-10-02T10:00:00.000Z';
  const s = createSession(lesson, 'sujiao-math-p1-upper-2024', 'child', {
    now,
    seed: 42,
  });
  s.phase = 'practice';
  const index = s.questions.findIndex(
    (q) => q.knowledge === `${lesson.id}-five-counts`,
  );
  s.responses[index]!.draft = [1, null, 5, null, null];
  const data = {
    schemaVersion: 1 as const,
    activeProfileId: 'child',
    profiles: [{ id: 'child', nickname: '孩子', createdAt: now }],
    sessions: [s],
  };
  expect(
    parseBackup(exportBackup(data, now)).data.sessions[0]!.responses[index]!
      .draft,
  ).toEqual([1, null, 5, null, null]);
  s.responses[index] = submitResponse(
    s.questions[index]!,
    { ...s.responses[index]!, draft: [1, 3, 5, 7, 8] },
    now,
  );
  for (const [i, q] of s.questions.entries()) {
    if (q.rule.kind === 'manual') continue;
    const answer = (() => {
      if (q.rule.kind === 'steps') return q.rule.values;
      if (q.rule.kind === 'number' || q.rule.kind === 'choice')
        return q.rule.value;
      if (q.rule.kind === 'reflection')
        return '实际尚未做，这是测试；以后计划另记。';
      throw new Error('Unexpected rule');
    })();
    s.responses[i] = submitResponse(
      q,
      { ...s.responses[i]!, draft: answer },
      now,
    );
  }
  expect(s.responses[index]!.submissions.map((a) => a.correct)).toEqual([
    false,
    true,
  ]);
  expect(statistics(s).manual).toBe(0);
  expect(statistics(s).finalCorrect).toBe(8);
  const reflections = s.questions.flatMap((q, i) =>
    q.rule.kind === 'reflection' ? [s.responses[i]!] : [],
  );
  expect(reflections).toHaveLength(3);
  expect(
    reflections.every(
      (r) => r.submissions.length === 1 && r.submissions[0]!.correct === null,
    ),
  ).toBe(true);
  expect(parseBackup(exportBackup(data, now)).data.sessions[0]).toEqual(s);
});
