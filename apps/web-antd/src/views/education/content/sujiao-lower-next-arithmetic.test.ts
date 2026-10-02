import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
} from '../learning/engine';
import { initialLibrary } from '../learning/storage';
import {
  sujiaoSmallAddInverseDraft as addition,
  sujiaoEightSevenSubtractDraft as subtraction,
} from './sujiao-lower-next-arithmetic';

it('keeps subtraction parts, removal totals and start-point errors distinct for subtracting eight and seven', () => {
  for (const [review, questions] of [
    [false, subtraction.questions],
    [true, subtraction.reviewQuestions!],
  ] as const) {
    const total = review ? 15 : 14;
    const removed = review ? 7 : 8;
    const task = (suffix: string) =>
      questions.find(
        (q) => q.id === `${subtraction.id}-${review ? 'r' : 'q'}-${suffix}`,
      )!;
    expect(
      evaluate(task('to-ten').rule, [
        total - 10,
        removed - (total - 10),
        total - removed,
      ]),
    ).toBe(true);
    expect(
      evaluate(task('to-ten').rule, [total - 10, removed, total - removed]),
    ).toBe(false);
    expect(
      evaluate(task('break-ten').rule, [
        10 - removed,
        total - 10,
        total - removed,
      ]),
    ).toBe(true);
    expect(
      evaluate(task('break-ten').rule, [1, total - 10, total - removed]),
    ).toBe(false);
    expect(evaluate(task('count-back').rule, total - removed)).toBe(true);
    expect(evaluate(task('count-back').rule, total - removed + 1)).toBe(false);
    expect(evaluate(task('inverse').rule, total - removed)).toBe(true);
    expect(evaluate(task('methods').rule, 'both')).toBe(true);
    for (const choice of ['a', 'b'])
      expect(evaluate(task('methods').rule, choice)).toBe(false);
    for (const q of questions.filter((item) =>
      item.id.includes('-difference-'),
    )) {
      const [a, b] = q.id.split('-').slice(-2).map(Number);
      expect(a).toBeGreaterThan(10);
      expect(a! - 10).toBeLessThan(b!);
      expect([7, 8]).toContain(b);
      expect(evaluate(q.rule, a! - b!)).toBe(true);
      expect(evaluate(q.rule, a! - b! - 1)).toBe(false);
    }
  }
  expect(
    subtraction.questions.filter((q) => q.rule.kind !== 'manual'),
  ).toHaveLength(9);
  expect(subtraction.reviewQuestions).toHaveLength(9);
});

it('keeps both make-ten directions and independent whole/part questions, with all sums in the observed teen range', () => {
  for (const [review, questions] of [
    [false, addition.questions],
    [true, addition.reviewQuestions!],
  ] as const) {
    const a = review ? 4 : 6;
    const b = review ? 9 : 7;
    const task = (suffix: string) =>
      questions.find(
        (q) => q.id === `${addition.id}-${review ? 'r' : 'q'}-${suffix}`,
      )!;
    expect(evaluate(task('first-ten').rule, [10 - a, 3])).toBe(true);
    expect(evaluate(task('second-ten').rule, [10 - b, 3])).toBe(true);
    expect(evaluate(task('relations').rule, [a, b])).toBe(true);
    expect(evaluate(task('relations').rule, [b, a])).toBe(false);
    expect(evaluate(task('relations').rule, [a, 0])).toBe(false);
    expect(evaluate(task('missing').rule, b)).toBe(true);
    expect(evaluate(task('story').rule, b)).toBe(true);
    expect(evaluate(task('story').rule, 13 + a)).toBe(false);
    expect(evaluate(task('preserve').rule, 'no')).toBe(true);
    for (const q of questions) {
      if (q.visual?.kind !== 'ten-frame' || q.rule.kind !== 'number') continue;
      expect(q.visual.left + q.visual.right).toBeGreaterThan(10);
      expect(q.visual.left + q.visual.right).toBeLessThanOrEqual(19);
      expect(evaluate(q.rule, q.visual.left + q.visual.right)).toBe(true);
    }
  }
  expect(
    addition.questions.filter((q) => q.rule.kind !== 'manual'),
  ).toHaveLength(12);
  expect(addition.reviewQuestions).toHaveLength(12);
});

it('backs up partial multi-step drafts, an immutable first error, reviewed diagrams and unconfirmed physical work', () => {
  for (const [lesson, suffix, wrong, correct] of [
    [subtraction, 'break-ten', [1, 4, 6], [2, 4, 6]],
    [addition, 'first-ten', [4, 7], [4, 3]],
  ] as const) {
    const state = initialLibrary('测试');
    const session = createSession(
      lesson,
      'unregistered-sujiao-lower-draft',
      state.activeProfileId,
    );
    session.phase = 'practice';
    const index = session.questions.findIndex(
      (q) => q.id === `${lesson.id}-q-${suffix}`,
    );
    const q = session.questions[index]!;
    session.responses[index]!.draft = [...wrong];
    session.responses[index] = submitResponse(q, session.responses[index]!);
    session.responses[index]!.draft = [...correct];
    session.responses[index] = submitResponse(q, session.responses[index]!);
    const partial = session.questions.findIndex(
      (item) => item.rule.kind === 'steps' && item.id !== q.id,
    );
    const rule = session.questions[partial]!.rule;
    if (rule.kind !== 'steps') throw new Error('missing second step question');
    session.responses[partial]!.draft = rule.values.map((value, position) =>
      position === 0 ? value : null,
    );
    state.sessions.push(session);
    const restored = parseBackup(exportBackup(state)).data.sessions[0]!;
    expect(restored).toEqual(session);
    expect(
      restored.responses[index]!.submissions.map((s) => s.correct),
    ).toEqual([false, true]);
    expect(restored.responses[partial]!.draft).toContain(null);
    expect(statistics(restored).manual).toBe(0);
    expect(
      lesson.questions.filter((item) => item.rule.kind === 'manual'),
    ).toHaveLength(3);
    expect(lesson.status).toBe('preparing');
  }
});
