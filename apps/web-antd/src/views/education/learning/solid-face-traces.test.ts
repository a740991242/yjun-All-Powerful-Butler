import type { SolidFaceTracesVisual } from './types';

import { expect, it } from 'vitest';

import { sujiaoFaceTracingDraft as lesson } from '../content/sujiao-face-tracing';
import { exportBackup, parseBackup } from './backup';
import { createSession, evaluate, statistics, submitResponse } from './engine';
import {
  distinctTraces,
  faceTraces,
  isSolidFaceTracesVisual,
  solidFacePolygons,
  tracePolygon,
} from './solid-face-traces';
import { initialLibrary } from './storage';
const models: SolidFaceTracesVisual['solid'][] = [
  'cube',
  'cuboid-distinct',
  'cuboid-square-end',
  'triangular-prism',
];
it('pairs selected solid faces with true flat geometry using one scale rather than perspective edge lengths', () => {
  for (const solid of models) {
    const model: SolidFaceTracesVisual = { kind: 'solid-face-traces', solid };
    expect(isSolidFaceTracesVisual(model)).toBe(true);
    const faces = solidFacePolygons(model);
    const traces = faceTraces(model);
    expect(new Set(faces.map((f) => f.letter))).toEqual(
      new Set(traces.map((t) => t.letter)),
    );
    for (const face of faces)
      for (const point of face.points) {
        expect(point[0]).toBeGreaterThan(0);
        expect(point[0]).toBeLessThan(240);
        expect(point[1]).toBeGreaterThan(0);
        expect(point[1]).toBeLessThan(210);
      }
    for (const trace of traces) {
      const points = tracePolygon(trace);
      expect(points).toHaveLength(trace.shape === 'triangle' ? 3 : 4);
      const xs = points.map((p) => p[0]!);
      const ys = points.map((p) => p[1]!);
      expect(Math.max(...xs) - Math.min(...xs)).toBeCloseTo(
        trace.width * 24,
        10,
      );
      expect(Math.max(...ys) - Math.min(...ys)).toBeCloseTo(
        trace.height * 24,
        10,
      );
      if (trace.shape === 'triangle') {
        const lengths = points.map((p, i) => {
          const q = points[(i + 1) % 3]!;
          return Math.hypot(p[0]! - q[0]!, p[1]! - q[1]!);
        });
        for (const length of lengths) expect(length).toBeCloseTo(48, 10);
      } else
        expect(trace.shape === 'square').toBe(trace.width === trace.height);
    }
  }
  const counts = models.map((solid) => [
    distinctTraces({ kind: 'solid-face-traces', solid }, 'rectangle'),
    distinctTraces({ kind: 'solid-face-traces', solid }, 'square'),
  ]);
  expect(counts).toEqual([
    [0, 1],
    [3, 0],
    [1, 1],
    [1, 0],
  ]);
  expect(
    faceTraces({ kind: 'solid-face-traces', solid: 'cuboid-distinct' }).map(
      (t) => [t.width, t.height],
    ),
  ).toEqual([
    [2, 4],
    [3, 4],
    [2, 3],
  ]);
});
it('rejects arbitrary face labels, dimensions, hidden answers and unsupported solids', () => {
  for (const value of [
    null,
    {},
    [],
    { kind: 'solid-face-traces', solid: 'sphere' },
    { kind: 'solid-face-traces', solid: ['cube'] },
    { kind: 'solid-face-traces', solid: 'cube', answer: 'square' },
    { kind: 'solid-face-traces', solid: 'cube', width: 3 },
    { kind: 'solid-face-traces', solid: 'cube', faces: ['D'] },
  ])
    expect(isSolidFaceTracesVisual(value)).toBe(false);
});
it('classifies the actual selected letter and counts unique flat traces instead of selected faces, with changed review targets', () => {
  expect(lesson.reviewQuestions).toHaveLength(14);
  for (const questions of [lesson.questions, lesson.reviewQuestions!])
    for (const q of questions) {
      const model = q.visual;
      if (model?.kind !== 'solid-face-traces') continue;
      if (q.id.includes('-classify-')) {
        const letter = q.prompt.match(/[ABC]/)![0];
        const actual = faceTraces(model).find((t) => t.letter === letter)!;
        expect(evaluate(q.rule, actual.shape)).toBe(true);
      } else if (q.rule.kind === 'number') {
        const kind = q.id.endsWith('-same-squares') ? 'square' : 'rectangle';
        expect(evaluate(q.rule, distinctTraces(model, kind))).toBe(true);
      }
    }
  const main = lesson.questions.find((q) =>
    q.id.endsWith('-q-different-rectangles'),
  )!;
  const review = lesson.reviewQuestions!.find(
    (q) => q.knowledge === main.knowledge,
  )!;
  expect(main.visual).not.toEqual(review.visual);
  expect(evaluate(main.rule, 3)).toBe(true);
  expect(evaluate(review.rule, 1)).toBe(true);
});
it('backs up a category-versus-congruence mistake and retry without auto-confirming physical tracing', () => {
  const library = initialLibrary('描面');
  const session = createSession(
    lesson,
    'sujiao-math-p1-lower-9787574312951',
    library.activeProfileId,
  );
  session.phase = 'practice';
  const index = session.questions.findIndex((q) =>
    q.id.endsWith('-q-different-rectangles'),
  );
  session.responses[index]!.draft = 1;
  session.responses[index] = submitResponse(
    session.questions[index]!,
    session.responses[index]!,
  );
  session.responses[index]!.draft = 3;
  session.responses[index] = submitResponse(
    session.questions[index]!,
    session.responses[index]!,
  );
  library.sessions.push(session);
  expect(parseBackup(exportBackup(library)).data.sessions[0]).toEqual(session);
  expect(session.responses[index]!.submissions.map((s) => s.correct)).toEqual([
    false,
    true,
  ]);
  expect(statistics(session).manual).toBe(0);
  const damaged = structuredClone(library);
  Object.assign(damaged.sessions[0]!.questions[index]!.visual!, {
    solid: 'sphere',
  });
  expect(() => parseBackup(exportBackup(damaged))).toThrow(Error);
});
