import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  bnuFinalAnimals,
  bnuFinalClassificationObjects,
} from '../learning/bnu-final-classification';
import { createSession, evaluate } from '../learning/engine';
import { required } from '../learning/required';
import { initialLibrary } from '../learning/storage';
import { bnuUpperBook } from './bnu';
import { bnuFinalClassificationLesson as lesson } from './bnu-final-classification';
const by = (suffix: string) =>
  required(lesson.questions.find((q) => q.id === `${lesson.id}-${suffix}`));
it('covers every original group and rejects omissions, mixed criteria and wrong group sizes', () => {
  expect(bnuFinalAnimals('legs', 'main').map((c) => c.name)).toEqual([
    'chicken',
    'goose',
    'duck',
    'cat',
  ]);
  expect(bnuFinalAnimals('habitat', 'main').map((c) => c.name)).toEqual([
    'shark',
    'eagle',
    'seaTurtle',
    'starfish',
  ]);
  expect(bnuFinalAnimals('motion', 'main').map((c) => c.name)).toEqual([
    'flyingBird',
    'panda',
    'sheep',
    'rabbit',
    'goldfish',
    'swallow',
    'shrimp',
  ]);
  for (const [suffix, answer] of [
    ['legs-two', ['A', 'B', 'C']],
    ['legs-four', ['D']],
    ['sea', ['A', 'C', 'D']],
    ['flying', ['A', 'F']],
    ['running', ['B', 'C', 'D']],
    ['swimming', ['E', 'G']],
  ] as const)
    expect(evaluate(by(suffix).rule, [...answer])).toBe(true);
  expect(evaluate(by('legs-two').rule, ['A', 'B'])).toBe(false);
  expect(evaluate(by('running').rule, ['B', 'C', 'D', 'E'])).toBe(false);
  expect(evaluate(by('legs-counts').rule, [3, 1])).toBe(true);
  expect(evaluate(by('legs-counts').rule, [2, 4])).toBe(false);
  expect(evaluate(by('motion-counts').rule, [2, 3, 2])).toBe(true);
  expect(evaluate(by('unknown').rule, '说明缺少的条件，再观察核对')).toBe(true);
  expect(
    evaluate(by('eagle-home').rule, '不能，要区分飞翔位置和生活环境'),
  ).toBe(true);
  expect(evaluate(by('exclusive').rule, '不能，本轮条件不等于全部能力')).toBe(
    true,
  );
});
it('sorts all six objects by full shapes without forcing multicolour or measured size claims', () => {
  const objects = bnuFinalClassificationObjects('main');
  expect(objects.map((c) => c.name)).toEqual([
    'redBox',
    'basketball',
    'brownColumn',
    'yellowBox',
    'coloredBall',
    'blueColumn',
  ]);
  expect(objects.map((c) => c.shape)).toEqual([
    'cuboid',
    'sphere',
    'cylinder',
    'cuboid',
    'sphere',
    'cylinder',
  ]);
  expect(objects.map((c) => c.size)).toEqual([
    'large',
    'large',
    'large',
    'small',
    'small',
    'small',
  ]);
  expect(evaluate(by('cuboids').rule, ['A', 'D'])).toBe(true);
  expect(evaluate(by('spheres').rule, ['B', 'E'])).toBe(true);
  expect(evaluate(by('cylinders').rule, ['C', 'F'])).toBe(true);
  expect(evaluate(by('shape-counts').rule, [2, 2, 2])).toBe(true);
  expect(evaluate(by('total').rule, 6)).toBe(true);
  expect(evaluate(by('color').rule, '不必，先说明多色物品的处理标准')).toBe(
    true,
  );
  expect(evaluate(by('size').rule, '篮球')).toBe(true);
  expect(lesson.steps[4]?.text).toContain('只表示示意相对大小');
});
it('keeps all original physical tasks separate from open criteria and future plans', () => {
  expect(lesson.steps).toHaveLength(6);
  expect(lesson.questions).toHaveLength(30);
  const manual = lesson.questions.filter((q) => q.rule.kind === 'manual');
  expect(manual.map((q) => q.id.replace(`${lesson.id}-actual-`, ''))).toEqual([
    'legs',
    'habitat',
    'motion',
    'shape',
    'color',
    'size',
    'exchange',
  ]);
  for (const q of manual) expect(evaluate(q.rule, 'confirmed')).toBeNull();
  const reflections = lesson.questions.filter(
    (q) => q.rule.kind === 'reflection',
  );
  expect(reflections).toHaveLength(3);
  for (const q of reflections)
    expect(evaluate(q.rule, '另一种标准尚未实做，准备下次试。')).toBeNull();
  const final = required(bnuUpperBook.units.find((u) => u.id === 'final'));
  expect(final.lessons).toContainEqual(lesson);
  expect(final.lessons.some((l) => l.status === 'preparing')).toBe(true);
});
it('changes every review condition and preserves partial zero, selected sets and old snapshots', () => {
  const review = required(lesson.reviewQuestions);
  expect(review).toHaveLength(4);
  const good = [['A'], ['C'], ['B', 'C', 'F'], ['D', 'E']];
  const stale = [['D'], ['A', 'C', 'D'], ['B', 'C', 'D'], ['B', 'E']];
  for (const [i, q] of review.entries()) {
    expect(evaluate(q.rule, required(good[i]))).toBe(true);
    expect(evaluate(q.rule, required(stale[i]))).toBe(false);
  }
  expect(bnuFinalAnimals('motion', 'review').map((c) => c.name)).toEqual([
    'goldfish',
    'rabbit',
    'panda',
    'flyingBird',
    'shrimp',
    'sheep',
    'swallow',
  ]);
  const library = initialLibrary('隔离85页');
  const session = createSession(
    lesson,
    bnuUpperBook.id,
    library.activeProfileId,
  );
  required(
    session.responses.find((r) => r.questionId.endsWith('-shape-counts')),
  ).draft = [0, null, 0];
  required(
    session.responses.find((r) => r.questionId.endsWith('-running')),
  ).draft = ['B', 'C'];
  library.sessions.push(session);
  expect(parseBackup(exportBackup(library)).data.sessions[0]).toEqual(
    JSON.parse(JSON.stringify(session)),
  );
});
