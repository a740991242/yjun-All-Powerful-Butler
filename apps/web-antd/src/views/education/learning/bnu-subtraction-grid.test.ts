import type { ArithmeticGridVisual, Lesson } from './types';

import { expect, it } from 'vitest';

import { bnuLowerCountrysideLesson } from '../content/bnu-lower-countryside';
import { bnuLowerSubtractionSource } from '../content/bnu-lower-subtraction-source';
import {
  arithmeticAxes,
  arithmeticCell,
  isArithmeticGridVisual,
} from './arithmetic-grid';
import { exportBackup, parseBackup } from './backup';
import { createSession, submitResponse } from './engine';
import { sparseArray } from './sparse-array';
import { initialLibrary } from './storage';

it('follows the source difference columns and all 45 distinct positions rather than the old subtrahend columns', () => {
  expect(arithmeticAxes('bnu-subtract')).toEqual({
    rows: [10, 11, 12, 13, 14, 15, 16, 17, 18],
    columns: [9, 8, 7, 6, 5, 4, 3, 2, 1],
  });
  const expressions: string[] = [];
  for (let row = 0; row < 9; row++)
    for (let col = 0; col < 9; col++) {
      const cell = arithmeticCell('bnu-subtract', row, col);
      if (col < 9 - row) {
        expect(cell).toEqual({
          expression: `${10 + row}−${1 + row + col}`,
          value: 9 - col,
        });
        if (cell) expressions.push(cell.expression);
      } else expect(cell).toBeNull();
    }
  expect(expressions).toHaveLength(45);
  expect(new Set(expressions).size).toBe(45);
  expect(arithmeticCell('bnu-subtract', 0, 0)?.expression).toBe('10−1');
  expect(arithmeticCell('borrow-complete', 0, 0)?.expression).toBe('10−9');
  expect(arithmeticCell('bnu-subtract', 8, 0)?.expression).toBe('18−9');
  expect(arithmeticCell('bnu-subtract', 8, 1)).toBeNull();
});

it('round trips all source blanks with partial zero drafts, retry history and an unchanged older lesson snapshot', () => {
  // A model fixture, not a claim that the subtraction course is released.
  const fixture: Lesson = {
    ...bnuLowerCountrysideLesson,
    id: 'subtraction-model-fixture',
    steps: [],
    questions: [
      {
        id: 'source-blank-a',
        knowledge: 'subtraction-table',
        prompt: '空格A：按原数、减数顺序填两个数。',
        rule: { kind: 'steps', values: [10, 4] },
        visual: {
          kind: 'arithmetic-grid',
          mode: 'bnu-subtract',
          hidden: bnuLowerSubtractionSource.blankPositions.map(([r, c]) => [
            r,
            c,
          ]),
        },
        hint: '先找行，再找得数所在的列。',
        explanation: '10−4的得数是6。',
      },
    ],
  };
  const state = initialLibrary('减法表模型');
  const oldSession = createSession(
    bnuLowerCountrysideLesson,
    'bnu-math-p1-lower-2024',
    state.activeProfileId,
  );
  const oldSnapshot = structuredClone(oldSession);
  const session = createSession(
    fixture,
    'bnu-math-p1-lower-2024',
    state.activeProfileId,
  );
  state.sessions.push(oldSession, session);
  session.responses[0]!.draft = [0, null];
  expect(parseBackup(exportBackup(state)).data).toEqual(state);
  session.responses[0]!.draft = [0, 4];
  session.responses[0] = submitResponse(
    session.questions[0]!,
    session.responses[0]!,
  );
  session.responses[0]!.draft = [10, 4];
  session.responses[0] = submitResponse(
    session.questions[0]!,
    session.responses[0]!,
  );
  session.responses[0]!.draft = [10, null];
  const backup = exportBackup(state);
  const restored = parseBackup(backup).data;
  expect(restored).toEqual(state);
  expect(restored.schemaVersion).toBe(1);
  expect(restored.sessions[0]).toEqual(oldSnapshot);
  expect(
    restored.sessions[1]!.responses[0]!.submissions.map((item) => item.correct),
  ).toEqual([false, true]);
  for (const hidden of [
    [[8, 1]],
    [
      [0, 3],
      [0, 3],
    ],
  ]) {
    const malformed = parseBackup(backup);
    const visual = malformed.data.sessions[1]!.questions[0]!.visual;
    if (visual?.kind !== 'arithmetic-grid')
      throw new Error('Expected table fixture');
    visual.hidden = hidden as [number, number][];
    expect(() => parseBackup(JSON.stringify(malformed))).toThrow(
      'educationLearning.invalidBackup',
    );
  }
  expect(parseBackup(backup).data).toEqual(state);
});
it('permits nineteen source blanks without widening older modes, and rejects sparse/outside/duplicate/extra fields', () => {
  const hidden: [number, number][] = Array.from({ length: 19 }, (_n, i) => {
    if (i < 9) return [0, i];
    if (i < 17) return [1, i - 9];
    return [2, i - 17];
  });
  const visual: ArithmeticGridVisual = {
    kind: 'arithmetic-grid',
    mode: 'bnu-subtract',
    hidden,
  };
  expect(isArithmeticGridVisual(visual)).toBe(true);
  expect(isArithmeticGridVisual({ ...visual, mode: 'borrow-complete' })).toBe(
    false,
  );
  expect(
    isArithmeticGridVisual({ ...visual, hidden: [...hidden, [2, 2]] }),
  ).toBe(false);
  for (const broken of [
    sparseArray(1),
    [
      [0, 0],
      [0, 0],
    ],
    [[8, 1]],
    [[9, 0]],
    [[-1, 0]],
    [[0, 9]],
    [[0, null]],
  ])
    expect(isArithmeticGridVisual({ ...visual, hidden: broken })).toBe(false);
  for (const field of [
    { answer: 9 },
    { marked: [9] },
    { mode: ['bnu-subtract'] },
  ])
    expect(isArithmeticGridVisual({ ...visual, ...field })).toBe(false);
});
