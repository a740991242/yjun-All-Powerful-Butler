import type { PlanePatch, ShapePatchVisual } from './types';

import { expect, it } from 'vitest';

import { sujiaoShapePatchesDraft as lesson } from '../content/sujiao-shape-patches';
import { exportBackup, parseBackup } from './backup';
import { createSession, evaluate, statistics, submitResponse } from './engine';
import { planeShapes } from './plane-cards';
import {
  isPlanePatch,
  isShapePatchVisual,
  matchingPatch,
  patchTrianglePoints,
} from './shape-patch';
import { sparseArray } from './sparse-array';
import { initialLibrary } from './storage';

it('bounds actual geometry and refuses non-square squares, ellipses and non-rectangular rectangle labels', () => {
  for (const shape of planeShapes)
    for (let width = 1; width <= 4; width++)
      for (let height = 1; height <= 4; height++) {
        const patch: PlanePatch = { shape, width, height };
        expect(isPlanePatch(patch)).toBe(
          shape === 'triangle' ||
            (shape === 'rectangle' ? width !== height : width === height),
        );
        if (shape === 'triangle') {
          const points = patchTrianglePoints(patch)
            .split(' ')
            .map((point) => point.split(',').map(Number));
          expect(points[0]).toEqual([72, 72 - height * 12]);
          expect(points[1]![0]! - points[2]![0]!).toBe(width * 24);
          expect(points[1]![1]! - points[0]![1]!).toBe(height * 24);
        }
      }
  for (const width of [0, 5, 1.5, '2', Number.NaN])
    expect(isPlanePatch({ shape: 'triangle', width, height: 2 })).toBe(false);
  expect(isPlanePatch({ shape: 'sphere', width: 2, height: 2 })).toBe(false);
  expect(
    isPlanePatch({ shape: 'square', width: 2, height: 2, answer: true }),
  ).toBe(false);
});
it('requires one exact translated match and rejects same-area, rotated, duplicated or missing fits', () => {
  const target: PlanePatch = { shape: 'rectangle', width: 1, height: 4 };
  const model: ShapePatchVisual = {
    kind: 'shape-patch',
    target,
    candidates: [
      { shape: 'rectangle', width: 4, height: 1 },
      target,
      { shape: 'square', width: 2, height: 2 },
    ],
  };
  expect(isShapePatchVisual(model)).toBe(true);
  expect(matchingPatch(model)).toBe(1);
  expect(
    isShapePatchVisual({
      ...model,
      candidates: [
        model.candidates[0],
        model.candidates[2],
        { shape: 'triangle', width: 2, height: 4 },
      ],
    }),
  ).toBe(false);
  expect(
    isShapePatchVisual({
      ...model,
      candidates: [target, { ...target }, model.candidates[2]],
    }),
  ).toBe(false);
  expect(isShapePatchVisual({ ...model, candidates: sparseArray(3) })).toBe(
    false,
  );
  expect(
    isShapePatchVisual({ ...model, candidates: [target, model.candidates[0]] }),
  ).toBe(false);
  expect(isShapePatchVisual({ ...model, answer: 'B' })).toBe(false);
});
it('selects a unique patch while separately counting same-category pieces in changed practice and review diagrams', () => {
  const families = ['rectangle', 'triangle', 'square', 'circle'];
  const expected = [
    ['B', 'D', 'C', 'A'],
    ['A', 'D', 'B', 'C'],
  ];
  for (const [review, questions] of [
    [false, lesson.questions],
    [true, lesson.reviewQuestions!],
  ] as const) {
    families.forEach((shape, i) => {
      const fit = questions.find(
        (q) => q.id === `${lesson.id}-${review ? 'r' : 'q'}-${shape}-fit`,
      )!;
      const count = questions.find(
        (q) => q.id === `${lesson.id}-${review ? 'r' : 'q'}-${shape}-category`,
      )!;
      const visual = fit.visual;
      if (visual?.kind !== 'shape-patch') throw new Error('missing patches');
      expect(isShapePatchVisual(visual)).toBe(true);
      expect(evaluate(fit.rule, expected[review ? 1 : 0]![i]!)).toBe(true);
      expect(fit.choices!.filter((c) => evaluate(fit.rule, c.id))).toHaveLength(
        1,
      );
      expect(
        evaluate(
          count.rule,
          visual.candidates.filter((p) => p.shape === shape).length,
        ),
      ).toBe(true);
      expect(evaluate(count.rule, 1)).toBe(false);
    });
  }
  for (const q of lesson.reviewQuestions!) {
    const original = lesson.questions.find(
      (old) => old.knowledge === q.knowledge,
    )!;
    expect(q.prompt).not.toBe(original.prompt);
    if (q.visual) expect(q.visual).not.toEqual(original.visual);
  }
  expect(lesson.reviewQuestions).toHaveLength(10);
});
it('backs up proportions and wrong-first choices without pretending real patchwork is completed', () => {
  const state = initialLibrary('补图测试');
  const session = createSession(
    lesson,
    'sujiao-math-p1-lower-9787574312951',
    state.activeProfileId,
  );
  session.phase = 'practice';
  const i = session.questions.findIndex((q) =>
    q.id.endsWith('-q-rectangle-fit'),
  );
  session.responses[i]!.draft = 'A';
  session.responses[i] = submitResponse(
    session.questions[i]!,
    session.responses[i]!,
  );
  session.responses[i]!.draft = 'B';
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
  if (visual?.kind !== 'shape-patch') throw new Error('missing patch');
  visual.candidates[0] = { ...visual.target };
  expect(() => parseBackup(exportBackup(damaged))).toThrow(Error);
});
