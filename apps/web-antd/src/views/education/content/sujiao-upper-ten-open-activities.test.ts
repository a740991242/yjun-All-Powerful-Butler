import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
} from '../learning/engine';
import { sujiaoUpperTenOpenActivitiesLesson as lesson } from './sujiao-upper-ten-open-activities';
it('accepts all and only integers satisfying each original equation and strict arithmetic comparison', () => {
  expect(lesson.questions).toHaveLength(15);
  expect(lesson.reviewQuestions).toHaveLength(9);
  const task = (key: string, review = false) =>
    (review ? lesson.reviewQuestions! : lesson.questions).find(
      (q) => q.knowledge === `${lesson.id}-${key}`,
    )!;
  for (const review of [false, true]) {
    const add = review ? 3 : 2;
    const total = review ? 9 : 10;
    const fixed = review ? 5 : 4;
    const difference = review ? 4 : 3;
    for (let x = 0; x <= 10; x++) {
      expect(evaluate(task('add-equal', review).rule, x)).toBe(
        add + x === total,
      );
      expect(evaluate(task('zero-equal', review).rule, x)).toBe(
        x + 0 === fixed,
      );
      expect(evaluate(task('subtract-equal', review).rule, x)).toBe(
        10 - x === difference,
      );
      expect(evaluate(task('add-less', review).rule, [x])).toBe(
        add + x < total,
      );
      expect(evaluate(task('zero-greater', review).rule, [x])).toBe(
        x + 0 > fixed,
      );
      expect(evaluate(task('subtract-less', review).rule, [x])).toBe(
        10 - x < difference,
      );
    }
    for (const key of ['add-less', 'zero-greater', 'subtract-less']) {
      expect(evaluate(task(key, review).rule, [-1])).toBe(false);
      expect(evaluate(task(key, review).rule, [11])).toBe(false);
      expect(() => evaluate(task(key, review).rule, [1.5])).toThrow(
        'educationLearning.answerRequired',
      );
    }
  }
  expect(evaluate(task('three-drawings').rule, [1, 8, 5])).toBe(true);
  expect(evaluate(task('three-drawings', true).rule, [1, 8, 5])).toBe(false);
  expect(evaluate(task('three-drawings', true).rule, [4, 7, 2])).toBe(true);
  expect(evaluate(task('same-equation').rule, ['join'])).toBe(false);
  expect(evaluate(task('same-equation').rule, ['join', 'parts'])).toBe(true);
  expect(task('actual-toss').prompt).toContain('不复制示例');
  expect(task('actual-draw').rule.kind).toBe('manual');
});
it('preserves partial drawings, wrong history and honest five manual activities separately from reflection', () => {
  const now = '2026-10-02T10:00:00.000Z';
  const s = createSession(lesson, 'sujiao-math-p1-upper-2024', 'child', {
    now,
    seed: 42,
  });
  s.phase = 'practice';
  const i = s.questions.findIndex(
    (q) => q.knowledge === `${lesson.id}-three-drawings`,
  );
  s.responses[i]!.draft = [1, null, 5];
  const data = {
    schemaVersion: 1 as const,
    activeProfileId: 'child',
    profiles: [{ id: 'child', nickname: '孩子', createdAt: now }],
    sessions: [s],
  };
  expect(
    parseBackup(exportBackup(data, now)).data.sessions[0]!.responses[i]!.draft,
  ).toEqual([1, null, 5]);
  s.responses[i] = submitResponse(
    s.questions[i]!,
    { ...s.responses[i]!, draft: [0, 8, 5] },
    now,
  );
  for (const [index, q] of s.questions.entries()) {
    if (q.rule.kind === 'manual') continue;
    const draft = (() => {
      if (q.rule.kind === 'steps' || q.rule.kind === 'set')
        return q.rule.values;
      if (q.rule.kind === 'number' || q.rule.kind === 'choice')
        return q.rule.value;
      if (q.rule.kind === 'number-chain') {
        for (let n = 0; n <= 10; n++) if (evaluate(q.rule, [n])) return [n];
        throw new Error('Missing valid integer');
      }
      if (q.rule.kind === 'reflection')
        return '隔离测试，实际操作未做，未来计划分开。';
      throw new Error('Unexpected rule');
    })();
    s.responses[index] = submitResponse(
      q,
      { ...s.responses[index]!, draft },
      now,
    );
  }
  expect(s.responses[i]!.submissions.map((a) => a.correct)).toEqual([
    false,
    true,
  ]);
  expect(statistics(s).finalCorrect).toBe(9);
  expect(statistics(s).manual).toBe(0);
  const reflection = s.questions.findIndex((q) => q.rule.kind === 'reflection');
  expect(s.responses[reflection]!.submissions[0]!.correct).toBeNull();
  expect(parseBackup(exportBackup(data, now)).data.sessions[0]).toEqual(s);
});
