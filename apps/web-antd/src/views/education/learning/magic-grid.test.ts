import type { MagicCells } from './types';

import { expect, it } from 'vitest';

import { sujiaoMagicGridDraft as lesson } from '../content/sujiao-magic-grid';
import { exportBackup, parseBackup } from './backup';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
  validAnswer,
} from './engine';
import {
  isMagicCells,
  isMagicGridRule,
  isMagicGridVisual,
  magicSolutions,
  matchesMagicGrid,
} from './magic-grid';
import { sparseArray } from './sparse-array';
import { initialLibrary } from './storage';
const center: MagicCells = [
  [null, null, null],
  [null, 5, null],
  [null, null, null],
];
it('independently enumerates 9! placements and accepts exactly all eight legal completions', () => {
  const legal: number[][] = [];
  const slots: number[] = [];
  function visit(mask: number) {
    if (slots.length === 9) {
      const [a, b, c, d, e, f, g, h, i] = slots as [
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
      ];
      if (
        a + b + c === 15 &&
        d + e + f === 15 &&
        g + h + i === 15 &&
        a + d + g === 15 &&
        b + e + h === 15 &&
        c + f + i === 15 &&
        a + e + i === 15 &&
        c + e + g === 15
      )
        legal.push([...slots]);
      return;
    }
    for (let n = 1; n <= 9; n++)
      if (!(mask & (1 << n))) {
        slots.push(n);
        visit(mask | (1 << n));
        slots.pop();
      }
  }
  visit(0);
  expect(legal).toHaveLength(8);
  const expected = legal.map((grid) => grid.filter((_n, index) => index !== 4));
  expect(
    magicSolutions(center)
      .map((v) => JSON.stringify(v))
      .toSorted(),
  ).toEqual(expected.map((v) => JSON.stringify(v)).toSorted());
  for (const answer of expected)
    expect(evaluate({ kind: 'magic-grid', cells: center }, answer)).toBe(true);
  expect(
    magicSolutions([
      [4, null, null],
      [null, 5, null],
      [null, null, null],
    ]),
  ).toHaveLength(2);
});
it('requires both diagonals, distinct 1–9 values and all blanks; it does not treat blanks as zero', () => {
  const incorrect: MagicCells = [
    [null, null, null],
    [null, 3, null],
    [null, null, null],
  ];
  const rowsColumnsOnly = [1, 5, 9, 8, 4, 6, 7, 2];
  expect(matchesMagicGrid(incorrect, rowsColumnsOnly)).toBe(false);
  expect(
    matchesMagicGrid(
      center,
      Array.from({ length: 8 }, () => 5),
    ),
  ).toBe(false);
  const correct = magicSolutions(center)[0]!;
  expect(
    evaluate({ kind: 'magic-grid', cells: center }, [0, ...correct.slice(1)]),
  ).toBe(false);
  expect(
    evaluate({ kind: 'magic-grid', cells: center }, [-1, ...correct.slice(1)]),
  ).toBe(false);
  expect(
    validAnswer({ kind: 'magic-grid', cells: center }, [
      null,
      ...correct.slice(1),
    ]),
  ).toBe(false);
  expect(
    validAnswer({ kind: 'magic-grid', cells: center }, sparseArray(8)),
  ).toBe(false);
  expect(matchesMagicGrid(center, [...correct, 1])).toBe(false);
});
it('strictly bounds models and feasibility while allowing complete lecture diagrams', () => {
  expect(isMagicGridVisual({ kind: 'magic-grid', cells: center })).toBe(true);
  expect(isMagicGridRule({ kind: 'magic-grid', cells: center })).toBe(true);
  const full: MagicCells = [
    [8, 1, 6],
    [3, 5, 7],
    [4, 9, 2],
  ];
  expect(isMagicGridVisual({ kind: 'magic-grid', cells: full })).toBe(true);
  expect(isMagicGridRule({ kind: 'magic-grid', cells: full })).toBe(false);
  for (const cells of [
    [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ],
    [
      [null, null, null],
      [null, 6, null],
      [null, null, null],
    ],
    [
      [8, null, 8],
      [null, 5, null],
      [null, null, null],
    ],
    [
      [0, null, null],
      [null, 5, null],
      [null, null, null],
    ],
    [
      [10, null, null],
      [null, 5, null],
      [null, null, null],
    ],
    [
      [1.5, null, null],
      [null, 5, null],
      [null, null, null],
    ],
    [
      [8, null],
      [null, 5, null],
      [null, null, null],
    ],
    [sparseArray(3), [null, 5, null], [null, null, null]],
    sparseArray(3),
    [
      [1, 5, 9],
      [8, 3, 4],
      [6, 7, 2],
    ],
  ])
    expect(isMagicGridVisual({ kind: 'magic-grid', cells })).toBe(false);
  expect(
    isMagicCells([
      [8, null, null],
      [null, 5, null],
      [null, null, null],
    ]),
  ).toBe(true);
  expect(
    isMagicGridVisual({
      kind: 'magic-grid',
      cells: center,
      answers: magicSolutions(center),
    }),
  ).toBe(false);
});
it('preserves partial input and first errors and refuses mismatched models, invalid drafts and forged scores', () => {
  const state = initialLibrary('九宫格测试');
  const session = createSession(
    lesson,
    'unregistered-sujiao-lower-draft',
    state.activeProfileId,
  );
  session.phase = 'practice';
  const index = session.questions.findIndex((q) => q.id.endsWith('-q-fill-2'));
  const q = session.questions[index]!;
  const answers = magicSolutions(center);
  session.responses[index]!.draft = Array.from({ length: 8 }, () => 5);
  session.responses[index] = submitResponse(q, session.responses[index]!);
  for (const answer of [answers[0]!, answers[1]!]) {
    session.responses[index]!.draft = answer;
    session.responses[index] = submitResponse(q, session.responses[index]!);
  }
  const partial = session.questions.findIndex((q) =>
    q.id.endsWith('-q-fill-0'),
  );
  session.responses[partial]!.draft = [1, null, null, null];
  state.sessions.push(session);
  expect(parseBackup(exportBackup(state)).data.sessions[0]).toEqual(session);
  expect(session.responses[index]!.submissions.map((s) => s.correct)).toEqual([
    false,
    true,
    true,
  ]);
  expect(statistics(session).manual).toBe(0);
  for (const mutate of [
    (s: typeof session) => {
      s.questions[index]!.visual = {
        kind: 'magic-grid',
        cells: [
          [4, null, null],
          [null, 5, null],
          [null, null, null],
        ],
      };
    },
    (s: typeof session) => {
      delete s.questions[index]!.visual;
    },
    (s: typeof session) => {
      s.responses[partial]!.draft = [1, null];
    },
    (s: typeof session) => {
      s.responses[partial]!.draft = ['1', 'A', 'B', 'C'];
    },
    (s: typeof session) => {
      s.responses[index]!.submissions[0]!.correct = true;
    },
  ]) {
    const changed = structuredClone(state);
    mutate(changed.sessions[0]!);
    expect(() => parseBackup(exportBackup(changed))).toThrow(Error);
  }
});
it('keeps nine objective tasks and changed reviews as drafts, with physical activities distinct', () => {
  for (const tasks of [lesson.questions, lesson.reviewQuestions!])
    for (const q of tasks) {
      if (q.rule.kind !== 'magic-grid') continue;
      expect(isMagicGridRule(q.rule)).toBe(true);
      expect(q.visual).toEqual({ kind: 'magic-grid', cells: q.rule.cells });
      for (const filling of magicSolutions(q.rule.cells))
        expect(evaluate(q.rule, filling)).toBe(true);
    }
  expect(lesson.questions.filter((q) => q.rule.kind !== 'manual')).toHaveLength(
    9,
  );
  expect(lesson.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
    3,
  );
  expect(lesson.reviewQuestions).toHaveLength(9);
  expect(lesson.status).toBe('preparing');
});
