import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { bnuBuildingItems } from '../learning/bnu-building';
import { createSession, evaluate } from '../learning/engine';
import { required } from '../learning/required';
import { bnuUpperBook } from './bnu';
import { bnuBuildingTowerLesson as lesson } from './bnu-tower';
const by = (suffix: string) =>
  required(
    lesson.questions.find(
      (question) => question.id === `${lesson.id}-${suffix}`,
    ),
  );
it('uses the same eight complete pieces when three cuboids change orientation', () => {
  const flat = bnuBuildingItems({
    kind: 'bnu-building',
    scene: 'tower-flat',
    variant: 'main',
  });
  const upright = bnuBuildingItems({
    kind: 'bnu-building',
    scene: 'tower-upright',
    variant: 'main',
  });
  expect(flat.map((piece) => [piece.label, piece.shape, piece.level])).toEqual([
    ['A', 'cuboid', 1],
    ['B', 'cuboid', 2],
    ['C', 'cuboid', 3],
    ['D', 'cube', 4],
    ['E', 'cube', 5],
    ['F', 'cylinder', 6],
    ['G', 'cylinder', 7],
    ['H', 'sphere', 8],
  ]);
  expect(upright.map(({ upright: _orientation, ...piece }) => piece)).toEqual(
    flat.map(({ upright: _orientation, ...piece }) => piece),
  );
  expect(flat.filter((piece) => piece.upright)).toHaveLength(0);
  expect(
    upright.filter((piece) => piece.upright).map((piece) => piece.label),
  ).toEqual(['A', 'B', 'C']);
  expect(evaluate(by('counts').rule, [3, 2, 2, 1])).toBe(true);
  expect(evaluate(by('counts').rule, [3, 2, 1, 2])).toBe(false);
  expect(evaluate(by('cuboids').rule, ['A', 'B', 'C'])).toBe(true);
  expect(evaluate(by('cuboids').rule, ['A', 'B'])).toBe(false);
  expect(evaluate(by('used').rule, [3, 5])).toBe(true);
  expect(evaluate(by('used').rule, [5, 3])).toBe(false);
  expect(evaluate(by('q1').rule, 8)).toBe(true);
  expect(evaluate(by('rotation-count').rule, 8)).toBe(true);
});
it('does not infer real heights, guarantees, or success from a plan or height alone', () => {
  for (const [suffix, answer] of [
    ['measure', '不可以'],
    ['goal', '八件都用、搭高且不倒'],
    ['base', '试大而平的面朝下并上下对齐'],
    ['turn', '不应另算'],
    ['align', '停下重新对齐再检查'],
    ['cooperate', '先听并商量，再轮流试'],
    ['unknown-height', '不能，实物高度未测'],
    ['fall', '没有'],
  ] as const)
    expect(evaluate(by(suffix).rule, answer)).toBe(true);
  expect(evaluate(by('measure').rule, '可以')).toBe(false);
  expect(evaluate(by('fall').rule, '满足了')).toBe(false);
  const reviews = required(lesson.reviewQuestions);
  expect(evaluate(required(reviews[0]).rule, ['H', 'D', 'G'])).toBe(true);
  expect(evaluate(required(reviews[0]).rule, ['A', 'B', 'C'])).toBe(false);
  expect(evaluate(required(reviews[1]).rule, ['B', 'F'])).toBe(true);
  expect(evaluate(required(reviews[1]).rule, ['D', 'E'])).toBe(false);
  expect(evaluate(required(reviews[2]).rule, [5, 3])).toBe(true);
  expect(evaluate(required(reviews[2]).rule, [3, 5])).toBe(false);
  expect(evaluate(required(reviews[3]).rule, '不能，还要不倒')).toBe(true);
});
it('covers actual preparation, both trials, comparison, adjustment, cooperation and source activity separately', () => {
  expect(lesson.steps).toHaveLength(6);
  expect(lesson.questions).toHaveLength(24);
  const manual = lesson.questions.filter(
    (question) => question.rule.kind === 'manual',
  );
  expect(manual.map((question) => question.id.split('-actual-')[1])).toEqual([
    'prepare',
    'first',
    'second',
    'compare',
    'adjust',
    'explain',
    'book',
  ]);
  for (const question of manual)
    expect(evaluate(question.rule, 'confirmed')).toBeNull();
  const reflection = lesson.questions.filter(
    (question) => question.rule.kind === 'reflection',
  );
  expect(reflection).toHaveLength(4);
  for (const question of reflection)
    expect(evaluate(question.rule, '待做，计划下次试。')).toBeNull();
  const unit = required(bnuUpperBook.units.find((item) => item.id === 'u5'));
  expect(unit.lessons.map((item) => item.id)).toEqual([
    'bnu-upper-solid-recognition',
    'bnu-upper-building-instructions',
    lesson.id,
  ]);
  expect(unit.lessons.every((item) => item.status === 'available')).toBe(true);
  expect(
    bnuUpperBook.units
      .flatMap((item) => item.lessons)
      .some((item) => item.status === 'preparing'),
  ).toBe(true);
});
it('keeps partial zero drafts and both visual orientations in schema-one snapshots', () => {
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
  expect(parseBackup(exportBackup(data, now)).data).toEqual(
    JSON.parse(JSON.stringify(data)),
  );
});
