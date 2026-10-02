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
  sujiaoCalculationApplicationsDraft as calculation,
  sujiaoConditionsPairsDraft as conditions,
} from './sujiao-lower-applications';

it('keeps continuous calculations, independent table columns and both endpoint conventions distinct', () => {
  for (const [review, questions] of [
    [false, calculation.questions],
    [true, calculation.reviewQuestions!],
  ] as const) {
    const task = (suffix: string) =>
      questions.find(
        (q) => q.id === `${calculation.id}-${review ? 'r' : 'q'}-${suffix}`,
      )!;
    const chains = review
      ? [
          [12, 5],
          [8, 14],
          [11, 15],
        ]
      : [
          [12, 5],
          [8, 13],
          [11, 17],
        ];
    chains.forEach((answer, index) =>
      expect(evaluate(task(`chain-${index}`).rule, answer)).toBe(true),
    );
    expect(evaluate(task('chain-0').rule, [12, review ? 2 : 1])).toBe(false);
    expect(evaluate(task('table').rule, review ? [12, 7, 8] : [13, 6, 8])).toBe(
      true,
    );
    expect(evaluate(task('table').rule, [0, 0, 0])).toBe(false);
    expect(evaluate(task('table-total').rule, 'all')).toBe(false);
    expect(evaluate(task('table-total').rule, 'column')).toBe(true);
    expect(evaluate(task('between').rule, review ? 7 : 6)).toBe(true);
    expect(evaluate(task('between').rule, review ? 8 : 7)).toBe(false);
    expect(evaluate(task('include-ends').rule, review ? 9 : 8)).toBe(true);
    expect(evaluate(task('include-ends').rule, review ? 7 : 6)).toBe(false);
    const known = review ? 13 : 12;
    const current = review ? 8 : 9;
    const legal = Array.from({ length: 11 }, (_, extra) => extra).find(
      (extra) => current + extra > known,
    );
    expect(evaluate(task('least-more').rule, legal!)).toBe(true);
    expect(evaluate(task('least-more').rule, known - current)).toBe(false);
    expect(evaluate(task('least-more').rule, legal! + 1)).toBe(false);
    expect(evaluate(task('comparison').rule, 'left')).toBe(false);
    expect(evaluate(task('comparison').rule, 'right')).toBe(true);
    expect(evaluate(task('smallest').rule, 'b')).toBe(true);
  }
  expect(
    calculation.questions.filter((q) => q.rule.kind !== 'manual'),
  ).toHaveLength(11);
  expect(calculation.reviewQuestions).toHaveLength(11);
});

it('refuses missing quantities and enumerates exactly three distinct two-box combinations', () => {
  for (const [review, questions] of [
    [false, conditions.questions],
    [true, conditions.reviewQuestions!],
  ] as const) {
    const task = (suffix: string) =>
      questions.find(
        (q) => q.id === `${conditions.id}-${review ? 'r' : 'q'}-${suffix}`,
      )!;
    expect(evaluate(task('needed').rule, 'read')).toBe(true);
    for (const value of ['color', 'name'])
      expect(evaluate(task('needed').rule, value)).toBe(false);
    expect(evaluate(task('unknown').rule, 'no')).toBe(true);
    expect(evaluate(task('unknown').rule, 'yes')).toBe(false);
    expect(evaluate(task('missing-box').rule, 'no')).toBe(true);
    expect(evaluate(task('missing-box').rule, 'yes')).toBe(false);
    expect(evaluate(task('with-condition').rule, 11)).toBe(true);
    expect(evaluate(task('question').rule, 'upper')).toBe(true);
    expect(evaluate(task('question').rule, 'new')).toBe(false);
    expect(evaluate(task('question').rule, 'pages')).toBe(false);
    const totals = review ? [9, 12, 15] : [11, 12, 15];
    expect(evaluate(task('pair-totals').rule, totals)).toBe(true);
    expect(evaluate(task('pair-totals').rule, [...totals].toReversed())).toBe(
      false,
    );
    expect(evaluate(task('extremes').rule, review ? [9, 15] : [11, 15])).toBe(
      true,
    );
    expect(evaluate(task('extremes').rule, [4, review ? 18 : 19])).toBe(false);
    expect(evaluate(task('max-boxes').rule, 'bc')).toBe(true);
    expect(evaluate(task('complete-story').rule, review ? 9 : 7)).toBe(true);
  }
  expect(
    conditions.questions.filter((q) => q.rule.kind !== 'manual'),
  ).toHaveLength(9);
  expect(conditions.reviewQuestions).toHaveLength(9);
});

it('preserves original tables, partial pair drafts, the wrong first answer and physical confirmations separately', () => {
  for (const [lesson, suffix, wrong, answer, partialSuffix] of [
    [calculation, 'between', 7, 6, 'table'],
    [conditions, 'unknown', 'yes', 'no', 'pair-totals'],
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
    session.responses[index]!.draft = wrong;
    session.responses[index] = submitResponse(q, session.responses[index]!);
    session.responses[index]!.draft = answer;
    session.responses[index] = submitResponse(q, session.responses[index]!);
    const partial = session.questions.findIndex(
      (item) => item.id === `${lesson.id}-q-${partialSuffix}`,
    );
    const rule = session.questions[partial]!.rule;
    if (rule.kind !== 'steps') throw new Error('missing multi-step task');
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
