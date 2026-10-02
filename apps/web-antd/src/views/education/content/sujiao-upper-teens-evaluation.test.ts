import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
} from '../learning/engine';
import { sujiaoUpperTeensEvaluationLesson as lesson } from './sujiao-upper-teens-evaluation';
it('keeps three evaluation aspects independent and distinguishes units from number of markers', () => {
  const q = (key: string, review = false) =>
    (review ? lesson.reviewQuestions! : lesson.questions).find(
      (q) => q.knowledge === `${lesson.id}-${key}`,
    )!;
  expect(lesson.questions).toHaveLength(14);
  expect(lesson.reviewQuestions).toHaveLength(7);
  expect(evaluate(q('composition').rule, [1, 6])).toBe(true);
  expect(evaluate(q('composition', true).rule, [1, 6])).toBe(false);
  expect(evaluate(q('composition', true).rule, [8, 1])).toBe(true);
  expect(evaluate(q('all-ones').rule, 6)).toBe(false);
  expect(evaluate(q('all-ones').rule, 16)).toBe(true);
  expect(evaluate(q('add-process').rule, [5, 15])).toBe(true);
  expect(evaluate(q('subtract-process').rule, [3, 13])).toBe(true);
  expect(evaluate(q('ten-marker').rule, [14, 5])).toBe(true);
  expect(evaluate(q('ten-marker').rule, [5, 14])).toBe(false);
  expect(evaluate(q('ten-marker', true).rule, [17, 8])).toBe(true);
  expect(lesson.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
    4,
  );
  expect(
    lesson.questions
      .filter((q) => q.rule.kind === 'reflection')
      .map((q) => q.knowledge),
  ).toEqual(
    [
      'reflection-recognition',
      'reflection-operation',
      'reflection-process',
    ].map((key) => `${lesson.id}-${key}`),
  );
  expect(evaluate(q('agreement').rule, 'guess')).toBe(false);
  expect(evaluate(q('independent-evidence').rule, 'auto')).toBe(false);
});
it('round trips two-field value/null drafts and keeps physical works separate from automatic correct answers', () => {
  const now = '2026-10-02T10:00:00.000Z';
  const s = createSession(lesson, 'sujiao-math-p1-upper-2024', 'child', {
    now,
    seed: 42,
  });
  s.phase = 'practice';
  const index = s.questions.findIndex(
    (q) => q.knowledge === `${lesson.id}-composition`,
  );
  const wrong = s.questions.findIndex(
    (q) => q.knowledge === `${lesson.id}-all-ones`,
  );
  const partial = Array.from({ length: 2 }, (_, i) => {
    if (i === 0) return 1;
    return null;
  });
  s.responses[index]!.draft = partial;
  const data = {
    schemaVersion: 1 as const,
    activeProfileId: 'child',
    profiles: [{ id: 'child', nickname: '孩子', createdAt: now }],
    sessions: [s],
  };
  expect(
    parseBackup(exportBackup(data, now)).data.sessions[0]!.responses[index]!
      .draft,
  ).toEqual(partial);
  s.responses[wrong] = submitResponse(
    s.questions[wrong]!,
    { ...s.responses[wrong]!, draft: 0 },
    now,
  );
  for (const [i, q] of s.questions.entries()) {
    if (q.rule.kind === 'manual') continue;
    const draft = (() => {
      if (q.rule.kind === 'steps' || q.rule.kind === 'set')
        return q.rule.values;
      if (q.rule.kind === 'number' || q.rule.kind === 'choice')
        return q.rule.value;
      if (q.rule.kind === 'reflection')
        return `隔离测试：${q.knowledge}实际未做，未来计划另记。`;
      throw new Error('Unexpected rule');
    })();
    s.responses[i] = submitResponse(q, { ...s.responses[i]!, draft }, now);
  }
  expect(s.responses[wrong]!.submissions.map((a) => a.correct)).toEqual([
    false,
    true,
  ]);
  expect(statistics(s).finalCorrect).toBe(7);
  expect(statistics(s).manual).toBe(0);
  const reflections = s.questions.flatMap((q, i) =>
    q.rule.kind === 'reflection' ? [i] : [],
  );
  expect(reflections).toHaveLength(3);
  for (const i of reflections)
    expect(s.responses[i]!.submissions[0]!.correct).toBeNull();
  expect(parseBackup(exportBackup(data, now)).data.sessions[0]).toEqual(s);
});
