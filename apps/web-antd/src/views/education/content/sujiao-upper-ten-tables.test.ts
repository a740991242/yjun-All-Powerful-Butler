import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
} from '../learning/engine';
import { sujiaoUpperTenTablesLesson as lesson } from './sujiao-upper-ten-tables';

it('requires complete row order and distinguishes parts, totals and zero difference', () => {
  expect(lesson.questions).toHaveLength(13);
  expect(lesson.reviewQuestions).toHaveLength(8);
  const q = (key: string, review = false) =>
    (review ? lesson.reviewQuestions! : lesson.questions).find(
      (q) => q.knowledge === `${lesson.id}-${key}`,
    )!;
  expect(evaluate(q('chains-other').rule, [9, 8, 7, 6, 5])).toBe(true);
  expect(evaluate(q('chains-other', true).rule, [9, 8, 7, 6, 5])).toBe(false);
  expect(evaluate(q('chains-other', true).rule, [5, 6, 7, 8, 9])).toBe(true);
  expect(evaluate(q('chains-both').rule, [1, 9, 2, 8, 3, 7, 4, 6, 5, 5])).toBe(
    true,
  );
  expect(
    evaluate(q('rows-complements').rule, [9, 8, 7, 6, 5, 4, 3, 2, 1]),
  ).toBe(true);
  expect(
    evaluate(q('rows-totals').rule, [10, 10, 10, 10, 10, 10, 10, 10, 10]),
  ).toBe(true);
  expect(evaluate(q('rows-totals').rule, [9, 8, 7, 6, 5, 4, 3, 2, 1])).toBe(
    false,
  );
  expect(evaluate(q('add-complements').rule, [9, 7, 5, 3, 1])).toBe(true);
  expect(evaluate(q('add-complements', true).rule, [9, 7, 5, 3, 1])).toBe(
    false,
  );
  expect(evaluate(q('add-complements', true).rule, [1, 3, 5, 7, 9])).toBe(true);
  expect(evaluate(q('sub-differences').rule, [8, 6, 4, 2, 0])).toBe(true);
  expect(evaluate(q('sub-differences', true).rule, [0, 2, 4, 6, 8])).toBe(true);
  expect(evaluate(q('trend').rule, 'less')).toBe(true);
  expect(evaluate(q('trend', true).rule, 'more')).toBe(true);
  expect(lesson.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
    4,
  );
});

it('preserves five-field including valid zero partial drafts, wrong attempts and one null self-evaluations without real activity claims', () => {
  const now = '2026-10-02T10:00:00.000Z';
  const s = createSession(lesson, 'sujiao-math-p1-upper-2024', 'child', {
    now,
    seed: 42,
  });
  s.phase = 'practice';
  const index = s.questions.findIndex(
    (q) => q.knowledge === `${lesson.id}-sub-differences`,
  );
  s.responses[index]!.draft = [8, null, 4, null, 0];
  const data = {
    schemaVersion: 1 as const,
    activeProfileId: 'child',
    profiles: [{ id: 'child', nickname: '孩子', createdAt: now }],
    sessions: [s],
  };
  expect(
    parseBackup(exportBackup(data, now)).data.sessions[0]!.responses[index]!
      .draft,
  ).toEqual([8, null, 4, null, 0]);
  s.responses[index] = submitResponse(
    s.questions[index]!,
    { ...s.responses[index]!, draft: [8, 6, 4, 2, 1] },
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
