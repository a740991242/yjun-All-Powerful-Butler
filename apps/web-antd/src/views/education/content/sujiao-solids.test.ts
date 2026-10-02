import { describe, expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  cubeColumnsSolid,
  cubeColumnsTotal,
  isCubeColumnsVisual,
} from '../learning/cube-columns';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
} from '../learning/engine';
import {
  isSolidRowVisual,
  solidCounts,
  solidPositions,
} from '../learning/solid-row';
import { mathBooks } from './math';
import {
  sujiaoSolidBuildDraft,
  sujiaoSolidDrafts,
  sujiaoSolidRecognitionDraft,
} from './sujiao-solids';

describe('sujiao solid recognition and building drafts', () => {
  it('checks all four solids, object counts and complete shapes independently', () => {
    for (const tasks of [
      sujiaoSolidRecognitionDraft.questions,
      sujiaoSolidRecognitionDraft.reviewQuestions!,
    ]) {
      const diagrams = tasks.filter((q) => q.id.includes('-diagram-'));
      expect(diagrams).toHaveLength(4);
      for (const q of diagrams) {
        if (q.visual?.kind !== 'shape') throw new Error('Expected solid');
        expect(evaluate(q.rule, q.visual.shape)).toBe(true);
        expect(['cuboid', 'cube', 'cylinder', 'sphere']).toContain(
          q.visual.shape,
        );
      }
    }
    for (const tasks of [
      sujiaoSolidBuildDraft.questions,
      sujiaoSolidBuildDraft.reviewQuestions!,
    ]) {
      for (const q of tasks) {
        if (q.visual?.kind !== 'cube-columns') continue;
        expect(isCubeColumnsVisual(q.visual)).toBe(true);
        if (q.rule.kind === 'number') {
          expect(evaluate(q.rule, cubeColumnsTotal(q.visual))).toBe(true);
          expect(evaluate(q.rule, cubeColumnsTotal(q.visual) + 1)).toBe(false);
        } else {
          expect(evaluate(q.rule, cubeColumnsSolid(q.visual) ?? 'other')).toBe(
            true,
          );
          expect(evaluate(q.rule, 'cube')).toBe(false);
        }
      }
    }
    expect(
      sujiaoSolidBuildDraft.questions.find((q) => q.id.endsWith('-pattern'))!
        .rule,
    ).toEqual({ kind: 'choice', value: 'cylinder' });
    expect(
      sujiaoSolidBuildDraft.reviewQuestions!.find((q) =>
        q.id.endsWith('-pattern'),
      )!.rule,
    ).toEqual({ kind: 'choice', value: 'sphere' });
    expect(
      sujiaoSolidBuildDraft.questions.find((q) =>
        q.id.endsWith('-instructions'),
      )!.rule,
    ).toEqual({ kind: 'choice', value: 'cube' });
    expect(
      sujiaoSolidBuildDraft.reviewQuestions!.find((q) =>
        q.id.endsWith('-instructions'),
      )!.rule,
    ).toEqual({ kind: 'choice', value: 'cylinder' });
  });
  it('keeps original source drafts independent and reviews associated with the same knowledge', () => {
    for (const lesson of sujiaoSolidDrafts) {
      expect(lesson.status).toBe('preparing');
      expect(
        mathBooks.flatMap((book) =>
          book.units.flatMap((unit) => unit.lessons.map((item) => item.id)),
        ),
      ).not.toContain(lesson.id);
      const objective = lesson.questions.filter(
        (q) => q.rule.kind !== 'manual',
      );
      expect(objective).toHaveLength(
        lesson === sujiaoSolidRecognitionDraft ? 16 : 9,
      );
      expect(lesson.reviewQuestions).toHaveLength(objective.length);
      const ids = [...lesson.questions, ...lesson.reviewQuestions!].map(
        (q) => q.id,
      );
      expect(new Set(ids).size).toBe(ids.length);
      for (const [index, question] of objective.entries())
        expect(lesson.reviewQuestions![index]!.knowledge).toBe(
          question.knowledge,
        );
      if (lesson === sujiaoSolidBuildDraft) {
        for (const [index, q] of objective.entries()) {
          const review = lesson.reviewQuestions![index]!;
          expect(
            JSON.stringify({ prompt: q.prompt, visual: q.visual }),
          ).not.toBe(
            JSON.stringify({ prompt: review.prompt, visual: review.visual }),
          );
        }
      }
    }
  });
  it('preserves first mistakes, manual activities and original cube snapshots through backup, rejecting extra rear depth', () => {
    const now = '2026-10-01T10:00:00.000Z';
    for (const lesson of sujiaoSolidDrafts) {
      const session = createSession(
        lesson,
        'unregistered-source-draft',
        'child',
        { now, seed: 23 },
      );
      session.phase = 'practice';
      const index = session.questions.findIndex(
        (q) => q.rule.kind === 'choice',
      );
      const question = session.questions[index]!;
      if (question.rule.kind !== 'choice') throw new Error('Expected choice');
      const wrong = question.choices!.find(
        (c) =>
          c.id !== (question.rule.kind === 'choice' ? question.rule.value : ''),
      )!.id;
      session.responses[index] = submitResponse(
        question,
        { ...session.responses[index]!, draft: wrong },
        now,
      );
      for (const [position, q] of session.questions.entries()) {
        const draft = (() => {
          if (q.rule.kind === 'choice' || q.rule.kind === 'number')
            return q.rule.value;
          return q.rule.kind === 'steps' ? q.rule.values : 'confirmed';
        })();
        session.responses[position] = submitResponse(
          q,
          { ...session.responses[position]!, draft },
          now,
        );
      }
      expect(statistics(session).manual).toBe(4);
      expect(
        session.responses[index]!.submissions.map((s) => s.correct),
      ).toEqual([false, true]);
      const json = exportBackup(
        {
          schemaVersion: 1,
          activeProfileId: 'child',
          profiles: [{ id: 'child', nickname: '孩子', createdAt: now }],
          sessions: [session],
        },
        now,
      );
      expect(parseBackup(json).data.sessions[0]).toEqual(session);
      if (lesson === sujiaoSolidBuildDraft) {
        const corrupt = JSON.parse(json);
        const cube = corrupt.data.sessions[0].questions.find(
          (q: { visual?: { kind: string } }) =>
            q.visual?.kind === 'cube-columns',
        );
        cube.visual.depth = 2;
        expect(() => parseBackup(JSON.stringify(corrupt))).toThrow(Error);
      }
    }
  });
});

