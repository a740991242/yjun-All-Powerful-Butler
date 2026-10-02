import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
} from '../learning/engine';
import { sujiaoUpperSolidRecomposeLesson as lesson } from './sujiao-upper-solid-recompose';

it('checks complete whole-piece joins, all valid splits and independent depth counts', () => {
  expect(lesson.questions).toHaveLength(15);
  expect(lesson.reviewQuestions).toHaveLength(10);
  const q = (key: string, review = false) =>
    (review ? lesson.reviewQuestions! : lesson.questions).find(
      (q) => q.knowledge === `${lesson.id}-${key}`,
    )!;
  expect(evaluate(q('cube-join').rule, ['A', 'B'])).toBe(true);
  expect(evaluate(q('cube-join').rule, ['A'])).toBe(false);
  expect(evaluate(q('cylinder-join').rule, 'B')).toBe(true);
  expect(evaluate(q('cylinder-join', true).rule, 'B')).toBe(false);
  expect(evaluate(q('cylinder-join', true).rule, 'C')).toBe(true);
  expect(evaluate(q('cube-split').rule, ['A'])).toBe(true);
  expect(evaluate(q('cube-split', true).rule, ['A'])).toBe(false);
  expect(evaluate(q('cube-split', true).rule, ['A', 'B'])).toBe(true);
  expect(evaluate(q('cylinder-split').rule, ['A', 'B'])).toBe(true);
  expect(evaluate(q('cylinder-split', true).rule, ['A', 'B'])).toBe(false);
  expect(evaluate(q('cylinder-split', true).rule, ['A'])).toBe(true);
  expect(evaluate(q('corner-layers').rule, [3, 2])).toBe(true);
  expect(evaluate(q('corner-layers').rule, [2, 3])).toBe(false);
  expect(evaluate(q('corner-layers', true).rule, [3, 3, 1])).toBe(true);
  expect(evaluate(q('rows-front-back').rule, [3, 3])).toBe(true);
  expect(evaluate(q('rows-front-back', true).rule, [4, 4])).toBe(true);
  expect(lesson.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
    4,
  );
});

it('preserves layer-field partial drafts, wrong attempts and one null self-evaluations without real activity claims', () => {
  const now = '2026-10-02T10:00:00.000Z';
  const s = createSession(lesson, 'sujiao-math-p1-upper-2024', 'child', {
    now,
    seed: 42,
  });
  s.phase = 'practice';
  const index = s.questions.findIndex(
    (q) => q.knowledge === `${lesson.id}-corner-layers`,
  );
  s.responses[index]!.draft = [3, null];
  const data = {
    schemaVersion: 1 as const,
    activeProfileId: 'child',
    profiles: [{ id: 'child', nickname: '孩子', createdAt: now }],
    sessions: [s],
  };
  expect(
    parseBackup(exportBackup(data, now)).data.sessions[0]!.responses[index]!
      .draft,
  ).toEqual([3, null]);
  s.responses[index] = submitResponse(
    s.questions[index]!,
    { ...s.responses[index]!, draft: [3, 3] },
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
  expect(statistics(s).finalCorrect).toBe(10);
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
