import type { Answer, FoldCutJoinVisual } from '../learning/types';

import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { fold } from '../learning/fold';
import {
  foldReflection,
  isFoldCutJoinVisual,
  joinedPaperOutline,
  paperPieces,
  shownPaperPieces,
} from '../learning/fold-cut-join';
import { initialLibrary } from '../learning/storage';
import { sujiaoFoldCutJoinDraft as lesson } from './sujiao-fold-cut-join';
type Point = [number, number];
const area = (p: Point[]) =>
  Math.abs(
    fold(p, 0, (s, a, i) => {
      const b = p[(i + 1) % p.length]!;
      return s + a[0] * b[1] - a[1] * b[0];
    }),
  ) / 2;
const distance = (a: Point, b: Point) => Math.hypot(a[0] - b[0], a[1] - b[1]);
it('keeps two real cut pieces congruent through folding and translation, fills a non-overlapping parallelogram, and bounds every displayed vertex', () => {
  for (const width of [4, 6] as const)
    for (const cut of ['corner', 'diagonal'] as const) {
      const v: FoldCutJoinVisual = {
        kind: 'fold-cut-join',
        width,
        cut,
        stage: 'creased',
      };
      const base = paperPieces(v);
      const outline = joinedPaperOutline(v);
      expect(area(base[0]) + area(base[1])).toBe(width * 2);
      expect(area(outline)).toBe(width * 2);
      expect(base[0]).toHaveLength(cut === 'corner' ? 4 : 3);
      const foldEnd: Point = [cut === 'corner' ? 2 : width, 2];
      expect(foldReflection([0, 0], v)).toEqual([0, 0]);
      expect(foldReflection(foldEnd, v)).toEqual(foldEnd);
      const tip = foldReflection([0, 2], v);
      if (cut === 'corner') expect(tip).toEqual([2, 0]);
      else expect(tip[1]).toBeLessThan(0); // Rectangle diagonal is not a symmetry fold.
      for (const stage of ['folded', 'creased', 'cut', 'joined'] as const) {
        const model = { ...v, stage };
        expect(isFoldCutJoinVisual(model)).toBe(true);
        const shown = shownPaperPieces(model);
        shown.forEach((piece, i) => {
          expect(area(piece)).toBeCloseTo(area(base[i]!), 10);
          piece.forEach((point, j) => {
            expect(distance(point, piece[(j + 1) % piece.length]!)).toBeCloseTo(
              distance(base[i]![j]!, base[i]![(j + 1) % piece.length]!),
              10,
            );
            expect(40 + point[0] * 40).toBeGreaterThanOrEqual(0);
            expect(40 + point[0] * 40).toBeLessThanOrEqual(
              (width * 2 + 2) * 40,
            );
            expect(100 + point[1] * 40).toBeGreaterThanOrEqual(0);
            expect(100 + point[1] * 40).toBeLessThanOrEqual(240);
          });
        });
      }
      const joined = shownPaperPieces({ ...v, stage: 'joined' });
      expect(Math.max(...joined[0].map((p) => p[0]))).toBe(width);
      expect(Math.min(...joined[1].map((p) => p[0]))).toBe(width);
      // Shared vertical edge only: all interiors are on opposite sides.
      expect(joined[0]).toContainEqual([width, 0]);
      expect(joined[0]).toContainEqual([width, 2]);
      expect(joined[1]).toContainEqual([width, 0]);
      expect(joined[1]).toContainEqual([width, 2]);
      const edges = outline.map((a, i): Point => {
        const b = outline[(i + 1) % 4]!;
        return [b[0] - a[0], b[1] - a[1]];
      });
      expect(edges[0]![0] * edges[2]![1] - edges[0]![1] * edges[2]![0]).toBe(0);
      expect(edges[1]![0] * edges[3]![1] - edges[1]![1] * edges[3]![0]).toBe(0);
      expect(
        edges[0]![0] * edges[1]![0] + edges[0]![1] * edges[1]![1],
      ).not.toBe(0);
    }
});
it('grades changed cut endpoints and A boundaries without generalizing arbitrary cuts or confirming actual paper work', () => {
  const main: Answer[] = [
    1,
    2,
    4,
    4,
    'parallelogram',
    1,
    2,
    3,
    4,
    'parallelogram',
    'inside',
    'no',
    0,
    'ask',
  ];
  const review: Answer[] = [
    1,
    2,
    3,
    4,
    'parallelogram',
    1,
    2,
    4,
    4,
    'parallelogram',
    'corner',
    'no',
    0,
    'ask',
  ];
  expect(lesson.steps).toHaveLength(8);
  expect(lesson.questions).toHaveLength(20);
  expect(lesson.reviewQuestions).toHaveLength(14);
  for (let i = 0; i < 14; i++) {
    expect(evaluate(lesson.questions[i]!.rule, main[i]!)).toBe(true);
    expect(evaluate(lesson.reviewQuestions![i]!.rule, review[i]!)).toBe(true);
    expect(lesson.questions[i]!.knowledge).toBe(
      lesson.reviewQuestions![i]!.knowledge,
    );
    if (lesson.questions[i]!.visual)
      expect(lesson.questions[i]!.visual).not.toEqual(
        lesson.reviewQuestions![i]!.visual,
      );
  }
  for (const i of [2, 7, 10])
    expect(evaluate(lesson.reviewQuestions![i]!.rule, main[i]!)).toBe(false);
  expect(evaluate(lesson.questions[0]!.rule, 2)).toBe(false);
  expect(evaluate(lesson.questions[13]!.rule, 'same')).toBe(false);
  expect(lesson.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
    4,
  );
  expect(
    lesson.questions.filter((q) => q.rule.kind === 'reflection'),
  ).toHaveLength(2);
});
it('strictly validates snapshots and retains a wrong-first history with real tasks still unconfirmed', () => {
  const library = initialLibrary('折剪拼');
  const session = createSession(
    lesson,
    'sujiao-math-p1-lower-9787574312951',
    library.activeProfileId,
  );
  library.sessions.push(session);
  const i = session.questions.findIndex((q) => q.id.endsWith('-q-a-sides-0'));
  for (const answer of [3, 4]) {
    session.responses[i]!.draft = answer;
    session.responses[i] = submitResponse(
      session.questions[i]!,
      session.responses[i]!,
    );
  }
  expect(session.responses[i]!.submissions.map((x) => x.correct)).toEqual([
    false,
    true,
  ]);
  expect(parseBackup(exportBackup(library)).data.sessions[0]).toEqual(session);
  expect(
    session.responses
      .filter((_, j) =>
        ['manual', 'reflection'].includes(session.questions[j]!.rule.kind),
      )
      .every((r) => r.submissions.length === 0),
  ).toBe(true);
  const model = {
    kind: 'fold-cut-join',
    width: 4,
    cut: 'corner',
    stage: 'cut',
  };
  for (const patch of [
    { width: 5 },
    { width: '4' },
    { cut: ['corner'] },
    { stage: 'unknown' },
    { stage: ['cut'] },
    { answer: 4 },
    { pieces: [] },
  ]) {
    expect(isFoldCutJoinVisual({ ...model, ...patch })).toBe(false);
    const damaged = structuredClone(library);
    Object.assign(damaged.sessions[0]!.questions[i]!.visual!, patch);
    expect(() => parseBackup(exportBackup(damaged))).toThrow(Error);
  }
});
