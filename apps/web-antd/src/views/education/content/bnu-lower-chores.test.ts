import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { required } from '../learning/required';
import { bnuLowerBook } from './bnu-lower';
import {
  bnuChoreExpressions,
  bnuLowerChoresLesson as lesson,
} from './bnu-lower-chores';
import { bnuLowerFarmLesson } from './bnu-lower-farm';

const q = (suffix: string) =>
  required(lesson.questions.find(({ id }) => id.endsWith(`-${suffix}`)));
it('covers the independently transcribed full 28-card source arithmetic, not a subset of the drawing', () => {
  expect(lesson.page).toBe(10);
  expect(lesson.questions).toHaveLength(54);
  expect(lesson.steps).toHaveLength(7);
  expect(bnuChoreExpressions).toEqual([
    [5, '+', 9],
    [9, '+', 5],
    [8, '+', 7],
    [5, '+', 7],
    [7, '−', 3],
    [6, '+', 7],
    [4, '+', 8],
    [3, '+', 9],
    [6, '+', 9],
    [3, '+', 10],
    [4, '+', 7],
    [18, '−', 6],
    [10, '+', 2],
    [6, '+', 6],
    [5, '+', 6],
    [15, '−', 3],
    [8, '+', 4],
    [8, '+', 9],
    [7, '+', 9],
    [2, '+', 9],
    [8, '+', 3],
    [6, '+', 5],
    [6, '−', 1],
    [7, '+', 6],
    [5, '+', 10],
    [8, '−', 4],
    [6, '+', 8],
    [5, '+', 8],
  ]);
  const results = [
    14, 14, 15, 12, 4, 13, 12, 12, 15, 13, 11, 12, 12, 12, 11, 12, 12, 17, 16,
    11, 11, 11, 5, 13, 15, 4, 14, 13,
  ];
  results.forEach((value, index) =>
    expect(evaluate(q(`card-${index + 1}`).rule, value)).toBe(true),
  );
  const twelves = [4, 7, 8, 12, 13, 14, 16, 17].map(
    (n) => `result-twelve-${n}`,
  );
  const elevens = [11, 15, 20, 21, 22].map((n) => `result-eleven-${n}`);
  expect(q('result-twelve').choices).toHaveLength(28);
  expect(q('result-eleven').choices).toHaveLength(28);
  expect(evaluate(q('result-twelve').rule, twelves)).toBe(true);
  expect(evaluate(q('result-twelve').rule, twelves.toReversed())).toBe(true);
  expect(evaluate(q('result-eleven').rule, elevens)).toBe(true);
  expect(
    evaluate(
      q('result-twelve').rule,
      twelves.filter((v) => v !== 'result-twelve-8'),
    ),
  ).toBe(false);
  expect(
    evaluate(q('result-twelve').rule, [...twelves, 'result-twelve-1']),
  ).toBe(false);
});

it('checks life quantities, both ten-making paths, exchange timing and two full jumps independently', () => {
  for (const [index, value] of [13, 11, 14, 13].entries())
    expect(evaluate(q(`sum-${index}`).rule, value)).toBe(true);
  for (const [suffix, answer] of [
    ['seven-first', [3, 3, 10, 13]],
    ['six-first', [4, 3, 10, 13]],
    ['clothes-six', [4, 1, 10, 11]],
    ['clothes-five', [5, 1, 10, 11]],
    ['exchange', [13, 1, 1, 3]],
    ['two-jumps', [3, 3, 6, 13]],
  ] as const)
    expect(evaluate(q(suffix).rule, [...answer])).toBe(true);
  expect(evaluate(q('exchange').rule, [13, 1, 1, 13])).toBe(false);
  expect(evaluate(q('two-jumps').rule, [3, 3, 3, 10])).toBe(false);
  expect(evaluate(q('total-add').rule, 6)).toBe(true);
  expect(evaluate(q('last-number').rule, 13)).toBe(true);
  expect(evaluate(q('zero-ones').rule, 0)).toBe(true);
  expect(() => evaluate(q('zero-ones').rule, null)).toThrow(
    'educationLearning.answerRequired',
  );
  const manual = lesson.questions.filter(({ rule }) => rule.kind === 'manual');
  expect(manual).toHaveLength(9);
  manual.forEach(({ rule }) => expect(evaluate(rule, 'confirmed')).toBeNull());
  const records = lesson.questions.filter(
    ({ rule }) => rule.kind === 'reflection',
  );
  expect(records).toHaveLength(2);
  records.forEach(({ rule }) =>
    expect(evaluate(rule, '尚未做，计划另记')).toBeNull(),
  );
  const review = required(lesson.reviewQuestions);
  for (const [index, answer] of [
    15,
    [2, 5, 10, 15],
    [
      'review-twelve-1',
      'review-twelve-2',
      'review-twelve-3',
      'review-twelve-6',
      'review-twelve-8',
    ],
    0,
  ].entries())
    expect(evaluate(required(review[index]).rule, answer)).toBe(true);
  expect(
    review.every(
      (item) =>
        !lesson.questions.some(
          (old) => old.id === item.id || old.prompt === item.prompt,
        ),
    ),
  ).toBe(true);
});

it('preserves partial category and method drafts, true zero and selection retries alongside unchanged farm records', () => {
  const now = '2026-10-04T16:00:00.000Z';
  const old = createSession(bnuLowerFarmLesson, bnuLowerBook.id, 'child', {
    seed: 1,
    now,
  });
  const snapshot = JSON.parse(JSON.stringify(old));
  const session = createSession(lesson, bnuLowerBook.id, 'child', {
    seed: 2,
    now,
  });
  const index = session.questions.findIndex(({ id }) =>
    id.endsWith('-result-twelve'),
  );
  const item = required(session.questions[index]);
  let response = required(session.responses[index]);
  response.draft = ['result-twelve-4'];
  response = submitResponse(item, response, now);
  response.draft = [4, 7, 8, 12, 13, 14, 16, 17].map(
    (n) => `result-twelve-${n}`,
  );
  session.responses[index] = submitResponse(item, response, now);
  expect(
    required(session.responses[index]).submissions.map(
      ({ correct }) => correct,
    ),
  ).toEqual([false, true]);
  required(
    session.responses.find(({ questionId }) =>
      questionId.endsWith('-seven-first'),
    ),
  ).draft = [3, null, 10, null];
  required(
    session.responses.find(({ questionId }) =>
      questionId.endsWith('-result-eleven'),
    ),
  ).draft = ['result-eleven-11'];
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
  expect(restored.sessions[0]).toEqual(snapshot);
});
