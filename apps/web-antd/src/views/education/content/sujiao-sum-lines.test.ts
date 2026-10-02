import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { isSumLinesVisual } from '../learning/sum-lines';
import { sujiaoSumLinesLesson as lesson } from './sujiao-sum-lines';

it('distinguishes triangle sides, shared centres and checking an incorrect trial', () => {
  for (const [i, tasks] of [
    lesson.questions,
    lesson.reviewQuestions!,
  ].entries()) {
    const q = (suffix: string) => tasks.find((q) => q.id.endsWith(suffix))!;
    for (const question of tasks)
      if (question.visual) expect(isSumLinesVisual(question.visual)).toBe(true);
    const answer = i ? [5, 7, 6] : [7, 5, 4];
    expect(evaluate(q('-triangle').rule, answer)).toBe(true);
    expect(
      evaluate(q('-triangle').rule, [answer[1]!, answer[0]!, answer[2]!]),
    ).toBe(false);
    expect(evaluate(q('-cross').rule, i ? [4, 2] : [4, 3])).toBe(true);
    expect(evaluate(q('-cross').rule, i ? [2, 4] : [3, 4])).toBe(false);
    expect(evaluate(q('-zero').rule, 0)).toBe(true);
    expect(evaluate(q('-zero').rule, 1)).toBe(false);
    expect(evaluate(q('-line').rule, 'left')).toBe(true);
    expect(evaluate(q('-line').rule, 'all')).toBe(false);
    expect(evaluate(q('-centre').rule, 'each')).toBe(true);
    expect(evaluate(q('-centre').rule, 'twice')).toBe(false);
    expect(evaluate(q('-check').rule, 9)).toBe(true);
    expect(evaluate(q('-check').rule, 10)).toBe(false);
  }
  const main = lesson.questions.filter((q) => q.rule.kind !== 'manual');
  expect(main).toHaveLength(6);
  expect(lesson.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
    3,
  );
  for (const [i, q] of main.entries()) {
    expect(lesson.reviewQuestions![i]!.knowledge).toBe(q.knowledge);
    expect(lesson.reviewQuestions![i]!.prompt).not.toBe(q.prompt);
  }
});

it('retains snapshots, partial blanks and first mistakes; rejects answer-bearing or impossible diagrams', () => {
  const now = '2026-10-01T17:00:00.000Z';
  const session = createSession(lesson, 'sujiao-math-p1-upper-2024', 'child', {
    now,
    seed: 21,
  });
  session.phase = 'practice';
  const index = session.questions.findIndex((q) => q.id.endsWith('-triangle'));
  for (const draft of [
    [5, 7, 4],
    [7, 5, 4],
  ])
    session.responses[index] = submitResponse(
      session.questions[index]!,
      { ...session.responses[index]!, draft },
      now,
    );
  const cross = session.questions.findIndex((q) => q.id.endsWith('-cross'));
  session.responses[cross]!.draft = [4, null];
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
  for (const given of [
    [7, 8, 1],
    [-1, 2, 3],
    [1, 2.5, 3],
  ]) {
    const invalid = JSON.parse(backup);
    invalid.data.sessions[0].questions[index].visual.given = given;
    expect(() => parseBackup(JSON.stringify(invalid))).toThrow(Error);
  }
  const invalid = JSON.parse(backup);
  invalid.data.sessions[0].questions[index].visual.answers = [7, 5, 4];
  expect(() => parseBackup(JSON.stringify(invalid))).toThrow(Error);
});
