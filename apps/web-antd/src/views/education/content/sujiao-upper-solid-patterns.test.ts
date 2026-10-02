import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
} from '../learning/engine';
import { sujiaoUpperSolidPatternsLesson as lesson } from './sujiao-upper-solid-patterns';

it('checks each next position against its own changed pattern', () => {
  expect(lesson.questions).toHaveLength(15);
  expect(lesson.reviewQuestions).toHaveLength(10);
  for (const [pattern, answers, review] of [
    ['alternating', ['cuboid', 'cube', 'cuboid'], ['cube', 'cuboid', 'cube']],
    [
      'three-shapes',
      ['cylinder', 'cube', 'sphere'],
      ['cuboid', 'cylinder', 'cube'],
    ],
    ['ball-sizes', ['large', 'small', 'small'], ['small', 'large', 'large']],
  ] as const) {
    for (const [i, answer] of answers.entries()) {
      const knowledge = `${lesson.id}-${pattern}-${i + 7}`;
      const q = lesson.questions.find((q) => q.knowledge === knowledge)!;
      const r = lesson.reviewQuestions!.find((q) => q.knowledge === knowledge)!;
      expect(evaluate(q.rule, answer)).toBe(true);
      expect(evaluate(r.rule, answer)).toBe(false);
      expect(evaluate(r.rule, review[i]!)).toBe(true);
    }
  }
  expect(
    lesson.questions
      .filter((q) => q.rule.kind === 'manual')
      .map((q) => q.knowledge),
  ).toEqual(
    [
      'actual-alternating',
      'actual-three-shapes',
      'actual-ball-sizes',
      'actual-explanation',
    ].map((k) => `${lesson.id}-${k}`),
  );
});

it('preserves three-field partial drafts, wrong attempts and one null self-evaluations without real activity claims', () => {
  const now = '2026-10-02T10:00:00.000Z';
  const s = createSession(lesson, 'sujiao-math-p1-upper-2024', 'child', {
    now,
    seed: 42,
  });
  s.phase = 'practice';
  const index = s.questions.findIndex(
    (q) => q.knowledge === `${lesson.id}-group-lengths`,
  );
  s.responses[index]!.draft = [2, null, 3];
  const data = {
    schemaVersion: 1 as const,
    activeProfileId: 'child',
    profiles: [{ id: 'child', nickname: '孩子', createdAt: now }],
    sessions: [s],
  };
  expect(
    parseBackup(exportBackup(data, now)).data.sessions[0]!.responses[index]!
      .draft,
  ).toEqual([2, null, 3]);
  s.responses[index] = submitResponse(
    s.questions[index]!,
    { ...s.responses[index]!, draft: [3, 3, 3] },
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
