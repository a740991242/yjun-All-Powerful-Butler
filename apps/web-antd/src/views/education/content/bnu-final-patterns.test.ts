import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { bnuFinalColorCards } from '../learning/bnu-final-color';
import { createSession, evaluate } from '../learning/engine';
import { required } from '../learning/required';
import { initialLibrary } from '../learning/storage';
import { bnuUpperBook } from './bnu';
import { bnuFinalColorPatternsLesson as lesson } from './bnu-final-patterns';
const by = (suffix: string) =>
  required(lesson.questions.find((q) => q.id === `${lesson.id}-${suffix}`));

it('covers all twelve original calculations and both chick stories with genuine intermediate quantities', () => {
  expect(evaluate(by('q1').rule, 8)).toBe(true);
  for (const [index, answers] of [
    [8, 9, 10],
    [8, 9, 10],
    [10, 9, 8],
    [10, 10, 10],
  ].entries())
    expect(evaluate(by(`column-${index + 1}`).rule, answers)).toBe(true);
  expect(evaluate(by('column-3').rule, [10, 9, 0])).toBe(false);
  expect(evaluate(by('chicks-total').rule, 10)).toBe(true);
  expect(evaluate(by('chicks-add').rule, [5, 10])).toBe(true);
  expect(evaluate(by('chicks-hidden').rule, [7, 3])).toBe(true);
  expect(evaluate(by('chicks-hidden').rule, [7, 7])).toBe(false);
  expect(() => evaluate(by('chicks-hidden').rule, [7, null])).toThrow(
    'educationLearning.answerRequired',
  );
  const permutations = [
    '3+2+5=10',
    '3+5+2=10',
    '2+3+5=10',
    '2+5+3=10',
    '5+3+2=10',
    '5+2+3=10',
  ];
  expect(evaluate(by('chicks-equations').rule, permutations.toReversed())).toBe(
    true,
  );
  expect(
    evaluate(by('chicks-equations').rule, [...permutations, '5+5+0=10']),
  ).toBe(false);
  expect(
    evaluate(by('chicks-hidden-equations').rule, ['10−4−3=3', '10−3−4=3']),
  ).toBe(true);
  expect(evaluate(by('chicks-unknown').rule, '不能，条件不足')).toBe(true);
});
it('retains and computes all 29 original regions without merging repeated expressions or guessing coloured image', () => {
  const expressions = [
    '1+3',
    '4+2',
    '3+3',
    '5+1',
    '5+4',
    '2+2+6',
    '9+1',
    '4+4+2',
    '2+8',
    '1+9',
    '7+1+2',
    '0+8',
    '2+1',
    '6+4',
    '7+3',
    '5+2',
    '8+2',
    '3+7',
    '4+4',
    '0+10',
    '3+6',
    '10+0',
    '5+5',
    '2+3+5',
    '1+1+8',
    '4+6',
    '0+8',
    '2+7',
    '1+7',
  ];
  const cards = bnuFinalColorCards('main');
  expect(cards.map((card) => card.expression)).toEqual(expressions);
  expect(new Set(cards.map((card) => card.id)).size).toBe(29);
  const sums = expressions.map((s) =>
    s.split('+').reduce((sum, n) => sum + Number(n), 0),
  );
  for (let part = 0; part < 5; part++)
    expect(
      evaluate(
        by(`color-calculate-${part + 1}`).rule,
        sums.slice(part * 6, part * 6 + 6),
      ),
    ).toBe(true);
  const chosen = cards.filter((_, i) => sums[i] === 10).map((card) => card.id);
  expect(chosen).toHaveLength(16);
  expect(evaluate(by('color-select').rule, chosen.toReversed())).toBe(true);
  expect(evaluate(by('color-select').rule, chosen.slice(1))).toBe(false);
  for (const id of ['R12', 'R27'])
    expect(evaluate(by('color-select').rule, [...chosen, id])).toBe(false);
  expect(evaluate(by('color-repeat').rule, '各自保留并计算，都不选')).toBe(
    true,
  );
  expect(required(by('color-select').choices)).toHaveLength(29);
});
it('extends all six point figures above ten and keeps six actual tasks separate from three open records', () => {
  expect(evaluate(by('dots-known').rule, [1, 3, 6])).toBe(true);
  expect(evaluate(by('dots-next').rule, [10, 15, 21])).toBe(true);
  expect(evaluate(by('dots-next').rule, [4, 5, 6])).toBe(false);
  expect(evaluate(by('dots-next').rule, [10, 10, 10])).toBe(false);
  expect(lesson.steps).toHaveLength(6);
  expect(lesson.questions).toHaveLength(31);
  expect(lesson.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
    6,
  );
  expect(
    lesson.questions.filter((q) => q.rule.kind === 'reflection'),
  ).toHaveLength(3);
  for (const q of lesson.questions.filter((q) => q.rule.kind === 'reflection'))
    expect(evaluate(q.rule, '未做，计划下次画。')).toBeNull();
  const final = required(bnuUpperBook.units.find((u) => u.id === 'final'));
  expect(final.lessons).toContainEqual(lesson);
  expect(final.lessons.some((l) => l.status === 'preparing')).toBe(true);
});
it('changes all review conditions and round-trips partial zero, selected regions and complete diagram snapshots', () => {
  const review = required(lesson.reviewQuestions);
  expect(review).toHaveLength(4);
  expect(evaluate(required(review[0]).rule, [10, 9, 8])).toBe(true);
  expect(evaluate(required(review[1]).rule, [7, 4])).toBe(true);
  expect(evaluate(required(review[1]).rule, [7, 3])).toBe(false);
  const chosen = bnuFinalColorCards('review')
    .filter(
      (card) =>
        card.expression.split('+').reduce((sum, n) => sum + Number(n), 0) === 9,
    )
    .map((card) => card.id);
  expect(evaluate(required(review[2]).rule, chosen)).toBe(true);
  expect(evaluate(required(review[3]).rule, [6, 3, 1])).toBe(true);
  expect(evaluate(required(review[3]).rule, [1, 3, 6])).toBe(false);
  const library = initialLibrary('隔离83页核对');
  const session = createSession(
    lesson,
    bnuUpperBook.id,
    library.activeProfileId,
  );
  required(
    session.responses.find((r) => r.questionId.endsWith('-dots-next')),
  ).draft = [0, null, null];
  required(
    session.responses.find((r) => r.questionId.endsWith('-color-select')),
  ).draft = ['R12', 'R27'];
  library.sessions.push(session);
  expect(parseBackup(exportBackup(library)).data.sessions[0]).toEqual(
    JSON.parse(JSON.stringify(session)),
  );
});
