import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  bnuFinalMaterials,
  bnuFinalObjects,
  bnuFinalRobot,
} from '../learning/bnu-final-solids';
import { createSession, evaluate } from '../learning/engine';
import { required } from '../learning/required';
import { initialLibrary } from '../learning/storage';
import { bnuUpperBook } from './bnu';
import { bnuFinalSolidsLesson as lesson } from './bnu-final-solids';
const by = (suffix: string) =>
  required(lesson.questions.find((q) => q.id === `${lesson.id}-${suffix}`));
it('classifies every original life object by the full shape and keeps the two material groups complete', () => {
  const answers = [
    '圆柱',
    '球',
    '正方体',
    '长方体',
    '长方体',
    '圆柱',
    '正方体',
  ];
  for (const [index, answer] of answers.entries())
    expect(evaluate(by(`life-${index + 1}`).rule, answer)).toBe(true);
  expect(bnuFinalObjects('main').map((x) => x.name)).toEqual([
    'can',
    'ball',
    'rubik',
    'book',
    'microwave',
    'column',
    'block',
  ]);
  expect(evaluate(by('life-counts').rule, [2, 2, 2, 1])).toBe(true);
  expect(evaluate(by('match-1').rule, 'B')).toBe(true);
  expect(evaluate(by('match-2').rule, 'A')).toBe(true);
  const materials = bnuFinalMaterials('main');
  expect(materials.map((group) => group.shapes.length)).toEqual([8, 8]);
  expect(
    required(materials[0]).shapes.filter((piece) => piece.shape === 'cylinder'),
  ).toHaveLength(3);
  expect(
    required(materials[1]).shapes.filter((piece) => piece.shape === 'cube'),
  ).toHaveLength(4);
  expect(evaluate(by('material-A').rule, [2, 3, 2, 0])).toBe(true);
  expect(evaluate(by('material-B').rule, [2, 0, 4, 0])).toBe(true);
  expect(evaluate(by('roof-A').rule, 1)).toBe(true);
  expect(evaluate(by('roof-B').rule, 2)).toBe(true);
  expect(evaluate(by('material-A').rule, [2, 2, 2, 1])).toBe(false);
  expect(() => evaluate(by('material-B').rule, [2, null, 4, 0])).toThrow(
    'educationLearning.answerRequired',
  );
});
it('distinguishes real robot pieces from the eye drawings, cylinder ends and example icons, with source-verified groups', () => {
  const pieces = bnuFinalRobot('main');
  const labels = (shape: string) =>
    pieces
      .filter((piece) => piece.shape === shape)
      .map((piece) => piece.label)
      .toSorted();
  expect(labels('cuboid')).toEqual(['A', 'B']);
  expect(labels('cylinder')).toEqual(['E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']);
  expect(labels('cube')).toEqual(['C', 'D']);
  expect(labels('sphere')).toEqual(['M', 'N', 'O', 'P']);
  expect(evaluate(by('q1').rule, 2)).toBe(true);
  expect(evaluate(by('robot-counts').rule, [2, 8, 2, 4])).toBe(true);
  expect(evaluate(by('robot-counts').rule, [2, 8, 2, 6])).toBe(false);
  expect(evaluate(by('robot-paint').rule, '不计，画记不是独立积木')).toBe(true);
  expect(evaluate(by('robot-end').rule, '不增加，它是同一圆柱的端面')).toBe(
    true,
  );
  expect(evaluate(by('stability').rule, '第一组')).toBe(true);
  expect(evaluate(by('roof').rule, '不必，另列观察')).toBe(true);
});
it('keeps seven independent physical activities, three reflections and separate full-course registration', () => {
  expect(lesson.steps).toHaveLength(6);
  expect(lesson.questions).toHaveLength(31);
  const manual = lesson.questions.filter((q) => q.rule.kind === 'manual');
  expect(manual).toHaveLength(7);
  for (const q of manual) expect(evaluate(q.rule, 'confirmed')).toBeNull();
  const reflection = lesson.questions.filter(
    (q) => q.rule.kind === 'reflection',
  );
  expect(reflection).toHaveLength(3);
  for (const q of reflection)
    expect(evaluate(q.rule, '未做，准备下次核对。')).toBeNull();
  const final = required(bnuUpperBook.units.find((u) => u.id === 'final'));
  expect(final.lessons).toContainEqual(lesson);
  expect(final.lessons.some((l) => l.status === 'preparing')).toBe(false);
});
it('changes all review conditions and preserves partial zero alongside strict new diagram snapshots', () => {
  const review = required(lesson.reviewQuestions);
  expect(review).toHaveLength(4);
  expect(evaluate(required(review[0]).rule, '正方体')).toBe(true);
  expect(evaluate(required(review[0]).rule, '圆柱')).toBe(false);
  expect(evaluate(required(review[1]).rule, '不能，须看实际承托和摆法')).toBe(
    true,
  );
  expect(evaluate(required(review[2]).rule, 'A')).toBe(true);
  expect(evaluate(required(review[3]).rule, [1, 6, 2, 2])).toBe(true);
  expect(evaluate(required(review[3]).rule, [2, 8, 2, 4])).toBe(false);
  const library = initialLibrary('隔离84页');
  const session = createSession(
    lesson,
    bnuUpperBook.id,
    library.activeProfileId,
  );
  required(
    session.responses.find((r) => r.questionId.endsWith('-robot-counts')),
  ).draft = [0, null, 0, null];
  library.sessions.push(session);
  expect(parseBackup(exportBackup(library)).data.sessions[0]).toEqual(
    JSON.parse(JSON.stringify(session)),
  );
});
