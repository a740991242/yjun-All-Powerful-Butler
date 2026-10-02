import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
} from '../learning/engine';
import {
  finalReadingTable,
  sujiaoUpperFinalReadingLesson as lesson,
} from './sujiao-upper-final-reading';
it('fills all six daily cells before comparing, keeps same-book unread comparison reversed and does not invent total pages', () => {
  expect(lesson.questions).toHaveLength(15);
  expect(lesson.reviewQuestions).toHaveLength(10);
  for (const review of [false, true]) {
    const qs = review ? lesson.reviewQuestions! : lesson.questions;
    const table = finalReadingTable(review);
    const q = (key: string) =>
      qs.find((q) => q.knowledge === `${lesson.id}-${key}`)!;
    const values = table.pages.flat();
    expect(evaluate(q('six-cells').rule, values)).toBe(true);
    expect(q('six-cells').visual).toEqual({ ...table, display: 'blanks' });
    expect(() =>
      evaluate(q('six-cells').rule, [...values.slice(0, 5), null]),
    ).toThrow('educationLearning.answerRequired');
    const wrong = [...values];
    wrong[1] = values[0]! + values[1]!;
    expect(evaluate(q('six-cells').rule, wrong)).toBe(false);
    expect(
      evaluate(q('totals').rule, review ? [11, 17, 11, 19] : [11, 18, 14, 19]),
    ).toBe(true);
    for (const key of [
      'read-more',
      'unread-more',
      'unknown-total',
      'meaning',
    ]) {
      const right = {
        'read-more': 'b',
        'unread-more': 'a',
        'unknown-total': 'unknown',
        meaning: 'new',
      }[key]!;
      expect(evaluate(q(key).rule, right)).toBe(true);
    }
    expect(evaluate(q('unread-more').rule, 'b')).toBe(false);
    expect(evaluate(q('unknown-total').rule, 'guess')).toBe(false);
    expect(evaluate(q('unread-difference').rule, review ? 2 : 1)).toBe(true);
  }
  expect(
    evaluate(
      lesson.reviewQuestions!.find(
        (q) => q.knowledge === `${lesson.id}-six-cells`,
      )!.rule,
      [6, 5, 7, 8, 6, 5],
    ),
  ).toBe(false);
  expect(lesson.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
    4,
  );
});
it('round trips numbered blank-table snapshots and zero/null drafts, without confirming personal reading or scoring reflections', () => {
  const now = '2026-10-02T10:00:00.000Z';
  const s = createSession(lesson, 'sujiao-math-p1-upper-2024', 'child', {
    now,
    seed: 42,
  });
  s.phase = 'practice';
  const index = s.questions.findIndex(
    (q) => q.knowledge === `${lesson.id}-six-cells`,
  );
  s.responses[index]!.draft = [0, null, 7, null, null, null];
  const data = {
    schemaVersion: 1 as const,
    activeProfileId: 'child',
    profiles: [{ id: 'child', nickname: '孩子', createdAt: now }],
    sessions: [s],
  };
  expect(
    parseBackup(exportBackup(data, now)).data.sessions[0]!.responses[index]!
      .draft,
  ).toEqual([0, null, 7, null, null, null]);
  s.responses[index] = submitResponse(
    s.questions[index]!,
    { ...s.responses[index]!, draft: [6, 11, 7, 8, 14, 5] },
    now,
  );
  for (const [i, q] of s.questions.entries()) {
    if (q.rule.kind === 'manual') continue;
    const draft = (() => {
      if (q.rule.kind === 'steps') return q.rule.values;
      if (q.rule.kind === 'choice' || q.rule.kind === 'number')
        return q.rule.value;
      if (q.rule.kind === 'reflection')
        return '隔离测试，真实三天阅读未做，未来计划另记。';
      throw new Error('Unexpected rule');
    })();
    s.responses[i] = submitResponse(q, { ...s.responses[i]!, draft }, now);
  }
  expect(s.responses[index]!.submissions.map((a) => a.correct)).toEqual([
    false,
    true,
  ]);
  expect(statistics(s).finalCorrect).toBe(10);
  expect(statistics(s).manual).toBe(0);
  expect(
    s.responses[s.questions.findIndex((q) => q.rule.kind === 'reflection')]!
      .submissions[0]!.correct,
  ).toBeNull();
  expect(parseBackup(exportBackup(data, now)).data.sessions[0]).toEqual(s);
});
