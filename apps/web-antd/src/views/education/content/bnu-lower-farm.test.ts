import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { required } from '../learning/required';
import { bnuLowerBook } from './bnu-lower';
import { bnuLowerBlocksLesson } from './bnu-lower-blocks';
import { bnuLowerFarmLesson as lesson } from './bnu-lower-farm';

const question = (suffix: string) =>
  required(lesson.questions.find(({ id }) => id.endsWith(`-${suffix}`)));
it('checks every sum, all eight stairs and both counting paths from independent expected results', () => {
  expect(lesson.page).toBe(8);
  expect(lesson.questions).toHaveLength(35);
  expect(lesson.steps).toHaveLength(7);
  for (const [index, value] of [14, 12, 11, 13, 13].entries())
    expect(evaluate(question(`sum-${index}`).rule, value)).toBe(true);
  for (const [index, value] of [11, 15, 16, 17, 17, 16, 15, 11].entries())
    expect(evaluate(question(`stairs-${index}`).rule, value)).toBe(true);
  for (const [suffix, value] of [
    ['first-jump', 9],
    ['second-jump', 10],
    ['six-jumps', 14],
    ['zero-ones', 0],
  ] as const)
    expect(evaluate(question(suffix).rule, value)).toBe(true);
  expect(evaluate(question('first-jump').rule, 8)).toBe(false);
  expect(() => evaluate(question('zero-ones').rule, null)).toThrow(
    'educationLearning.answerRequired',
  );
  expect(lesson.steps[1]?.visual).toEqual({
    kind: 'ten-frame',
    left: 9,
    right: 5,
  });
  expect(lesson.steps[3]?.visual).toEqual({
    kind: 'ten-frame',
    left: 4,
    right: 8,
  });
  expect(
    lesson.questions.filter(({ rule }) => rule.kind === 'number'),
  ).toHaveLength(17);
});

it('distinguishes both valid specified decompositions and rejects inconsistent intermediate quantities', () => {
  const methods = [
    ['nine-first', [1, 4, 10, 14]],
    ['five-first', [5, 4, 10, 14]],
    ['four-first', [6, 2, 10, 12]],
    ['eight-first', [2, 2, 10, 12]],
    ['seven-first', [3, 1, 10, 11]],
    ['four-duck-first', [6, 1, 10, 11]],
    ['eight-six', [2, 4, 10, 14]],
  ] as const;
  expect(
    lesson.questions.filter(({ rule }) => rule.kind === 'steps'),
  ).toHaveLength(7);
  for (const [suffix, values] of methods)
    expect(evaluate(question(suffix).rule, [...values])).toBe(true);
  expect(evaluate(question('nine-first').rule, [1, 5, 10, 14])).toBe(false);
  expect(evaluate(question('nine-first').rule, [5, 4, 10, 14])).toBe(false);
  expect(evaluate(question('five-first').rule, [5, 4, 10, 14])).toBe(true);
  expect(() =>
    evaluate(question('nine-first').rule, [1, null, 10, null]),
  ).toThrow('educationLearning.answerRequired');
  const actual = lesson.questions.filter(({ rule }) => rule.kind === 'manual');
  expect(actual).toHaveLength(9);
  actual.forEach(({ rule }) => expect(evaluate(rule, 'confirmed')).toBeNull());
  const records = lesson.questions.filter(
    ({ rule }) => rule.kind === 'reflection',
  );
  expect(records).toHaveLength(2);
  records.forEach(({ rule }) =>
    expect(evaluate(rule, '未做，计划下一次操作')).toBeNull(),
  );
  const review = required(lesson.reviewQuestions);
  for (const [index, value] of [12, [2, 2, 10, 12], 13, 0].entries())
    expect(evaluate(required(review[index]).rule, value)).toBe(true);
  expect(
    review.every(
      (q) =>
        !lesson.questions.some(
          (old) => q.id === old.id || q.prompt === old.prompt,
        ),
    ),
  ).toBe(true);
});

it('round-trips partial four-field drafts, true zero and method retries without rewriting the previous course', () => {
  const now = '2026-10-04T15:00:00.000Z';
  const old = createSession(bnuLowerBlocksLesson, bnuLowerBook.id, 'child', {
    seed: 1,
    now,
  });
  const before = JSON.parse(JSON.stringify(old));
  const session = createSession(lesson, bnuLowerBook.id, 'child', {
    seed: 2,
    now,
  });
  const index = session.questions.findIndex(({ id }) =>
    id.endsWith('-nine-first'),
  );
  const q = required(session.questions[index]);
  let response = required(session.responses[index]);
  response.draft = [1, 5, 10, 14];
  response = submitResponse(q, response, now);
  response.draft = [1, 4, 10, 14];
  session.responses[index] = submitResponse(q, response, now);
  expect(
    required(session.responses[index]).submissions.map(
      ({ correct }) => correct,
    ),
  ).toEqual([false, true]);
  required(
    session.responses.find(({ questionId }) =>
      questionId.endsWith('-five-first'),
    ),
  ).draft = [5, null, 10, null];
  required(
    session.responses.find(({ questionId }) =>
      questionId.endsWith('-zero-ones'),
    ),
  ).draft = 0;
  const data = {
    schemaVersion: 1 as const,
    profiles: [{ id: 'child', nickname: '测试', createdAt: now }],
    activeProfileId: 'child',
    sessions: [old, session],
  };
  const restored = parseBackup(exportBackup(data, now)).data;
  expect(restored).toEqual(JSON.parse(JSON.stringify(data)));
  expect(restored.sessions[0]).toEqual(before);
});
