import { describe, expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
} from '../learning/engine';
import { fold } from '../learning/fold';
import { gridPathLength, isGridPathsVisual } from '../learning/grid-paths';
import { isRegionPairVisual } from '../learning/region-pair';
import { sujiaoIntroShapesLesson as lesson } from './sujiao-intro-shapes';

describe('sujiao introductory building and geometry activities', () => {
  it('distinguishes blocks from columns and compares full paths rather than endpoints', () => {
    for (const tasks of [lesson.questions, lesson.reviewQuestions!]) {
      const blocks = tasks.find((q) => q.id.endsWith('-blocks'))!;
      if (blocks.visual?.kind !== 'cube-columns')
        throw new Error('Missing blocks');
      const total = fold(blocks.visual.heights, 0, (a, b) => a + b);
      expect(evaluate(blocks.rule, total)).toBe(true);
      expect(evaluate(blocks.rule, blocks.visual.heights.length)).toBe(false);
      const columns = tasks.find((q) => q.id.endsWith('-columns'))!;
      expect(evaluate(columns.rule, blocks.visual.heights.length)).toBe(true);
      expect(evaluate(columns.rule, total)).toBe(false);
      const shortest = tasks.find((q) => q.id.endsWith('-shortest'))!;
      expect(isGridPathsVisual(shortest.visual)).toBe(true);
      if (shortest.visual?.kind !== 'grid-paths')
        throw new Error('Missing paths');
      const lengths = shortest.visual.paths.map((p) =>
        gridPathLength(p.points),
      );
      const index = lengths.indexOf(Math.min(...lengths));
      expect(evaluate(shortest.rule, shortest.visual.paths[index]!.id)).toBe(
        true,
      );
      const bend = tasks.find((q) => q.id.endsWith('-bend'))!;
      expect(evaluate(bend.rule, lengths[0]!)).toBe(true);
      expect(evaluate(bend.rule, lengths[0]! + 1)).toBe(false);
      expect(
        evaluate(tasks.find((q) => q.id.endsWith('-piece-count'))!.rule, 2),
      ).toBe(true);
    }
  });
  it('uses proper containment and does not infer size from outline thickness', () => {
    for (const tasks of [lesson.questions, lesson.reviewQuestions!]) {
      const region = tasks.find((q) => q.id.endsWith('-region'))!;
      expect(isRegionPairVisual(region.visual)).toBe(true);
      if (region.visual?.kind !== 'region-pair')
        throw new Error('Missing regions');
      const [a, b] = region.visual.sizes;
      const expected = a[0] >= b[0] && a[1] >= b[1] ? 'A' : 'B';
      expect(evaluate(region.rule, expected)).toBe(true);
      expect(evaluate(region.rule, expected === 'A' ? 'B' : 'A')).toBe(false);
      const method = tasks.find((q) => q.id.endsWith('-region-method'))!;
      expect(evaluate(method.rule, 'space')).toBe(true);
      expect(evaluate(method.rule, 'thickness')).toBe(false);
      expect(
        evaluate(tasks.find((q) => q.id.endsWith('-boundary'))!.rule, 'seam'),
      ).toBe(false);
    }
  });
  it('retains diagram snapshots, manual work and first mistakes while rejecting damaged backup geometry', () => {
    const main = lesson.questions.filter((q) => q.rule.kind !== 'manual');
    expect(main).toHaveLength(9);
    expect(lesson.reviewQuestions).toHaveLength(9);
    main.forEach((q, index) => {
      expect(lesson.reviewQuestions![index]!.knowledge).toBe(q.knowledge);
      expect(lesson.reviewQuestions![index]!.prompt).not.toBe(q.prompt);
    });
    const now = '2026-10-01T18:30:00.000Z';
    const session = createSession(
      lesson,
      'sujiao-math-p1-upper-2024',
      'child',
      { now, seed: 67 },
    );
    session.phase = 'practice';
    const index = session.questions.findIndex(
      (q) => q.visual?.kind === 'region-pair',
    );
    const first = session.questions[index]!;
    session.responses[index] = submitResponse(
      first,
      { ...session.responses[index]!, draft: 'A', hintUsed: true },
      now,
    );
    for (const [i, q] of session.questions.entries()) {
      const draft =
        q.rule.kind === 'number' || q.rule.kind === 'choice'
          ? q.rule.value
          : 'confirmed';
      session.responses[i] = submitResponse(
        q,
        { ...session.responses[i]!, draft },
        now,
      );
    }
    expect(statistics(session).manual).toBe(4);
    expect(session.responses[index]!.submissions.map((s) => s.correct)).toEqual(
      [false, true],
    );
    expect(session.responses[index]!.submissions[0]!.assisted).toBe(true);
    const json = exportBackup(
      {
        schemaVersion: 1,
        activeProfileId: 'child',
        profiles: [{ id: 'child', nickname: '孩子', createdAt: now }],
        sessions: [session],
      },
      now,
    );
    const restored = parseBackup(json);
    expect(restored.data.sessions[0]).toEqual(session);
    const visual = restored.data.sessions[0]!.questions[index]!.visual;
    if (visual?.kind !== 'region-pair')
      throw new Error('Missing restored regions');
    visual.sizes[0][0] = 5;
    expect(() => parseBackup(JSON.stringify(restored))).toThrow(Error);
  });
});
