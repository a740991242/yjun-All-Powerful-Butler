import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  caterpillarTurn,
  isBnuCaterpillarVisual,
} from '../learning/bnu-caterpillar';
import { createSession, evaluate } from '../learning/engine';
import { required } from '../learning/required';
import {
  bnuTenOrganizeGameLesson as game,
  bnuTenFactTablesLesson as tables,
} from './bnu-ten-finish';

const by = (lesson: typeof tables, suffix: string) =>
  required(
    lesson.questions.find((item) => item.id === `${lesson.id}-${suffix}`),
  );
it('covers every ordered addition and nonnegative subtraction within ten exactly once', () => {
  const additions = new Set<string>();
  const subtractions = new Set<string>();
  for (let total = 0; total <= 10; total++) {
    const rule = by(tables, `add-${total}`).rule;
    expect(rule.kind).toBe('steps');
    if (rule.kind !== 'steps') throw new Error('Expected steps');
    expect(rule.values).toHaveLength(total + 1);
    rule.values.forEach((second, index) => {
      const first = total - index;
      expect(first + second).toBe(total);
      additions.add(`${first}+${second}`);
    });
  }
  for (let result = 0; result <= 10; result++) {
    const rule = by(tables, `sub-${result}`).rule;
    if (rule.kind !== 'steps') throw new Error('Expected steps');
    expect(rule.values).toHaveLength(11 - result);
    rule.values.forEach((second, index) => {
      const first = 10 - index;
      expect(first - second).toBe(result);
      subtractions.add(`${first}-${second}`);
    });
  }
  expect(additions.size).toBe(66);
  expect(subtractions.size).toBe(66);
  for (let a = 0; a <= 10; a++)
    for (let b = 0; b <= 10; b++) {
      expect(additions.has(`${a}+${b}`)).toBe(a + b <= 10);
      expect(subtractions.has(`${a}-${b}`)).toBe(a >= b);
    }
});
it('distinguishes classification standards, card identities, all matching expressions and missing quantities', () => {
  expect(evaluate(by(tables, 'operand-sort').rule, ['A', 'B'])).toBe(true);
  expect(evaluate(by(tables, 'result-sort').rule, ['A', 'C'])).toBe(true);
  expect(evaluate(by(tables, 'result-sort').rule, ['A', 'B'])).toBe(false);
  expect(evaluate(by(game, 'pairs').rule, ['AG', 'BD', 'CE', 'FI', 'HJ'])).toBe(
    true,
  );
  expect(evaluate(by(game, 'pairs').rule, ['AG', 'BD', 'CE', 'FF', 'HJ'])).toBe(
    false,
  );
  for (const [suffix, answer] of [
    ['ten-minus', [9, 7, 5, 3, 1, 10, 8, 6, 4, 2, 0]],
    ['add-results', [6, 8, 7, 10, 8, 10, 6, 7]],
    ['add-match', [3, 1, 4, 2]],
    ['sub-results', [2, 6, 4, 0, 0, 2, 4, 6]],
    ['sub-match', [2, 4, 3, 1]],
    ['six-missing', [5, 3, 4, 3, 4, 4]],
    ['game', [4, 9, 12, 7, 10]],
  ] as const)
    expect(evaluate(by(game, suffix).rule, [...answer])).toBe(true);
  expect(evaluate(by(game, 'boat').rule, 5)).toBe(true);
  expect(evaluate(by(game, 'boat').rule, 1)).toBe(false);
  expect(evaluate(by(game, 'unknown').rule, '不能')).toBe(true);
});
it('allows overshooting, takes only on subsequent turns and stops exactly at ten', () => {
  for (let current = 0; current <= 17; current++)
    for (let card = 1; card <= 8; card++) {
      const turn = caterpillarTurn(current, card);
      if (current === 10) expect(turn).toBeNull();
      else
        expect(turn).toEqual({
          before: current,
          card,
          action: current > 10 ? 'take' : 'add',
          after: current > 10 ? current - card : current + card,
        });
    }
  let current = 0;
  const states = [4, 5, 3, 5, 3].map((card) => {
    current = required(caterpillarTurn(current, card)).after;
    return current;
  });
  expect(states).toEqual([4, 9, 12, 7, 10]);
  for (const bad of [-1, 18, 1.5, Number.NaN, Number.POSITIVE_INFINITY])
    expect(() => caterpillarTurn(bad, 4)).toThrow(
      'educationLearning.invalidRecord',
    );
  for (const bad of [0, 9, 1.5, Number.NaN])
    expect(() => caterpillarTurn(0, bad)).toThrow(
      'educationLearning.invalidRecord',
    );
  expect(isBnuCaterpillarVisual({ kind: 'bnu-caterpillar' })).toBe(true);
  for (const bad of [
    null,
    [],
    {},
    { kind: 'other' },
    { kind: 'bnu-caterpillar', answer: 10 },
  ])
    expect(isBnuCaterpillarVisual(bad)).toBe(false);
});
it('keeps partial zero drafts, separate real activities and unscored reflections through schema one', () => {
  const now = '2026-10-04T00:00:00.000Z';
  const sessions = [tables, game].map((lesson) =>
    createSession(lesson, 'bnu-math-p1-upper-2024', 'child', { seed: 7, now }),
  );
  const draft = [0, ...Array.from({ length: 10 }, () => null)];
  required(
    sessions[0]?.responses.find((item) => item.questionId.endsWith('-add-10')),
  ).draft = draft;
  expect(() => evaluate(by(tables, 'add-10').rule, draft)).toThrow(
    'educationLearning.answerRequired',
  );
  const sparse = Array.from({ length: 11 }, (_, index) => index);
  Reflect.deleteProperty(sparse, '3');
  expect(() => evaluate(by(tables, 'add-10').rule, sparse)).toThrow(
    'educationLearning.answerRequired',
  );
  const data = {
    schemaVersion: 1 as const,
    profiles: [{ id: 'child', nickname: '隔离测试', createdAt: now }],
    activeProfileId: 'child',
    sessions,
  };
  expect(parseBackup(exportBackup(data, now)).data).toEqual(
    JSON.parse(JSON.stringify(data)),
  );
  for (const [lesson, total, manuals] of [
    [tables, 35, 6],
    [game, 34, 7],
  ] as const) {
    expect(lesson.questions).toHaveLength(total);
    expect(lesson.steps).toHaveLength(6);
    expect(
      lesson.questions.filter((item) => item.rule.kind === 'manual'),
    ).toHaveLength(manuals);
    expect(
      lesson.questions.filter((item) => item.rule.kind === 'reflection'),
    ).toHaveLength(2);
    for (const question of lesson.questions) {
      if (question.rule.kind === 'manual')
        expect(evaluate(question.rule, 'confirmed')).toBeNull();
      if (question.rule.kind === 'reflection')
        expect(evaluate(question.rule, '尚未实际做，准备下次做。')).toBeNull();
    }
    expect(lesson.reviewQuestions).toHaveLength(4);
  }
});
