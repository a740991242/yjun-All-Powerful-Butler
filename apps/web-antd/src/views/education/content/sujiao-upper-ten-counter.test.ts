import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
} from '../learning/engine';
import { sujiaoUpperTenCounterLesson as lesson } from './sujiao-upper-ten-counter';

it('separates bead counts from represented quantity and addition from unit exchange', () => {
  expect(lesson.questions).toHaveLength(13);
  expect(lesson.reviewQuestions).toHaveLength(9);
  const q = (key: string, review = false) =>
    (review ? lesson.reviewQuestions! : lesson.questions).find(
      (q) => q.knowledge === `${lesson.id}-${key}`,
    )!;
  expect(evaluate(q('before-parts').rule, [0, 9, 9])).toBe(true);
  expect(evaluate(q('before-parts', true).rule, [0, 9, 9])).toBe(false);
  expect(evaluate(q('before-parts', true).rule, [0, 8, 8])).toBe(true);
  expect(evaluate(q('need').rule, 1)).toBe(true);
  expect(evaluate(q('need', true).rule, 1)).toBe(false);
  expect(evaluate(q('need', true).rule, 2)).toBe(true);
  expect(evaluate(q('after-parts').rule, [1, 0, 10])).toBe(true);
  expect(evaluate(q('after-parts').rule, [1, 0, 1])).toBe(false);
  expect(evaluate(q('bead-vs-total').rule, 'unit')).toBe(true);
  expect(evaluate(q('bead-vs-total').rule, 'zero')).toBe(false);
  expect(evaluate(q('exchange-conserves').rule, 'same')).toBe(true);
  expect(lesson.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
    3,
  );
  for (const task of [...lesson.questions, ...lesson.reviewQuestions!])
    if (task.visual?.kind === 'digit-counter')
      expect(task.visual.ones).toBeLessThanOrEqual(9);
});

it('preserves counter-field partial drafts, wrong attempts and one null self-evaluations without real activity claims', () => {
  const now = '2026-10-02T10:00:00.000Z';
  const s = createSession(lesson, 'sujiao-math-p1-upper-2024', 'child', {
    now,
    seed: 42,
  });
  s.phase = 'practice';
  const index = s.questions.findIndex(
    (q) => q.knowledge === `${lesson.id}-before-parts`,
  );
  s.responses[index]!.draft = [0, null, 9];
  const data = {
    schemaVersion: 1 as const,
    activeProfileId: 'child',
    profiles: [{ id: 'child', nickname: '孩子', createdAt: now }],
    sessions: [s],
  };
  expect(
    parseBackup(exportBackup(data, now)).data.sessions[0]!.responses[index]!
      .draft,
  ).toEqual([0, null, 9]);
  s.responses[index] = submitResponse(
    s.questions[index]!,
    { ...s.responses[index]!, draft: [0, 8, 8] },
    now,
  );
  for (const [i, q] of s.questions.entries()) {
    if (q.rule.kind === 'manual') continue;
    const answer = (() => {
      if (q.rule.kind === 'steps') return q.rule.values;
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
  expect(statistics(s).finalCorrect).toBe(9);
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
