import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate } from '../learning/engine';
import { required } from '../learning/required';
import { initialLibrary } from '../learning/storage';
import { bnuUpperBook } from './bnu';
import { bnuFinalNumberPracticeLesson as lesson } from './bnu-final-practice';

const by = (suffix: string) =>
  required(lesson.questions.find((q) => q.id === `${lesson.id}-${suffix}`));
it('covers all six blanks and nine ordinal positions with explicit direction and zero', () => {
  expect(evaluate(by('q1').rule, 3)).toBe(true);
  expect(evaluate(by('q1').rule, 9)).toBe(false);
  expect(by('ascending').visual).toEqual({
    kind: 'number-strip',
    values: [5, null, 7, null, 9, null],
  });
  expect(by('descending').visual).toEqual({
    kind: 'number-strip',
    values: [10, 8, null, null, 2, null],
  });
  expect(evaluate(by('ascending').rule, [6, 8, 10])).toBe(true);
  expect(evaluate(by('descending').rule, [6, 4, 0])).toBe(true);
  expect(evaluate(by('descending').rule, [6, 4, 2])).toBe(false);
  expect(() => evaluate(by('descending').rule, [6, 4, null])).toThrow(
    'educationLearning.answerRequired',
  );
  expect(evaluate(by('queue').rule, [1, 2, 3, 4, 5, 6, 7, 8, 9])).toBe(true);
  expect(evaluate(by('queue').rule, [9, 8, 7, 6, 5, 4, 3, 2, 1])).toBe(false);
  expect(by('queue').visual).toEqual({
    kind: 'queue',
    labels: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
    front: 'left',
  });
});
it('computes all twelve expressions and matches each of the six pairs, including mixed operations', () => {
  expect(evaluate(by('calculate-left').rule, [10, 8, 9, 10, 8, 9])).toBe(true);
  expect(evaluate(by('calculate-right').rule, [4, 10, 5, 4, 10, 5])).toBe(true);
  const expected = ['10+0', '5+3', '7+2', '6−2', '0+5', '4+6'];
  for (const [index, answer] of expected.entries()) {
    const question = by(`match-${index + 1}`);
    expect(evaluate(question.rule, answer)).toBe(true);
    for (const candidate of required(question.choices))
      expect(evaluate(question.rule, candidate.id)).toBe(
        candidate.id === answer,
      );
  }
});
it('accepts all bounded open fillings without mistaking equality, a partial answer or a container for quantity', () => {
  for (let value = -1; value <= 11; value++) {
    expect(evaluate(by('greater').rule, [value])).toBe(
      value > 1 && value <= 10,
    );
    expect(evaluate(by('less').rule, [value])).toBe(value >= 0 && value < 10);
  }
  expect(evaluate(by('equal').rule, 2)).toBe(true);
  for (const pair of [
    [8, 0],
    [9, 1],
    [10, 2],
  ])
    expect(evaluate(by('difference').rule, pair)).toBe(true);
  expect(evaluate(by('difference').rule, [8, 2])).toBe(false);
  expect(evaluate(by('monkeys').rule, 10)).toBe(true);
  expect(evaluate(by('monkey-equations').rule, ['4+6', '6+4'])).toBe(true);
  expect(evaluate(by('monkey-equations').rule, ['6+4', '5+5'])).toBe(false);
  expect(evaluate(by('cabbage').rule, 9)).toBe(true);
  expect(evaluate(by('cabbage').rule, 0)).toBe(false);
  expect(evaluate(by('basket-unit').rule, '不能，容器与白菜不同')).toBe(true);
});
it('keeps seven physical activities and three independent reflections without releasing later source pages', () => {
  expect(lesson.steps).toHaveLength(6);
  expect(lesson.questions).toHaveLength(30);
  const manual = lesson.questions.filter((q) => q.rule.kind === 'manual');
  expect(manual.map((q) => q.id.split('-actual-')[1])).toEqual([
    'number-rows',
    'queue',
    'matching',
    'open',
    'monkeys',
    'cabbage',
    'exchange',
  ]);
  for (const question of manual)
    expect(evaluate(question.rule, 'confirmed')).toBeNull();
  const reflections = lesson.questions.filter(
    (q) => q.rule.kind === 'reflection',
  );
  expect(reflections).toHaveLength(3);
  for (const question of reflections)
    expect(evaluate(question.rule, '未做，准备下次核对。')).toBeNull();
  const unit = required(bnuUpperBook.units.find((unit) => unit.id === 'final'));
  expect(unit.lessons).toContainEqual(lesson);
  expect(unit.lessons.some((item) => item.status === 'preparing')).toBe(false);
});
it('changes all four review conditions and preserves new rule and diagram snapshots in schema one', () => {
  const review = required(lesson.reviewQuestions);
  expect(review).toHaveLength(4);
  expect(evaluate(required(review[0]).rule, [3, 5, 7])).toBe(true);
  expect(evaluate(required(review[1]).rule, [9, 8, 7, 6, 5, 4, 3, 2, 1])).toBe(
    true,
  );
  expect(evaluate(required(review[2]).rule, [6, 0])).toBe(true);
  expect(evaluate(required(review[3]).rule, 7)).toBe(true);
  expect(evaluate(required(review[2]).rule, [8, 0])).toBe(false);
  expect(evaluate(required(review[3]).rule, 9)).toBe(false);
  const library = initialLibrary('隔离第82页核对');
  const session = createSession(
    lesson,
    bnuUpperBook.id,
    library.activeProfileId,
  );
  const response = required(
    session.responses.find((q) => q.questionId.endsWith('-difference')),
  );
  response.draft = [null, 0];
  library.sessions.push(session);
  expect(parseBackup(exportBackup(library)).data.sessions[0]).toEqual(
    JSON.parse(JSON.stringify(session)),
  );
});
