import type { NumberTowerVisual, TowerRows } from './types';

import { expect, it } from 'vitest';

import { sujiaoNumberTowersDraft as lesson } from '../content/sujiao-number-towers';
import { exportBackup, parseBackup } from './backup';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
  validAnswer,
} from './engine';
import {
  isNumberTowerVisual,
  isTowerRows,
  isTowerRule,
  matchesTower,
  towerSolutions,
} from './number-tower';
import { sparseArray } from './sparse-array';
import { initialLibrary } from './storage';
const multi: TowerRows = [[16], [9, null], [null, null, null]];
it('accepts all eight multi-solutions, including zero, and rejects a sum of the bottom row alone', () => {
  const solutions = Array.from({ length: 8 }, (_, b) => [7, 9 - b, b, 7 - b]);
  expect(
    towerSolutions(multi)
      .map((value) => JSON.stringify(value))
      .toSorted(),
  ).toEqual(solutions.map((value) => JSON.stringify(value)).toSorted());
  for (const filling of solutions) {
    expect(evaluate({ kind: 'tower', rows: multi }, filling)).toBe(true);
    expect(matchesTower(multi, filling)).toBe(true);
  }
  expect(evaluate({ kind: 'tower', rows: multi }, [7, 8, 1, 7])).toBe(false);
  expect(evaluate({ kind: 'tower', rows: multi }, [7, 9, 0, -1])).toBe(false);
  expect(validAnswer({ kind: 'tower', rows: multi }, [7, 9, null, 7])).toBe(
    false,
  );
  expect(validAnswer({ kind: 'tower', rows: multi }, sparseArray(4))).toBe(
    false,
  );
  expect(matchesTower(multi, [7, 9, 0, 7, 1])).toBe(false);
  expect(towerSolutions([[null], [null, 6], [8, 2, null]])).toEqual([
    [16, 10, 4],
  ]);
});
it('checks shape, feasibility, ranges, completed diagrams and strict fields', () => {
  const model: NumberTowerVisual = { kind: 'number-tower', rows: multi };
  expect(isNumberTowerVisual(model)).toBe(true);
  expect(isTowerRule({ kind: 'tower', rows: multi })).toBe(true);
  expect(
    isNumberTowerVisual({
      kind: 'number-tower',
      rows: [[13], [6, 7], [2, 4, 3]],
    }),
  ).toBe(true);
  expect(isTowerRule({ kind: 'tower', rows: [[13], [6, 7], [2, 4, 3]] })).toBe(
    false,
  );
  for (const rows of [
    [[null], [null, null], [null, null, null]],
    [[16], [9, 8], [null, null, null]],
    [[null], [null, null], [10, 5, 4]],
    [[0], [1, null], [null, null, null]],
    [[20], [9, null], [null, null, null]],
    [[16], [9.5, null], [null, null, null]],
    [[16], [9, null], [-1, null, null]],
    [[16], [9], [null, null, null]],
    [[16], [9, null], sparseArray(3)],
    sparseArray(3),
  ])
    expect(isNumberTowerVisual({ ...model, rows })).toBe(false);
  expect(isTowerRows([[16], [9, null], [null, null, null]])).toBe(true);
  expect(isNumberTowerVisual({ ...model, answers: [7, 9, 0, 7] })).toBe(false);
  expect(
    isTowerRule({ kind: 'tower', rows: multi, solution: [7, 9, 0, 7] }),
  ).toBe(false);
});
it('preserves partial tower input and wrong-first/correct-later history; rejects mismatched diagrams and forged scores', () => {
  const state = initialLibrary('数塔测试');
  const session = createSession(
    lesson,
    'unregistered-sujiao-lower-draft',
    state.activeProfileId,
  );
  session.phase = 'practice';
  const index = session.questions.findIndex((q) => q.id.endsWith('fill-2'));
  const q = session.questions[index]!;
  session.responses[index]!.draft = [7, 8, 1, 7];
  session.responses[index] = submitResponse(q, session.responses[index]!);
  session.responses[index]!.draft = [7, 8, 1, 6];
  session.responses[index] = submitResponse(q, session.responses[index]!);
  const partial = session.questions.findIndex((q) => q.id.endsWith('fill-1'));
  session.responses[partial]!.draft = [16, null, null];
  state.sessions.push(session);
  expect(parseBackup(exportBackup(state)).data.sessions[0]).toEqual(session);
  expect(session.responses[index]!.submissions.map((s) => s.correct)).toEqual([
    false,
    true,
  ]);
  expect(statistics(session).manual).toBe(0);
  for (const mutate of [
    (s: typeof session) => {
      s.questions[index]!.visual = {
        kind: 'number-tower',
        rows: [[18], [10, null], [null, null, null]],
      };
    },
    (s: typeof session) => {
      delete s.questions[index]!.visual;
    },
    (s: typeof session) => {
      s.responses[index]!.submissions[0]!.correct = true;
    },
    (s: typeof session) => {
      s.responses[partial]!.draft = [16];
    },
    (s: typeof session) => {
      s.responses[partial]!.draft = ['16', 'A', 'B'];
    },
  ]) {
    const changed = structuredClone(state);
    mutate(changed.sessions[0]!);
    expect(() => parseBackup(exportBackup(changed))).toThrow(Error);
  }
});
it('checks every draft objective and changed review against its own visual without registering the book', () => {
  for (const tasks of [lesson.questions, lesson.reviewQuestions!]) {
    for (const q of tasks) {
      if (q.rule.kind !== 'tower') continue;
      expect(isTowerRule(q.rule)).toBe(true);
      expect(q.visual).toEqual({ kind: 'number-tower', rows: q.rule.rows });
      for (const solution of towerSolutions(q.rule.rows))
        expect(evaluate(q.rule, solution)).toBe(true);
    }
  }
  expect(lesson.status).toBe('preparing');
  expect(lesson.questions.filter((q) => q.rule.kind !== 'manual')).toHaveLength(
    8,
  );
  expect(lesson.reviewQuestions).toHaveLength(8);
});
