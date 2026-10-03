import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  bnuBuildingItems,
  bnuBuildingLayers,
  isBnuBuildingVisual,
} from '../learning/bnu-building';
import { createSession, evaluate } from '../learning/engine';
import { required } from '../learning/required';
import { bnuBuildingInstructionsLesson as lesson } from './bnu-building';
const by = (suffix: string) =>
  required(
    lesson.questions.find(
      (question) => question.id === `${lesson.id}-${suffix}`,
    ),
  );
it('keeps the original two different bases, complete objects, and vertical order', () => {
  const beam = bnuBuildingItems({
    kind: 'bnu-building',
    scene: 'beam',
    variant: 'main',
  });
  expect(
    beam.map((item) => [item.label, item.shape, item.level, item.side]),
  ).toEqual([
    ['A', 'cylinder', 1, 'left'],
    ['B', 'cylinder', 1, 'right'],
    ['C', 'cuboid', 2, 'center'],
    ['D', 'cube', 3, 'center'],
  ]);
  const gate = bnuBuildingItems({
    kind: 'bnu-building',
    scene: 'gate',
    variant: 'main',
  });
  expect(
    gate.map((item) => [item.label, item.shape, item.level, item.side]),
  ).toEqual([
    ['A', 'cube', 1, 'left'],
    ['B', 'cube', 1, 'right'],
    ['C', 'cylinder', 2, 'left'],
    ['D', 'cylinder', 2, 'right'],
    ['E', 'cuboid', 3, 'center'],
    ['F', 'sphere', 4, 'left'],
    ['G', 'sphere', 4, 'right'],
  ]);
  expect(
    bnuBuildingLayers({
      kind: 'bnu-building',
      scene: 'gate',
      variant: 'main',
    }).map((layer) => layer.level),
  ).toEqual([4, 3, 2, 1]);
  for (const scene of ['beam', 'gate', 'tower-flat', 'tower-upright'] as const)
    for (const variant of ['main', 'review'] as const) {
      const model = { kind: 'bnu-building' as const, scene, variant };
      expect(isBnuBuildingVisual(model)).toBe(true);
      const pieces = bnuBuildingItems(model);
      expect(new Set(pieces.map((piece) => piece.label)).size).toBe(
        pieces.length,
      );
      expect(
        bnuBuildingLayers(model).flatMap((layer) => layer.pieces),
      ).toHaveLength(pieces.length);
    }
});
it('rejects arbitrary scenes, string coercion, extra answer fields and invalid variants', () => {
  for (const model of [
    null,
    [],
    { kind: 'bnu-building', scene: 'other', variant: 'main' },
    {
      kind: 'bnu-building',
      scene: { toString: () => 'beam' },
      variant: 'main',
    },
    { kind: 'bnu-building', scene: 'beam', variant: 'old' },
    { kind: 'bnu-building', scene: 'beam', variant: 'main', answer: 4 },
  ])
    expect(isBnuBuildingVisual(model)).toBe(false);
});
it('requires actual clearance and direction evidence, preserves zero and checks all selected pieces', () => {
  expect(evaluate(by('counts').rule, [1, 1, 2, 0])).toBe(true);
  expect(evaluate(by('counts').rule, [1, 1, 2, 1])).toBe(false);
  expect(() => evaluate(by('counts').rule, [1, 1, 2, null])).toThrow(
    'educationLearning.answerRequired',
  );
  for (const [suffix, answer] of [
    ['q1', 2],
    ['beam-total', 4],
    ['beam-beam', 'C'],
    ['beam-top', 'D'],
    ['above', '上面'],
    ['pass', '要核对实物大小和间距再试'],
    ['touch', '圆柱'],
    ['roll', '横放，侧面接触平桌'],
    ['gate-beam', 'E'],
    ['gate-total', 7],
    ['different-base', '双柱图圆柱；城门图正方体'],
  ] as const)
    expect(evaluate(by(suffix).rule, answer)).toBe(true);
  for (const [suffix, answers] of [
    ['beam-base', ['A', 'B']],
    ['gate-base', ['A', 'B']],
    ['gate-cylinders', ['C', 'D']],
    ['gate-balls', ['F', 'G']],
  ] as const) {
    expect(evaluate(by(suffix).rule, [...answers])).toBe(true);
    expect(evaluate(by(suffix).rule, [answers[0]])).toBe(false);
  }
  expect(evaluate(by('pass').rule, '一定能')).toBe(false);
  expect(evaluate(by('pass').rule, '一定不能')).toBe(false);
});
it('keeps all original real activities and reflections separate and changes review labels', () => {
  expect(lesson.steps).toHaveLength(6);
  expect(lesson.questions).toHaveLength(25);
  const manual = lesson.questions.filter(
    (question) => question.rule.kind === 'manual',
  );
  expect(manual.map((question) => question.id.split('-actual-')[1])).toEqual([
    'beam',
    'touch-cylinder',
    'touch-cube',
    'roll',
    'gate',
    'local',
    'exchange',
  ]);
  for (const question of manual)
    expect(evaluate(question.rule, 'confirmed')).toBeNull();
  for (const suffix of ['reflection', 'plan'])
    expect(evaluate(by(suffix).rule, '待做，计划下一次尝试。')).toBeNull();
  const review = required(lesson.reviewQuestions);
  expect(review).toHaveLength(4);
  const answers = [['D', 'C'], 'B', ['A', 'E'], ['D', 'F']];
  const oldAnswers = [['A', 'B'], 'D', ['F', 'G'], ['C', 'D']];
  review.forEach((question, index) => {
    expect(evaluate(question.rule, required(answers[index]))).toBe(true);
    expect(evaluate(question.rule, required(oldAnswers[index]))).toBe(false);
  });
});
it('round trips schema one snapshots with partial zero drafts and rejects inserted visual answers', () => {
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
  const data = {
    schemaVersion: 1 as const,
    profiles: [{ id: 'child', nickname: '隔离核对', createdAt: now }],
    activeProfileId: 'child',
    sessions: [session],
  };
  const encoded = exportBackup(data, now);
  expect(parseBackup(encoded).data).toEqual(JSON.parse(JSON.stringify(data)));
  expect(() =>
    parseBackup(
      encoded.replace(
        '"kind": "bnu-building"',
        '"kind": "bnu-building", "answer": 4',
      ),
    ),
  ).toThrow('educationLearning.invalidBackup');
});
