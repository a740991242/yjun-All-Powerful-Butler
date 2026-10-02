import { expect, it } from 'vitest';

import { sujiaoMixedCollagesDraft as lesson } from '../content/sujiao-mixed-collages';
import { exportBackup, parseBackup } from './backup';
import { createSession, evaluate, submitResponse } from './engine';
import {
  collageCounts,
  collageLayouts,
  collagePieces,
  isShapeCollageVisual,
} from './shape-collage';
import { isPlanePatch } from './shape-patch';
import { initialLibrary } from './storage';
it('keeps common-scale original materials distinct and within the diagram, changing categories and quantities in review', () => {
  const main = [
    [1, 2, 1, 2],
    [2, 2, 2, 2],
    [3, 1, 2, 2],
    [1, 1, 2, 2],
  ];
  const review = [
    [0, 2, 3, 3],
    [4, 1, 2, 2],
    [3, 3, 0, 3],
    [2, 1, 4, 0],
  ];
  for (const [index, layout] of collageLayouts.entries())
    for (const variant of ['main', 'review'] as const) {
      const visual = { kind: 'shape-collage' as const, layout, variant };
      expect(isShapeCollageVisual(visual)).toBe(true);
      const counts = collageCounts(visual);
      expect([
        counts.rectangle,
        counts.square,
        counts.triangle,
        counts.circle,
      ]).toEqual((variant === 'main' ? main : review)[index]);
      const pieces = collagePieces(visual);
      for (const p of pieces) {
        expect(isPlanePatch(p.patch)).toBe(true);
        expect(16 + (p.x - p.patch.width / 2) * 16).toBeGreaterThan(2);
        expect(16 + (p.x + p.patch.width / 2) * 16).toBeLessThan(254);
        expect(8 + (p.y - p.patch.height / 2) * 16).toBeGreaterThan(2);
        expect(8 + (p.y + p.patch.height / 2) * 16).toBeLessThan(174);
      }
      // Disjoint bounding-box interiors prove none of these supported examples conceal a material piece.
      for (let a = 0; a < pieces.length; a++)
        for (let b = a + 1; b < pieces.length; b++) {
          const p = pieces[a]!;
          const q = pieces[b]!;
          expect(
            Math.abs(p.x - q.x) >= (p.patch.width + q.patch.width) / 2 ||
              Math.abs(p.y - q.y) >= (p.patch.height + q.patch.height) / 2,
          ).toBe(true);
        }
    }
});
it('rejects unsupported layouts, answer fields and arbitrary replacement geometry', () => {
  const visual = { kind: 'shape-collage', layout: 'robot', variant: 'main' };
  for (const v of [
    { ...visual, layout: 'unknown' },
    { ...visual, variant: ['main'] },
    { ...visual, answer: 8 },
    { ...visual, pieces: [] },
    [],
    null,
  ])
    expect(isShapeCollageVisual(v)).toBe(false);
});
it('separates material counts, all present categories, physical work and open stories, with actual new review conditions', () => {
  expect(lesson.steps).toHaveLength(5);
  expect(lesson.questions).toHaveLength(34);
  expect(new Set(lesson.questions.map((q) => q.knowledge)).size).toBe(34);
  expect(lesson.reviewQuestions).toHaveLength(24);
  expect(lesson.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
    5,
  );
  expect(
    lesson.questions.filter((q) => q.rule.kind === 'reflection'),
  ).toHaveLength(5);
  for (const questions of [lesson.questions, lesson.reviewQuestions!])
    for (const q of questions) {
      if (q.visual?.kind !== 'shape-collage') continue;
      const counts = collageCounts(q.visual);
      if (q.rule.kind === 'number') {
        const shape = q.id.split('-').at(-1)!;
        expect(evaluate(q.rule, counts[shape as keyof typeof counts])).toBe(
          true,
        );
      }
      if (q.rule.kind === 'set')
        expect(
          evaluate(
            q.rule,
            Object.keys(counts).filter(
              (key) => counts[key as keyof typeof counts] > 0,
            ),
          ),
        ).toBe(true);
    }
  for (const review of lesson.reviewQuestions!) {
    const original = lesson.questions.find(
      (q) => q.knowledge === review.knowledge,
    )!;
    if (review.visual) expect(review.visual).not.toEqual(original.visual);
    else expect(review.prompt).not.toBe(original.prompt);
  }
});
it('preserves a partially selected category set before correction and open story text without inventing a score', () => {
  const library = initialLibrary('创作');
  const session = createSession(
    lesson,
    'sujiao-math-p1-lower-9787574312951',
    library.activeProfileId,
  );
  const index = session.questions.findIndex((q) => q.id.endsWith('-0-types'));
  for (const answer of [
    ['triangle'],
    ['rectangle', 'square', 'triangle', 'circle'],
  ]) {
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
  const story = session.questions.findIndex(
    (q) => q.id.endsWith('-story') && q.rule.kind === 'reflection',
  );
  session.responses[story]!.draft = '我想把纸片拼成去月球的小车。';
  session.responses[story] = submitResponse(
    session.questions[story]!,
    session.responses[story]!,
  );
  expect(session.responses[story]!.submissions[0]!.correct).toBeNull();
  const reflection = session.questions.findIndex((q) =>
    q.id.endsWith('-reflection'),
  );
  session.responses[reflection]!.draft = '下次先按图形分类，再逐片数。';
  session.responses[reflection] = submitResponse(
    session.questions[reflection]!,
    session.responses[reflection]!,
  );
  expect(session.responses[reflection]!.submissions[0]!.correct).toBeNull();
  expect(session.responses[reflection]!.submissions[0]!.answer).not.toEqual(
    session.responses[story]!.submissions[0]!.answer,
  );
  library.sessions.push(session);
  expect(parseBackup(exportBackup(library)).data.sessions[0]).toEqual(session);
  const bad = structuredClone(library);
  (
    bad.sessions[0]!.questions[index]!.visual as unknown as Record<
      string,
      unknown
    >
  ).answer = 4;
  expect(() => parseBackup(exportBackup(bad))).toThrow(Error);
});
it('keeps version-one snapshots intact and records three independent recollections without confirming physical work', () => {
  const library = initialLibrary('图形实践');
  const previous = createSession(
    {
      ...lesson,
      version: 1,
      questions: lesson.questions.filter(
        (q) =>
          ![
            `${lesson.id}-manual-3`,
            `${lesson.id}-manual-4`,
            `${lesson.id}-reflection-creation`,
            `${lesson.id}-reflection-digits`,
            `${lesson.id}-reflection-relations`,
          ].includes(q.id),
      ),
    },
    'sujiao-math-p1-lower-9787574312951',
    library.activeProfileId,
  );
  expect(previous.questions).toHaveLength(29);
  const oldSnapshot = structuredClone(previous);
  const current = createSession(
    lesson,
    previous.bookId,
    library.activeProfileId,
  );
  expect(current.lessonVersion).toBe(2);
  for (const suffix of ['digits', 'relations', 'creation']) {
    const index = current.questions.findIndex(
      (q) => q.id === `${lesson.id}-reflection-${suffix}`,
    );
    current.responses[index]!.draft =
      `${suffix}：还没有实物，想下次试，这是计划。`;
    current.responses[index] = submitResponse(
      current.questions[index]!,
      current.responses[index]!,
    );
    expect(current.responses[index]!.submissions[0]!.correct).toBeNull();
  }
  const actualWork = current.questions.flatMap((q, index) =>
    q.rule.kind === 'manual' ? [current.responses[index]!] : [],
  );
  expect(actualWork).toHaveLength(5);
  expect(actualWork.every((r) => r.submissions.length === 0)).toBe(true);
  for (const q of previous.questions) {
    const replacement = current.questions.find((item) => item.id === q.id)!;
    expect(replacement.knowledge).toBe(q.knowledge);
    expect(replacement.rule).toEqual(q.rule);
  }
  library.sessions.push(previous, current);
  const restored = parseBackup(exportBackup(library)).data;
  expect(restored.sessions[0]).toEqual(oldSnapshot);
  expect(restored.sessions[1]).toEqual(current);
});
