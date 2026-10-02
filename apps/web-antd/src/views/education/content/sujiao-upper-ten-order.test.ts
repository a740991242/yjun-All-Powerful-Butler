import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
} from '../learning/engine';
import { sujiaoUpperTenOrderLesson as lesson } from './sujiao-upper-ten-order';

it('accepts every legal coupled integer pair and rejects equality and out-of-range values', () => {
  expect(lesson.questions).toHaveLength(13);
  expect(lesson.reviewQuestions).toHaveLength(8);
  for (const review of [false, true]) {
    const questions = review ? lesson.reviewQuestions! : lesson.questions;
    const anchor = review ? 9 : 10;
    const high = review ? 7 : 9;
    const middle = review ? 6 : 8;
    for (const [key, expected] of [
      ['around-descending', (a: number, b: number) => a > high && high > b],
      ['around-ascending', (a: number, b: number) => a < middle && middle < b],
      ['dependent-descending', (a: number, b: number) => anchor > a && a > b],
    ] as const) {
      const q = questions.find((q) => q.knowledge === `${lesson.id}-${key}`)!;
      for (let a = 0; a <= 10; a++)
        for (let b = 0; b <= 10; b++)
          expect(evaluate(q.rule, [a, b]), `${review}/${key}/${a},${b}`).toBe(
            expected(a, b),
          );
      expect(evaluate(q.rule, [-1, 0])).toBe(false);
      expect(evaluate(q.rule, [11, 0])).toBe(false);
    }
  }
  const task = (key: string, review = false) =>
    (review ? lesson.reviewQuestions! : lesson.questions).find(
      (q) => q.knowledge === `${lesson.id}-${key}`,
    )!;
  expect(
    evaluate(task('full-0-10').rule, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  ).toBe(true);
  expect(
    evaluate(task('full-0-10', true).rule, [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]),
  ).toBe(true);
  expect(
    evaluate(task('full-1-10').rule, [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]),
  ).toBe(true);
  expect(
    evaluate(task('full-1-10', true).rule, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  ).toBe(true);
  expect(evaluate(task('around-descending').rule, [10, 8])).toBe(true);
  expect(evaluate(task('around-descending', true).rule, [10, 8])).toBe(false);
  expect(evaluate(task('around-descending', true).rule, [8, 0])).toBe(true);
  expect(evaluate(task('dependent-descending').rule, [3, 5])).toBe(false);
  expect(evaluate(task('dependent-descending').rule, [1, 0])).toBe(true);
  expect(lesson.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
    4,
  );
});

it('preserves eleven-field including zero partial drafts, wrong attempts and one null self-evaluations without real activity claims', () => {
  const now = '2026-10-02T10:00:00.000Z';
  const s = createSession(lesson, 'sujiao-math-p1-upper-2024', 'child', {
    now,
    seed: 42,
  });
  s.phase = 'practice';
  const index = s.questions.findIndex(
    (q) => q.knowledge === `${lesson.id}-full-0-10`,
  );
  s.responses[index]!.draft = [
    0,
    null,
    null,
    null,
    null,
    5,
    null,
    null,
    null,
    null,
    10,
  ];
  const data = {
    schemaVersion: 1 as const,
    activeProfileId: 'child',
    profiles: [{ id: 'child', nickname: '孩子', createdAt: now }],
    sessions: [s],
  };
  expect(
    parseBackup(exportBackup(data, now)).data.sessions[0]!.responses[index]!
      .draft,
  ).toEqual([0, null, null, null, null, 5, null, null, null, null, 10]);
  s.responses[index] = submitResponse(
    s.questions[index]!,
    { ...s.responses[index]!, draft: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 9] },
    now,
  );
  for (const [i, q] of s.questions.entries()) {
    if (q.rule.kind === 'manual') continue;
    const answer = (() => {
      if (q.rule.kind === 'steps') return q.rule.values;
      if (q.rule.kind === 'number-chain') {
        for (let a = 0; a <= 10; a++)
          for (let b = 0; b <= 10; b++)
            if (evaluate(q.rule, [a, b])) return [a, b];
        throw new Error('Missing legal comparison pair');
      }
      if (q.rule.kind === 'number' || q.rule.kind === 'choice')
        return q.rule.value;
      if (q.rule.kind === 'set') return q.rule.values;
      if (q.rule.kind === 'reflection')
        return '实际尚未做，这是测试；以后计划另记。';
      throw new Error('Unexpected rule');
    })();
    s.responses[i] = submitResponse(
      q,
      { ...s.responses[i]!, draft: answer },
      now,
    );
  }
  expect(s.responses[index]!.submissions.map((a) => a.correct)).toEqual([
    false,
    true,
  ]);
  expect(statistics(s).manual).toBe(0);
  expect(statistics(s).finalCorrect).toBe(8);
  const reflections = s.questions.flatMap((q, i) =>
    q.rule.kind === 'reflection' ? [s.responses[i]!] : [],
  );
  expect(reflections).toHaveLength(1);
  expect(
    reflections.every(
      (r) => r.submissions.length === 1 && r.submissions[0]!.correct === null,
    ),
  ).toBe(true);
  expect(parseBackup(exportBackup(data, now)).data.sessions[0]).toEqual(s);
});
