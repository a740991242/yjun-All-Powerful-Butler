import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate } from '../learning/engine';
import { required } from '../learning/required';
import { solidCounts, solidPositions } from '../learning/solid-row';
import { bnuUpperBook } from './bnu';
import {
  bnuSolidMain,
  bnuSolidReview,
  bnuSolidRecognitionLesson as lesson,
} from './bnu-solids';

const by = (suffix: string) =>
  required(
    lesson.questions.find(
      (question) => question.id === `${lesson.id}-${suffix}`,
    ),
  );
it('covers all four complete shapes and all seven objects without counting faces or repeating objects', () => {
  expect(solidCounts(bnuSolidMain)).toEqual({
    cuboid: 3,
    cube: 1,
    cylinder: 2,
    sphere: 1,
  });
  expect(solidPositions(bnuSolidMain, 'cylinder')).toEqual([5, 7]);
  expect(solidPositions(bnuSolidMain, 'cuboid')).toEqual([1, 4, 6]);
  expect(bnuSolidMain.shapes).toHaveLength(7);
  expect(evaluate(by('counts').rule, [3, 1, 2, 1])).toBe(true);
  expect(evaluate(by('counts').rule, [3, 1, 1, 2])).toBe(false);
  expect(evaluate(by('total').rule, 7)).toBe(true);
  expect(evaluate(by('total').rule, 21)).toBe(false);
  expect(evaluate(by('cylinder-positions').rule, ['5', '7'])).toBe(true);
  expect(evaluate(by('cylinder-positions').rule, ['5'])).toBe(false);
  expect(evaluate(by('cuboid-positions').rule, ['1', '4', '6'])).toBe(true);
  expect(evaluate(by('zero').rule, 0)).toBe(true);
  for (const [suffix, answer] of [
    ['q1', '正方体'],
    ['cuboid', '长方体'],
    ['cylinder', '圆柱'],
    ['sphere', '球'],
    ['turn', '没有改变'],
    ['roll', '横放，侧面接触桌面'],
    ['upright', '不可以'],
    ['roll-only', '不能'],
    ['one-face', '不能'],
    ['colour', '不应增加'],
    ['unknown', '还需观察'],
  ] as const)
    expect(evaluate(by(suffix).rule, answer)).toBe(true);
});
it('keeps original actual activities, open reflection and remaining geometry separate', () => {
  expect(lesson.steps).toHaveLength(6);
  expect(lesson.questions).toHaveLength(25);
  const manual = lesson.questions.filter(
    (question) => question.rule.kind === 'manual',
  );
  expect(manual.map((question) => question.id.split('-actual-')[1])).toEqual([
    'book-classify',
    'play',
    'match',
    'fill',
    'build',
    'local',
    'explain',
  ]);
  for (const question of manual)
    expect(evaluate(question.rule, 'confirmed')).toBeNull();
  for (const suffix of ['reflection', 'plan'])
    expect(
      evaluate(by(suffix).rule, '尚未实际操作，准备下一次再做。'),
    ).toBeNull();
  const unit = required(bnuUpperBook.units.find((item) => item.id === 'u5'));
  expect(unit.lessons).toContain(lesson);
  expect(unit.lessons.every((item) => item.status === 'available')).toBe(true);
  expect(
    bnuUpperBook.units
      .flatMap((item) => item.lessons)
      .some((item) => item.status === 'preparing'),
  ).toBe(false);
  expect(lesson.steps.map((step) => step.text).join('')).toContain('横放');
  expect(lesson.steps.map((step) => step.text).join('')).toContain('竖放');
  expect(lesson.steps.map((step) => step.text).join('')).toContain(
    '不是搭稳的证据',
  );
});
it('changes the review arrangement, counts and all positions while keeping zero meaningful', () => {
  expect(solidCounts(bnuSolidReview)).toEqual({
    cuboid: 1,
    cube: 2,
    cylinder: 3,
    sphere: 2,
  });
  expect(solidPositions(bnuSolidReview, 'cylinder')).toEqual([1, 4, 7]);
  expect(solidPositions(bnuSolidReview, 'cube')).toEqual([3, 8]);
  const review = required(lesson.reviewQuestions);
  expect(review).toHaveLength(5);
  expect(evaluate(required(review[0]).rule, [1, 2, 3, 2])).toBe(true);
  expect(evaluate(required(review[1]).rule, 8)).toBe(true);
  expect(evaluate(required(review[2]).rule, ['1', '4', '7'])).toBe(true);
  expect(evaluate(required(review[3]).rule, ['3', '8'])).toBe(true);
  expect(evaluate(required(review[4]).rule, 0)).toBe(true);
  expect(evaluate(required(review[0]).rule, [3, 1, 2, 1])).toBe(false);
  expect(evaluate(required(review[2]).rule, ['5', '7'])).toBe(false);
});
it('preserves partial zero drafts, original visual snapshots and unconfirmed manual activities in schema one', () => {
  const now = '2026-10-04T00:00:00.000Z';
  const session = createSession(lesson, 'bnu-math-p1-upper-2024', 'child', {
    now,
    seed: 7,
  });
  required(
    session.responses.find((response) =>
      response.questionId.endsWith('-counts'),
    ),
  ).draft = [0, null, null, null];
  expect(() => evaluate(by('counts').rule, [0, null, null, null])).toThrow(
    'educationLearning.answerRequired',
  );
  const data = {
    schemaVersion: 1 as const,
    profiles: [{ id: 'child', nickname: '隔离核对', createdAt: now }],
    activeProfileId: 'child',
    sessions: [session],
  };
  const decoded = parseBackup(exportBackup(data, now)).data;
  expect(decoded).toEqual(JSON.parse(JSON.stringify(data)));
  expect(
    required(decoded.sessions[0]).responses.every(
      (response) => response.submissions.length === 0,
    ),
  ).toBe(true);
  expect(
    required(decoded.sessions[0]).questions.find((question) =>
      question.id.endsWith('-counts'),
    )?.visual,
  ).toEqual(bnuSolidMain);
  expect(() =>
    parseBackup(
      exportBackup(data, now).replace(
        '"kind": "solid-row"',
        '"kind": "solid-row", "answer": 7',
      ),
    ),
  ).toThrow('educationLearning.invalidBackup');
});
