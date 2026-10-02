import type { PlanePatch, RotatingPatchVisual } from './types';

import { expect, it } from 'vitest';

import {
  sujiaoRotatingPatchesDraft as lesson,
  rotationExamples,
} from '../content/sujiao-rotating-patches';
import { exportBackup, parseBackup } from './backup';
import { createSession, evaluate, statistics, submitResponse } from './engine';
import {
  congruentPatchKey,
  isRotatingPatch,
  isRotatingPatchVisual,
  matchingRotatingPatch,
} from './rotating-patch';
import { isPlanePatch, matchingPatch } from './shape-patch';
import { sparseArray } from './sparse-array';
import { initialLibrary } from './storage';
it('permits the stated rotations without accepting equal-area rectangles or differently proportioned triangles', () => {
  const target: PlanePatch = { shape: 'rectangle', width: 1, height: 4 };
  expect(congruentPatchKey(target)).toBe(
    congruentPatchKey({ ...target, width: 4, height: 1 }),
  );
  expect(congruentPatchKey(target)).not.toBe(
    congruentPatchKey({ shape: 'square', width: 2, height: 2 }),
  );
  expect(
    congruentPatchKey({ shape: 'triangle', width: 4, height: 2 }),
  ).not.toBe(congruentPatchKey({ shape: 'triangle', width: 2, height: 4 }));
  expect(
    matchingPatch({
      kind: 'shape-patch',
      target,
      candidates: [{ ...target, width: 4, height: 1 }],
    }),
  ).toBe(-1);
  const model: RotatingPatchVisual = {
    kind: 'rotating-patch',
    target: { patch: target, turn: 0 },
    candidates: [
      { patch: { shape: 'square', width: 2, height: 2 }, turn: 45 },
      { patch: { ...target, width: 4, height: 1 }, turn: 0 },
      { patch: { ...target, height: 3 }, turn: 90 },
    ],
  };
  expect(isRotatingPatchVisual(model)).toBe(true);
  expect(matchingRotatingPatch(model)).toBe(1);
  expect(
    isRotatingPatchVisual({
      ...model,
      candidates: [...model.candidates, { patch: target, turn: 180 }],
    }),
  ).toBe(false);
});
it('keeps every supported rotated outline within the shared viewBox and uniquely identifies actual material dimensions', () => {
  const keys = new Map<string, PlanePatch[]>();
  for (const shape of ['rectangle', 'square', 'triangle', 'circle'] as const)
    for (let width = 1; width <= 4; width++)
      for (let height = 1; height <= 4; height++) {
        const patch: PlanePatch = { shape, width, height };
        if (!isPlanePatch(patch)) continue;
        const key = congruentPatchKey(patch);
        keys.set(key, [...(keys.get(key) ?? []), patch]);
        for (const turn of [0, 45, 90, 135, 180, 225, 270, 315] as const) {
          expect(isRotatingPatch({ patch, turn })).toBe(true);
          const points =
            shape === 'triangle'
              ? [
                  [0, -height * 12],
                  [width * 12, height * 12],
                  [-width * 12, height * 12],
                ]
              : [
                  [-width * 12, -height * 12],
                  [width * 12, -height * 12],
                  [width * 12, height * 12],
                  [-width * 12, height * 12],
                ];
          if (shape === 'circle') continue;
          const angle = (turn * Math.PI) / 180;
          for (const [x, y] of points) {
            const rx = 72 + x! * Math.cos(angle) - y! * Math.sin(angle);
            const ry = 72 + x! * Math.sin(angle) + y! * Math.cos(angle);
            expect(rx).toBeGreaterThan(1.25);
            expect(rx).toBeLessThan(142.75);
            expect(ry).toBeGreaterThan(1.25);
            expect(ry).toBeLessThan(142.75);
          }
        }
      }
  for (const matches of keys.values())
    for (const a of matches)
      for (const b of matches) {
        expect(a.shape).toBe(b.shape);
        if (a.shape === 'rectangle')
          expect(
            [a.width, a.height].toSorted((a, b) =>
              String(a).localeCompare(String(b)),
            ),
          ).toEqual(
            [b.width, b.height].toSorted((a, b) =>
              String(a).localeCompare(String(b)),
            ),
          );
        else expect([a.width, a.height]).toEqual([b.width, b.height]);
      }
});
it('bounds angles, candidates and exact solvability without sparse or derived-answer fields', () => {
  const model = rotationExamples(false)[0]!;
  for (const value of [
    { ...model, answer: 'B' },
    { ...model, candidates: sparseArray(4) },
    { ...model, target: { ...model.target, turn: 30 } },
    { ...model, target: { ...model.target, turn: '45' } },
    { ...model, candidates: model.candidates.filter((_, i) => i !== 1) },
    { ...model, target: { ...model.target, extra: true } },
  ])
    expect(isRotatingPatchVisual(value)).toBe(false);
  expect(isRotatingPatch({ patch: model.target.patch, turn: 360 })).toBe(false);
});
it('uses changed shape proportions and orientations in review, independently counting category rather than congruence', () => {
  const expected = [
    ['B', 'D', 'A', 'D'],
    ['C', 'A', 'C', 'B'],
  ];
  for (const [review, questions] of [
    [false, lesson.questions],
    [true, lesson.reviewQuestions!],
  ] as const)
    for (let i = 0; i < 4; i++) {
      const count = questions.find((q) => q.id.endsWith(`-${i}-category`))!;
      const fit = questions.find((q) => q.id.endsWith(`-${i}-fit`))!;
      const model = fit.visual;
      if (model?.kind !== 'rotating-patch')
        throw new Error('missing rotating model');
      expect(isRotatingPatchVisual(model)).toBe(true);
      expect(evaluate(fit.rule, expected[review ? 1 : 0]![i]!)).toBe(true);
      expect(matchingRotatingPatch(model)).toBe(
        expected[review ? 1 : 0]![i]!.codePointAt(0)! - 65,
      );
      expect(
        evaluate(
          count.rule,
          model.candidates.filter(
            (p) => p.patch.shape === model.target.patch.shape,
          ).length,
        ),
      ).toBe(true);
      expect(evaluate(count.rule, 1)).toBe(false);
    }
  for (const q of lesson.reviewQuestions!) {
    const original = lesson.questions.find(
      (old) => old.knowledge === q.knowledge,
    )!;
    expect(q.prompt).not.toBe(original.prompt);
    if (q.visual) expect(q.visual).not.toEqual(original.visual);
  }
});
it('preserves selecting a same-area square before the valid turned rectangle, and refuses an ambiguous backup', () => {
  const state = initialLibrary('转向贴合');
  const session = createSession(
    lesson,
    'sujiao-math-p1-lower-9787574312951',
    state.activeProfileId,
  );
  session.phase = 'practice';
  const index = session.questions.findIndex((q) => q.id.endsWith('-q-0-fit'));
  session.responses[index]!.draft = 'A';
  session.responses[index] = submitResponse(
    session.questions[index]!,
    session.responses[index]!,
  );
  session.responses[index]!.draft = 'B';
  session.responses[index] = submitResponse(
    session.questions[index]!,
    session.responses[index]!,
  );
  state.sessions.push(session);
  expect(parseBackup(exportBackup(state)).data.sessions[0]).toEqual(session);
  expect(session.responses[index]!.submissions.map((s) => s.correct)).toEqual([
    false,
    true,
  ]);
  expect(statistics(session).manual).toBe(0);
  const bad = structuredClone(state);
  const model = bad.sessions[0]!.questions[index]!.visual;
  if (model?.kind !== 'rotating-patch') throw new Error('missing model');
  model.candidates[0] = { patch: { ...model.target.patch }, turn: 180 };
  expect(() => parseBackup(exportBackup(bad))).toThrow(Error);
});
