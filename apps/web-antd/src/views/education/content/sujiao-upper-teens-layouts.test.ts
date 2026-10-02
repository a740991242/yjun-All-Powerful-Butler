import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
} from '../learning/engine';
import { sujiaoUpperTeensLayoutsLesson as lesson } from './sujiao-upper-teens-layouts';
it('counts actual point layouts and all nineteen rooms with moved guests in review', () => {
  expect(lesson.questions).toHaveLength(18);
  expect(lesson.reviewQuestions).toHaveLength(12);
  const q = (key: string, review = false) =>
    (review ? lesson.reviewQuestions! : lesson.questions).find(
      (q) => q.knowledge === `${lesson.id}-${key}`,
    )!;
  for (const [key, main, next] of [
    ['triangle-total', 15, 10],
    ['frame-total', 16, 14],
    ['guest-A', 7, 3],
    ['guest-B', 9, 6],
    ['guest-C', 11, 16],
    ['guest-D', 17, 18],
  ] as const) {
    expect(evaluate(q(key).rule, main)).toBe(true);
    expect(evaluate(q(key, true).rule, main)).toBe(false);
    expect(evaluate(q(key, true).rule, next)).toBe(true);
  }
  expect(evaluate(q('triangle-rows').rule, [1, 2, 3, 4, 5])).toBe(true);
  expect(evaluate(q('frame-rows').rule, [5, 2, 2, 2, 5])).toBe(true);
  expect(evaluate(q('frame-rows', true).rule, [5, 2, 2, 5])).toBe(true);
  const rooms = Array.from({ length: 19 }, (_, i) => i + 1);
  expect(evaluate(q('room-complete').rule, rooms)).toBe(true);
  expect(evaluate(q('room-complete', true).rule, rooms)).toBe(false);
  expect(evaluate(q('room-complete', true).rule, rooms.toReversed())).toBe(
    true,
  );
  expect(lesson.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
    5,
  );
});
it('round trips nineteen-field value/null drafts and keeps physical works separate from automatic correct answers', () => {
  const now = '2026-10-02T10:00:00.000Z';
  const s = createSession(lesson, 'sujiao-math-p1-upper-2024', 'child', {
    now,
    seed: 42,
  });
  s.phase = 'practice';
  const index = s.questions.findIndex(
    (q) => q.knowledge === `${lesson.id}-room-complete`,
  );
  const wrong = s.questions.findIndex(
    (q) => q.knowledge === `${lesson.id}-guest-A`,
  );
  const partial = Array.from({ length: 19 }, (_, i) => {
    if (i === 0) return 1;
    if (i === 9) return 10;
    if (i === 18) return 19;
    return null;
  });
  s.responses[index]!.draft = partial;
  const data = {
    schemaVersion: 1 as const,
    activeProfileId: 'child',
    profiles: [{ id: 'child', nickname: '孩子', createdAt: now }],
    sessions: [s],
  };
  expect(
    parseBackup(exportBackup(data, now)).data.sessions[0]!.responses[index]!
      .draft,
  ).toEqual(partial);
  s.responses[wrong] = submitResponse(
    s.questions[wrong]!,
    { ...s.responses[wrong]!, draft: 0 },
    now,
  );
  for (const [i, q] of s.questions.entries()) {
    if (q.rule.kind === 'manual') continue;
    const draft = (() => {
      if (q.rule.kind === 'steps' || q.rule.kind === 'set')
        return q.rule.values;
      if (q.rule.kind === 'number' || q.rule.kind === 'choice')
        return q.rule.value;
      if (q.rule.kind === 'reflection')
        return '隔离测试，纸线与圈物实际未做，未来计划另记。';
      throw new Error('Unexpected rule');
    })();
    s.responses[i] = submitResponse(q, { ...s.responses[i]!, draft }, now);
  }
  expect(s.responses[wrong]!.submissions.map((a) => a.correct)).toEqual([
    false,
    true,
  ]);
  expect(statistics(s).finalCorrect).toBe(12);
  expect(statistics(s).manual).toBe(0);
  const reflection = s.questions.findIndex((q) => q.rule.kind === 'reflection');
  expect(s.responses[reflection]!.submissions[0]!.correct).toBeNull();
  expect(parseBackup(exportBackup(data, now)).data.sessions[0]).toEqual(s);
});
