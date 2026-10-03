import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  drawSixCard,
  isBnuSixCardGameVisual,
  newSixCardRound,
  sixCardStatus,
  sixCardTotal,
  stopSixCard,
} from '../learning/bnu-six-card-game';
import { createSession, evaluate } from '../learning/engine';
import { required } from '../learning/required';
import { bnuSixCardGameLesson as lesson } from './bnu-six-card-game';

const by = (suffix: string) =>
  required(
    lesson.questions.find((item) => item.id === `${lesson.id}-${suffix}`),
  );
function drawValue(round: ReturnType<typeof newSixCardRound>, value: number) {
  return required(
    drawSixCard(
      round,
      round.deck.findIndex((card) => card.value === value),
    ),
  );
}
it('deals from exactly twenty distinct cards without replacement or mutating the original round', () => {
  const initial = newSixCardRound();
  expect(initial.deck).toHaveLength(20);
  expect(new Set(initial.deck.map((card) => card.id)).size).toBe(20);
  for (let value = 1; value <= 5; value++)
    expect(initial.deck.filter((card) => card.value === value)).toHaveLength(4);
  const a = drawValue(initial, 3);
  const b = drawValue(a, 3);
  expect(sixCardTotal(b)).toBe(6);
  expect(b.hand[0]?.id).not.toBe(b.hand[1]?.id);
  expect(b.deck).toHaveLength(18);
  expect(initial.deck).toHaveLength(20);
  expect(initial.hand).toEqual([]);
  expect(new Set([...b.deck, ...b.hand].map((card) => card.id)).size).toBe(20);
  expect(
    b.deck.some((card) => b.hand.some((held) => held.id === card.id)),
  ).toBe(false);
  for (const index of [-1, 20, 1.5, Number.NaN, Number.POSITIVE_INFINITY])
    expect(() => drawSixCard(initial, index)).toThrow(
      'educationLearning.invalidRecord',
    );
});
it('checks every one-to-three-card sequence, including the equal-six boundary, overshooting and the three-card quota', () => {
  for (let a = 1; a <= 5; a++)
    for (let b = 1; b <= 5; b++)
      for (let c = 1; c <= 5; c++) {
        const initial = newSixCardRound();
        const first = drawValue(initial, a);
        expect(sixCardStatus(first)).toBe('active');
        const second = drawValue(first, b);
        expect(sixCardTotal(second)).toBe(a + b);
        expect(sixCardStatus(second)).toBe(a + b > 6 ? 'out' : 'active');
        if (a + b > 6) expect(drawSixCard(second, 0)).toBeNull();
        else {
          const third = drawValue(second, c);
          expect(sixCardTotal(third)).toBe(a + b + c);
          expect(sixCardStatus(third)).toBe(a + b + c > 6 ? 'out' : 'finished');
          expect(drawSixCard(third, 0)).toBeNull();
          expect(third.hand).toHaveLength(3);
        }
      }
  const six = drawValue(drawValue(newSixCardRound(), 3), 3);
  expect(sixCardStatus(six)).toBe('active');
  const stopped = stopSixCard(six);
  expect(sixCardStatus(stopped)).toBe('finished');
  expect(drawSixCard(stopped, 0)).toBeNull();
  expect(six.stopped).toBe(false);
  expect(sixCardTotal(drawValue(six, 5))).toBe(11);
  expect(sixCardStatus(drawValue(six, 5))).toBe('out');
});
it('keeps valid winners, joint winners, unknown next cards and total-versus-card-count distinct', () => {
  expect(lesson.steps).toHaveLength(6);
  expect(lesson.questions).toHaveLength(29);
  expect(
    lesson.questions.filter((item) => item.rule.kind === 'manual'),
  ).toHaveLength(6);
  expect(
    lesson.questions.filter((item) => item.rule.kind === 'reflection'),
  ).toHaveLength(2);
  for (const [suffix, answer] of [
    ['first-trial', [3, 5]],
    ['third-legal', [1, 5, 6]],
    ['third-out', [1, 5, 7]],
    ['count-vs-total', [3, 5]],
  ] as const)
    expect(evaluate(by(suffix).rule, [...answer])).toBe(true);
  expect(evaluate(by('joint').rule, ['乙', '丙'])).toBe(true);
  expect(evaluate(by('joint').rule, ['甲', '乙', '丙'])).toBe(false);
  expect(evaluate(by('legal-next').rule, ['1', '2'])).toBe(true);
  expect(evaluate(by('legal-next').rule, ['1', '2', '3'])).toBe(false);
  for (const [suffix, answer] of [
    ['winner', '丁'],
    ['larger-out', '甲'],
    ['not-more-cards', '乙'],
    ['unknown', '不能断定'],
    ['used-three', '不可以'],
    ['out-stop', '不可以'],
    ['equal', '未出局'],
    ['early-stop', '可以停止'],
  ] as const)
    expect(evaluate(by(suffix).rule, answer)).toBe(true);
  expect(lesson.reviewQuestions).toHaveLength(4);
  expect(evaluate(required(lesson.reviewQuestions?.[1]).rule, ['A', 'C'])).toBe(
    true,
  );
  expect(
    evaluate(required(lesson.reviewQuestions?.[1]).rule, ['乙', '丙']),
  ).toBe(false);
  for (const question of lesson.questions) {
    if (question.rule.kind === 'manual')
      expect(evaluate(question.rule, 'confirmed')).toBeNull();
    if (question.rule.kind === 'reflection')
      expect(evaluate(question.rule, '还没有真实玩，准备以后做。')).toBeNull();
  }
});
it('preserves partial zero drafts and strictly validates the demonstration marker in unchanged schema-one backups', () => {
  const now = '2026-10-04T00:00:00.000Z';
  const session = createSession(lesson, 'bnu-math-p1-upper-2024', 'child', {
    seed: 11,
    now,
  });
  required(
    session.responses.find((response) =>
      response.questionId.endsWith('-third-legal'),
    ),
  ).draft = [0, null, null];
  expect(() => evaluate(by('third-legal').rule, [0, null, null])).toThrow(
    'educationLearning.answerRequired',
  );
  required(session.questions[0]).visual = { kind: 'bnu-six-card-game' };
  const data = {
    schemaVersion: 1 as const,
    profiles: [{ id: 'child', nickname: '隔离测试', createdAt: now }],
    activeProfileId: 'child',
    sessions: [session],
  };
  const serialized = exportBackup(data, now);
  expect(parseBackup(serialized).data).toEqual(
    JSON.parse(JSON.stringify(data)),
  );
  expect(serialized).toContain('"kind": "bnu-six-card-game"');
  expect(() =>
    parseBackup(
      serialized.replace(
        '"kind": "bnu-six-card-game"',
        '"kind": "bnu-six-card-game", "answer": 6',
      ),
    ),
  ).toThrow('educationLearning.invalidBackup');
  expect(isBnuSixCardGameVisual({ kind: 'bnu-six-card-game' })).toBe(true);
  for (const bad of [
    null,
    [],
    {},
    { kind: 'other' },
    { kind: 'bnu-six-card-game', answer: 6 },
  ])
    expect(isBnuSixCardGameVisual(bad)).toBe(false);
});
