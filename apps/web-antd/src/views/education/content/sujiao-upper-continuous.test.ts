import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
} from '../learning/engine';
import { sujiaoBooks } from './sujiao';
import { sujiaoUpperContinuousLesson as lesson } from './sujiao-upper-continuous';

it('records six current quantities on each independent path and preserves hidden positions', () => {
  expect(sujiaoBooks[0]!.units.find((u) => u.id === 'u2')!.lessons).toContain(
    lesson,
  );
  expect(lesson.questions).toHaveLength(11);
  expect(lesson.reviewQuestions).toHaveLength(8);
  const task = (key: string, review = false) =>
    (review ? lesson.reviewQuestions! : lesson.questions).find(
      (q) => q.knowledge === `${lesson.id}-${key}`,
    )!;
  expect(task('first-path').rule).toEqual({
    kind: 'steps',
    values: [8, 2, 4, 9, 1, 8],
  });
  expect(task('second-path').rule).toEqual({
    kind: 'steps',
    values: [6, 1, 9, 0, 3, 9],
  });
  expect(task('first-path', true).rule).toEqual({
    kind: 'steps',
    values: [6, 1, 7, 4, 8, 1],
  });
  expect(task('second-path', true).rule).toEqual({
    kind: 'steps',
    values: [3, 9, 2, 6, 0, 5],
  });
  expect(evaluate(task('first-path').rule, [5, 8, 2, 4, 9, 1])).toBe(false);
  expect(evaluate(task('second-path').rule, [5, 0, 8, -1, 2, 8])).toBe(false);
  expect(task('fifth-step-start').rule).toEqual({ kind: 'number', value: 9 });
  expect(task('fifth-step-start', true).rule).toEqual({
    kind: 'number',
    value: 4,
  });
  expect(task('hidden-seven').rule).toEqual({ kind: 'choice', value: '圆' });
  expect(task('hidden-nine').rule).toEqual({ kind: 'choice', value: '方' });
  expect(task('hidden-seven', true).rule).toEqual({
    kind: 'choice',
    value: '星',
  });
  expect(task('hidden-nine', true).rule).toEqual({
    kind: 'choice',
    value: '月',
  });
  expect(task('hidden-in-group').rule).toEqual({
    kind: 'steps',
    values: [1, 3],
  });
  for (const tasks of [lesson.questions, lesson.reviewQuestions!])
    for (const q of tasks) {
      if (q.rule.kind === 'choice')
        expect(q.choices!.filter((c) => evaluate(q.rule, c.id))).toHaveLength(
          1,
        );
      if (q.rule.kind === 'steps')
        expect(q.rule.values.every((n) => n >= 0 && n <= 9)).toBe(true);
    }
  expect(
    lesson.questions
      .filter((q) => q.rule.kind === 'manual')
      .map((q) => q.knowledge),
  ).toEqual(
    ['actual-first-path', 'actual-second-path', 'actual-hidden-pattern'].map(
      (key) => `${lesson.id}-${key}`,
    ),
  );
});

it('backs up partial six-step drafts and corrected errors without confirming a real game', () => {
  const now = '2026-10-02T10:00:00.000Z';
  const s = createSession(lesson, 'sujiao-math-p1-upper-2024', 'child', {
    now,
    seed: 42,
  });
  s.phase = 'practice';
  const index = s.questions.findIndex(
    (q) => q.knowledge === `${lesson.id}-first-path`,
  );
  s.responses[index]!.draft = [8, null, null, 9, null, null];
  const data = {
    schemaVersion: 1 as const,
    activeProfileId: 'child',
    profiles: [{ id: 'child', nickname: '孩子', createdAt: now }],
    sessions: [s],
  };
  expect(
    parseBackup(exportBackup(data, now)).data.sessions[0]!.responses[index]!
      .draft,
  ).toEqual(s.responses[index]!.draft);
  s.responses[index] = submitResponse(
    s.questions[index]!,
    { ...s.responses[index]!, draft: [5, 8, 2, 4, 9, 1] },
    now,
  );
  for (const [i, q] of s.questions.entries()) {
    if (q.rule.kind === 'manual') continue;
    const answer = (() => {
      if (q.rule.kind === 'steps') return q.rule.values;
      if (q.rule.kind === 'choice' || q.rule.kind === 'number')
        return q.rule.value;
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
  expect(parseBackup(exportBackup(data, now)).data.sessions[0]).toEqual(s);
});
