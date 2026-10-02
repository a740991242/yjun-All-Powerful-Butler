import type { Outline } from './assembly-candidates';

import { expect, it } from 'vitest';

import {
  assemblyLayouts,
  assemblyModel,
  sujiaoAssemblyCandidatesDraft as lesson,
} from '../content/sujiao-assembly-candidates';
import {
  assemblyFigures,
  assemblySolution,
  fittingCandidates,
  isAssemblyCandidatesVisual,
  outlineArea,
  rotateOutline,
} from './assembly-candidates';
import { exportBackup, parseBackup } from './backup';
import { createSession, evaluate, submitResponse } from './engine';
import { fold } from './fold';
import { overlaps } from './shape-join';
import { initialLibrary } from './storage';
function inside(point: [number, number], polygon: Outline) {
  let result = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const a = polygon[i]!;
    const b = polygon[j]!;
    if (
      a[1] > point[1] !== b[1] > point[1] &&
      point[0] < ((b[0] - a[0]) * (point[1] - a[1])) / (b[1] - a[1]) + a[0]
    )
      result = !result;
  }
  return result;
}
it('finds actual non-overlapping complete placements rather than using category or equal area alone', () => {
  const expected = [['A'], ['A'], ['A', 'B'], ['A', 'B']];
  for (const [index, layout] of assemblyLayouts.entries()) {
    const model = assemblyModel(layout, false);
    const { pieces, targets } = assemblyFigures(model);
    expect(fittingCandidates(model)).toEqual(expected[index]);
    for (const [candidate, target] of targets.entries()) {
      const solution = assemblySolution(pieces, target);
      if (!expected[index]!.includes(String.fromCodePoint(65 + candidate))) {
        expect(solution).toBeNull();
        continue;
      }
      expect(solution).not.toBeNull();
      expect(solution).toHaveLength(pieces.length);
      expect(fold(solution!, 0, (a, p) => a + outlineArea(p))).toBe(
        outlineArea(target),
      );
      const remaining = pieces.map((piece) =>
        [0, 1, 2, 3]
          .map((i) => rotateOutline(piece, i))
          .map((p) =>
            p
              .map(([x, y]) => `${x},${y}`)
              .toSorted()
              .join(';'),
          ),
      );
      for (const piece of solution!) {
        const minX = Math.min(...piece.map((p) => p[0]));
        const minY = Math.min(...piece.map((p) => p[1]));
        const key = piece
          .map(([x, y]) => `${x - minX},${y - minY}`)
          .toSorted()
          .join(';');
        const index = remaining.findIndex((keys) => keys.includes(key));
        expect(index).toBeGreaterThanOrEqual(0);
        remaining.splice(index, 1);
        for (let x = 0.03125; x < 5; x += 0.0625)
          for (let y = 0.03125; y < 5; y += 0.0625)
            if (inside([x, y], piece))
              expect(inside([x, y], target)).toBe(true);
      }
      expect(remaining).toHaveLength(0);
      for (let a = 0; a < solution!.length; a++)
        for (let b = a + 1; b < solution!.length; b++)
          expect(
            overlaps(
              solution![a]!.map(([x, y]) => ({ x, y })),
              solution![b]!.map(([x, y]) => ({ x, y })),
            ),
          ).toBe(false);
    }
  }
  const { pieces, targets } = assemblyFigures(
    assemblyModel('four-squares', false),
  );
  expect(fold(pieces, 0, (a, p) => a + outlineArea(p))).toBe(
    outlineArea(targets[2]!),
  );
  expect(assemblySolution(pieces, targets[2]!)).toBeNull();
});
it('keeps original materials and candidate proportions on one bounded scale without showing a solution partition', () => {
  for (const layout of assemblyLayouts)
    for (const review of [false, true]) {
      const model = assemblyModel(layout, review);
      expect(isAssemblyCandidatesVisual(model)).toBe(true);
      const figures = assemblyFigures(model);
      expect(figures.targets).toHaveLength(3);
      for (const points of [...figures.pieces, ...figures.targets]) {
        const height = Math.max(...points.map((p) => p[1]));
        const width = Math.max(...points.map((p) => p[0]));
        expect(width).toBeLessThanOrEqual(5);
        expect(height).toBeLessThanOrEqual(5);
        for (const [x, y] of points) {
          expect(Number.isInteger(x)).toBe(true);
          expect(Number.isInteger(y)).toBe(true);
          expect(x).toBeGreaterThanOrEqual(0);
          expect(y).toBeGreaterThanOrEqual(0);
          expect(80 + (x - width / 2) * 28).toBeGreaterThan(1);
          expect(80 + (x - width / 2) * 28).toBeLessThan(159);
          expect(80 + (y - height / 2) * 28).toBeGreaterThan(1);
          expect(80 + (y - height / 2) * 28).toBeLessThan(159);
        }
      }
      expect(fittingCandidates(model)).toEqual(
        (() => {
          if (review)
            return layout === 'squares-triangle' || layout === 'four-squares'
              ? ['B', 'C']
              : ['B'];
          return layout === 'squares-triangle' || layout === 'four-squares'
            ? ['A', 'B']
            : ['A'];
        })(),
      );
    }
});
it('requires every fitting candidate and changes review order and orientation while preserving separate practical confirmation', () => {
  for (const questions of [lesson.questions, lesson.reviewQuestions!])
    for (const q of questions.filter((q) => q.id.endsWith('-fit'))) {
      if (q.visual?.kind !== 'assembly-candidates')
        throw new Error('missing assembly model');
      const values = fittingCandidates(q.visual);
      expect(evaluate(q.rule, values)).toBe(true);
      if (values.length > 1)
        expect(evaluate(q.rule, values.slice(0, 1))).toBe(false);
    }
  for (const q of lesson.reviewQuestions!.filter((q) => q.visual)) {
    const original = lesson.questions.find(
      (old) => old.knowledge === q.knowledge,
    )!;
    expect(q.prompt).not.toBe(original.prompt);
    if (
      q.visual?.kind !== 'assembly-candidates' ||
      original.visual?.kind !== 'assembly-candidates'
    )
      throw new Error('missing model');
    expect(assemblyFigures(q.visual)).not.toEqual(
      assemblyFigures(original.visual),
    );
  }
  expect(lesson.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
    3,
  );
});
it('rejects unbounded layouts, extra solutions and corrupted backups while preserving partial-set wrong-first attempts', () => {
  const model = assemblyModel('four-squares', false);
  for (const value of [
    null,
    [],
    { ...model, layout: 'arbitrary' },
    { ...model, variant: true },
    { ...model, answer: ['A', 'B'] },
    { ...model, pieces: [] },
  ])
    expect(isAssemblyCandidatesVisual(value)).toBe(false);
  const state = initialLibrary('指定拼组');
  const session = createSession(
    lesson,
    'sujiao-math-p1-lower-9787574312951',
    state.activeProfileId,
  );
  session.phase = 'practice';
  const index = session.questions.findIndex((q) => q.id.endsWith('-q-3-fit'));
  for (const answer of [['A'], ['A', 'B']]) {
    session.responses[index]!.draft = answer;
    session.responses[index] = submitResponse(
      session.questions[index]!,
      session.responses[index]!,
    );
  }
  state.sessions.push(session);
  expect(parseBackup(exportBackup(state)).data.sessions[0]).toEqual(session);
  expect(session.responses[index]!.submissions.map((s) => s.correct)).toEqual([
    false,
    true,
  ]);
  const bad = structuredClone(state);
  bad.sessions[0]!.questions[index]!.visual = {
    ...model,
    layout: 'unknown',
  } as never;
  expect(() => parseBackup(exportBackup(bad))).toThrow(Error);
});
