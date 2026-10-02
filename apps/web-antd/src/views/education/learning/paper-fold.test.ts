import type { FoldPoint } from './paper-fold';
import type { PaperFoldVisual } from './types';

import { expect, it } from 'vitest';

import { sujiaoPaperFoldsDraft as lesson } from '../content/sujiao-paper-folds';
import { exportBackup, parseBackup } from './backup';
import { createSession, evaluate, statistics, submitResponse } from './engine';
import { fold } from './fold';
import {
  foldOutline,
  foldShape,
  isPaperFoldVisual,
  nextFoldLine,
} from './paper-fold';
import { hull, overlaps } from './shape-join';
import { initialLibrary } from './storage';
const area = (points: FoldPoint[]) =>
  Math.abs(
    fold(points, 0, (sum, p, i) => {
      const q = points[(i + 1) % points.length]!;
      return sum + p[0] * q[1] - p[1] * q[0];
    }),
  ) / 2;
it('each fold is a real reflection along the shown crease covering exactly the previous outline in two equal halves', () => {
  for (const paper of ['square', 'rectangle'] as const)
    for (const method of ['cross', 'parallel', 'diagonal'] as const) {
      const model: PaperFoldVisual = {
        kind: 'paper-fold',
        paper,
        method,
        stage: 0,
      };
      expect(isPaperFoldVisual(model)).toBe(true);
      for (const stage of [0, 1] as const) {
        const [a, b] = nextFoldLine(model, stage)!;
        const folded = foldOutline(model, (stage + 1) as 1 | 2);
        const previous = foldOutline(model, stage);
        const dx = b[0] - a[0];
        const dy = b[1] - a[1];
        const length = dx * dx + dy * dy;
        const mirrored = folded.map(([x, y]): FoldPoint => {
          const t = ((x - a[0]) * dx + (y - a[1]) * dy) / length;
          return [2 * (a[0] + t * dx) - x, 2 * (a[1] + t * dy) - y];
        });
        expect(area(folded) * 2).toBeCloseTo(area(previous), 12);
        const toPoints = (points: FoldPoint[]) =>
          points.map(([x, y]) => ({ x, y }));
        expect(overlaps(toPoints(folded), toPoints(mirrored))).toBe(false);
        const boundary = hull(toPoints([...folded, ...mirrored]));
        expect(area(boundary.map((p) => [p.x, p.y]))).toBeCloseTo(
          area(previous),
          12,
        );
        for (const point of [...folded, ...mirrored]) {
          const orientation = previous.map((p, i) => {
            const q = previous[(i + 1) % previous.length]!;
            return (
              (q[0] - p[0]) * (point[1] - p[1]) -
              (q[1] - p[1]) * (point[0] - p[0])
            );
          });
          expect(
            orientation.every((value) => value >= -1e-10) ||
              orientation.every((value) => value <= 1e-10),
          ).toBe(true);
        }
      }
      expect(nextFoldLine(model, 2)).toBeNull();
    }
});
it('strictly validates the original dimensions and prescribed fold paths without result fields', () => {
  for (const value of [
    null,
    {},
    [],
    { kind: 'paper-fold', paper: ['square'], method: 'cross', stage: 0 },
    { kind: 'paper-fold', paper: 'square', method: ['cross'], stage: 0 },
    { kind: 'paper-fold', paper: 'square', method: 'cross', stage: '1' },
    { kind: 'paper-fold', paper: 'square', method: 'cross', stage: 3 },
    { kind: 'paper-fold', paper: 'circle', method: 'cross', stage: 0 },
    { kind: 'paper-fold', paper: 'square', method: 'random', stage: 0 },
    {
      kind: 'paper-fold',
      paper: 'square',
      method: 'cross',
      stage: 0,
      answer: 'square',
    },
  ])
    expect(isPaperFoldVisual(value)).toBe(false);
});
it('grades the prescribed result without drawing it and changes material or method in same-knowledge review', () => {
  expect(lesson.reviewQuestions).toHaveLength(11);
  for (const questions of [lesson.questions, lesson.reviewQuestions!])
    for (const q of questions) {
      if (q.visual?.kind !== 'paper-fold') continue;
      expect(isPaperFoldVisual(q.visual)).toBe(true);
      expect(q.visual.stage).toBeLessThan(2);
      const final = q.id.includes('-result-');
      expect(evaluate(q.rule, foldShape(q.visual, final ? 2 : 1))).toBe(true);
    }
  for (const q of lesson.reviewQuestions!) {
    const original = lesson.questions.find(
      (old) => old.knowledge === q.knowledge,
    )!;
    expect(q.prompt).not.toBe(original.prompt);
    if (q.visual) expect(q.visual).not.toEqual(original.visual);
  }
});
it('preserves an assumed universal square answer as a first mistake followed by the given parallel-fold rectangle', () => {
  const state = initialLibrary('折纸');
  const session = createSession(
    lesson,
    'sujiao-math-p1-lower-9787574312951',
    state.activeProfileId,
  );
  session.phase = 'practice';
  const index = session.questions.findIndex((q) =>
    q.id.endsWith('-q-result-1'),
  );
  session.responses[index]!.draft = 'square';
  session.responses[index] = submitResponse(
    session.questions[index]!,
    session.responses[index]!,
  );
  session.responses[index]!.draft = 'rectangle';
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
  const damaged = structuredClone(state);
  Object.assign(damaged.sessions[0]!.questions[index]!.visual!, {
    method: 'random',
  });
  expect(() => parseBackup(exportBackup(damaged))).toThrow(Error);
});
