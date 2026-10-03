import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate } from '../learning/engine';
import { required } from '../learning/required';
import { bnuFiveAddLesson as lesson } from './bnu-five-add';

const q = (suffix: string) =>
  required(lesson.questions.find((item) => item.id.endsWith(`-${suffix}`)));
it('distinguishes each part, all objects, starting count and already-completed arrivals', () => {
  for (const [suffix, value] of [
    ['q1', 4],
    ['q2', 5],
    ['q3', 1],
    ['q4', 4],
    ['q7', 3],
    ['q8', 4],
    ['q10', 5],
    ['q11', 1],
  ] as const)
    expect(evaluate(q(suffix).rule, value)).toBe(true);
  expect(evaluate(q('q1').rule, 1)).toBe(false);
  expect(evaluate(q('q2').rule, 2)).toBe(false);
  expect(evaluate(q('q5').rule, [2, 1, 3])).toBe(true);
  expect(evaluate(q('q5').rule, [2, 1, 2])).toBe(false);
  expect(() => evaluate(q('q5').rule, [2, null, 3])).toThrow(
    'educationLearning.answerRequired',
  );
  expect(evaluate(q('q6').rule, '+')).toBe(true);
  expect(evaluate(q('q9').rule, '不能')).toBe(true);
  expect(evaluate(q('q9').rule, '能')).toBe(false);
  expect(evaluate(q('q11').rule, 5)).toBe(false);
});
it('keeps actual counting, writing and read-original activities separate from new review answers', () => {
  expect(lesson.steps).toHaveLength(6);
  expect(lesson.questions).toHaveLength(18);
  const actual = lesson.questions.filter((item) => item.rule.kind === 'manual');
  expect(actual).toHaveLength(6);
  for (const item of actual)
    expect(evaluate(item.rule, 'confirmed')).toBeNull();
  expect(evaluate(q('reflection').rule, '计划稍后做')).toBeNull();
  const fresh = required(lesson.reviewQuestions);
  expect(fresh).toHaveLength(4);
  for (const item of fresh)
    expect(
      lesson.questions.some(
        (old) => old.id === item.id || old.prompt === item.prompt,
      ),
    ).toBe(false);
  for (const [index, value] of [5, 3, 4, 3].entries())
    expect(evaluate(required(fresh[index]).rule, value)).toBe(true);
});
it('preserves a partial zero draft with the unchanged schema', () => {
  const now = '2026-10-03T00:00:00.000Z';
  const session = createSession(lesson, 'bnu-math-p1-upper-2024', 'child', {
    seed: 31,
    now,
  });
  required(
    session.responses.find((item) => item.questionId.endsWith('-q5')),
  ).draft = [0, null, 3];
  const data = {
    schemaVersion: 1 as const,
    profiles: [{ id: 'child', nickname: '隔离测试', createdAt: now }],
    activeProfileId: 'child',
    sessions: [session],
  };
  expect(parseBackup(exportBackup(data, now)).data).toEqual(
    JSON.parse(JSON.stringify(data)),
  );
});
