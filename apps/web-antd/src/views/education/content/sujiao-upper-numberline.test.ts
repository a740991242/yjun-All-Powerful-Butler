import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
} from '../learning/engine';
import { sujiaoBooks } from './sujiao';
import { sujiaoUpperNumberlineLesson as lesson } from './sujiao-upper-numberline';

it('counts travelled intervals instead of starting marks and continues from intermediate landings', () => {
  expect(sujiaoBooks[0]!.units.find((u) => u.id === 'u2')!.lessons).toContain(
    lesson,
  );
  expect(lesson.questions).toHaveLength(15);
  expect(lesson.reviewQuestions).toHaveLength(10);
  const task = (key: string, review = false) =>
    (review ? lesson.reviewQuestions! : lesson.questions).find(
      (q) => q.knowledge === `${lesson.id}-${key}`,
    )!;
  expect(task('forward-landings').rule).toEqual({
    kind: 'steps',
    values: [3, 4, 5, 6, 7, 8],
  });
  expect(task('backward-landings').rule).toEqual({
    kind: 'steps',
    values: [7, 6, 5, 4],
  });
  expect(evaluate(task('forward-landings').rule, [2, 3, 4, 5, 6, 7])).toBe(
    false,
  );
  expect(evaluate(task('backward-landings').rule, [8, 7, 6, 5])).toBe(false);
  expect(task('two-additions').rule).toEqual({ kind: 'steps', values: [6, 8] });
  expect(task('two-subtractions').rule).toEqual({
    kind: 'steps',
    values: [4, 0],
  });
  expect(task('add-then-subtract').rule).toEqual({
    kind: 'steps',
    values: [8, 6],
  });
  expect(task('subtract-then-add').rule).toEqual({
    kind: 'steps',
    values: [3, 7],
  });
  expect(evaluate(task('two-additions').rule, [6, 7])).toBe(false);
  expect(evaluate(task('two-subtractions').rule, [4, 2])).toBe(false);
  expect(task('two-additions', true).rule).toEqual({
    kind: 'steps',
    values: [6, 9],
  });
  expect(task('two-subtractions', true).rule).toEqual({
    kind: 'steps',
    values: [6, 2],
  });
  expect(task('add-then-subtract', true).rule).toEqual({
    kind: 'steps',
    values: [8, 5],
  });
  expect(task('subtract-then-add', true).rule).toEqual({
    kind: 'steps',
    values: [3, 6],
  });
  for (const q of lesson.reviewQuestions!) {
    const main = task(q.knowledge.slice(lesson.id.length + 1));
    if (main.rule.kind === 'steps' && q.rule.kind === 'steps') {
      const values = main.rule.values;
      if (values.length === q.rule.values.length)
        expect(evaluate(q.rule, values)).toBe(false);
      else
        expect(() => evaluate(q.rule, values)).toThrow(
          'educationLearning.answerRequired',
        );
    }
    if (main.rule.kind === 'number')
      expect(evaluate(q.rule, main.rule.value)).toBe(false);
  }
  expect(task('complete-read-order').rule).toEqual({
    kind: 'steps',
    values: [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
  });
  expect(task('complete-read-order', true).rule).toEqual({
    kind: 'steps',
    values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  });
  expect(
    lesson.questions
      .filter((q) => q.rule.kind === 'manual')
      .map((q) => q.knowledge),
  ).toEqual(
    [
      'actual-complete-line',
      'actual-addition-lines',
      'actual-subtraction-lines',
      'actual-two-change-lines',
      'actual-distance',
    ].map((key) => `${lesson.id}-${key}`),
  );
});

it('backs up ten-field drafts including zero, preserves first mistakes and leaves paper work unconfirmed', () => {
  const now = '2026-10-02T08:00:00.000Z';
  const s = createSession(lesson, 'sujiao-math-p1-upper-2024', 'child', {
    now,
    seed: 42,
  });
  s.phase = 'practice';
  const i = s.questions.findIndex((q) =>
    q.knowledge.endsWith('complete-read-order'),
  );
  s.responses[i]!.draft = [9, null, null, 6, null, null, null, null, null, 0];
  const data = {
    schemaVersion: 1 as const,
    activeProfileId: 'child',
    profiles: [{ id: 'child', nickname: '孩子', createdAt: now }],
    sessions: [s],
  };
  expect(
    parseBackup(exportBackup(data, now)).data.sessions[0]!.responses[i]!.draft,
  ).toEqual(s.responses[i]!.draft);
  s.responses[i] = submitResponse(
    s.questions[i]!,
    { ...s.responses[i]!, draft: Array.from({ length: 10 }, () => 1) },
    now,
  );
  for (const [index, q] of s.questions.entries()) {
    if (q.rule.kind === 'manual') continue;
    const answer = (() => {
      if (q.rule.kind === 'steps') return q.rule.values;
      if (q.rule.kind === 'number') return q.rule.value;
      throw new Error('Unexpected rule');
    })();
    s.responses[index] = submitResponse(
      q,
      { ...s.responses[index]!, draft: answer },
      now,
    );
  }
  expect(s.responses[i]!.submissions.map((a) => a.correct)).toEqual([
    false,
    true,
  ]);
  expect(statistics(s).manual).toBe(0);
  expect(statistics(s).finalCorrect).toBe(10);
  expect(parseBackup(exportBackup(data, now)).data.sessions[0]).toEqual(s);
});
