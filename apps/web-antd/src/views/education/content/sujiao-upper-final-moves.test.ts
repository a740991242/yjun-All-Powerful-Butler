import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import {
  finalMoveMinimum,
  finalMoveStates,
  sujiaoUpperFinalMovesLesson as lesson,
} from './sujiao-upper-final-moves';
it('checks all free target orientations and locations and distinguishes new state from initial and fixed prefix', () => {
  expect(finalMoveMinimum([1, 2, 3, 2, 1])).toBe(2);
  expect(finalMoveMinimum([2, 1, 3, 1, 2])).toBe(3);
  // A translated target and a depth/height permutation remain legal alternatives.
  expect(finalMoveMinimum([3, 3, 3])).toBe(0);
  expect(finalMoveMinimum([1, 1, 1, 1, 1, 1, 1, 1, 1])).toBe(0);
  for (const review of [false, true]) {
    const state = finalMoveStates(review);
    const qs = review ? lesson.reviewQuestions! : lesson.questions;
    expect(state.initial.reduce((a, b) => a + b, 0)).toBe(9);
    expect(state.next.reduce((a, b) => a + b, 0)).toBe(9);
    expect(finalMoveMinimum(state.next)).toBe(state.minimum);
    const changed = state.initial.map((n, i) => Math.abs(n - state.next[i]!));
    expect(changed.reduce((a, b) => a + b, 0)).toBe(4); // two moved blocks, four changed cells
    const minimum = qs.find((q) => q.knowledge === `${lesson.id}-minimum`)!;
    expect(evaluate(minimum.rule, state.minimum)).toBe(true);
    expect(evaluate(minimum.rule, state.minimum - 1)).toBe(false);
    expect(evaluate(minimum.rule, state.minimum + 2)).toBe(false);
    for (const q of qs) {
      const rule = q.rule;
      if (rule.kind === 'choice')
        expect(q.choices!.some((c) => c.id === rule.value)).toBe(true);
    }
  }
  expect(lesson.questions).toHaveLength(15);
  expect(lesson.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
    5,
  );
  for (const q of lesson.reviewQuestions!) {
    const original = lesson.questions.find((o) => o.knowledge === q.knowledge)!;
    const signature = (v: typeof q) =>
      JSON.stringify([v.prompt, v.visual, v.rule, v.choices]);
    expect(signature(q)).not.toBe(signature(original));
  }
});
it('preserves partial zero drafts, wrong cumulative count and null reflection in existing backup schema', () => {
  const now = '2026-10-02T10:00:00.000Z';
  const session = createSession(lesson, 'sujiao-math-p1-upper-2024', 'child', {
    now,
    seed: 42,
  });
  session.phase = 'practice';
  const index = session.questions.findIndex(
    (q) => q.knowledge === `${lesson.id}-total`,
  );
  session.responses[index]!.draft = [2, null, 0];
  const data = {
    schemaVersion: 1 as const,
    activeProfileId: 'child',
    profiles: [{ id: 'child', nickname: '孩子', createdAt: now }],
    sessions: [session],
  };
  expect(
    parseBackup(exportBackup(data, now)).data.sessions[0]!.responses[index]!
      .draft,
  ).toEqual([2, null, 0]);
  const q = session.questions[index]!;
  expect(() => evaluate(q.rule, [2, null, 0])).toThrow(
    'educationLearning.answerRequired',
  );
  session.responses[index] = submitResponse(
    q,
    { ...session.responses[index]!, draft: [2, 4, 4] },
    now,
  );
  session.responses[index] = submitResponse(
    q,
    { ...session.responses[index]!, draft: [2, 2, 4] },
    now,
  );
  expect(session.responses[index]!.submissions.map((s) => s.correct)).toEqual([
    false,
    true,
  ]);
  const reflectionIndex = session.questions.findIndex(
    (q) => q.rule.kind === 'reflection',
  );
  session.responses[reflectionIndex] = submitResponse(
    session.questions[reflectionIndex]!,
    {
      ...session.responses[reflectionIndex]!,
      draft: '实际尚未操作，未来计划另记。',
    },
    now,
  );
  expect(
    session.responses[reflectionIndex]!.submissions[0]!.correct,
  ).toBeNull();
  expect(parseBackup(exportBackup(data, now)).data.sessions[0]).toEqual(
    session,
  );
});
