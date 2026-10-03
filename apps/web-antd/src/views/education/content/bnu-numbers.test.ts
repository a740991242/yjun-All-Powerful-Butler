import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate } from '../learning/engine';
import { required } from '../learning/required';
import {
  bnuCountOrderLesson as count,
  bnuZeroLesson as zero,
} from './bnu-numbers';

it('covers all ten counts and respects changed counting objects and ordinal directions', () => {
  for (let value = 1; value <= 10; value++) {
    const q = required(
      count.questions.find((item) => item.id.endsWith(`-q${value}`)),
    );
    expect(q.visual).toEqual({ kind: 'count', count: value });
    expect(evaluate(q.rule, value)).toBe(true);
    expect(evaluate(q.rule, value - 1)).toBe(false);
  }
  const q = (suffix: string) =>
    required(count.questions.find((item) => item.id.endsWith(suffix)));
  expect(evaluate(q('-q11').rule, 3)).toBe(true);
  expect(evaluate(q('-q11').rule, 5)).toBe(false);
  expect(evaluate(q('-q12').rule, 2)).toBe(true);
  expect(evaluate(q('-q12').rule, 4)).toBe(false);
  expect(evaluate(q('-q14').rule, '1个盒子')).toBe(true);
  expect(
    count.questions.filter((item) => item.rule.kind === 'manual'),
  ).toHaveLength(6);
});
it('accepts explicit zero but rejects blank input and inference from unknown containers', () => {
  const q = (suffix: string) =>
    required(zero.questions.find((item) => item.id.endsWith(suffix)));
  expect(evaluate(q('-q1').rule, 0)).toBe(true);
  expect(evaluate(q('-q1').rule, 1)).toBe(false);
  expect(() => evaluate(q('-q1').rule, null)).toThrow(
    'educationLearning.answerRequired',
  );
  expect(evaluate(q('-q2').rule, '不能确定')).toBe(true);
  expect(evaluate(q('-q2').rule, '一定是0')).toBe(false);
  expect(evaluate(q('-q3').rule, '1个框')).toBe(true);
  expect(evaluate(q('-q5').rule, '不能')).toBe(true);
  expect(evaluate(q('-q6').rule, 1)).toBe(true);
  expect(evaluate(q('-q8').rule, 0)).toBe(true);
});
it('retains zero drafts and independent new review conditions in schema-one backups', () => {
  const now = '2026-10-03T00:00:00.000Z';
  const sessions = [count, zero].map((lesson) =>
    createSession(lesson, 'bnu-math-p1-upper-2024', 'child', { seed: 19, now }),
  );
  const response = required(
    sessions[1]?.responses.find((item) => item.questionId.endsWith('-q1')),
  );
  response.draft = 0;
  const data = {
    schemaVersion: 1 as const,
    profiles: [{ id: 'child', nickname: '隔离测试', createdAt: now }],
    activeProfileId: 'child',
    sessions,
  };
  expect(parseBackup(exportBackup(data, now)).data).toEqual(
    JSON.parse(JSON.stringify(data)),
  );
  expect(count.questions).toHaveLength(21);
  expect(zero.questions).toHaveLength(14);
  for (const lesson of [count, zero]) {
    expect(lesson.reviewQuestions).toHaveLength(4);
    for (const fresh of lesson.reviewQuestions ?? [])
      expect(
        lesson.questions.some(
          (old) => old.id === fresh.id || old.prompt === fresh.prompt,
        ),
      ).toBe(false);
    for (const q of lesson.questions.filter(
      (item) => item.rule.kind === 'manual',
    ))
      expect(evaluate(q.rule, 'confirmed')).toBeNull();
  }
});
