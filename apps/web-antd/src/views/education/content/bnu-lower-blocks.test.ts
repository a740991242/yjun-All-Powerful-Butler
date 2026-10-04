import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { required } from '../learning/required';
import { bnuLowerBook } from './bnu-lower';
import { bnuLowerBlocksLesson as lesson } from './bnu-lower-blocks';
import { bnuLowerPlaceValueLesson } from './bnu-lower-place-value';

it('checks all computations and each jump independently, keeping physical work ungraded', () => {
  expect(lesson.page).toBe(6);
  expect(lesson.questions).toHaveLength(39);
  expect(lesson.steps).toHaveLength(7);
  const q = (suffix: string) =>
    required(lesson.questions.find(({ id }) => id.endsWith(`-${suffix}`)));
  for (const [index, value] of [
    15, 16, 5, 15, 6, 16, 13, 13, 10, 17, 12,
  ].entries())
    expect(evaluate(q(`calc-${index}`).rule, value)).toBe(true);
  for (const [suffix, value] of [
    ['forward-first', 14],
    ['forward-second', 15],
    ['backward-first', 17],
    ['backward-second', 16],
    ['zero-ones', 0],
  ] as const)
    expect(evaluate(q(suffix).rule, value)).toBe(true);
  expect(evaluate(q('forward-first').rule, 13)).toBe(false);
  expect(evaluate(q('backward-first').rule, 18)).toBe(false);
  expect(evaluate(q('zero-ones').rule, 10)).toBe(false);
  expect(() => evaluate(q('zero-ones').rule, null)).toThrow(
    'educationLearning.answerRequired',
  );
  const manual = lesson.questions.filter(({ rule }) => rule.kind === 'manual');
  expect(manual).toHaveLength(9);
  manual.forEach(({ rule }) => expect(evaluate(rule, 'confirmed')).toBeNull());
  const reflections = lesson.questions.filter(
    ({ rule }) => rule.kind === 'reflection',
  );
  expect(reflections).toHaveLength(2);
  reflections.forEach(({ rule }) =>
    expect(evaluate(rule, '未做，计划另记')).toBeNull(),
  );
});

it('exhausts all unordered distinct two-card pairs for each specified game, rather than examples alone', () => {
  const add = lesson.questions.filter(({ id }) => id.includes('-pair-add-'));
  const sub = lesson.questions.filter(({ id }) => id.includes('-pair-sub-'));
  expect(add).toHaveLength(6);
  expect(sub).toHaveLength(6);
  for (const [questions, values, operation] of [
    [add, [12, 6, 4, 3], '+'],
    [sub, [18, 5, 3, 2], '−'],
  ] as const) {
    const expected: number[] = [];
    for (let i = 0; i < values.length; i++)
      for (let j = i + 1; j < values.length; j++) {
        const a = required(values[i]);
        const b = required(values[j]);
        expected.push(operation === '+' ? a + b : a - b);
      }
    questions.forEach((question, index) =>
      expect(evaluate(question.rule, required(expected[index]))).toBe(true),
    );
    expect(questions.every(({ prompt }) => prompt.includes('各一张'))).toBe(
      true,
    );
  }
  const review = required(lesson.reviewQuestions);
  for (const [index, value] of [17, 13, 13, 0].entries())
    expect(evaluate(required(review[index]).rule, value)).toBe(true);
  expect(
    review.every(
      (q) =>
        !lesson.questions.some(
          (old) => old.id === q.id || old.prompt === q.prompt,
        ),
    ),
  ).toBe(true);
});

it('aligns the corrected previous diagram with its text while retaining a version-1 historical snapshot', () => {
  expect(bnuLowerPlaceValueLesson.version).toBe(2);
  const step = required(bnuLowerPlaceValueLesson.steps[1]);
  expect(step.visual).toEqual({ kind: 'place-value', value: 18 });
  expect(step.text).toContain('个位8个表示18');
  const now = '2026-10-04T14:00:00.000Z';
  const previous = createSession(
    { ...bnuLowerPlaceValueLesson, version: 1 },
    bnuLowerBook.id,
    'child',
    { seed: 1, now },
  );
  const snapshot = JSON.parse(JSON.stringify(previous));
  const session = createSession(lesson, bnuLowerBook.id, 'child', {
    seed: 2,
    now,
  });
  const index = session.questions.findIndex(({ id }) => id.endsWith('-calc-0'));
  const q = required(session.questions[index]);
  let response = required(session.responses[index]);
  response.draft = 3;
  response = submitResponse(q, response, now);
  response.draft = 15;
  session.responses[index] = submitResponse(q, response, now);
  expect(
    required(session.responses[index]).submissions.map(
      ({ correct }) => correct,
    ),
  ).toEqual([false, true]);
  required(
    session.responses.find(({ questionId }) =>
      questionId.endsWith('-zero-ones'),
    ),
  ).draft = 0;
  const data = {
    schemaVersion: 1 as const,
    profiles: [{ id: 'child', nickname: '测试', createdAt: now }],
    activeProfileId: 'child',
    sessions: [previous, session],
  };
  const restored = parseBackup(exportBackup(data, now)).data;
  expect(restored).toEqual(JSON.parse(JSON.stringify(data)));
  expect(restored.sessions[0]).toEqual(snapshot);
  expect(restored.sessions[0]?.lessonVersion).toBe(1);
});
