import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
} from '../learning/engine';
import { sujiaoUpperTeensNumberlineLesson as lesson } from './sujiao-upper-teens-numberline';
it('covers complete sequences and grouped quantities rather than only selected endpoints', () => {
  expect(lesson.questions).toHaveLength(18);
  expect(lesson.reviewQuestions).toHaveLength(12);
  const q = (key: string, review = false) =>
    (review ? lesson.reviewQuestions! : lesson.questions).find(
      (q) => q.knowledge === `${lesson.id}-${key}`,
    )!;
  const full = Array.from({ length: 20 }, (_, i) => i);
  expect(evaluate(q('complete-0-19').rule, full)).toBe(true);
  expect(evaluate(q('complete-0-19', true).rule, full)).toBe(false);
  expect(evaluate(q('complete-0-19', true).rule, full.toReversed())).toBe(true);
  expect(
    evaluate(q('complete-12-19').rule, [12, 13, 14, 15, 16, 17, 18, 19]),
  ).toBe(true);
  expect(evaluate(q('complete-19-15').rule, [19, 18, 17, 16, 15])).toBe(true);
  expect(q('group-totals').visual).toEqual({
    kind: 'comparison-rows',
    counts: [13, 15],
  });
  expect(q('group-totals', true).visual).toEqual({
    kind: 'comparison-rows',
    counts: [18, 14],
  });
  expect(evaluate(q('group-totals').rule, [3, 5])).toBe(false);
  expect(evaluate(q('group-totals').rule, [13, 15])).toBe(true);
  expect(evaluate(q('group-totals', true).rule, [13, 15])).toBe(false);
  expect(evaluate(q('group-totals', true).rule, [18, 14])).toBe(true);
  expect(evaluate(q('forward-landings').rule, [16, 17, 18])).toBe(true);
  expect(evaluate(q('forward-landings').rule, [15, 16, 17])).toBe(false);
  expect(evaluate(q('backward-landings').rule, [17, 16, 15])).toBe(true);
  expect(evaluate(q('distance').rule, [2, 7])).toBe(true);
  expect(evaluate(q('distance', true).rule, [8, 1])).toBe(true);
  expect(evaluate(q('all-between').rule, ['17', '18'])).toBe(true);
  expect(evaluate(q('all-between').rule, ['16', '17', '18', '19'])).toBe(false);
  expect(lesson.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
    5,
  );
});
it('round trips twenty-field zero/null drafts and keeps physical works separate from automatic correct answers', () => {
  const now = '2026-10-02T10:00:00.000Z';
  const s = createSession(lesson, 'sujiao-math-p1-upper-2024', 'child', {
    now,
    seed: 42,
  });
  s.phase = 'practice';
  const index = s.questions.findIndex(
    (q) => q.knowledge === `${lesson.id}-complete-0-19`,
  );
  const wrong = s.questions.findIndex(
    (q) => q.knowledge === `${lesson.id}-group-totals`,
  );
  const partial = Array.from({ length: 20 }, (_, i) => {
    if (i === 0) return 0;
    if (i === 10) return 10;
    if (i === 19) return 19;
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
    { ...s.responses[wrong]!, draft: [3, 5] },
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
