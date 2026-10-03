import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate } from '../learning/engine';
import { isEqualPairsRule, matchesEqualPairs } from '../learning/equal-pairs';
import { required } from '../learning/required';
import { bnuTenPartitionsLesson as lesson } from './bnu-ten';

const q = (suffix: string) =>
  required(lesson.questions.find((item) => item.id.endsWith(`-${suffix}`)));
function* permutations(values: number[]): Generator<number[]> {
  if (values.length === 0) {
    yield [];
    return;
  }
  for (const [i, n] of values.entries())
    for (const tail of permutations(values.filter((_, j) => j !== i)))
      yield [n, ...tail];
}
it('accepts exactly all equal-pair permutations for both card sets, not one example', () => {
  for (const start of [0, 1]) {
    const cards = Array.from({ length: 8 }, (_, n) => n + start);
    const rule = { kind: 'equal-pairs' as const, values: cards };
    let correct = 0;
    for (const answer of permutations(cards)) {
      const sums = [0, 2, 4, 6].map(
        (i) => required(answer[i]) + required(answer[i + 1]),
      );
      const expected = sums.every((sum) => sum === sums[0]);
      expect(matchesEqualPairs(rule, answer)).toBe(expected);
      if (expected) correct++;
    }
    expect(correct).toBe(384);
    expect(matchesEqualPairs(rule, [1, 8, 1, 8, 1, 8, 1, 8])).toBe(false);
    const holes = Array.from({ length: 8 }, (_, n) => n + start);
    Reflect.deleteProperty(holes, '0');
    expect(matchesEqualPairs(rule, holes)).toBe(false);
    expect(isEqualPairsRule({ kind: 'equal-pairs', values: holes })).toBe(
      false,
    );
    expect(isEqualPairsRule({ ...rule, answer: [] })).toBe(false);
  }
  expect(
    isEqualPairsRule({ kind: 'equal-pairs', values: [0, 1, 2, 3, 4, 5, 6, 8] }),
  ).toBe(false);
  expect(evaluate(q('pairs').rule, [8, 1, 6, 3, 2, 7, 5, 4])).toBe(true);
  expect(evaluate(q('pairs').rule, [1, 2, 3, 4, 5, 6, 7, 8])).toBe(false);
  expect(() => evaluate(q('pairs').rule, [1, null, 2, 7, 3, 6, 4, 5])).toThrow(
    'educationLearning.answerRequired',
  );
});
it('checks all eleven ordered partitions and both zero endpoints plus every independent calculation', () => {
  for (const [suffix, answer] of [
    ['parts', Array.from({ length: 11 }, (_, n) => 10 - n)],
    ['add', Array.from({ length: 11 }, () => 10)],
    ['subtract', Array.from({ length: 11 }, (_, n) => 10 - n)],
    ['both-parts', [10, 10, 8, 2]],
    ['eight', [7, 5, 10, 6, 4, 10, 10, 10]],
    ['missing', [1, 2, 7, 0]],
  ] as const) {
    expect(evaluate(q(suffix).rule, [...answer])).toBe(true);
    for (let field = 0; field < answer.length; field++) {
      const wrong = [...answer];
      wrong[field] = required(wrong[field]) + 1;
      expect(evaluate(q(suffix).rule, wrong)).toBe(false);
    }
  }
  expect(evaluate(q('q1').rule, 0)).toBe(true);
  expect(evaluate(q('count').rule, 11)).toBe(false);
  expect(evaluate(q('stairs').rule, 2)).toBe(true);
  expect(evaluate(q('unknown').rule, '能')).toBe(false);
});
it('strictly preserves eight-card and eleven-part partial drafts and rejects additional rule fields', () => {
  const now = '2026-10-03T00:00:00.000Z';
  const session = createSession(lesson, 'bnu-math-p1-upper-2024', 'child', {
    seed: 55,
    now,
  });
  required(
    session.responses.find((item) => item.questionId.endsWith('-pairs')),
  ).draft = [1, null, null, null, null, null, null, 8];
  required(
    session.responses.find((item) => item.questionId.endsWith('-parts')),
  ).draft = [0, null, null, null, null, null, null, null, null, null, 0];
  const data = {
    schemaVersion: 1 as const,
    profiles: [{ id: 'child', nickname: '隔离测试', createdAt: now }],
    activeProfileId: 'child',
    sessions: [session],
  };
  expect(parseBackup(exportBackup(data, now)).data).toEqual(
    JSON.parse(JSON.stringify(data)),
  );
  const raw = JSON.parse(exportBackup(data, now));
  const card = raw.data.sessions[0].questions.find(
    (item: { rule: { kind: string } }) => item.rule.kind === 'equal-pairs',
  );
  card.rule.answer = [1, 8, 2, 7, 3, 6, 4, 5];
  expect(() => parseBackup(JSON.stringify(raw))).toThrow(
    'educationLearning.invalidBackup',
  );
});
it('keeps actual tasks and reflections unscored, with four fresh review conditions', () => {
  expect(lesson.questions).toHaveLength(19);
  expect(lesson.steps).toHaveLength(6);
  const actual = lesson.questions.filter((item) => item.rule.kind === 'manual');
  expect(actual).toHaveLength(6);
  for (const task of actual)
    expect(evaluate(task.rule, 'confirmed')).toBeNull();
  for (const task of lesson.questions.filter(
    (item) => item.rule.kind === 'reflection',
  ))
    expect(evaluate(task.rule, '实际方法')).toBeNull();
  const fresh = required(lesson.reviewQuestions);
  expect(fresh).toHaveLength(4);
  expect(evaluate(required(fresh[0]).rule, [0, 3, 6, 9])).toBe(true);
  expect(evaluate(required(fresh[1]).rule, [4, 7, 5, 10])).toBe(true);
  expect(evaluate(required(fresh[2]).rule, 4)).toBe(true);
  expect(evaluate(required(fresh[3]).rule, [7, 0, 6, 1, 5, 2, 4, 3])).toBe(
    true,
  );
});
