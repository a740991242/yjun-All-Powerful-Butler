import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { isDigitCounterVisual } from '../learning/digit-counter';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
} from '../learning/engine';
import { sujiaoUpperTeensCounterLesson as lesson } from './sujiao-upper-teens-counter';
it('covers all nine place-sensitive counter models and changes both arithmetic conditions in review', () => {
  expect(lesson.questions).toHaveLength(15);
  expect(lesson.reviewQuestions).toHaveLength(11);
  const task = (key: string, review = false) =>
    (review ? lesson.reviewQuestions! : lesson.questions).find(
      (q) => q.knowledge === `${lesson.id}-${key}`,
    )!;
  for (const review of [false, true]) {
    const values: number[] = [];
    for (let index = 0; index < 9; index++) {
      const ones = review ? 9 - index : index + 1;
      const q = task(`read-${index}`, review);
      expect(q.visual).toEqual({ kind: 'digit-counter', tens: 1, ones });
      expect(isDigitCounterVisual(q.visual)).toBe(true);
      expect(evaluate(q.rule, 10 + ones)).toBe(true);
      expect(evaluate(q.rule, 1 + ones)).toBe(false);
      values.push(10 + ones);
    }
    expect(values.toSorted((a, b) => a - b)).toEqual([
      11, 12, 13, 14, 15, 16, 17, 18, 19,
    ]);
  }
  expect(evaluate(task('read-0', true).rule, 11)).toBe(false);
  expect(task('add-after').visual).toEqual({
    kind: 'digit-counter',
    tens: 1,
    ones: 3,
  });
  expect(evaluate(task('add-after').rule, [1, 3])).toBe(false);
  expect(evaluate(task('add-after').rule, [1, 5])).toBe(true);
  expect(evaluate(task('add-after', true).rule, [1, 5])).toBe(false);
  expect(evaluate(task('add-after', true).rule, [1, 6])).toBe(true);
  expect(evaluate(task('subtract-after').rule, [1, 3])).toBe(true);
  expect(evaluate(task('subtract-after', true).rule, [1, 4])).toBe(true);
  expect(lesson.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
    3,
  );
  expect(task('actual-nine-states').prompt).toContain('九种');
  expect(task('actual-explain').prompt).toContain('四个计数器');
  expect(task('actual-explain').prompt).toContain('比较13与16、19与18');
});
it('preserves partial after-state and wrong history without claiming physical operations happened', () => {
  const now = '2026-10-02T10:00:00.000Z';
  const s = createSession(lesson, 'sujiao-math-p1-upper-2024', 'child', {
    now,
    seed: 42,
  });
  s.phase = 'practice';
  const add = s.questions.findIndex(
    (q) => q.knowledge === `${lesson.id}-add-after`,
  );
  const sub = s.questions.findIndex(
    (q) => q.knowledge === `${lesson.id}-subtract-after`,
  );
  s.responses[sub]!.draft = [1, null];
  const data = {
    schemaVersion: 1 as const,
    activeProfileId: 'child',
    profiles: [{ id: 'child', nickname: '孩子', createdAt: now }],
    sessions: [s],
  };
  expect(
    parseBackup(exportBackup(data, now)).data.sessions[0]!.responses[sub]!
      .draft,
  ).toEqual([1, null]);
  s.responses[add] = submitResponse(
    s.questions[add]!,
    { ...s.responses[add]!, draft: [1, 3] },
    now,
  );
  for (const [i, q] of s.questions.entries()) {
    if (q.rule.kind === 'manual') continue;
    const draft = (() => {
      if (q.rule.kind === 'steps') return q.rule.values;
      if (q.rule.kind === 'number') return q.rule.value;
      if (q.rule.kind === 'reflection')
        return '隔离测试，实际拨珠未做，下一步计划另记。';
      throw new Error('Unexpected rule');
    })();
    s.responses[i] = submitResponse(q, { ...s.responses[i]!, draft }, now);
  }
  expect(s.responses[add]!.submissions.map((a) => a.correct)).toEqual([
    false,
    true,
  ]);
  expect(statistics(s).finalCorrect).toBe(11);
  expect(statistics(s).manual).toBe(0);
  const reflection = s.questions.findIndex((q) => q.rule.kind === 'reflection');
  expect(s.responses[reflection]!.submissions[0]!.correct).toBeNull();
  expect(parseBackup(exportBackup(data, now)).data.sessions[0]).toEqual(s);
});
