import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
} from '../learning/engine';
import { sujiaoUpperCubePairLesson as lesson } from './sujiao-upper-cube-pair';

it('requires complete valid pairs with a changed target rather than only total counts', () => {
  const task = (key: string, review = false) =>
    (review ? lesson.reviewQuestions! : lesson.questions).find(
      (q) => q.knowledge === `${lesson.id}-${key}`,
    )!;
  expect(lesson.questions).toHaveLength(12);
  expect(lesson.reviewQuestions).toHaveLength(7);
  expect(evaluate(task('all-valid-pairs').rule, ['AE', 'BF', 'CD'])).toBe(true);
  expect(evaluate(task('all-valid-pairs').rule, ['AE', 'BF'])).toBe(false);
  expect(evaluate(task('all-valid-pairs', true).rule, ['AE', 'BF', 'CD'])).toBe(
    false,
  );
  expect(evaluate(task('all-valid-pairs', true).rule, ['AE', 'BF'])).toBe(true);
  expect(evaluate(task('cd-shape').rule, 'yes')).toBe(true);
  expect(evaluate(task('cd-shape', true).rule, 'no')).toBe(true);
  expect(
    lesson.questions
      .filter((q) => q.rule.kind === 'manual')
      .map((q) => q.knowledge),
  ).toEqual(
    [
      'actual-six-groups',
      'actual-three-main-pairs',
      'actual-new-target',
      'actual-explanation',
    ].map((key) => `${lesson.id}-${key}`),
  );
});

it('preserves six-field partial drafts, wrong attempts and one null self-evaluations without real activity claims', () => {
  const now = '2026-10-02T10:00:00.000Z';
  const s = createSession(lesson, 'sujiao-math-p1-upper-2024', 'child', {
    now,
    seed: 42,
  });
  s.phase = 'practice';
  const index = s.questions.findIndex(
    (q) => q.knowledge === `${lesson.id}-all-candidates`,
  );
  s.responses[index]!.draft = [3, null, 4, null, null, 1];
  const data = {
    schemaVersion: 1 as const,
    activeProfileId: 'child',
    profiles: [{ id: 'child', nickname: '孩子', createdAt: now }],
    sessions: [s],
  };
  expect(
    parseBackup(exportBackup(data, now)).data.sessions[0]!.responses[index]!
      .draft,
  ).toEqual([3, null, 4, null, null, 1]);
  s.responses[index] = submitResponse(
    s.questions[index]!,
    { ...s.responses[index]!, draft: [3, 5, 4, 2, 3, 2] },
    now,
  );
  for (const [i, q] of s.questions.entries()) {
    if (q.rule.kind === 'manual') continue;
    const answer = (() => {
      if (q.rule.kind === 'steps') return q.rule.values;
      if (q.rule.kind === 'number' || q.rule.kind === 'choice')
        return q.rule.value;
      if (q.rule.kind === 'set') return q.rule.values;
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
  expect(statistics(s).finalCorrect).toBe(7);
  const reflections = s.questions.flatMap((q, i) =>
    q.rule.kind === 'reflection' ? [s.responses[i]!] : [],
  );
  expect(reflections).toHaveLength(1);
  expect(
    reflections.every(
      (r) => r.submissions.length === 1 && r.submissions[0]!.correct === null,
    ),
  ).toBe(true);
  expect(parseBackup(exportBackup(data, now)).data.sessions[0]).toEqual(s);
});
