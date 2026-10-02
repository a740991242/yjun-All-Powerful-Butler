import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
} from '../learning/engine';
import { sujiaoUpperSolidReviewLesson as lesson } from './sujiao-upper-solid-review';

it('counts two independent visible compositions and changes all four class counts for review', () => {
  const task = (key: string, review = false) =>
    (review ? lesson.reviewQuestions! : lesson.questions).find(
      (q) => q.knowledge === `${lesson.id}-${key}`,
    )!;
  expect(lesson.questions).toHaveLength(14);
  expect(lesson.reviewQuestions).toHaveLength(6);
  expect(evaluate(task('composition-0').rule, [2, 3, 2, 2])).toBe(true);
  expect(evaluate(task('composition-1').rule, [2, 2, 3, 2])).toBe(true);
  expect(evaluate(task('composition-0', true).rule, [2, 3, 2, 2])).toBe(false);
  expect(evaluate(task('composition-0', true).rule, [1, 3, 3, 2])).toBe(true);
  expect(evaluate(task('composition-1', true).rule, [4, 2, 2, 1])).toBe(true);
  for (const review of [false, true])
    for (const key of ['composition-0', 'composition-1']) {
      const q = task(key, review);
      expect(q.visual?.kind).toBe('solid-build');
      if (q.visual?.kind !== 'solid-build')
        throw new Error('Expected composition');
      const shapes = q.visual.shapes;
      const counts = ['cube', 'cuboid', 'cylinder', 'sphere'].map(
        (shape) => shapes.filter((s) => s === shape).length,
      );
      expect(evaluate(q.rule, counts)).toBe(true);
      expect(shapes).toHaveLength(9);
    }
  for (const key of ['recognition', 'building', 'care']) {
    expect(task(`actual-evaluation-${key}`).rule.kind).toBe('manual');
    expect(task(`reflection-${key}`).rule.kind).toBe('reflection');
  }
});

it('preserves four-field partial drafts, wrong attempts and three null self-evaluations without real activity claims', () => {
  const now = '2026-10-02T10:00:00.000Z';
  const s = createSession(lesson, 'sujiao-math-p1-upper-2024', 'child', {
    now,
    seed: 42,
  });
  s.phase = 'practice';
  const index = s.questions.findIndex(
    (q) => q.knowledge === `${lesson.id}-composition-0`,
  );
  s.responses[index]!.draft = [2, null, null, 2];
  const data = {
    schemaVersion: 1 as const,
    activeProfileId: 'child',
    profiles: [{ id: 'child', nickname: '孩子', createdAt: now }],
    sessions: [s],
  };
  expect(
    parseBackup(exportBackup(data, now)).data.sessions[0]!.responses[index]!
      .draft,
  ).toEqual([2, null, null, 2]);
  s.responses[index] = submitResponse(
    s.questions[index]!,
    { ...s.responses[index]!, draft: [2, 2, 2, 2] },
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
  expect(statistics(s).finalCorrect).toBe(6);
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
