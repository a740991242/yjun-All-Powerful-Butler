import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
} from '../learning/engine';
import { sujiaoUpperSolidInstructionsLesson as lesson } from './sujiao-upper-solid-instructions';

it('checks all five directions and complete support instructions with changed review labels', () => {
  const task = (key: string, review = false) =>
    (review ? lesson.reviewQuestions! : lesson.questions).find(
      (q) => q.knowledge === `${lesson.id}-${key}`,
    )!;
  expect(lesson.questions).toHaveLength(18);
  expect(lesson.reviewQuestions).toHaveLength(13);
  for (const [key, value] of [
    ['cross-left', 'B'],
    ['cross-right', 'C'],
    ['cross-front', 'D'],
    ['cross-back', 'E'],
    ['bridge-left-support', 'D'],
    ['bridge-right-support', 'E'],
    ['after-pillars', 'C'],
  ])
    expect(evaluate(task(key!).rule, value!)).toBe(true);
  expect(evaluate(task('cross-left', true).rule, 'B')).toBe(false);
  expect(evaluate(task('cross-left', true).rule, 'G')).toBe(true);
  expect(evaluate(task('cross-front', true).rule, 'F')).toBe(true);
  expect(evaluate(task('upper-two').rule, ['F', 'G'])).toBe(true);
  expect(evaluate(task('upper-two').rule, ['D', 'E'])).toBe(false);
  expect(evaluate(task('two-pillars').rule, ['A', 'B'])).toBe(true);
  expect(evaluate(task('two-pillars').rule, ['A', 'C'])).toBe(false);
  expect(evaluate(task('bridge-counts').rule, [2, 1, 2, 2])).toBe(true);
  expect(
    lesson.questions
      .filter((q) => q.rule.kind === 'manual')
      .map((q) => q.knowledge),
  ).toEqual(
    [
      'actual-central-seven',
      'actual-four-step-bridge',
      'actual-mutual-instructions',
      'actual-new-arrangement',
    ].map((key) => `${lesson.id}-${key}`),
  );
});

it('preserves four-field partial drafts, wrong attempts and one null self-evaluations without real activity claims', () => {
  const now = '2026-10-02T10:00:00.000Z';
  const s = createSession(lesson, 'sujiao-math-p1-upper-2024', 'child', {
    now,
    seed: 42,
  });
  s.phase = 'practice';
  const index = s.questions.findIndex(
    (q) => q.knowledge === `${lesson.id}-bridge-counts`,
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
  expect(statistics(s).finalCorrect).toBe(13);
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
