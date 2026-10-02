import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
} from '../learning/engine';
import { sujiaoUpperMonthRecordLesson as lesson } from './sujiao-upper-month-record';
it('classifies every record, recomputes whole-month totals and selects only requested classes', () => {
  const q = (key: string, review = false) =>
    (review ? lesson.reviewQuestions! : lesson.questions).find(
      (q) => q.knowledge === `${lesson.id}-${key}`,
    )!;
  expect(lesson.questions).toHaveLength(15);
  expect(lesson.reviewQuestions).toHaveLength(10);
  for (let i = 0; i < 3; i++) {
    const rule = q(`group-${i}`).rule;
    expect(rule.kind).toBe('steps');
    if (rule.kind === 'steps') expect(rule.values).toHaveLength(10);
  }
  expect(evaluate(q('all-counts').rule, [12, 7, 11])).toBe(true);
  expect(evaluate(q('all-counts', true).rule, [12, 7, 11])).toBe(false);
  expect(evaluate(q('all-counts', true).rule, [13, 7, 10])).toBe(true);
  expect(evaluate(q('combine').rule, 19)).toBe(true);
  expect(evaluate(q('combine', true).rule, 19)).toBe(false);
  expect(evaluate(q('combine', true).rule, 17)).toBe(true);
  for (const key of [
    'every-day',
    'same-kind',
    'simulation',
    'complete-month',
  ]) {
    expect(evaluate(q(key).rule, 'guess')).toBe(false);
    expect(evaluate(q(key).rule, 'read-record')).toBe(true);
  }
  expect(lesson.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
    4,
  );
});
it('round trips ten-field zero/null drafts and keeps physical works separate from automatic correct answers', () => {
  const now = '2026-10-02T10:00:00.000Z';
  const s = createSession(lesson, 'sujiao-math-p1-upper-2024', 'child', {
    now,
    seed: 42,
  });
  s.phase = 'practice';
  const index = s.questions.findIndex(
    (q) => q.knowledge === `${lesson.id}-group-0`,
  );
  const wrong = s.questions.findIndex(
    (q) => q.knowledge === `${lesson.id}-group-0`,
  );
  const partial = Array.from({ length: 10 }, (_, i) => {
    if (i === 0) return 0;
    if (i === 4) return 1;
    if (i === 9) return 1;
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
    { ...s.responses[wrong]!, draft: [0, 2, 3, 2, 1, 1, 3, 1, 3, 1] },
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
  expect(statistics(s).finalCorrect).toBe(10);
  expect(statistics(s).manual).toBe(0);
  const reflection = s.questions.findIndex((q) => q.rule.kind === 'reflection');
  expect(s.responses[reflection]!.submissions[0]!.correct).toBeNull();
  expect(parseBackup(exportBackup(data, now)).data.sessions[0]).toEqual(s);
});