it('checks the full shape row independently of category order and left/right neighbours', () => {
  for (const [review, tasks] of [
    sujiaoSolidRecognitionDraft.questions,
    sujiaoSolidRecognitionDraft.reviewQuestions!,
  ].entries()) {
    const rows = tasks.filter((q) => q.visual?.kind === 'solid-row');
    expect(rows).toHaveLength(6);
    const visual = rows[0]!.visual!;
    if (visual.kind !== 'solid-row') throw new Error('Expected row');
    expect(isSolidRowVisual(visual)).toBe(true);
    const counts = solidCounts(visual);
    expect(visual.shapes.length).toBe(review ? 8 : 7);
    expect(solidPositions(visual, 'sphere')).toEqual(review ? [5] : [3]);
    expect(
      evaluate(
        rows.find((q) => q.id.endsWith('-row-cubes'))!.rule,
        review ? [2, 6] : [1, 6],
      ),
    ).toBe(true);
    expect(
      evaluate(rows.find((q) => q.id.endsWith('-row-cubes'))!.rule, [2, 2]),
    ).toBe(false);
    expect(
      evaluate(rows.find((q) => q.id.endsWith('-row-counts'))!.rule, [
        counts.cube,
        counts.cuboid,
        counts.cylinder,
        counts.sphere,
      ]),
    ).toBe(true);
    const sphere = solidPositions(visual, 'sphere')[0]!;
    expect(
      evaluate(
        rows.find((q) => q.id.endsWith('-row-neighbour-0'))!.rule,
        visual.shapes[sphere - 2]!,
      ),
    ).toBe(true);
    expect(
      evaluate(
        rows.find((q) => q.id.endsWith('-row-neighbour-1'))!.rule,
        visual.shapes[sphere]!,
      ),
    ).toBe(true);
  }
});

it('round-trips changed review diagrams and rejects invalid model rows during backup import', () => {
  const now = '2026-10-01T12:00:00.000Z';
  const session = createSession(
    sujiaoSolidRecognitionDraft,
    'sujiao-math-p1-upper-2024',
    'child',
    {
      now,
      seed: 31,
      questions: sujiaoSolidRecognitionDraft.reviewQuestions,
      mode: 'review',
    },
  );
  const index = session.questions.findIndex((q) =>
    q.id.endsWith('-row-counts'),
  );
  const q = session.questions[index]!;
  if (q.rule.kind !== 'steps') throw new Error('Expected counts');
  session.responses[index]!.draft = [2, null, 2, 1];
  const data = {
    schemaVersion: 1 as const,
    activeProfileId: 'child',
    profiles: [{ id: 'child', nickname: '孩子', createdAt: now }],
    sessions: [session],
  };
  const original = exportBackup(data, now);
  expect(parseBackup(original).data.sessions[0]).toEqual(session);
  session.responses[index] = submitResponse(
    q,
    { ...session.responses[index]!, draft: [1, 1, 1, 1] },
    now,
  );
  session.responses[index] = submitResponse(
    q,
    { ...session.responses[index]!, draft: [2, 3, 2, 1] },
    now,
  );
  expect(session.responses[index]!.submissions.map((s) => s.correct)).toEqual([
    false,
    true,
  ]);
  expect(parseBackup(exportBackup(data, now)).data.sessions[0]).toEqual(
    session,
  );
  for (const change of [
    { shapes: ['sphere'] },
    { shapes: ['sphere', 'triangle'] },
    { answer: 8 },
    { depth: 2 },
  ]) {
    const corrupt = JSON.parse(exportBackup(data, now));
    Object.assign(corrupt.data.sessions[0].questions[index].visual, change);
    expect(() => parseBackup(JSON.stringify(corrupt))).toThrow(Error);
  }
});
