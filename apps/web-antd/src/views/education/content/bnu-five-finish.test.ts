import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate } from '../learning/engine';
import { required } from '../learning/required';
import {
  bnuFiveOrganizeLesson as organize,
  bnuFiveSubtractLesson as subtract,
} from './bnu-five-finish';

const question = (lesson: typeof subtract, suffix: string) =>
  required(lesson.questions.find((item) => item.id.endsWith(`-${suffix}`)));

it('distinguishes taking all, taking nothing, independent experiments and continuous remaining amounts', () => {
  expect(evaluate(question(subtract, 'q1').rule, 0)).toBe(true);
  expect(() => evaluate(question(subtract, 'q1').rule, null)).toThrow(
    'educationLearning.answerRequired',
  );
  for (const [suffix, answer] of [
    ['q2', 3],
    ['q3', 2],
    ['q4', 3],
    ['q6', 4],
    ['q7', 3],
    ['q8', 3],
    ['q12', 2],
    ['q13', 3],
  ] as const)
    expect(evaluate(question(subtract, suffix).rule, answer)).toBe(true);
  for (const [suffix, answer] of [
    ['q9', [4, 2, 0]],
    ['q10', [4, 3, 2, 1, 0]],
    ['q11', [5, 5, 5, 5, 5]],
    ['q14', [3, 3, 4, 5, 1, 1, 0, 0]],
  ] as const) {
    expect(evaluate(question(subtract, suffix).rule, [...answer])).toBe(true);
    for (let index = 0; index < answer.length; index++) {
      const wrong: number[] = [...answer];
      wrong[index] = required(wrong[index]) + 1;
      expect(evaluate(question(subtract, suffix).rule, wrong)).toBe(false);
    }
  }
  expect(evaluate(question(subtract, 'q9').rule, [4, 3, 3])).toBe(false);
  expect(evaluate(question(subtract, 'q15').rule, '不能')).toBe(true);
});

it('checks every calculation and accepts both explicitly permitted number directions', () => {
  for (const [suffix, answer] of [
    ['q6', [4, 4, 1, 5]],
    ['q7', [3, 2, 2, 0]],
    ['q8', [5, 3, 2, 3]],
    ['q9', [1, 4]],
    ['q10', [10, 7, 6]],
    ['q14', [3, 2, 0]],
    ['q15', [5, 3]],
  ] as const) {
    const rule = question(organize, suffix).rule;
    expect(evaluate(rule, [...answer])).toBe(true);
    for (let index = 0; index < answer.length; index++) {
      const wrong: number[] = [...answer];
      wrong[index] = required(wrong[index]) + 1;
      expect(evaluate(rule, wrong)).toBe(false);
    }
  }
  const directions = ['4、5、6、7、8', '8、7、6、5、4'];
  expect(evaluate(question(organize, 'q11').rule, directions)).toBe(true);
  expect(evaluate(question(organize, 'q11').rule, directions.slice(0, 1))).toBe(
    false,
  );
  expect(
    evaluate(question(organize, 'q11').rule, [...directions, '6、6、6、6、6']),
  ).toBe(false);
});

it('independently enumerates every valid arithmetic card, rejecting missing cards and extra wrong cards', () => {
  const universe: string[][] = Array.from({ length: 6 }, () => []);
  for (let left = 0; left <= 5; left++)
    for (let right = 0; right <= 5; right++) {
      if (left + right <= 5)
        required(universe[left + right]).push(`${left}+${right}`);
      if (left >= right)
        required(universe[left - right]).push(`${left}−${right}`);
    }
  expect(universe.flat()).toHaveLength(42);
  expect(new Set(universe.flat()).size).toBe(42);
  for (let target = 1; target <= 5; target++) {
    const task = question(organize, `q${15 + target}`);
    const valid = required(universe[target]);
    expect(valid).toHaveLength(7);
    expect(evaluate(task.rule, valid)).toBe(true);
    for (const choice of required(task.choices)) {
      if (valid.includes(choice.id))
        expect(
          evaluate(
            task.rule,
            valid.filter((value) => value !== choice.id),
          ),
        ).toBe(false);
      else expect(evaluate(task.rule, [...valid, choice.id])).toBe(false);
    }
  }
});

it('keeps actual activities and reflections ungraded and preserves partial zero drafts in backups', () => {
  const now = '2026-10-03T00:00:00.000Z';
  for (const [lesson, manuals, reflections, suffix, draft] of [
    [subtract, 7, 2, 'q9', [0, null, 0]],
    [organize, 8, 3, 'q7', [0, null, 2, 0]],
  ] as const) {
    expect(
      lesson.questions.filter((item) => item.rule.kind === 'manual'),
    ).toHaveLength(manuals);
    expect(
      lesson.questions.filter((item) => item.rule.kind === 'reflection'),
    ).toHaveLength(reflections);
    for (const item of lesson.questions.filter((item) =>
      ['manual', 'reflection'].includes(item.rule.kind),
    ))
      expect(
        evaluate(
          item.rule,
          item.rule.kind === 'manual' ? 'confirmed' : '实际记录',
        ),
      ).toBeNull();
    const fresh = required(lesson.reviewQuestions);
    expect(fresh).toHaveLength(4);
    for (const item of fresh)
      expect(
        lesson.questions.some(
          (old) => old.id === item.id || old.prompt === item.prompt,
        ),
      ).toBe(false);
    const session = createSession(lesson, 'bnu-math-p1-upper-2024', 'child', {
      seed: 37,
      now,
    });
    required(
      session.responses.find((item) => item.questionId.endsWith(`-${suffix}`)),
    ).draft = [...draft];
    const data = {
      schemaVersion: 1 as const,
      profiles: [{ id: 'child', nickname: '隔离测试', createdAt: now }],
      activeProfileId: 'child',
      sessions: [session],
    };
    expect(parseBackup(exportBackup(data, now)).data).toEqual(
      JSON.parse(JSON.stringify(data)),
    );
    expect(() => evaluate(question(lesson, suffix).rule, [...draft])).toThrow(
      'educationLearning.answerRequired',
    );
  }
});
