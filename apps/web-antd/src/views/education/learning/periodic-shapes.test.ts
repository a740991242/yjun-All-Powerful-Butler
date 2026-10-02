import type { PeriodicShapesVisual } from './types';

import { expect, it } from 'vitest';

import { sujiaoPlanePatternsDraft as lesson } from '../content/sujiao-plane-patterns';
import { exportBackup, parseBackup } from './backup';
import { createSession, evaluate, statistics, submitResponse } from './engine';
import {
  isPeriodicShapesVisual,
  periodicShapeAt,
  shapeKey,
} from './periodic-shapes';
import { planeShapes } from './plane-cards';
import { sparseArray } from './sparse-array';
import { initialLibrary } from './storage';

it('repeats three supplied shape-size positions without treating duplicates as a shorter group', () => {
  const entries = planeShapes.flatMap((shape) =>
    ([1, 2] as const).map((size) => ({ shape, size })),
  );
  for (const a of entries)
    for (const b of entries)
      for (const c of entries) {
        if (new Set([a, b, c].map((item) => shapeKey(item))).size === 1)
          continue;
        for (let total = 7; total <= 12; total++) {
          const model: PeriodicShapesVisual = {
            kind: 'periodic-shapes',
            pattern: [a, b, c],
            total,
            shown: 6,
          };
          expect(isPeriodicShapesVisual(model)).toBe(true);
          for (let index = 0; index < total; index++)
            expect(periodicShapeAt(model, index)).toEqual([a, b, c][index % 3]);
          expect(periodicShapeAt(model, total)).toBeUndefined();
        }
      }
});
it('rejects sparse/identical patterns, unsupported geometry and hidden answer fields', () => {
  const large = { shape: 'circle', size: 2 };
  const small = { shape: 'circle', size: 1 };
  const model = {
    kind: 'periodic-shapes',
    pattern: [small, large, large],
    total: 11,
    shown: 6,
  };
  for (const pattern of [
    sparseArray(3),
    [small, small, small],
    [small, large],
    [{ shape: 'sphere', size: 1 }, large, large],
    [{ shape: 'circle', size: '1' }, large, large],
    [{ ...small, turn: 45 }, large, large],
  ])
    expect(isPeriodicShapesVisual({ ...model, pattern })).toBe(false);
  for (const total of [6, 13, 7.5, '11', Number.NaN])
    expect(isPeriodicShapesVisual({ ...model, total })).toBe(false);
  for (const shown of [0, 3, 7, 12, '6'])
    expect(isPeriodicShapesVisual({ ...model, shown })).toBe(false);
  expect(isPeriodicShapesVisual({ ...model, total: 9, shown: 9 })).toBe(false);
  expect(isPeriodicShapesVisual({ ...model, total: 12, shown: 9 })).toBe(true);
  expect(isPeriodicShapesVisual({ ...model, answer: '2-circle' })).toBe(false);
  const valid: PeriodicShapesVisual = {
    kind: 'periodic-shapes',
    pattern: [
      { shape: 'circle', size: 1 },
      { shape: 'circle', size: 2 },
      { shape: 'circle', size: 2 },
    ],
    total: 11,
    shown: 6,
  };
  for (const index of [-1, 0.5, Number.NaN])
    expect(periodicShapeAt(valid, index)).toBeUndefined();
});
it('checks both shape and size for each hidden position and changes the rule order in review', () => {
  const expected = [
    ['1-circle', '2-circle', '2-circle', '2-circle', '1-circle', '2-circle'],
    [
      '2-triangle',
      '2-circle',
      '2-triangle',
      '2-square',
      '2-triangle',
      '2-triangle',
    ],
    [
      '2-rectangle',
      '2-square',
      '2-square',
      '2-square',
      '2-rectangle',
      '2-square',
    ],
  ];
  ['sizes', 'shapes', 'mixed'].forEach((family, f) => {
    for (const review of [false, true]) {
      const questions = review ? lesson.reviewQuestions! : lesson.questions;
      for (let i = 0; i < 3; i++) {
        const q = questions.find(
          (q) => q.id === `${lesson.id}-${review ? 'r' : 'q'}-${family}-${i}`,
        )!;
        expect(evaluate(q.rule, expected[f]![i + (review ? 3 : 0)]!)).toBe(
          true,
        );
        expect(
          q.choices!.filter((choice) => evaluate(q.rule, choice.id)),
        ).toHaveLength(1);
      }
    }
  });
  for (const q of lesson.reviewQuestions!) {
    const original = lesson.questions.find(
      (old) => old.knowledge === q.knowledge,
    )!;
    expect(q.prompt).not.toBe(original.prompt);
    if (q.visual) expect(q.visual).not.toEqual(original.visual);
  }
  const sizesFirst = lesson.questions.find((q) => q.id.endsWith('-q-sizes-0'))!;
  expect(evaluate(sizesFirst.rule, '2-circle')).toBe(false);
  expect(
    evaluate(
      lesson.questions.find((q) => q.id.endsWith('-q-stated-rule'))!.rule,
      'no',
    ),
  ).toBe(true);
  expect(lesson.reviewQuestions).toHaveLength(13);
});
it('backs up known segments and wrong-size attempts without recording real paper continuation', () => {
  const state = initialLibrary('图形规律测试');
  const session = createSession(
    lesson,
    'sujiao-math-p1-lower-9787574312951',
    state.activeProfileId,
  );
  session.phase = 'practice';
  const i = session.questions.findIndex((q) => q.id.endsWith('-q-sizes-0'));
  session.responses[i]!.draft = '2-circle';
  session.responses[i] = submitResponse(
    session.questions[i]!,
    session.responses[i]!,
  );
  session.responses[i]!.draft = '1-circle';
  session.responses[i] = submitResponse(
    session.questions[i]!,
    session.responses[i]!,
  );
  state.sessions.push(session);
  expect(parseBackup(exportBackup(state)).data.sessions[0]).toEqual(session);
  expect(session.responses[i]!.submissions.map((s) => s.correct)).toEqual([
    false,
    true,
  ]);
  expect(statistics(session).manual).toBe(0);
  const damaged = structuredClone(state);
  const visual = damaged.sessions[0]!.questions[i]!.visual;
  if (visual?.kind !== 'periodic-shapes') throw new Error('missing pattern');
  visual.pattern = [
    { shape: 'circle', size: 1 },
    { shape: 'circle', size: 1 },
    { shape: 'circle', size: 1 },
  ];
  expect(() => parseBackup(exportBackup(damaged))).toThrow(Error);
});
