import { expect, it } from 'vitest';

import { sujiaoCrossBalanceDraft as lesson } from '../content/sujiao-cross-balance';
import { exportBackup, parseBackup } from './backup';
import { isCrossBalanceModel, matchesCrossBalance } from './cross-balance';
import { createSession, evaluate, submitResponse, validAnswer } from './engine';
import { initialLibrary } from './storage';

function permutations(values: number[]): number[][] {
  if (values.length === 0) return [[]];
  return values.flatMap((value, i) =>
    permutations(values.filter((_, j) => i !== j)).map((rest) => [
      value,
      ...rest,
    ]),
  );
}
it('accepts all balanced permutations, including different centres, rather than a canonical solution', () => {
  for (const values of [
    [2, 4, 6, 8, 10],
    [3, 5, 7, 9, 11],
    [0, 1, 2, 3, 4],
  ]) {
    const model = { kind: 'cross-balance' as const, values };
    expect(isCrossBalanceModel(model)).toBe(true);
    let count = 0;
    const centres = new Set<number>();
    for (const placement of permutations(values)) {
      const vertical = placement[0]! + placement[2]! + placement[4]!;
      const horizontal = placement[1]! + placement[2]! + placement[3]!;
      const expected = vertical === horizontal;
      expect(evaluate(model, placement)).toBe(expected);
      if (expected) {
        count++;
        centres.add(placement[2]!);
      }
    }
    expect(count).toBe(24);
    expect([...centres].toSorted((a, b) => a - b)).toEqual([
      values[0],
      values[2],
      values[4],
    ]);
  }
  const model = { kind: 'cross-balance' as const, values: [2, 4, 6, 8, 10] };
  for (const placement of [
    [4, 6, 2, 8, 10],
    [2, 4, 6, 8, 10],
    [2, 4, 10, 6, 8],
  ])
    expect(evaluate(model, placement)).toBe(true);
  expect(evaluate(model, [2, 2, 6, 8, 8])).toBe(false); // Equal sums do not excuse missing/repeated cards.
  expect(evaluate(model, [2, 4, 6, 10, 8])).toBe(false);
  expect(evaluate(model, [-1, 4, 6, 8, 10])).toBe(false);
  expect(validAnswer(model, [null, 4, 6, 8, 10])).toBe(false);
  expect(validAnswer(model, [2, 4, 6, 8])).toBe(false);
  expect(
    evaluate(
      { kind: 'cross-balance', values: [0, 1, 2, 3, 4] },
      [1, 2, 0, 3, 4],
    ),
  ).toBe(true);
});
it('rejects impossible pools, sparse data, damaged enumeration and hidden answer fields', () => {
  const model = { kind: 'cross-balance', values: [2, 4, 6, 8, 10] };
  const sparse: number[] = [];
  sparse.length = 5;
  sparse[0] = 2;
  for (const bad of [
    null,
    [],
    { ...model, values: [2, 2, 6, 8, 10] },
    { ...model, values: [0, 1, 2, 4, 8] },
    { ...model, values: [2, 4, 6, 8] },
    { ...model, values: [2, 4, 6, 8, 21] },
    { ...model, values: [2, 4, 6, 8, 10.5] },
    { ...model, values: [2, 4, 6, 8, '10'] },
    { ...model, values: sparse },
    { ...model, answers: [4, 6, 2, 8, 10] },
  ])
    expect(isCrossBalanceModel(bad)).toBe(false);
  expect(
    matchesCrossBalance({ kind: 'cross-balance', values: [2, 4, 6, 8, 10] }, [
      2,
      4,
      6,
      8,
      '10',
    ]),
  ).toBe(false);
});
it('keeps the five positions distinct from counting the shared centre in both line sums', () => {
  expect(lesson.questions).toHaveLength(11);
  expect(lesson.reviewQuestions).toHaveLength(6);
  const main = lesson.questions;
  const review = lesson.reviewQuestions!;
  expect(evaluate(main[1]!.rule, 1)).toBe(true);
  expect(evaluate(main[2]!.rule, 5)).toBe(true);
  expect(evaluate(main[3]!.rule, [16, 16])).toBe(true);
  expect(evaluate(review[3]!.rule, [19, 19])).toBe(true);
  expect(evaluate(main[4]!.rule, 'no')).toBe(true);
  expect(evaluate(main[5]!.rule, 'both')).toBe(true);
  review.forEach((q, i) => {
    expect(q.prompt).not.toBe(main[i]!.prompt);
    expect(q.visual).not.toEqual(main[i]!.visual);
    expect(q.knowledge).toBe(main[i]!.knowledge);
  });
});
it('restores partial five-position drafts and wrong/equivalent-correct history with matching rule and diagram pools', () => {
  const library = initialLibrary('数阵');
  const s = createSession(
    lesson,
    'sujiao-math-p1-lower-9787574312951',
    library.activeProfileId,
  );
  const i = s.questions.findIndex((q) => q.rule.kind === 'cross-balance');
  s.responses[i]!.draft = [null, 4, 10, 6, 8];
  library.sessions.push(s);
  expect(
    parseBackup(exportBackup(library)).data.sessions[0]!.responses[i]!.draft,
  ).toEqual([null, 4, 10, 6, 8]);
  for (const draft of [
    [2, 4, 6, 10, 8],
    [2, 4, 10, 6, 8],
  ]) {
    s.responses[i]!.draft = draft;
    s.responses[i] = submitResponse(s.questions[i]!, s.responses[i]!);
  }
  expect(s.responses[i]!.submissions.map((a) => a.correct)).toEqual([
    false,
    true,
  ]);
  expect(parseBackup(exportBackup(library)).data.sessions[0]).toEqual(s);
  const bad = JSON.parse(exportBackup(library));
  bad.data.sessions[0].questions[i].visual.values = [3, 5, 7, 9, 11];
  expect(() => parseBackup(JSON.stringify(bad))).toThrow(Error);
  bad.data.sessions[0].questions[i].visual.values = [2, 4, 6, 8, 10];
  bad.data.sessions[0].responses[i].draft = [2, 4, 6, 8];
  expect(() => parseBackup(JSON.stringify(bad))).toThrow(Error);
  expect(
    s.responses
      .filter((_, j) => s.questions[j]!.rule.kind === 'manual')
      .every((r) => r.submissions.length === 0),
  ).toBe(true);
});
