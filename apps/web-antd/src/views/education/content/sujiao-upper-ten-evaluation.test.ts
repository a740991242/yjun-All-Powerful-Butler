import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
} from '../learning/engine';
import { sujiaoUpperTenEvaluationLesson as lesson } from './sujiao-upper-ten-evaluation';

it('changes requested quantities without turning automatic correct answers into the three actual evaluations', () => {
  expect(lesson.questions).toHaveLength(12);
  expect(lesson.reviewQuestions).toHaveLength(6);
  const q = (key: string, review = false) =>
    (review ? lesson.reviewQuestions! : lesson.questions).find(
      (q) => q.knowledge === `${lesson.id}-${key}`,
    )!;
  expect(evaluate(q('ten-places').rule, [1, 0])).toBe(true);
  expect(evaluate(q('ten-places', true).rule, [1, 0])).toBe(false);
  expect(evaluate(q('ten-places', true).rule, [0, 1])).toBe(true);
  expect(evaluate(q('sum-ten').rule, [10, 10, 10, 10])).toBe(true);
  expect(evaluate(q('sum-ten', true).rule, [10, 10, 10, 10])).toBe(false);
  expect(evaluate(q('sum-ten', true).rule, [9, 6, 10, 5])).toBe(true);
  expect(evaluate(q('ten-subtract').rule, [9, 6, 0, 5])).toBe(true);
  expect(evaluate(q('ten-subtract', true).rule, [8, 7, 1, 0])).toBe(true);
  expect(evaluate(q('join-story', true).rule, 10)).toBe(false);
  expect(evaluate(q('join-story', true).rule, 9)).toBe(true);
  for (const review of [false, true])
    expect(evaluate(q('care-evidence', review).rule, 'auto')).toBe(false);
  for (const key of ['recognition', 'application', 'care']) {
    expect(q(`actual-${key}`).rule.kind).toBe('manual');
    expect(q(`reflection-${key}`).rule.kind).toBe('reflection');
  }
});

it('keeps three distinct null reflections, partial zero drafts and honest manual states through backup round trips', () => {
  const now = '2026-10-02T10:00:00.000Z';
  const session = createSession(lesson, 'sujiao-math-p1-upper-2024', 'child', {
    now,
    seed: 42,
  });
  session.phase = 'practice';
  const index = session.questions.findIndex(
    (q) => q.knowledge === `${lesson.id}-ten-places`,
  );
  session.responses[index]!.draft = [1, null];
  const data = {
    schemaVersion: 1 as const,
    activeProfileId: 'child',
    profiles: [{ id: 'child', nickname: '孩子', createdAt: now }],
    sessions: [session],
  };
  expect(
    parseBackup(exportBackup(data, now)).data.sessions[0]!.responses[index]!
      .draft,
  ).toEqual([1, null]);
  session.responses[index] = submitResponse(
    session.questions[index]!,
    { ...session.responses[index]!, draft: [1, 1] },
    now,
  );
  for (const [i, q] of session.questions.entries()) {
    if (q.rule.kind === 'manual') continue;
    const draft = (() => {
      if (q.rule.kind === 'steps') return q.rule.values;
      if (q.rule.kind === 'choice' || q.rule.kind === 'number')
        return q.rule.value;
      if (q.rule.kind === 'reflection')
        return `隔离测试，本项${q.knowledge}实际还未做，未来计划另记。`;
      throw new Error('Unexpected evaluation rule');
    })();
    session.responses[i] = submitResponse(
      q,
      { ...session.responses[i]!, draft },
      now,
    );
  }
  expect(session.responses[index]!.submissions.map((s) => s.correct)).toEqual([
    false,
    true,
  ]);
  expect(statistics(session).finalCorrect).toBe(6);
  expect(statistics(session).manual).toBe(0);
  const refs = session.questions.flatMap((q, i) =>
    q.rule.kind === 'reflection' ? [session.responses[i]!] : [],
  );
  expect(refs).toHaveLength(3);
  expect(new Set(refs.map((r) => r.draft)).size).toBe(3);
  expect(
    refs.every(
      (r) => r.submissions.length === 1 && r.submissions[0]!.correct === null,
    ),
  ).toBe(true);
  expect(parseBackup(exportBackup(data, now)).data.sessions[0]).toEqual(
    session,
  );
});
