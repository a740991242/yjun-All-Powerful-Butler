import type { ArithmeticGridVisual } from './types';

import { expect, it } from 'vitest';

import { sujiaoArithmeticTablesDraft as lesson } from '../content/sujiao-arithmetic-tables';
import {
  arithmeticAxes,
  arithmeticCell,
  isArithmeticGridVisual,
  sumFrequency,
} from './arithmetic-grid';
import { exportBackup, parseBackup } from './backup';
import { createSession, evaluate, statistics, submitResponse } from './engine';
import { fold } from './fold';
import { sparseArray } from './sparse-array';
import { initialLibrary } from './storage';
it('adds the complete 45 borrowing equations without changing the original 36-equation mode', () => {
  const axes = arithmeticAxes('borrow-complete');
  expect(axes.rows).toEqual([10, 11, 12, 13, 14, 15, 16, 17, 18]);
  expect(axes.columns).toEqual([9, 8, 7, 6, 5, 4, 3, 2, 1]);
  const expressions: string[] = [];
  axes.rows.forEach((minuend, row) => {
    axes.columns.forEach((subtrahend, column) => {
      const cell = arithmeticCell('borrow-complete', row, column);
      if (subtrahend > minuend - 10) {
        expect(cell).toEqual({
          expression: `${minuend}−${subtrahend}`,
          value: minuend - subtrahend,
        });
        expressions.push(cell!.expression);
      } else expect(cell).toBeNull();
    });
  });
  expect(expressions).toHaveLength(45);
  expect(new Set(expressions).size).toBe(45);
  expect(expressions).toContain('10−1');
  expect(expressions).toContain('10−9');
  expect(expressions).not.toContain('18−8');
  expect(arithmeticAxes('borrow-subtract')).toEqual({
    rows: [11, 12, 13, 14, 15, 16, 17, 18],
    columns: [9, 8, 7, 6, 5, 4, 3, 2],
  });
  const visual: ArithmeticGridVisual = {
    kind: 'arithmetic-grid',
    mode: 'borrow-complete',
    hidden: [
      [0, 0],
      [0, 8],
      [3, 4],
      [8, 0],
    ],
  };
  expect(isArithmeticGridVisual(visual)).toBe(true);
  expect(
    visual.hidden.map(([r, c]) => arithmeticCell(visual.mode, r, c)?.value),
  ).toEqual([1, 9, 8, 9]);
  for (const hidden of [
    [[8, 1]],
    [[9, 0]],
    [[0, 9]],
    [
      [0, 0],
      [0, 0],
    ],
  ])
    expect(isArithmeticGridVisual({ ...visual, hidden })).toBe(false);
  expect(isArithmeticGridVisual({ ...visual, marked: [9] })).toBe(false);
  expect(isArithmeticGridVisual({ ...visual, mode: ['borrow-complete'] })).toBe(
    false,
  );
});
it('covers exactly the 36 carry additions and 36 borrowing subtractions with independently checked scope', () => {
  const addition: string[] = [];
  const subtraction: string[] = [];
  for (let a = 2; a <= 9; a++)
    for (let b = 2; b <= 9; b++) if (a + b > 10) addition.push(`${a}+${b}`);
  for (let a = 11; a <= 18; a++)
    for (let b = 2; b <= 9; b++)
      if (a - b >= 2 && a - b <= 9) subtraction.push(`${a}−${b}`);
  for (const [mode, expected] of [
    ['carry-add', addition],
    ['borrow-subtract', subtraction],
  ] as const) {
    const actual: string[] = [];
    const axes = arithmeticAxes(mode);
    for (let r = 0; r < axes.rows.length; r++)
      for (let c = 0; c < axes.columns.length; c++) {
        const cell = arithmeticCell(mode, r, c);
        if (cell) actual.push(cell.expression);
      }
    expect(actual).toHaveLength(36);
    expect(actual.toSorted()).toEqual(expected.toSorted());
  }
  expect(arithmeticCell('carry-add', 5, 0)?.value).toBe(16);
  expect(arithmeticCell('carry-add', 5, 1)?.value).toBe(15);
  expect(arithmeticCell('borrow-subtract', 4, 0)?.value).toBe(6);
  expect(arithmeticCell('borrow-subtract', 4, 1)?.value).toBe(7);
  expect(arithmeticCell('carry-add', 0, 7)).toBeNull();
  expect(arithmeticCell('borrow-subtract', 7, 7)).toBeNull();
  expect(arithmeticCell('borrow-subtract', 0, 0)).toEqual({
    expression: '11−9',
    value: 2,
  });
});
it('checks all 81 sum cells and the full ordered-pair frequency distribution', () => {
  const histogram = new Map<number, number>();
  for (let r = 0; r < 9; r++)
    for (let c = 0; c < 9; c++) {
      const expected = r + 1 + (c + 1);
      expect(arithmeticCell('sum-grid', r, c)?.value).toBe(expected);
      histogram.set(expected, (histogram.get(expected) ?? 0) + 1);
    }
  expect(fold([...histogram.values()], 0, (a, b) => a + b)).toBe(81);
  const counts = [1, 2, 3, 4, 5, 6, 7, 8, 9, 8, 7, 6, 5, 4, 3, 2, 1];
  counts.forEach((count, i) => {
    expect(histogram.get(i + 2)).toBe(count);
    expect(sumFrequency(i + 2)).toBe(count);
  });
  expect(sumFrequency(1)).toBe(0);
  expect(sumFrequency(19)).toBe(0);
});
it('rejects wrong modes, sparse or duplicate positions, outside-scope blanks and extra answer fields', () => {
  const model: ArithmeticGridVisual = {
    kind: 'arithmetic-grid',
    mode: 'carry-add',
    hidden: [[3, 2]],
  };
  expect(isArithmeticGridVisual(model)).toBe(true);
  for (const hidden of [
    [[0, 7]],
    [[8, 0]],
    [[0, 8]],
    [[-1, 0]],
    [[1.5, 2]],
    [
      [3, 2],
      [3, 2],
    ],
    [[3]],
    sparseArray(1),
    Array.from({ length: 7 }, (_n, column) => [7, column]),
  ])
    expect(isArithmeticGridVisual({ ...model, hidden })).toBe(false);
  for (const marked of [
    [],
    [1],
    [19],
    [10.5],
    [10, 10],
    sparseArray(1),
    [2, 3, 4, 5],
  ])
    expect(
      isArithmeticGridVisual({
        kind: 'arithmetic-grid',
        mode: 'sum-grid',
        hidden: [],
        marked,
      }),
    ).toBe(false);
  expect(isArithmeticGridVisual({ ...model, marked: [12] })).toBe(false);
  expect(isArithmeticGridVisual({ ...model, mode: 'multiplication' })).toBe(
    false,
  );
  expect(isArithmeticGridVisual({ ...model, answer: '7+5' })).toBe(false);
  expect(
    isArithmeticGridVisual({
      kind: 'arithmetic-grid',
      mode: 'sum-grid',
      hidden: [[0, 0]],
      marked: [6, 13],
    }),
  ).toBe(true);
});
it('checks masked expression positions, complete-table frequencies and tied least sums in both task sets', () => {
  for (const [review, questions] of [
    [false, lesson.questions],
    [true, lesson.reviewQuestions!],
  ] as const) {
    const q = (suffix: string) =>
      questions.find(
        (q) => q.id === `${lesson.id}-${review ? 'r' : 'q'}-${suffix}`,
      )!;
    for (const suffix of ['missing-add', 'missing-subtract']) {
      const item = q(suffix);
      if (item.visual?.kind !== 'arithmetic-grid')
        throw new Error('missing grid');
      const [r, c] = item.visual.hidden[0]!;
      const formula = arithmeticCell(item.visual.mode, r, c)!.expression;
      expect(
        item.choices!.filter((choice) => choice.label === formula),
      ).toHaveLength(1);
      expect(
        evaluate(
          item.rule,
          item.choices!.find((choice) => choice.label === formula)!.id,
        ),
      ).toBe(true);
    }
    expect(evaluate(q('marked-count').rule, review ? 8 : 9)).toBe(true);
    expect(evaluate(q('two-counts').rule, review ? [6, 5] : [5, 6])).toBe(true);
    expect(evaluate(q('most').rule, '10')).toBe(true);
    expect(evaluate(q('least').rule, ['18', '2'])).toBe(true);
    expect(evaluate(q('least').rule, ['2'])).toBe(false);
    expect(evaluate(q('ordered').rule, 2)).toBe(true);
    expect(evaluate(q('ordered').rule, 1)).toBe(false);
    expect(evaluate(q('outside').rule, 'yes')).toBe(false);
  }
  expect(
    lesson.questions.filter(
      (q) => q.rule.kind !== 'manual' && q.rule.kind !== 'reflection',
    ),
  ).toHaveLength(12);
  expect(
    lesson.reviewQuestions!.filter((q) => q.rule.kind !== 'reflection'),
  ).toHaveLength(12);
  expect(lesson.status).toBe('preparing');
});
it('retains the table snapshot, wrong-first counts, partial inputs and separate paper activities through backup', () => {
  const state = initialLibrary('表格测试');
  const session = createSession(
    lesson,
    'unregistered-sujiao-lower-draft',
    state.activeProfileId,
  );
  session.phase = 'practice';
  const i = session.questions.findIndex((q) =>
    q.id.endsWith('-q-marked-count'),
  );
  const q = session.questions[i]!;
  session.responses[i]!.draft = 5;
  session.responses[i] = submitResponse(q, session.responses[i]!);
  session.responses[i]!.draft = 9;
  session.responses[i] = submitResponse(q, session.responses[i]!);
  const partial = session.questions.findIndex((q) =>
    q.id.endsWith('-q-two-counts'),
  );
  session.responses[partial]!.draft = [5, null];
  state.sessions.push(session);
  expect(parseBackup(exportBackup(state)).data.sessions[0]).toEqual(session);
  expect(session.responses[i]!.submissions.map((s) => s.correct)).toEqual([
    false,
    true,
  ]);
  expect(statistics(session).manual).toBe(0);
  const damaged = structuredClone(state);
  const visual = damaged.sessions[0]!.questions[i]!.visual;
  if (visual?.kind !== 'arithmetic-grid') throw new Error('missing grid');
  visual.hidden = [[10, 0]];
  expect(() => parseBackup(exportBackup(damaged))).toThrow(Error);
});
