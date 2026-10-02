import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
} from '../learning/engine';
import { initialLibrary } from '../learning/storage';
import { sujiaoEightSevenAddDraft as lesson } from './sujiao-eight-seven-add';

it('distinguishes the two split directions, conserves each addend, and retains zero and ten boundaries', () => {
  for (const [review, questions] of [
    [false, lesson.questions],
    [true, lesson.reviewQuestions!],
  ] as const) {
    const left = review ? 7 : 8;
    const right = review ? 6 : 5;
    const task = (suffix: string) =>
      questions.find(
        (q) => q.id === `${lesson.id}-${review ? 'r' : 'q'}${suffix}`,
      )!;
    expect(
      evaluate(task('-left-ten').rule, [10 - left, right - (10 - left)]),
    ).toBe(true);
    expect(evaluate(task('-left-ten').rule, [10 - left, right])).toBe(false);
    expect(
      evaluate(task('-right-ten').rule, [10 - right, left - (10 - right)]),
    ).toBe(true);
    expect(
      evaluate(task('-right-ten').rule, [10 - left, right - (10 - left)]),
    ).toBe(false);
    expect(evaluate(task('-check-split').rule, 'yes')).toBe(false);
    expect(evaluate(task('-check-split').rule, 'no')).toBe(true);
    expect(evaluate(task('-zero').rule, left)).toBe(true);
    expect(evaluate(task('-ten').rule, 10 + left)).toBe(true);
    expect(evaluate(task('-exchange').rule, 13)).toBe(true);
    expect(evaluate(task('-exchange').rule, 26)).toBe(false);
    for (const q of questions) {
      if (q.visual?.kind === 'ten-frame' && q.rule.kind === 'number') {
        expect(q.visual.left + q.visual.right).toBe(q.rule.value);
        expect(q.rule.value).toBeGreaterThan(10);
        expect(q.rule.value).toBeLessThanOrEqual(19);
      }
    }
  }
  expect(lesson.questions.filter((q) => q.rule.kind !== 'manual')).toHaveLength(
    11,
  );
  expect(lesson.reviewQuestions).toHaveLength(11);
  expect(lesson.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
    3,
  );
});

it('keeps partial split drafts, the wrong first answer and original ten-frame when backing up', () => {
  const state = initialLibrary('测试');
  const session = createSession(
    lesson,
    'unregistered-sujiao-lower-draft',
    state.activeProfileId,
  );
  session.phase = 'practice';
  const index = session.questions.findIndex((q) =>
    q.id.endsWith('-q-left-ten'),
  );
  const question = session.questions[index]!;
  session.responses[index]!.draft = [2, 5];
  session.responses[index] = submitResponse(
    question,
    session.responses[index]!,
  );
  session.responses[index]!.draft = [2, 3];
  session.responses[index] = submitResponse(
    question,
    session.responses[index]!,
  );
  const other = session.questions.findIndex((q) =>
    q.id.endsWith('-q-right-ten'),
  );
  session.responses[other]!.draft = [5, null];
  state.sessions.push(session);
  const restored = parseBackup(exportBackup(state)).data.sessions[0]!;
  expect(restored).toEqual(session);
  expect(restored.responses[index]!.submissions.map((r) => r.correct)).toEqual([
    false,
    true,
  ]);
  expect(restored.responses[other]!.draft).toEqual([5, null]);
  expect(restored.questions[index]!.visual).toEqual({
    kind: 'ten-frame',
    left: 8,
    right: 5,
  });
  expect(statistics(restored).manual).toBe(0);
});
