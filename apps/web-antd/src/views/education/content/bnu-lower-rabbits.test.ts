import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { required } from '../learning/required';
import { bnuLowerBook } from './bnu-lower';
import { bnuLowerChoresLesson } from './bnu-lower-chores';
import {
  bnuRabbitColumns,
  bnuLowerRabbitsLesson as lesson,
} from './bnu-lower-rabbits';
const q = (suffix: string) =>
  required(lesson.questions.find(({ id }) => id.endsWith(`-${suffix}`)));
it('accepts every ordered twelve-rabbit allocation including explicit empty-house extensions and rejects changed totals', () => {
  expect(lesson.page).toBe(12);
  expect(lesson.steps).toHaveLength(7);
  expect(lesson.questions).toHaveLength(61);
  const expected = [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0];
  const accepted: number[][] = [];
  for (let a = 0; a <= 12; a++)
    for (let b = 0; b <= 12; b++)
      if (evaluate(q('two-homes').rule, [a, b])) accepted.push([a, b]);
  expect(accepted).toEqual([
    [0, 12],
    [1, 11],
    [2, 10],
    [3, 9],
    [4, 8],
    [5, 7],
    [6, 6],
    [7, 5],
    [8, 4],
    [9, 3],
    [10, 2],
    [11, 1],
    [12, 0],
  ]);
  expected.forEach((v, i) =>
    expect(evaluate(q(`home-partner-${i}`).rule, v)).toBe(true),
  );
  expect(evaluate(q('two-homes').rule, [5, 6])).toBe(false);
  expect(evaluate(q('two-homes').rule, [-1, 13])).toBe(false);
  expect(() => evaluate(q('two-homes').rule, [0, null])).toThrow(
    'educationLearning.answerRequired',
  );
  expect(lesson.steps[2]?.text).toContain('本站另把0+12');
});
it('checks the four full ten-making paths, three arithmetic columns, all cookie conditions and complete distinct-card pairs independently', () => {
  [12, 12, 11, 11].forEach((v, i) =>
    expect(evaluate(q(`method-sum-${i}`).rule, v)).toBe(true),
  );
  expect(bnuRabbitColumns).toEqual([
    [7, 6],
    [7, 5],
    [7, 4],
    [6, 9],
    [7, 9],
    [8, 9],
    [9, 5],
    [8, 5],
    [7, 5],
  ]);
  [13, 12, 11, 15, 16, 17, 14, 13, 12].forEach((v, i) =>
    expect(evaluate(q(`column-${i + 1}`).rule, v)).toBe(true),
  );
  for (const [suffix, values] of [
    ['seven-first', [3, 2, 10, 12]],
    ['five-first', [5, 2, 10, 12]],
    ['eight-first', [2, 2, 10, 12]],
    ['method-1', [1, 2, 10, 12]],
    ['method-2', [3, 1, 10, 11]],
    ['method-3', [5, 1, 10, 11]],
    ['eleven-partners', [10, 9, 8, 7, 6]],
  ] as const)
    expect(evaluate(q(suffix).rule, [...values])).toBe(true);
  expect(evaluate(q('eight-first').rule, [2, 5, 10, 13])).toBe(false);
  for (const [suffix, v] of [
    ['total', 12],
    ['jump-total', 5],
    ['jump-last', 12],
    ['boxes-ab', 14],
    ['boxes-ac', 15],
    ['boxes-bc', 17],
    ['boxes-short', 1],
    ['boxes-left', 2],
    ['zero-ones', 0],
  ] as const)
    expect(evaluate(q(suffix).rule, v)).toBe(true);
  expect(evaluate(q('boxes-exact').rule, 'ac')).toBe(true);
  expect(evaluate(q('boxes-exact').rule, 'bc')).toBe(false);
  expect(lesson.steps[5]?.text).toContain('够用但余2');
  const pairs = [1, 2, 3, 4, 5].map((n) => `eleven-pairs-${n}`);
  expect(evaluate(q('eleven-pairs').rule, pairs.toReversed())).toBe(true);
  expect(evaluate(q('eleven-pairs').rule, pairs.slice(1))).toBe(false);
  expect(evaluate(q('eleven-pairs').rule, [...pairs, 'eleven-pairs-6'])).toBe(
    false,
  );
  const review = required(lesson.reviewQuestions);
  expect(evaluate(required(review[0]).rule, 13)).toBe(true);
  expect(evaluate(required(review[1]).rule, [3, 6, 10, 13])).toBe(true);
  for (let a = 0; a <= 13; a++)
    expect(evaluate(required(review[2]).rule, [a, 13 - a])).toBe(true);
  expect(
    evaluate(
      required(review[3]).rule,
      [1, 2, 3, 4, 5].map((n) => `review-pairs-${n}`),
    ),
  ).toBe(true);
  expect(
    evaluate(
      required(review[3]).rule,
      [1, 2, 3, 4, 5, 6].map((n) => `review-pairs-${n}`),
    ),
  ).toBe(false);
  expect(
    review.every(
      (item) =>
        !lesson.questions.some(
          (old) => old.prompt === item.prompt || old.id === item.id,
        ),
    ),
  ).toBe(true);
  expect(
    lesson.questions.filter(({ rule }) => rule.kind === 'manual'),
  ).toHaveLength(10);
  for (const item of lesson.questions.filter(({ rule }) =>
    ['manual', 'reflection'].includes(rule.kind),
  ))
    expect(
      evaluate(
        item.rule,
        item.rule.kind === 'manual' ? 'confirmed' : '尚未做，未来计划另记',
      ),
    ).toBeNull();
});
it('preserves empty-house zero, partial five-part partner drafts and wrong-then-correct allocations with unchanged chores snapshots', () => {
  const now = '2026-10-04T17:00:00.000Z';
  const old = createSession(bnuLowerChoresLesson, bnuLowerBook.id, 'child', {
    seed: 1,
    now,
  });
  const snapshot = JSON.parse(JSON.stringify(old));
  const session = createSession(lesson, bnuLowerBook.id, 'child', {
    seed: 2,
    now,
  });
  const index = session.questions.findIndex(({ id }) =>
    id.endsWith('-two-homes'),
  );
  const item = required(session.questions[index]);
  let response = required(session.responses[index]);
  response.draft = [5, 6];
  response = submitResponse(item, response, now);
  response.draft = [5, 7];
  session.responses[index] = submitResponse(item, response, now);
  expect(
    required(session.responses[index]).submissions.map(
      ({ correct }) => correct,
    ),
  ).toEqual([false, true]);
  required(
    session.responses.find(({ questionId }) =>
      questionId.endsWith('-eleven-partners'),
    ),
  ).draft = [10, null, null, null, null];
  required(
    session.responses.find(({ questionId }) =>
      questionId.endsWith('-home-partner-12'),
    ),
  ).draft = 0;
  required(session.responses[index]).draft = [0, null];
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

it('teaches each source first-addend decomposition independently from the existing second-addend method and preserves version-one history', () => {
  expect(lesson.version).toBe(2);
  const paths = [
    [2, 6, 10, 12],
    [2, 7, 10, 12],
    [1, 6, 10, 11],
    [1, 4, 10, 11],
  ] as const;
  paths.forEach((path, i) => {
    expect(evaluate(q(`source-first-${i}`).rule, [...path])).toBe(true);
    expect(
      evaluate(q(`source-first-${i}`).rule, [
        path[1],
        path[0],
        path[2],
        path[3],
      ]),
    ).toBe(false);
  });
  expect(evaluate(q('source-first-0').rule, [2, 2, 10, 12])).toBe(false);
  expect(evaluate(q('eight-first').rule, [2, 2, 10, 12])).toBe(true);
  expect(required(lesson.steps[4]).text).toContain('8分成2和6');
  const now = '2026-10-05T00:10:00.000Z';
  const previous = createSession(
    {
      ...lesson,
      version: 1,
      questions: lesson.questions.filter(
        ({ id }) => !id.includes('-source-first-'),
      ),
    },
    bnuLowerBook.id,
    'child',
    { seed: 1, now },
  );
  const previousSnapshot = JSON.parse(JSON.stringify(previous));
  expect(previous.lessonVersion).toBe(1);
  expect(previous.questions).toHaveLength(57);
  const session = createSession(lesson, bnuLowerBook.id, 'child', {
    seed: 2,
    now,
  });
  expect(session.lessonVersion).toBe(2);
  const index = session.questions.findIndex(({ id }) =>
    id.endsWith('-source-first-0'),
  );
  const item = required(session.questions[index]);
  let response = required(session.responses[index]);
  response.draft = [2, 2, 10, 12];
  response = submitResponse(item, response, now);
  response.draft = [2, 6, 10, 12];
  session.responses[index] = submitResponse(item, response, now);
  expect(
    required(session.responses[index]).submissions.map(
      ({ correct }) => correct,
    ),
  ).toEqual([false, true]);
  required(session.responses[index]).draft = [2, null, null, null];
  const data = {
    schemaVersion: 1 as const,
    profiles: [{ id: 'child', nickname: '测试', createdAt: now }],
    activeProfileId: 'child',
    sessions: [previous, session],
  };
  const restored = parseBackup(exportBackup(data, now)).data;
  expect(restored).toEqual(JSON.parse(JSON.stringify(data)));
  expect(restored.sessions[0]).toEqual(previousSnapshot);
});
