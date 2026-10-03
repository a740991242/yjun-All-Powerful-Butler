import { expect, it } from 'vitest';

import { bnuFinalNumberPracticeLesson as lesson } from '../content/bnu-final-practice';
import { isArithmeticPairRule, matchesArithmeticPair } from './arithmetic-pair';
import { exportBackup, parseBackup } from './backup';
import { createSession, evaluate, submitResponse } from './engine';
import { required } from './required';
import { sparseArray } from './sparse-array';
import { initialLibrary } from './storage';

const difference = {
  kind: 'arithmetic-pair' as const,
  minimum: 0,
  maximum: 10,
  operation: 'subtract' as const,
  result: 8,
};
it('checks the two blanks together and accepts all three bounded subtraction solutions', () => {
  let count = 0;
  for (let a = -1; a <= 11; a++)
    for (let b = -1; b <= 11; b++) {
      const expected = a >= 0 && a <= 10 && b >= 0 && b <= 10 && a - b === 8;
      expect(matchesArithmeticPair(difference, [a, b])).toBe(expected);
      if (expected) count++;
    }
  expect(count).toBe(3);
  for (const answer of [
    [8, 0],
    [9, 1],
    [10, 2],
  ])
    expect(evaluate(difference, answer)).toBe(true);
  expect(evaluate(difference, [8, 2])).toBe(false);
  expect(() => evaluate(difference, [8, null])).toThrow(
    'educationLearning.answerRequired',
  );
  for (const answer of [
    sparseArray(2),
    ['8', 0],
    [8.5, 0],
    null,
    [8],
    [8, 0, 0],
  ])
    expect(matchesArithmeticPair(difference, answer)).toBe(false);
});
it('bounds both operations, validates feasibility independently and rejects coercion or hidden answers', () => {
  for (let minimum = 0; minimum <= 4; minimum++)
    for (let maximum = minimum; maximum <= 6; maximum++)
      for (const operation of ['add', 'subtract'] as const)
        for (let result = 0; result <= 13; result++) {
          let possible = false;
          for (let a = minimum; a <= maximum; a++)
            for (let b = minimum; b <= maximum; b++)
              if ((operation === 'add' ? a + b : a - b) === result)
                possible = true;
          expect(
            isArithmeticPairRule({
              ...difference,
              minimum,
              maximum,
              operation,
              result,
            }),
          ).toBe(possible);
        }
  for (const bad of [
    null,
    [],
    { ...difference, operation: ['subtract'] },
    { ...difference, operation: 'multiply' },
    { ...difference, minimum: -1 },
    { ...difference, maximum: 100 },
    { ...difference, minimum: 11 },
    { ...difference, result: -1 },
    { ...difference, result: 11 },
    { ...difference, result: 8.5 },
    { ...difference, maximum: '10' },
    { ...difference, answer: [8, 0] },
  ])
    expect(isArithmeticPairRule(bad)).toBe(false);
  expect(
    isArithmeticPairRule({ ...difference, minimum: 5, maximum: 5, result: 0 }),
  ).toBe(true);
  expect(
    matchesArithmeticPair(
      { ...difference, operation: 'add', result: 10 },
      [5, 5],
    ),
  ).toBe(true);
  expect(
    matchesArithmeticPair(
      { ...difference, operation: 'add', result: 10 },
      [0, 10],
    ),
  ).toBe(true);
});
it('backs up partial zero drafts and each alternative without rewriting history or allowing forged results', () => {
  const library = initialLibrary('隔离减法核对');
  const session = createSession(
    lesson,
    'bnu-math-p1-upper-2024',
    library.activeProfileId,
  );
  const index = session.questions.findIndex((q) =>
    q.id.endsWith('-difference'),
  );
  const question = required(session.questions[index]);
  let response = required(session.responses[index]);
  for (const draft of [
    [8, 2],
    [8, 0],
    [9, 1],
    [10, 2],
  ])
    response = submitResponse(question, { ...response, draft });
  expect(response.submissions.map((item) => item.correct)).toEqual([
    false,
    true,
    true,
    true,
  ]);
  response.draft = [null, 0];
  session.responses[index] = response;
  library.sessions.push(session);
  const encoded = exportBackup(library);
  expect(parseBackup(encoded).data.sessions[0]).toEqual(
    JSON.parse(JSON.stringify(session)),
  );
  for (const draft of [[0], ['0', null], [0, 0.5], [0, 0, 0]]) {
    const bad = JSON.parse(encoded);
    bad.data.sessions[0].responses[index].draft = draft;
    expect(() => parseBackup(JSON.stringify(bad))).toThrow(
      'educationLearning.invalidBackup',
    );
  }
  for (const mutate of [
    (bad: typeof library) => {
      required(required(bad.sessions[0]).questions[index]).rule = {
        ...difference,
        result: 11,
      };
    },
    (bad: typeof library) => {
      required(
        required(required(bad.sessions[0]).responses[index]).submissions[0],
      ).correct = true;
    },
  ]) {
    const bad = JSON.parse(encoded);
    mutate(bad.data);
    expect(() => parseBackup(JSON.stringify(bad))).toThrow(
      'educationLearning.invalidBackup',
    );
  }
});
