import type { GeoboardShiftState } from './types';

import { expect, it } from 'vitest';

import {
  sujiaoGeoboardShiftDraft as lesson,
  shiftExamples,
} from '../content/sujiao-geoboard-shift';
import { exportBackup, parseBackup } from './backup';
import { createSession, evaluate, submitResponse } from './engine';
import {
  boardCorners,
  boardShape,
  isGeoboardShiftState,
  isGeoboardShiftVisual,
  moveUpperEdge,
} from './geoboard-shift';
import { initialLibrary } from './storage';
it('moves both upper endpoints equally while keeping the lower edge fixed and all points within the board', () => {
  for (const width of [3, 4] as const)
    for (let shift = -1; shift <= 5 - width; shift++) {
      const state = { width, shift } as GeoboardShiftState;
      const corners = boardCorners(state);
      expect(isGeoboardShiftState(state)).toBe(true);
      for (const [x, y] of corners) {
        expect(x).toBeGreaterThanOrEqual(0);
        expect(x).toBeLessThanOrEqual(6);
        expect(y).toBeGreaterThanOrEqual(0);
        expect(y).toBeLessThanOrEqual(4);
      }
      expect(corners[1]![0] - corners[0]![0]).toBe(width);
      expect(corners[2]![0] - corners[3]![0]).toBe(width);
      const side = [
        corners[3]![0] - corners[0]![0],
        corners[3]![1] - corners[0]![1],
      ];
      expect(side[0] === 0).toBe(shift === 0);
      expect(boardShape(state) === 'rectangle').toBe(side[0] === 0);
      for (const direction of ['left', 'right'] as const) {
        const before = structuredClone(state);
        const next = moveUpperEdge(state, direction);
        const after = boardCorners(next);
        expect(state).toEqual(before);
        expect(next).not.toBe(state);
        expect(after.slice(2)).toEqual(corners.slice(2));
        expect(after[0]![0] - corners[0]![0]).toBe(
          after[1]![0] - corners[1]![0],
        );
        expect(isGeoboardShiftState(next)).toBe(true);
        const proposed = shift + (direction === 'left' ? -1 : 1);
        expect(next.shift).toBe(
          proposed < -1 || proposed > 5 - width ? shift : proposed,
        );
      }
    }
});
it('rejects unsupported dimensions, out-of-board shifts and hidden derived fields', () => {
  for (const value of [
    null,
    [],
    { width: 2, shift: 0 },
    { width: 4, shift: 2 },
    { width: 3, shift: 3 },
    { width: 3, shift: -2 },
    { width: 3, shift: 0.5 },
    { width: 3, shift: '0' },
    { width: 3, shift: 0, answer: 'rectangle' },
  ])
    expect(isGeoboardShiftState(value)).toBe(false);
  expect(
    isGeoboardShiftVisual({ kind: 'geoboard-shift', width: 3, shift: 0 }),
  ).toBe(true);
  expect(
    isGeoboardShiftVisual({
      kind: 'geoboard-shift',
      width: 3,
      shift: 0,
      answer: 'rectangle',
    }),
  ).toBe(false);
});
it('grades original figure conditions and changes review figures rather than reusing only wording', () => {
  for (const [review, questions] of [
    [false, lesson.questions],
    [true, lesson.reviewQuestions!],
  ] as const) {
    const models = shiftExamples(review);
    for (let i = 0; i < 4; i++) {
      const q = questions.find(
        (q) => q.knowledge === `${lesson.id}-${i}-shape`,
      )!;
      expect(q.visual).toEqual(models[i]);
      expect(evaluate(q.rule, boardShape(models[i]!))).toBe(true);
    }
    for (let i = 0; i < 2; i++) {
      const q = questions.find(
        (q) => q.knowledge === `${lesson.id}-${i}-move`,
      )!;
      const model = models[i]!;
      const expected = (() => {
        if (model.shift === 0) return 'parallelogram';
        return model.shift > 0 ? 'left' : 'right';
      })();
      expect(evaluate(q.rule, expected)).toBe(true);
      if (model.shift !== 0)
        expect(
          boardShape(
            moveUpperEdge(
              { width: model.width, shift: model.shift },
              expected as 'left' | 'right',
            ),
          ),
        ).toBe('rectangle');
    }
  }
  for (const q of lesson.reviewQuestions!.filter((q) => q.visual))
    expect(q.visual).not.toEqual(
      lesson.questions.find((old) => old.knowledge === q.knowledge)!.visual,
    );
  expect(lesson.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
    3,
  );
});
it('preserves wrong-first retries and step/manual states but rejects changed objective diagrams and mismatched widths', () => {
  const state = initialLibrary('改围');
  const session = createSession(
    lesson,
    'sujiao-math-p1-lower-9787574312951',
    state.activeProfileId,
  );
  session.phase = 'practice';
  const index = session.questions.findIndex(
    (q) => q.knowledge === `${lesson.id}-0-shape`,
  );
  for (const answer of ['rectangle', 'parallelogram']) {
    session.responses[index]!.draft = answer;
    session.responses[index] = submitResponse(
      session.questions[index]!,
      session.responses[index]!,
    );
  }
  const manual = session.questions.find(
    (q) => q.id === `${lesson.id}-manual-0`,
  )!;
  session.tools = {
    'step-1': { geoboardShift: { width: 3, shift: 0 } },
    [`question-${manual.id}`]: { geoboardShift: { width: 3, shift: -1 } },
  };
  state.sessions.push(session);
  expect(session.responses[index]!.submissions.map((s) => s.correct)).toEqual([
    false,
    true,
  ]);
  expect(parseBackup(exportBackup(state)).data.sessions[0]).toEqual(session);
  for (const [key, width] of [
    [`question-${manual.id}`, 4],
    [`question-${session.questions[index]!.id}`, 3],
    ['question-missing', 3],
  ] as const) {
    const bad = structuredClone(state);
    bad.sessions[0]!.tools = { [key]: { geoboardShift: { width, shift: 0 } } };
    expect(() => parseBackup(exportBackup(bad))).toThrow(Error);
  }
  const old = structuredClone(state);
  delete old.sessions[0]!.tools;
  expect(parseBackup(exportBackup(old)).data.sessions[0]).toEqual(
    old.sessions[0],
  );
});
