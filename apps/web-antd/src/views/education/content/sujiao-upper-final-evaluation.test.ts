import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
} from '../learning/engine';
import { sujiaoUpperFinalEvaluationLesson as lesson } from './sujiao-upper-final-evaluation';
it('covers all five assessment aspects with distinct actual evidence and five ungraded reflections', () => {
  expect(lesson.questions).toHaveLength(18);
  expect(lesson.reviewQuestions).toHaveLength(8);
  for (const key of [
    'numbers',
    'calculation',
    'solids',
    'position',
    'expression',
  ]) {
    expect(
      lesson.questions.find((q) => q.knowledge === `${lesson.id}-actual-${key}`)
        ?.rule.kind,
    ).toBe('manual');
    expect(
      lesson.questions.find(
        (q) => q.knowledge === `${lesson.id}-reflection-${key}`,
      )?.rule.kind,
    ).toBe('reflection');
  }
  expect(
    new Set(
      lesson.questions
        .filter((q) => q.rule.kind === 'reflection')
        .map((q) => q.prompt),
    ).size,
  ).toBe(5);
  const q = (key: string, review = false) =>
    (review ? lesson.reviewQuestions! : lesson.questions).find(
      (q) => q.knowledge === `${lesson.id}-${key}`,
    )!;
  const nums = Array.from({ length: 20 }, (_, i) => i);
  expect(evaluate(q('all-numbers').rule, nums)).toBe(true);
  expect(evaluate(q('all-numbers', true).rule, nums.toReversed())).toBe(true);
  expect(evaluate(q('ten-unit').rule, [1, 7])).toBe(true);
  expect(evaluate(q('ten-unit', true).rule, [4, 1])).toBe(true);
  expect(evaluate(q('arithmetic').rule, [10, 6, 6, 0, 9])).toBe(true);
  expect(evaluate(q('arithmetic', true).rule, [10, 4, 4, 0, 6])).toBe(true);
  expect(evaluate(q('application').rule, 7)).toBe(true);
  expect(evaluate(q('application', true).rule, 4)).toBe(true);
  expect(evaluate(q('body-direction').rule, 'right')).toBe(true);
  expect(evaluate(q('body-direction', true).rule, 'left')).toBe(true);
  expect(evaluate(q('independent').rule, 'auto')).toBe(false);
});
it('saves each reflection separately with null correctness while zero/null numeric drafts and manual incompletion survive backup', () => {
  const now = '2026-10-02T10:00:00.000Z';
  const s = createSession(lesson, 'sujiao-math-p1-upper-2024', 'child', {
    now,
    seed: 42,
  });
  s.phase = 'practice';
  const index = s.questions.findIndex(
    (q) => q.knowledge === `${lesson.id}-arithmetic`,
  );
  s.responses[index]!.draft = [null, null, null, 0, null];
  const data = {
    schemaVersion: 1 as const,
    activeProfileId: 'child',
    profiles: [{ id: 'child', nickname: '孩子', createdAt: now }],
    sessions: [s],
  };
  expect(
    parseBackup(exportBackup(data, now)).data.sessions[0]!.responses[index]!
      .draft,
  ).toEqual([null, null, null, 0, null]);
  s.responses[index] = submitResponse(
    s.questions[index]!,
    { ...s.responses[index]!, draft: [0, 0, 0, 0, 0] },
    now,
  );
  for (const [i, q] of s.questions.entries()) {
    if (q.rule.kind === 'manual') continue;
    const draft = (() => {
      if (q.rule.kind === 'steps' || q.rule.kind === 'set')
        return q.rule.values;
      if (q.rule.kind === 'choice' || q.rule.kind === 'number')
        return q.rule.value;
      if (q.rule.kind === 'reflection')
        return `隔离测试${q.knowledge}：实际未做，未来计划另记。`;
      throw new Error('Unexpected rule');
    })();
    s.responses[i] = submitResponse(q, { ...s.responses[i]!, draft }, now);
  }
  expect(s.responses[index]!.submissions.map((a) => a.correct)).toEqual([
    false,
    true,
  ]);
  expect(statistics(s).finalCorrect).toBe(8);
  expect(statistics(s).manual).toBe(0);
  const reflections = s.questions
    .map((q, i) => ({ q, r: s.responses[i]! }))
    .filter(({ q }) => q.rule.kind === 'reflection');
  expect(reflections).toHaveLength(5);
  expect(new Set(reflections.map(({ r }) => r.draft)).size).toBe(5);
  expect(reflections.every(({ r }) => r.submissions[0]!.correct === null)).toBe(
    true,
  );
  expect(parseBackup(exportBackup(data, now)).data.sessions[0]).toEqual(s);
});
