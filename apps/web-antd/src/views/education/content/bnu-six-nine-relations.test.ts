import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate } from '../learning/engine';
import { required } from '../learning/required';
import { bnuSixNineRelationsLesson as lesson } from './bnu-six-nine-relations';

const q = (suffix: string) =>
  required(lesson.questions.find((item) => item.id.endsWith(`-${suffix}`)));
it('checks every ordered partition and every independent addition and subtraction including both zero endpoints', () => {
  for (let total = 6; total <= 9; total++) {
    const remaining = Array.from(
      { length: total + 1 },
      (_, part) => total - part,
    );
    for (const [suffix, answer] of [
      [`partition-${total}`, remaining],
      [`add-${total}`, Array.from({ length: total + 1 }, () => total)],
      [`sub-${total}`, remaining],
    ] as const) {
      const task = q(suffix);
      expect(evaluate(task.rule, [...answer])).toBe(true);
      for (let field = 0; field <= total; field++) {
        const wrong = [...answer];
        wrong[field] = required(wrong[field]) + 1;
        expect(evaluate(task.rule, wrong)).toBe(false);
      }
    }
  }
  expect(evaluate(q('q1').rule, 0)).toBe(true);
  expect(() => evaluate(q('q1').rule, null)).toThrow(
    'educationLearning.answerRequired',
  );
  expect(evaluate(q('q2').rule, 2)).toBe(true);
  expect(evaluate(q('q3').rule, 2)).toBe(true);
  expect(evaluate(q('q4').rule, 7)).toBe(true);
  expect(evaluate(q('q5').rule, '能')).toBe(false);
  expect(evaluate(q('q6').rule, 8)).toBe(true);
  expect(evaluate(q('q7').rule, 9)).toBe(true);
  expect(evaluate(q('q8').rule, '能')).toBe(false);
});
it('checks every missing or resulting field and uses the current remaining amount for continuous changes', () => {
  const cases = [
    ['q21', [3, 6, 0, 6, 5, 6, 4, 6]],
    ['q22', [6, 2, 3, 4, 1, 2, 3, 4]],
    ['q23', [7, 4, 5, 1, 4, 5]],
    ['q24', [4, 6, 7, 4]],
    ['q25', [3, 6, 6]],
    ['q26', [6, 0]],
  ] as const;
  for (const [suffix, answer] of cases) {
    expect(evaluate(q(suffix).rule, [...answer])).toBe(true);
    for (let field = 0; field < answer.length; field++) {
      const wrong: number[] = [...answer];
      wrong[field] = required(wrong[field]) + 1;
      expect(evaluate(q(suffix).rule, wrong)).toBe(false);
    }
  }
  expect(evaluate(q('q26').rule, [6, 1])).toBe(false);
});
it('preserves ten-field zero and null drafts plus original diagrams in strict schema-one backups', () => {
  const now = '2026-10-03T00:00:00.000Z';
  const session = createSession(lesson, 'bnu-math-p1-upper-2024', 'child', {
    seed: 48,
    now,
  });
  const draft = [0, null, null, null, null, null, null, null, null, 0];
  required(
    session.responses.find((item) => item.questionId.endsWith('-partition-9')),
  ).draft = draft;
  const data = {
    schemaVersion: 1 as const,
    profiles: [{ id: 'child', nickname: '隔离测试', createdAt: now }],
    activeProfileId: 'child',
    sessions: [session],
  };
  expect(parseBackup(exportBackup(data, now)).data).toEqual(
    JSON.parse(JSON.stringify(data)),
  );
  expect(() => evaluate(q('partition-9').rule, draft)).toThrow(
    'educationLearning.answerRequired',
  );
});
it('keeps actual complete paper methods separate from scored answers and changes all four review conditions', () => {
  expect(lesson.steps).toHaveLength(7);
  expect(lesson.questions).toHaveLength(35);
  const actual = lesson.questions.filter((item) => item.rule.kind === 'manual');
  const reflections = lesson.questions.filter(
    (item) => item.rule.kind === 'reflection',
  );
  expect(actual).toHaveLength(7);
  expect(reflections).toHaveLength(2);
  for (const task of actual)
    expect(evaluate(task.rule, 'confirmed')).toBeNull();
  for (const task of reflections)
    expect(evaluate(task.rule, '实际方法或未来计划')).toBeNull();
  const fresh = required(lesson.reviewQuestions);
  expect(fresh).toHaveLength(4);
  for (const task of fresh)
    expect(
      lesson.questions.some(
        (old) => old.id === task.id || old.prompt === task.prompt,
      ),
    ).toBe(false);
  expect(evaluate(required(fresh[0]).rule, [0, 2, 4, 6, 8])).toBe(true);
  expect(evaluate(required(fresh[1]).rule, 3)).toBe(true);
  expect(evaluate(required(fresh[2]).rule, [4, 4, 2, 0])).toBe(true);
  expect(evaluate(required(fresh[3]).rule, [6, 4])).toBe(true);
});
