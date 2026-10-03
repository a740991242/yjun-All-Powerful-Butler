import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate } from '../learning/engine';
import { required } from '../learning/required';
import {
  bnuClassificationLesson as classify,
  bnuRoomSortLesson as room,
} from './bnu-classification';

const q = (lesson: typeof room, suffix: string) =>
  required(lesson.questions.find((item) => item.id.endsWith(`-${suffix}`)));
const complete = (task: (typeof room.questions)[number], valid: string[]) => {
  expect(evaluate(task.rule, valid)).toBe(true);
  for (const choice of required(task.choices)) {
    if (valid.includes(choice.id)) {
      const incomplete = valid.filter((id) => id !== choice.id);
      if (incomplete.length === 0)
        expect(() => evaluate(task.rule, incomplete)).toThrow(
          'educationLearning.answerRequired',
        );
      else expect(evaluate(task.rule, incomplete)).toBe(false);
    } else expect(evaluate(task.rule, [...valid, choice.id])).toBe(false);
  }
};
it('fully partitions eight items by declared use and changes book and pen standards', () => {
  expect(evaluate(q(room, 'q1').rule, 4)).toBe(true);
  expect(evaluate(q(room, 'q1').rule, 3)).toBe(false);
  for (const [suffix, answer] of [
    ['q2', ['A', 'B', 'C', 'D']],
    ['q3', ['E', 'F']],
    ['q4', ['G', 'H']],
    ['q7', ['A', 'C']],
    ['q8', ['A', 'B']],
    ['q9', ['A', 'C']],
    ['q10', ['A', 'B']],
    ['q11', ['A', 'B', 'E']],
  ] as const)
    complete(q(room, suffix), [...answer]);
  expect(evaluate(q(room, 'q5').rule, [4, 2, 2])).toBe(true);
  expect(evaluate(q(room, 'q5').rule, [3, 2, 2])).toBe(false);
  expect(evaluate(q(room, 'q6').rule, 8)).toBe(true);
  expect(evaluate(q(room, 'q12').rule, 3)).toBe(true);
  expect(evaluate(q(room, 'q13').rule, '能')).toBe(false);
});
it('enumerates each classification from individual card attributes and rejects every omission and outsider', () => {
  const cards = [
    ['A', '红', '圆', '小'],
    ['B', '蓝', '三角', '大'],
    ['C', '红', '方', '大'],
    ['D', '蓝', '圆', '大'],
    ['E', '黄', '方', '小'],
    ['F', '红', '三角', '小'],
    ['G', '黄', '圆', '大'],
    ['H', '蓝', '方', '小'],
    ['I', '黄', '三角', '大'],
  ];
  expect(new Set(cards.map((card) => card[0])).size).toBe(9);
  for (const [suffix, attribute, value] of [
    ['q2', 1, '红'],
    ['q3', 1, '蓝'],
    ['q4', 1, '黄'],
    ['q5', 2, '圆'],
    ['q6', 2, '三角'],
    ['q7', 2, '方'],
    ['q8', 3, '小'],
    ['q9', 3, '大'],
  ] as const) {
    const valid = cards
      .filter((card) => card[attribute] === value)
      .map((card) => required(card[0]));
    complete(q(classify, suffix), valid);
  }
  complete(
    q(classify, 'q14'),
    cards
      .filter((card) => card[1] === '红' && card[3] === '小')
      .map((card) => required(card[0])),
  );
  expect(evaluate(q(classify, 'q13').rule, '不符合')).toBe(true);
  expect(evaluate(q(classify, 'q16').rule, '可以')).toBe(true);
  expect(evaluate(q(classify, 'q17').rule, '能')).toBe(false);
  expect(evaluate(q(classify, 'q1').rule, 9)).toBe(true);
  expect(evaluate(q(classify, 'q15').rule, 18)).toBe(false);
});
it('requires each group count and preserves explicit zero separately from an empty field', () => {
  for (const [suffix, answer] of [
    ['q10', [3, 3, 3]],
    ['q11', [3, 3, 3]],
    ['q12', [4, 5]],
  ] as const) {
    const task = q(classify, suffix);
    expect(evaluate(task.rule, [...answer])).toBe(true);
    for (let index = 0; index < answer.length; index++) {
      const wrong: number[] = [...answer];
      wrong[index] = required(wrong[index]) + 1;
      expect(evaluate(task.rule, wrong)).toBe(false);
    }
  }
  expect(() => evaluate(q(classify, 'q12').rule, [0, null])).toThrow(
    'educationLearning.answerRequired',
  );
  const now = '2026-10-03T00:00:00.000Z';
  const session = createSession(classify, 'bnu-math-p1-upper-2024', 'child', {
    seed: 46,
    now,
  });
  required(
    session.responses.find((item) => item.questionId.endsWith('-q12')),
  ).draft = [0, null];
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
it('keeps complete original and paper activities separate from objective scoring and new review conditions', () => {
  for (const [lesson, tasks] of [
    [room, 21],
    [classify, 25],
  ] as const) {
    expect(lesson.steps).toHaveLength(6);
    expect(lesson.questions).toHaveLength(tasks);
    const actual = lesson.questions.filter(
      (item) => item.rule.kind === 'manual',
    );
    const reflections = lesson.questions.filter(
      (item) => item.rule.kind === 'reflection',
    );
    expect(actual).toHaveLength(6);
    expect(reflections).toHaveLength(2);
    for (const task of actual)
      expect(evaluate(task.rule, 'confirmed')).toBeNull();
    for (const task of reflections)
      expect(evaluate(task.rule, '实际发现或未来计划')).toBeNull();
    const fresh = required(lesson.reviewQuestions);
    expect(fresh).toHaveLength(4);
    for (const task of fresh)
      expect(
        lesson.questions.some(
          (old) => old.id === task.id || old.prompt === task.prompt,
        ),
      ).toBe(false);
  }
  const newClass = required(classify.reviewQuestions);
  complete(required(newClass[0]), ['K', 'N']);
  complete(required(newClass[1]), ['J', 'L', 'N']);
  expect(evaluate(required(newClass[2]).rule, [2, 2, 2])).toBe(true);
  complete(required(newClass[3]), ['M']);
  const newRoom = required(room.reviewQuestions);
  expect(evaluate(required(newRoom[0]).rule, 5)).toBe(true);
  complete(required(newRoom[1]), ['K', 'L']);
  complete(required(newRoom[2]), ['J', 'M']);
  expect(evaluate(required(newRoom[3]).rule, '不能')).toBe(true);
});
