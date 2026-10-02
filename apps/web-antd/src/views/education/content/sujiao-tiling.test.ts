import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { isTileGridVisual, tileCounts } from '../learning/tile-grid';
import { sujiaoTilingLesson as lesson } from './sujiao-tiling';

it('uses bounded original and updated grids and distinguishes rows, covered and empty cells', () => {
  for (const [i, questions] of [
    lesson.questions,
    lesson.reviewQuestions!,
  ].entries()) {
    const q = (suffix: string) =>
      questions.find((item) => item.id.endsWith(suffix))!;
    for (const question of questions)
      if (question.visual) {
        expect(isTileGridVisual(question.visual)).toBe(true);
        if (question.visual.kind !== 'tile-grid')
          throw new Error('Wrong visual');
        const counts = tileCounts(question.visual);
        expect(counts.filled).toBeLessThanOrEqual(10);
        expect(counts.empty).toBeLessThanOrEqual(10);
      }
    expect(evaluate(q('-covered').rule, i ? 8 : 9)).toBe(true);
    expect(evaluate(q('-empty').rule, i ? 4 : 3)).toBe(true);
    expect(evaluate(q('-covered').rule, i ? 4 : 3)).toBe(false);
    expect(evaluate(q('-rows').rule, i ? [1, 2, 2, 3] : [2, 3, 4])).toBe(true);
    expect(evaluate(q('-row-number').rule, i ? 4 : 3)).toBe(true);
    expect(evaluate(q('-row-number').rule, i ? 8 : 9)).toBe(false);
    expect(evaluate(q('-add-one').rule, i ? 9 : 10)).toBe(true);
    expect(evaluate(q('-changed').rule, 2)).toBe(true);
    expect(evaluate(q('-changed').rule, 10)).toBe(false);
  }
  const main = lesson.questions.filter((q) => q.rule.kind !== 'manual');
  expect(main).toHaveLength(7);
  expect(lesson.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
    3,
  );
  for (const [i, q] of main.entries()) {
    expect(lesson.reviewQuestions![i]!.knowledge).toBe(q.knowledge);
    expect(lesson.reviewQuestions![i]!.prompt).not.toBe(q.prompt);
  }
});

it('retains first confusion and partial row counts and rejects damaged tile snapshots', () => {
  const now = '2026-10-01T16:00:00.000Z';
  const session = createSession(lesson, 'sujiao-math-p1-upper-2024', 'child', {
    now,
    seed: 13,
  });
  session.phase = 'practice';
  const index = session.questions.findIndex((q) => q.id.endsWith('-covered'));
  for (const draft of [3, 9])
    session.responses[index] = submitResponse(
      session.questions[index]!,
      { ...session.responses[index]!, draft },
      now,
    );
  const rows = session.questions.findIndex((q) => q.id.endsWith('-rows'));
  session.responses[rows]!.draft = [2, null, 4];
  const state = {
    schemaVersion: 1 as const,
    activeProfileId: 'child',
    profiles: [{ id: 'child', nickname: '孩子', createdAt: now }],
    sessions: [session],
  };
  const backup = exportBackup(state, now);
  expect(parseBackup(backup).data.sessions[0]).toEqual(session);
  expect(session.responses[index]!.submissions.map((s) => s.correct)).toEqual([
    false,
    true,
  ]);
  for (const cells of [
    [[true, true], [true]],
    [
      [true, true],
      [true, 'false'],
    ],
    Array.from({ length: 4 }, () => [true, true, true, true]),
  ]) {
    const corrupt = JSON.parse(backup);
    corrupt.data.sessions[0].questions[index].visual.cells = cells;
    expect(() => parseBackup(JSON.stringify(corrupt))).toThrow(Error);
  }
});
