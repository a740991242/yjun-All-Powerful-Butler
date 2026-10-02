import type { Answer } from './types';

import { expect, it } from 'vitest';

import { sujiaoPracticalProblemsDraft as lesson } from '../content/sujiao-practical-problems';
import { exportBackup, parseBackup } from './backup';
import { createSession, evaluate, submitResponse } from './engine';
import { isStockTableVisual, stockRows } from './stock-table';
import { initialLibrary } from './storage';

it('provides independent within-twenty main and review quantities without storing answers', () => {
  for (const [variant, expected] of [
    [
      'within-twenty',
      [
        [12, 7],
        [14, 8],
        [16, 9],
      ],
    ],
    [
      'within-twenty-review',
      [
        [13, 8],
        [15, 9],
        [17, 8],
      ],
    ],
  ] as const) {
    const visual = { kind: 'stock-table' as const, variant };
    expect(isStockTableVisual(visual)).toBe(true);
    const rows = stockRows(visual);
    expect(rows.map((r) => [r.initial, r.sold])).toEqual(expected);
    expect(rows.map((r) => r.unit)).toEqual(['sheets', 'sheets', 'pieces']);
    for (const row of rows) {
      expect(row.initial).toBeLessThanOrEqual(20);
      expect(row.sold).toBeLessThan(row.initial);
      expect(row).not.toHaveProperty('remaining');
    }
    expect(isStockTableVisual({ ...visual, remaining: [5, 6, 7] })).toBe(false);
    rows[0]!.initial = 0;
    expect(stockRows(visual).map((r) => [r.initial, r.sold])).toEqual(expected);
  }
});

it('keeps only original/sold quantities in fixed source rows and never supplies a remaining answer column', () => {
  const main = stockRows({ kind: 'stock-table', variant: 'main' });
  const review = stockRows({ kind: 'stock-table', variant: 'review' });
  expect(main.map((r) => [r.id, r.initial, r.sold])).toEqual([
    ['A', 43, 7],
    ['B', 30, 6],
    ['C', 52, 9],
  ]);
  expect(review.map((r) => [r.id, r.initial, r.sold])).toEqual([
    ['A', 64, 8],
    ['B', 40, 7],
    ['C', 71, 6],
  ]);
  expect(main.map((r) => r.unit)).toEqual(['sheets', 'sheets', 'pieces']);
  for (const row of [...main, ...review]) {
    expect(Object.keys(row).toSorted()).toEqual([
      'id',
      'initial',
      'item',
      'sold',
      'unit',
    ]);
    expect(row.sold).toBeLessThanOrEqual(row.initial);
  }
  main[0]!.initial = 1;
  expect(stockRows({ kind: 'stock-table', variant: 'main' })[0]!.initial).toBe(
    43,
  );
  for (const invalid of [
    null,
    [],
    { kind: 'stock-table', variant: ['main'] },
    { kind: 'stock-table', variant: 'other' },
    { kind: 'stock-table', variant: 'main', remaining: [36, 24, 43] },
    { kind: 'stock-table' },
  ])
    expect(isStockTableVisual(invalid)).toBe(false);
});
it('independently checks stock row alignment, exact capacity, zero shortfall and sufficient conditions', () => {
  const main: Answer[] = [
    [36, 24, 43],
    '0',
    '0',
    '1',
    1,
    9,
    '0',
    '0',
    '0',
    31,
    35,
    28,
    ['sum', 'difference'],
  ];
  const review: Answer[] = [
    [56, 33, 65],
    '0',
    '0',
    '0',
    0,
    17,
    '0',
    '0',
    '0',
    43,
    52,
    44,
    ['sum', 'difference'],
  ];
  expect(lesson.questions).toHaveLength(18);
  expect(lesson.reviewQuestions).toHaveLength(13);
  lesson.questions
    .slice(0, 13)
    .forEach((q, i) => expect(evaluate(q.rule, main[i]!)).toBe(true));
  lesson.reviewQuestions!.forEach((q, i) => {
    expect(evaluate(q.rule, review[i]!)).toBe(true);
    expect(q.knowledge).toBe(lesson.questions[i]!.knowledge);
    expect(q.prompt).not.toBe(lesson.questions[i]!.prompt);
    if (q.visual) expect(q.visual).not.toEqual(lesson.questions[i]!.visual);
  });
  expect(evaluate(lesson.questions[0]!.rule, [36, 24, 45])).toBe(false); // C cannot subtract A's 7.
  expect(evaluate(lesson.questions[7]!.rule, '2')).toBe(false);
  expect(evaluate(lesson.questions[8]!.rule, '1')).toBe(false);
  expect(evaluate(lesson.questions[12]!.rule, ['sum'])).toBe(false);
  expect(evaluate(lesson.reviewQuestions![4]!.rule, 0)).toBe(true);
  expect(evaluate(lesson.reviewQuestions![4]!.rule, 1)).toBe(false);
});
it('preserves partial letter-labelled drafts and incorrect cross-row subtraction through backup without filling the readonly table', () => {
  const library = initialLibrary('应用题');
  const s = createSession(
    lesson,
    'sujiao-math-p1-lower-9787574312951',
    library.activeProfileId,
  );
  const i = s.questions.findIndex((q) => q.id.endsWith('-q-table'));
  s.responses[i]!.draft = [36, null, 43];
  library.sessions.push(s);
  expect(
    parseBackup(exportBackup(library)).data.sessions[0]!.responses[i]!.draft,
  ).toEqual([36, null, 43]);
  for (const draft of [
    [36, 24, 45],
    [36, 24, 43],
  ]) {
    s.responses[i]!.draft = draft;
    s.responses[i] = submitResponse(s.questions[i]!, s.responses[i]!);
  }
  expect(s.responses[i]!.submissions.map((r) => r.correct)).toEqual([
    false,
    true,
  ]);
  expect(parseBackup(exportBackup(library)).data.sessions[0]).toEqual(s);
  const bad = JSON.parse(exportBackup(library));
  bad.data.sessions[0].questions[i].visual.remaining = [36, 24, 43];
  expect(() => parseBackup(JSON.stringify(bad))).toThrow(Error);
  expect(
    s.responses
      .filter(
        (_, j) =>
          s.questions[j]!.rule.kind === 'manual' ||
          s.questions[j]!.rule.kind === 'reflection',
      )
      .every((r) => r.submissions.length === 0),
  ).toBe(true);
});
