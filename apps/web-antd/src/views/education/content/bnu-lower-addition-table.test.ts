import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { required } from '../learning/required';
import { bnuLowerBook } from './bnu-lower';
import {
  bnuAdditionSourceCards,
  bnuLowerAdditionTableLesson as lesson,
} from './bnu-lower-addition-table';
import { bnuLowerRabbitsLesson } from './bnu-lower-rabbits';
const q = (suffix: string) =>
  required(lesson.questions.find(({ id }) => id.endsWith(`-${suffix}`)));
it('covers all thirteen independently read source cards and both complete classification standards', () => {
  expect(lesson.page).toBe(14);
  expect(lesson.steps).toHaveLength(7);
  expect(lesson.questions).toHaveLength(62);
  expect(bnuAdditionSourceCards).toEqual([
    [9, 5],
    [9, 9],
    [6, 9],
    [7, 7],
    [6, 8],
    [3, 9],
    [9, 8],
    [5, 9],
    [9, 3],
    [5, 7],
    [8, 5],
    [8, 7],
    [8, 4],
  ]);
  [14, 18, 15, 14, 14, 12, 17, 14, 12, 12, 13, 15, 12].forEach((value, i) =>
    expect(evaluate(q(`card-${i + 1}`).rule, value)).toBe(true),
  );
  const fourteen = [1, 4, 5, 8].map((n) => `result-fourteen-${n}`);
  expect(evaluate(q('result-fourteen').rule, fourteen)).toBe(true);
  expect(evaluate(q('result-fourteen').rule, fourteen.slice(1))).toBe(false);
  expect(
    evaluate(
      q('first-eight').rule,
      [11, 12, 13].map((n) => `first-eight-${n}`),
    ),
  ).toBe(true);
  expect(
    evaluate(
      q('first-eight').rule,
      [11, 12, 13, 7].map((n) => `first-eight-${n}`),
    ),
  ).toBe(false);
});
it('checks all twenty-six ordered position blanks, eight full rows and row/column conditions, with independent multi-answer review', () => {
  const pairs = [
    [6, 5],
    [4, 7],
    [2, 9],
    [8, 4],
    [7, 5],
    [6, 6],
    [5, 7],
    [4, 8],
    [3, 9],
    [9, 4],
    [8, 5],
    [7, 6],
    [6, 7],
    [5, 8],
    [4, 9],
    [8, 6],
    [6, 8],
    [5, 9],
    [9, 6],
    [7, 8],
    [6, 9],
    [9, 7],
    [8, 8],
    [7, 9],
    [9, 8],
    [8, 9],
  ];
  pairs.forEach((pair, i) =>
    expect(
      evaluate(q(`blank-${String.fromCodePoint(65 + i)}`).rule, pair),
    ).toBe(true),
  );
  expect(evaluate(q('blank-A').rule, [5, 6])).toBe(false); // Same sum, different ordered table position.
  expect(evaluate(q('horizontal').rule, [9, 8, 7, 6, 5, 4, 3, 2])).toBe(true);
  expect(evaluate(q('vertical').rule, [2, 3, 4, 5, 6, 7, 8, 9])).toBe(true);
  [8, 7, 6, 5, 4, 3, 2, 1].forEach((value, i) =>
    expect(evaluate(q(`row-count-${i + 11}`).rule, value)).toBe(true),
  );
  expect(evaluate(q('nine-path').rule, [1, 8, 10, 18])).toBe(true);
  expect(evaluate(q('zero-ones').rule, 0)).toBe(true);
  const review = required(lesson.reviewQuestions);
  expect(evaluate(required(review[0]).rule, [2, 9])).toBe(true);
  const accepted: number[][] = [];
  for (let a = 2; a <= 9; a++)
    for (let b = 2; b <= 9; b++)
      if (evaluate(required(review[1]).rule, [a, b])) accepted.push([a, b]);
  expect(accepted).toEqual([
    [7, 9],
    [8, 8],
    [9, 7],
  ]);
  expect(evaluate(required(review[1]).rule, [6, 10])).toBe(false);
  expect(
    evaluate(
      required(review[2]).rule,
      [1, 2, 3, 4].map((n) => `review-sort-${n}`),
    ),
  ).toBe(true);
  expect(evaluate(required(review[3]).rule, [11, 12, 13, 14])).toBe(true);
  expect(
    review.every(
      (item) =>
        !lesson.questions.some(
          (old) => old.id === item.id || old.prompt === item.prompt,
        ),
    ),
  ).toBe(true);
  expect(
    lesson.questions.filter(({ rule }) => rule.kind === 'manual'),
  ).toHaveLength(7);
  for (const item of lesson.questions.filter(({ rule }) =>
    ['manual', 'reflection'].includes(rule.kind),
  ))
    expect(
      evaluate(
        item.rule,
        item.rule.kind === 'manual' ? 'confirmed' : '未制作，计划另记',
      ),
    ).toBeNull();
});
it('preserves partial eight-field drafts, ordered-position retry history, fixed table identity and the previous rabbits snapshot in strict backups', () => {
  const now = '2026-10-04T18:00:00.000Z';
  const old = createSession(bnuLowerRabbitsLesson, bnuLowerBook.id, 'child', {
    seed: 1,
    now,
  });
  const snapshot = JSON.parse(JSON.stringify(old));
  const session = createSession(lesson, bnuLowerBook.id, 'child', {
    seed: 2,
    now,
  });
  const index = session.questions.findIndex(({ id }) =>
    id.endsWith('-blank-A'),
  );
  const item = required(session.questions[index]);
  let response = required(session.responses[index]);
  response.draft = [5, 6];
  response = submitResponse(item, response, now);
  response.draft = [6, 5];
  session.responses[index] = submitResponse(item, response, now);
  expect(
    required(session.responses[index]).submissions.map(
      ({ correct }) => correct,
    ),
  ).toEqual([false, true]);
  required(
    session.responses.find(({ questionId }) =>
      questionId.endsWith('-horizontal'),
    ),
  ).draft = [9, null, null, null, null, null, null, null];
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
  const malformed = JSON.parse(exportBackup(data, now));
  const question = malformed.data.sessions[1].questions.find(
    (candidate: { id: string }) => candidate.id.endsWith('-blank-A'),
  );
  question.visual.answers = [6, 5];
  expect(() => parseBackup(JSON.stringify(malformed))).toThrow(
    'educationLearning.invalidBackup',
  );
});
