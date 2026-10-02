import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { initialLibrary } from '../learning/storage';
import {
  changedTriangle,
  isTriangleMosaicVisual,
  isTriangleMoveVisual,
  triangleMosaicShape,
  triangleMovement,
} from '../learning/triangle-mosaic';
import {
  sujiaoTriangleMosaicsDraft as lesson,
  triangleOutlines,
} from './sujiao-triangle-mosaics';
it('covers four-piece shapes, one-piece before/after changes, hidden reference counts and distinct reviews', () => {
  expect(lesson.steps).toHaveLength(4);
  expect(
    lesson.questions.filter(
      (q) => !['manual', 'reflection'].includes(q.rule.kind),
    ),
  ).toHaveLength(20);
  expect(lesson.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
    3,
  );
  expect(
    lesson.questions.filter((q) => q.rule.kind === 'reflection'),
  ).toHaveLength(1);
  expect(lesson.reviewQuestions).toHaveLength(20);
  expect(triangleOutlines.map((p) => p.length)).toEqual([10, 6, 16, 12]);
  for (const questions of [lesson.questions, lesson.reviewQuestions!])
    for (const q of questions) {
      const visual = q.visual;
      if (visual?.kind === 'triangle-mosaic') {
        expect(isTriangleMosaicVisual(visual)).toBe(true);
        if (q.id.includes('-shape-'))
          expect(
            evaluate(
              q.rule,
              triangleMosaicShape({ selected: 0, pieces: visual.pieces }),
            ),
          ).toBe(true);
        if (q.id.includes('-count-')) {
          expect(visual.seams).toBe(false);
          expect(evaluate(q.rule, visual.pieces.length)).toBe(true);
        }
      }
      if (visual?.kind === 'triangle-move') {
        expect(isTriangleMoveVisual(visual)).toBe(true);
        if (q.id.includes('-piece-'))
          expect(
            evaluate(
              q.rule,
              String.fromCodePoint(65 + changedTriangle(visual)),
            ),
          ).toBe(true);
        if (q.id.includes('-direction-'))
          expect(evaluate(q.rule, triangleMovement(visual))).toBe(true);
      }
    }
  for (const review of lesson.reviewQuestions!) {
    const original = lesson.questions.find(
      (q) => q.knowledge === review.knowledge,
    )!;
    if (review.visual) expect(review.visual).not.toEqual(original.visual);
    else expect(review.prompt).not.toBe(original.prompt);
    if (review.id.includes('-count-'))
      expect(review.rule).not.toEqual(original.rule);
  }
});
it('retains incorrect changed-piece guesses before correction and separates physical skips from reflection', () => {
  const library = initialLibrary('三角片');
  const session = createSession(
    lesson,
    'sujiao-math-p1-lower-9787574312951',
    library.activeProfileId,
  );
  const index = session.questions.findIndex((q) => q.id.endsWith('-piece-0'));
  for (const answer of ['B', 'A']) {
    session.responses[index]!.draft = answer;
    session.responses[index] = submitResponse(
      session.questions[index]!,
      session.responses[index]!,
    );
  }
  expect(session.responses[index]!.submissions.map((s) => s.correct)).toEqual([
    false,
    true,
  ]);
  library.sessions.push(session);
  expect(parseBackup(exportBackup(library)).data.sessions[0]).toEqual(session);
  const bad = structuredClone(library);
  const question = bad.sessions[0]!.questions[index]!;
  if (question.visual?.kind !== 'triangle-move')
    throw new Error('missing comparison');
  question.visual.after.pieces[1]!.x = 4;
  expect(() => parseBackup(exportBackup(bad))).toThrow(Error);
  expect(evaluate({ kind: 'reflection' }, '我的新摆法')).toBeNull();
});
