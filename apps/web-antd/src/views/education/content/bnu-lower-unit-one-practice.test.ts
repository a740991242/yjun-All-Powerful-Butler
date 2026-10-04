import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { required } from '../learning/required';
import { bnuLowerBook } from './bnu-lower';
import { bnuLowerUnitOneHarvestLesson } from './bnu-lower-unit-one-harvest';
import {
  bnuNeighborNumbers,
  bnuReviewAdditionPairs,
  bnuReviewSourceCards,
  bnuLowerUnitOnePracticeLesson as lesson,
} from './bnu-lower-unit-one-practice';

const q = (suffix: string) =>
  required(lesson.questions.find(({ id }) => id.endsWith(`-${suffix}`)));
it('matches all source positions, neighbor pairs, nine independent sums, two axes and both quantity relationships', () => {
  expect(lesson.page).toBe(16);
  expect(lesson.steps).toHaveLength(8);
  expect(lesson.questions).toHaveLength(61);
  [6, 7, 9, 10, 13, 14, 16, 18, 19].forEach((level, index) =>
    expect(
      evaluate(q(`stair-${String.fromCodePoint(65 + index)}`).rule, level),
    ).toBe(true),
  );
  expect(evaluate(q('reverse-10').rule, 'D')).toBe(true);
  expect(evaluate(q('reverse-19').rule, 'I')).toBe(true);
  expect(evaluate(q('stair-C').rule, 3)).toBe(false);
  expect(bnuNeighborNumbers).toEqual([7, 8, 9, 4, 8, 6, 7, 5]);
  [15, 17, 13, 12, 14, 13, 12].forEach((value, index) =>
    expect(evaluate(q(`neighbor-${index + 1}`).rule, value)).toBe(true),
  );
  expect(evaluate(q('neighbor-2').rule, 24)).toBe(false);
  expect(bnuReviewAdditionPairs).toEqual([
    [6, 6],
    [6, 7],
    [6, 8],
    [7, 7],
    [8, 6],
    [9, 5],
    [9, 9],
    [9, 8],
    [9, 7],
  ]);
  [12, 13, 14, 14, 14, 14, 18, 17, 16].forEach((value, index) =>
    expect(evaluate(q(`sum-${index + 1}`).rule, value)).toBe(true),
  );
  expect(evaluate(q('line-add').rule, 12)).toBe(true);
  expect(evaluate(q('line-subtract').rule, 13)).toBe(true);
  expect(q('line-subtract').visual).toEqual({
    kind: 'number-line',
    minimum: 11,
    maximum: 20,
    value: 18,
  });
  expect(evaluate(q('rabbits').rule, [6, 7, 13])).toBe(true);
  expect(evaluate(q('bees').rule, [9, 6, 15])).toBe(true);
  expect(evaluate(q('bees').rule, [0, 6, 6])).toBe(false);
  expect(evaluate(q('sold').rule, 12)).toBe(true);
  expect(evaluate(q('sold').rule, 7)).toBe(false);
  expect(evaluate(q('zero-unchecked').rule, 0)).toBe(true);
  expect(() => evaluate(q('zero-unchecked').rule, null)).toThrow(
    'educationLearning.answerRequired',
  );
});
it('keeps both actual subtraction cards and all twelve card identities with complete equal-result matching', () => {
  expect(
    bnuReviewSourceCards.map(
      ({ left, operator, right }) => `${left}${operator}${right}`,
    ),
  ).toEqual([
    '7+6',
    '8+5',
    '9-4',
    '8+3',
    '7+5',
    '6+5',
    '3+5',
    '7-6',
    '7+9',
    '6+9',
    '5+9',
    '8+7',
  ]);
  [13, 13, 5, 11, 12, 11, 8, 1, 16, 15, 14, 15].forEach((value, index) =>
    expect(evaluate(q(`card-${index + 1}`).rule, value)).toBe(true),
  );
  expect(evaluate(q('card-3').rule, 13)).toBe(false);
  expect(evaluate(q('card-8').rule, 13)).toBe(false);
  expect(
    evaluate(q('match-thirteen').rule, [
      'match-thirteen-2',
      'match-thirteen-1',
    ]),
  ).toBe(true);
  expect(evaluate(q('match-thirteen').rule, ['match-thirteen-1'])).toBe(false);
  expect(
    evaluate(q('match-fifteen').rule, ['match-fifteen-10', 'match-fifteen-12']),
  ).toBe(true);
  expect(
    evaluate(q('match-fifteen').rule, [
      'match-fifteen-10',
      'match-fifteen-12',
      'match-fifteen-8',
    ]),
  ).toBe(false);
});
it('accepts all and only mathematically valid strict inequalities under the stated web bounds, with new review conditions', () => {
  const rule = q('inequalities').rule;
  const review = required(lesson.reviewQuestions);
  const newRule = required(
    review.find(({ id }) => id.endsWith('-review-inequalities')),
  ).rule;
  let oldCount = 0;
  let newCount = 0;
  for (let a = 0; a <= 20; a++)
    for (let b = 0; b <= 20; b++)
      for (let c = 0; c <= 20; c++) {
        const oldValid =
          8 + a > 12 &&
          8 + a <= 20 &&
          15 - b >= 0 &&
          15 - b < 8 &&
          c - 5 >= 0 &&
          c - 5 < 9;
        const newValid =
          7 + a > 12 &&
          7 + a <= 20 &&
          16 - b >= 0 &&
          16 - b < 8 &&
          c - 6 >= 0 &&
          c - 6 < 9;
        expect(evaluate(rule, [a, b, c])).toBe(oldValid);
        expect(evaluate(newRule, [a, b, c])).toBe(newValid);
        if (oldValid) oldCount++;
        if (newValid) newCount++;
      }
  expect([oldCount, newCount]).toEqual([576, 576]);
  expect(evaluate(rule, [8, 8, 8])).toBe(true);
  expect(evaluate(rule, [4, 7, 14])).toBe(false);
  expect(evaluate(rule, [13, 8, 5])).toBe(false);
  expect(() => evaluate(rule, [5, null, null])).toThrow(
    'educationLearning.answerRequired',
  );
  expect(lesson.steps[7]?.text).toContain('原题未写这个上限');
  expect(
    evaluate(
      required(review.find(({ id }) => id.endsWith('-review-stair'))).rule,
      5,
    ),
  ).toBe(true);
  expect(
    evaluate(
      required(review.find(({ id }) => id.endsWith('-review-stair'))).rule,
      6,
    ),
  ).toBe(false);
  expect(
    evaluate(
      required(review.find(({ id }) => id.endsWith('-review-sale-remaining')))
        .rule,
      9,
    ),
  ).toBe(true);
  expect(
    evaluate(
      required(review.find(({ id }) => id.endsWith('-review-neighbors'))).rule,
      [14, 12],
    ),
  ).toBe(true);
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
  ).toHaveLength(10);
  expect(
    lesson.questions.filter(({ rule }) => rule.kind === 'reflection'),
  ).toHaveLength(3);
  for (const item of lesson.questions.filter(({ rule }) =>
    ['manual', 'reflection'].includes(rule.kind),
  ))
    expect(
      evaluate(
        item.rule,
        item.rule.kind === 'manual' ? 'confirmed' : '还没做，计划另记',
      ),
    ).toBeNull();
});
it('preserves partial multi-solution drafts, retry history and the older harvest snapshot, rejecting injected diagram answers', () => {
  const now = '2026-10-04T18:00:00.000Z';
  const old = createSession(
    bnuLowerUnitOneHarvestLesson,
    bnuLowerBook.id,
    'child',
    { seed: 1, now },
  );
  const snapshot = JSON.parse(JSON.stringify(old));
  const session = createSession(lesson, bnuLowerBook.id, 'child', {
    seed: 2,
    now,
  });
  const index = session.questions.findIndex(
    ({ id }) => id === 'bnu-lower-unit-one-practice-inequalities',
  );
  const item = required(session.questions[index]);
  const response = required(session.responses[index]);
  response.draft = [4, 7, 14];
  const wrong = submitResponse(item, response, now);
  wrong.draft = [12, 15, 13];
  session.responses[index] = submitResponse(item, wrong, now);
  required(
    session.responses.find(({ questionId }) => questionId.endsWith('-bees')),
  ).draft = [9, null, null];
  required(
    session.responses.find(({ questionId }) =>
      questionId.endsWith('-zero-unchecked'),
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
  expect(
    restored.sessions[1]?.responses[index]?.submissions.map(
      ({ correct }) => correct,
    ),
  ).toEqual([false, true]);
  const damaged = JSON.parse(exportBackup(data, now));
  const stairs = damaged.data.sessions[1].questions.find(
    (q: { visual?: { kind: string } }) => q.visual?.kind === 'teen-stairs',
  );
  stairs.visual.answers = [6, 9, 19];
  expect(() => parseBackup(JSON.stringify(damaged))).toThrow(
    'educationLearning.invalidBackup',
  );
});
