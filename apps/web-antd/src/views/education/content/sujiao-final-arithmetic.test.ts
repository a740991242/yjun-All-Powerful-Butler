import { expect, it } from 'vitest';

import { exportBackup, isLibraryState, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import {
  isQuantityTableVisual,
  quantityTableMissing,
} from '../learning/quantity-table';
import { initialLibrary } from '../learning/storage';
import { sujiaoFinalArithmeticLesson as lesson } from './sujiao-final-arithmetic';
it('checks every permitted integer against all six strict inequalities', () => {
  for (const [review, questions] of [
    [false, lesson.questions],
    [true, lesson.reviewQuestions!],
  ] as const) {
    const conditions: [string, number, (x: number) => boolean][] = [
      ['max-add', 10, (x) => (review ? 5 : 4) + x < 10],
      ['max-subtract', 10, (x) => 10 - x > (review ? 4 : 2)],
      ['max-two-sides', 9, (x) => 10 + x < (review ? 12 : 11) + 3],
    ];
    for (const [suffix, limit, condition] of conditions) {
      const q = questions.find(
        (item) => item.id === `${lesson.id}-${review ? 'r' : 'q'}-${suffix}`,
      )!;
      const possible = Array.from({ length: limit + 1 }, (_, x) => x);
      const maximum = Math.max(...possible.filter((item) => condition(item)));
      for (const x of possible) {
        expect(evaluate(q.rule, x), `${q.id}: ${x}`).toBe(x === maximum);
      }
      expect(condition(maximum)).toBe(true);
      expect(condition(maximum + 1)).toBe(false);
    }
  }
});

it('checks strict maxima and keeps extraneous category counts out of the answer', () => {
  const main = lesson.questions;
  const maximum = main.find((q) => q.id.endsWith('-q-max-add'))!;
  expect(evaluate(maximum.rule, 5)).toBe(true);
  expect(evaluate(maximum.rule, 6)).toBe(false);
  expect(main.find((q) => q.id.endsWith('-q-max-subtract'))?.rule).toEqual({
    kind: 'number',
    value: 7,
  });
  expect(main.find((q) => q.id.endsWith('-q-max-two-sides'))?.rule).toEqual({
    kind: 'number',
    value: 3,
  });
  const one = main.find((q) => q.id.endsWith('-q-one-kind'))!;
  expect(evaluate(one.rule, 4)).toBe(true);
  expect(evaluate(one.rule, 6)).toBe(false);
  expect(main.filter((q) => q.rule.kind !== 'manual')).toHaveLength(19);
  expect(lesson.reviewQuestions).toHaveLength(19);
});
it('validates each independent column and preserves first table error and partial drafts', () => {
  for (const tasks of [lesson.questions, lesson.reviewQuestions!]) {
    const q = tasks.find((q) => q.id.endsWith('-table'))!;
    if (q.visual?.kind !== 'quantity-table') throw new Error('missing table');
    expect(isQuantityTableVisual(q.visual)).toBe(true);
    expect(q.rule).toEqual({
      kind: 'steps',
      values: quantityTableMissing(q.visual),
    });
  }
  const state = initialLibrary('测试');
  const s = createSession(
    lesson,
    'sujiao-math-p1-upper-2024',
    state.activeProfileId,
  );
  const index = s.questions.findIndex((q) => q.id.endsWith('-q-table'));
  const q = s.questions[index]!;
  const r = s.responses[index]!;
  r.draft = [8, 5, null];
  state.sessions.push(s);
  expect(parseBackup(exportBackup(state)).data).toEqual(state);
  r.draft = [8, 5, 8];
  s.responses[index] = submitResponse(q, r);
  s.responses[index]!.draft = [8, 5, 6];
  s.responses[index] = submitResponse(q, s.responses[index]!);
  expect(s.responses[index]!.submissions.map((x) => x.correct)).toEqual([
    false,
    true,
  ]);
  expect(parseBackup(exportBackup(state)).data).toEqual(state);
  const bad = structuredClone(state);
  Object.assign(bad.sessions[0]!.questions[index]!.visual!, {
    values: [
      [3, null, 2],
      [5, null, null],
      [null, 9, 8],
    ],
  });
  expect(isLibraryState(bad)).toBe(false);
});
