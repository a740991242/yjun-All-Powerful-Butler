import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
} from '../learning/engine';
import { sujiaoUpperNumberCultureLesson as lesson } from './sujiao-upper-number-culture';

it('distinguishes numeral types, quantities and unverified historical shapes in changed review conditions', () => {
  expect(lesson.questions).toHaveLength(13);
  expect(lesson.reviewQuestions).toHaveLength(8);
  const q = (key: string, review = false) =>
    (review ? lesson.reviewQuestions! : lesson.questions).find(
      (q) => q.knowledge === `${lesson.id}-${key}`,
    )!;
  expect(
    evaluate(q('modern-digits').rule, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]),
  ).toBe(true);
  expect(
    evaluate(q('modern-digits', true).rule, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]),
  ).toBe(false);
  expect(
    evaluate(q('modern-digits', true).rule, [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]),
  ).toBe(true);
  expect(evaluate(q('matched-counts').rule, [2, 5, 8, 10])).toBe(true);
  expect(evaluate(q('matched-counts', true).rule, [2, 5, 8, 10])).toBe(false);
  expect(evaluate(q('matched-counts', true).rule, [9, 7, 4, 0])).toBe(true);
  for (const review of [false, true]) {
    expect(evaluate(q('history-boundary', review).rule, 'yes')).toBe(false);
    expect(evaluate(q('history-boundary', review).rule, 'no')).toBe(true);
    expect(evaluate(q('empty-count', review).rule, 'blank')).toBe(false);
    expect(evaluate(q('empty-count', review).rule, 'zero')).toBe(true);
  }
  expect(q('actual-history').rule.kind).toBe('manual');
  expect(q('actual-history').prompt).toContain('图不清或没有对照暂跳');
  expect(lesson.parentTip).toContain('不冒充甲骨文字形');
});

it('preserves ten-field including zero partial drafts, wrong attempts and one null self-evaluations without real activity claims', () => {
  const now = '2026-10-02T10:00:00.000Z';
  const s = createSession(lesson, 'sujiao-math-p1-upper-2024', 'child', {
    now,
    seed: 42,
  });
  s.phase = 'practice';
  const index = s.questions.findIndex(
    (q) => q.knowledge === `${lesson.id}-modern-digits`,
  );
  s.responses[index]!.draft = [
    0,
    null,
    null,
    null,
    null,
    5,
    null,
    null,
    null,
    9,
  ];
  const data = {
    schemaVersion: 1 as const,
    activeProfileId: 'child',
    profiles: [{ id: 'child', nickname: '孩子', createdAt: now }],
    sessions: [s],
  };
  expect(
    parseBackup(exportBackup(data, now)).data.sessions[0]!.responses[index]!
      .draft,
  ).toEqual([0, null, null, null, null, 5, null, null, null, 9]);
  s.responses[index] = submitResponse(
    s.questions[index]!,
    { ...s.responses[index]!, draft: [0, 1, 2, 3, 4, 5, 6, 7, 8, 8] },
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
  expect(statistics(s).finalCorrect).toBe(8);
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
