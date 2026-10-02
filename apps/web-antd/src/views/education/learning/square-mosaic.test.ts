import { expect, it } from 'vitest';

import {
  digitMosaics,
  sujiaoSquareMosaicsDraft as lesson,
  squareMosaicModel,
} from '../content/sujiao-square-mosaics';
import { exportBackup, parseBackup } from './backup';
import { createSession, evaluate, submitResponse } from './engine';
import { sparseArray } from './sparse-array';
import {
  isSquareMosaicState,
  isSquareMosaicVisual,
  matchingMosaicState,
  mosaicCount,
  mosaicEdges,
  mosaicShape,
  rotateMosaic,
  toggleMosaic,
} from './square-mosaic';
import { initialLibrary } from './storage';
it('distinguishes a fully filled square/rectangle from concave outlines, holes and empty material', () => {
  expect(
    mosaicShape([
      [true, true],
      [true, true],
    ]),
  ).toBe('square');
  expect(mosaicShape([[true, true, true, true]])).toBe('rectangle');
  expect(
    mosaicShape([
      [true, false],
      [true, true],
    ]),
  ).toBe('other');
  const ring = [
    [true, true, true],
    [true, false, true],
    [true, true, true],
  ];
  expect(mosaicCount(ring)).toBe(8);
  expect(mosaicShape(ring)).toBe('other');
  expect(mosaicEdges(ring)).toHaveLength(16);
  expect(mosaicEdges([[true, true]])).toHaveLength(6);
  expect(mosaicEdges([[true, true]])).not.toContainEqual([1, 0, 1, 1]);
  expect(mosaicShape([[false]])).toBe('empty');
  expect(mosaicEdges([[false]])).toEqual([]);
  expect(
    mosaicShape([
      [false, false, false],
      [false, true, false],
      [false, false, false],
    ]),
  ).toBe('square');
});
it('takes a piece off before moving it, preserving the fixed supply and refusing an extra piece for every small-board state', () => {
  const visual = squareMosaicModel(
    [
      [true, true, true],
      [true, false, false],
    ],
    true,
  );
  for (let bits = 0; bits < 64; bits++) {
    const state = {
      cells: [
        Array.from({ length: 3 }, (_, i) => Boolean(bits & (1 << i))),
        Array.from({ length: 3 }, (_, i) => Boolean(bits & (1 << (i + 3)))),
      ],
    };
    if (mosaicCount(state.cells) > 4) continue;
    const original = structuredClone(state);
    expect(matchingMosaicState(state, visual)).toBe(true);
    for (let row = 0; row < 2; row++)
      for (let column = 0; column < 3; column++) {
        const count = mosaicCount(state.cells);
        const next = toggleMosaic(visual, state, row, column);
        expect(state).toEqual(original);
        expect(next).not.toBe(state);
        expect(mosaicCount(next.cells)).toBe(
          (() => {
            if (state.cells[row]![column]) return count - 1;
            return count === 4 ? 4 : count + 1;
          })(),
        );
        expect(matchingMosaicState(next, visual)).toBe(true);
      }
  }
  const removed = toggleMosaic(visual, { cells: visual.cells }, 0, 0);
  const moved = toggleMosaic(visual, removed, 1, 2);
  expect(mosaicCount(moved.cells)).toBe(4);
  expect(moved.cells[0]![0]).toBe(false);
  expect(moved.cells[1]![2]).toBe(true);
});
it('rejects sparse, mismatched, over-budget and corrupt grid states while allowing an empty interactive board', () => {
  const visual = squareMosaicModel(
    [
      [true, false],
      [false, true],
    ],
    false,
  );
  for (const cells of [
    [],
    sparseArray(2),
    [[true], []],
    [[1]],
    [[true, undefined]],
    [[true], sparseArray(1)],
    Array.from({ length: 6 }, () => [true]),
    Array.from({ length: 5 }, () => Array.from({ length: 5 }, () => true)),
  ]) {
    expect(isSquareMosaicVisual({ ...visual, cells })).toBe(false);
    expect(isSquareMosaicState({ cells })).toBe(false);
  }
  expect(isSquareMosaicState({ cells: [[false]] })).toBe(true);
  expect(isSquareMosaicVisual({ ...visual, cells: [[false]] })).toBe(false);
  expect(isSquareMosaicVisual({ ...visual, seams: 'false' })).toBe(false);
  expect(isSquareMosaicVisual({ ...visual, answer: 2 })).toBe(false);
  expect(
    matchingMosaicState(
      {
        cells: [
          [true, true],
          [true, false],
        ],
      },
      visual,
    ),
  ).toBe(false);
  expect(matchingMosaicState({ cells: [[true, true]] }, visual)).toBe(false);
  for (const [row, col] of [
    [-1, 0],
    [0, 2],
    [0.5, 0],
  ])
    expect(() =>
      toggleMosaic(visual, { cells: visual.cells }, row!, col!),
    ).toThrow(Error);
});
it('counts actual pieces rather than the represented digit, keeps unsplit outlines free of answer seams, and changes review conditions', () => {
  expect(digitMosaics.map((item) => mosaicCount(item))).toEqual([
    12, 8, 11, 11, 9, 11, 12, 7, 13, 12,
  ]);
  for (const questions of [lesson.questions, lesson.reviewQuestions!])
    for (const q of questions) {
      if (q.visual?.kind !== 'square-mosaic' || q.rule.kind === 'manual')
        continue;
      expect(isSquareMosaicVisual(q.visual)).toBe(true);
      if (q.rule.kind === 'number')
        expect(evaluate(q.rule, mosaicCount(q.visual.cells))).toBe(true);
      if (q.id.endsWith('-count')) expect(q.visual.seams).toBe(false);
      if (q.id.endsWith('-shape'))
        expect(evaluate(q.rule, mosaicShape(q.visual.cells))).toBe(true);
      expect(72 + q.visual.cells.length * 32).toBeLessThan(255);
      expect(32 + q.visual.cells[0]!.length * 32).toBeLessThan(255);
    }
  for (const q of lesson.reviewQuestions!.filter((q) => q.visual))
    expect(q.visual).not.toEqual(
      lesson.questions.find((old) => old.knowledge === q.knowledge)!.visual,
    );
  const zero = lesson.questions.find((q) => q.id.endsWith('-digit-0'))!;
  expect(evaluate(zero.rule, 0)).toBe(false);
  expect(
    rotateMosaic(rotateMosaic(rotateMosaic(rotateMosaic(digitMosaics[2]!)))),
  ).toEqual(digitMosaics[2]);
});
it('preserves counting the represented digit before correction and valid manual tools, rejecting objective or wrong-budget bindings', () => {
  const state = initialLibrary('正方形拼图');
  const session = createSession(
    lesson,
    'sujiao-math-p1-lower-9787574312951',
    state.activeProfileId,
  );
  session.phase = 'practice';
  const index = session.questions.findIndex((q) => q.id.endsWith('-digit-0'));
  for (const answer of [0, 12]) {
    session.responses[index]!.draft = answer;
    session.responses[index] = submitResponse(
      session.questions[index]!,
      session.responses[index]!,
    );
  }
  const manual = session.questions.find(
    (q) => q.id === `${lesson.id}-manual-0`,
  )!;
  const visual = manual.visual;
  if (visual?.kind !== 'square-mosaic') throw new Error('missing mosaic');
  const tool = toggleMosaic(visual, { cells: visual.cells }, 0, 0);
  session.tools = {
    'step-0': { squareMosaic: tool },
    [`question-${manual.id}`]: { squareMosaic: tool },
  };
  state.sessions.push(session);
  expect(parseBackup(exportBackup(state)).data.sessions[0]).toEqual(session);
  expect(session.responses[index]!.submissions.map((s) => s.correct)).toEqual([
    false,
    true,
  ]);
  for (const key of [
    `question-${session.questions[index]!.id}`,
    'question-missing',
  ]) {
    const bad = structuredClone(state);
    bad.sessions[0]!.tools = { [key]: { squareMosaic: tool } };
    expect(() => parseBackup(exportBackup(bad))).toThrow(Error);
  }
  const excessive = structuredClone(state);
  excessive.sessions[0]!.tools![`question-${manual.id}`]!.squareMosaic = {
    cells: Array.from({ length: 4 }, () =>
      Array.from({ length: 4 }, () => true),
    ),
  };
  expect(() => parseBackup(exportBackup(excessive))).toThrow(Error);
  const broken = structuredClone(state);
  broken.sessions[0]!.tools = {
    'step-0': { squareMosaic: { cells: [[true, 1]] } as never },
  };
  expect(() => parseBackup(exportBackup(broken))).toThrow(Error);
  const old = structuredClone(state);
  delete old.sessions[0]!.tools;
  expect(parseBackup(exportBackup(old)).data.sessions[0]).toEqual(
    old.sessions[0],
  );
});
