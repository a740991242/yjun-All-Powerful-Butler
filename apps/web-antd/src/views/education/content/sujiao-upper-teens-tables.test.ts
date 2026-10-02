import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
} from '../learning/engine';
import { sujiaoUpperTeensTablesLesson as lesson } from './sujiao-upper-teens-tables';
it('fills both complete columns and preserves different story structures and operation types', () => {
  const q = (key: string, review = false) =>
    (review ? lesson.reviewQuestions! : lesson.questions).find(
      (q) => q.knowledge === `${lesson.id}-${key}`,
    )!;
  expect(lesson.questions).toHaveLength(35);
  expect(lesson.reviewQuestions).toHaveLength(28);
  expect(evaluate(q('table-add').rule, [11, 13, 15, 17])).toBe(true);
  expect(evaluate(q('table-subtract').rule, [16, 14, 12, 10])).toBe(true);
  expect(evaluate(q('table-add', true).rule, [11, 13, 15, 17])).toBe(false);
  expect(evaluate(q('table-add', true).rule, [12, 14, 16, 18])).toBe(true);
  expect(evaluate(q('table-subtract', true).rule, [18, 16, 14, 12])).toBe(true);
  for (const [key, main, next] of [
    ['rods-join', 17, 18],
    ['rods-take', 12, 12],
    ['rods-ten', 9, 7],
    ['add-story', 15, 16],
    ['subtract-story', 13, 14],
    ['ten-add-story', 18, 17],
    ['ten-subtract-story', 8, 7],
  ] as const) {
    expect(evaluate(q(key).rule, main)).toBe(true);
    expect(evaluate(q(key, true).rule, next)).toBe(true);
  }
  expect(evaluate(q('chain-0').rule, [10, 13])).toBe(true);
  expect(evaluate(q('chain-3').rule, [10, 2])).toBe(true);
  expect(evaluate(q('complete-ten').rule, [1, 2, 3])).toBe(true);
  for (const key of ['story-structure-add', 'story-structure-subtract']) {
    expect(evaluate(q(key).rule, 'change')).toBe(true);
    expect(evaluate(q(key, true).rule, 'change')).toBe(false);
    expect(evaluate(q(key, true).rule, 'parts')).toBe(true);
  }
  expect(lesson.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
    6,
  );
});
it('round trips four-field zero/null drafts and keeps physical works separate from automatic correct answers', () => {
  const now = '2026-10-02T10:00:00.000Z';
  const s = createSession(lesson, 'sujiao-math-p1-upper-2024', 'child', {
    now,
    seed: 42,
  });
  s.phase = 'practice';
  const index = s.questions.findIndex(
    (q) => q.knowledge === `${lesson.id}-table-add`,
  );
  const wrong = s.questions.findIndex(
    (q) => q.knowledge === `${lesson.id}-table-add`,
  );
  const partial = Array.from({ length: 4 }, (_, i) => {
    if (i === 0) return 0;
    if (i === 2) return 15;
    if (i === 3) return 17;
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
    { ...s.responses[wrong]!, draft: [0, 13, 15, 17] },
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
        return '隔离测试，纸线与圈物实际未做，未来计划另记。';
      throw new Error('Unexpected rule');
    })();
    s.responses[i] = submitResponse(q, { ...s.responses[i]!, draft }, now);
  }
  expect(s.responses[wrong]!.submissions.map((a) => a.correct)).toEqual([
    false,
    true,
  ]);
  expect(statistics(s).finalCorrect).toBe(28);
  expect(statistics(s).manual).toBe(0);
  const reflection = s.questions.findIndex((q) => q.rule.kind === 'reflection');
  expect(s.responses[reflection]!.submissions[0]!.correct).toBeNull();
  expect(parseBackup(exportBackup(data, now)).data.sessions[0]).toEqual(s);
});
