import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { required } from '../learning/required';
import { bnuLowerBook } from './bnu-lower';
import { bnuLowerAdditionTableLesson } from './bnu-lower-addition-table';
import { bnuLowerUnitOneHarvestLesson as lesson } from './bnu-lower-unit-one-harvest';

const q = (suffix: string) =>
  required(lesson.questions.find(({ id }) => id.endsWith(`-${suffix}`)));
it('keeps the two actual printed-page paths distinct and checks quantity units independently', () => {
  expect(lesson.page).toBe(15);
  expect(lesson.version).toBe(1);
  expect(lesson.steps).toHaveLength(7);
  expect(lesson.questions).toHaveLength(24);
  const expected: [string, number | number[] | string][] = [
    ['total', 15],
    ['groups', 2],
    ['eight-path', [2, 5, 10, 15]],
    ['seven-path', [3, 5, 10, 15]],
    ['jump-total', 7],
    ['sticks-total', 15],
    ['bundle-count', 1],
    ['loose-count', 5],
    ['counter-value', 15],
    ['counter-material', 6],
    ['tens-bead', 10],
    ['exchange', [1, 5, 15]],
    ['zero-ones', 0],
    ['largest', 'next'],
  ];
  expected.forEach(([suffix, value]) =>
    expect(evaluate(q(suffix).rule, value)).toBe(true),
  );
  expect(evaluate(q('seven-path').rule, [2, 5, 10, 15])).toBe(false);
  expect(evaluate(q('eight-path').rule, [3, 5, 10, 15])).toBe(false);
  expect(evaluate(q('counter-material').rule, 15)).toBe(false);
  expect(evaluate(q('counter-value').rule, 6)).toBe(false);
  expect(evaluate(q('sticks-total').rule, 6)).toBe(false);
  expect(evaluate(q('largest').rule, 'twenty')).toBe(false);
  expect(() => evaluate(q('zero-ones').rule, null)).toThrow(
    'educationLearning.answerRequired',
  );
  expect(lesson.steps[2]?.text).toContain('把8分成5和3');
  expect(lesson.steps[1]?.text).toContain('第二部分7分成2和5');
  const review = required(lesson.reviewQuestions);
  [[3, 6, 10, 16], 9, 20, 7].forEach((value, index) =>
    expect(evaluate(required(review[index]).rule, value)).toBe(true),
  );
  expect(evaluate(required(review[0]).rule, [2, 5, 10, 15])).toBe(false);
  expect(
    review.every(
      (item) =>
        !lesson.questions.some(
          (old) => item.id === old.id || item.prompt === old.prompt,
        ),
    ),
  ).toBe(true);
});

it('records all physical activities and independent questions without assigning objective correctness', () => {
  const manual = lesson.questions.filter(({ rule }) => rule.kind === 'manual');
  const reflections = lesson.questions.filter(
    ({ rule }) => rule.kind === 'reflection',
  );
  expect(manual).toHaveLength(7);
  expect(reflections).toHaveLength(3);
  manual.forEach(({ rule }) => expect(evaluate(rule, 'confirmed')).toBeNull());
  reflections.forEach(({ rule }) =>
    expect(evaluate(rule, '还在想，尚未做，计划另记')).toBeNull(),
  );
  expect(q('question-bank').prompt).toContain('可以不同于示例');
  expect(lesson.parentTip).toContain('不含第16～17页');
  expect(
    bnuLowerBook.units[0]?.lessons.some((l) => l.status === 'preparing'),
  ).toBe(false);
  expect(
    bnuLowerBook.units[1]?.lessons.every((l) => l.status === 'available'),
  ).toBe(true);
  expect(bnuLowerBook.units[3]?.lessons[0]?.status).toBe('available');
  expect(bnuLowerBook.units[3]?.lessons[1]?.status).toBe('available');
  expect(bnuLowerBook.units[3]?.lessons[0]?.page).toBe(27);
  expect(bnuLowerBook.units[3]?.lessons[1]?.page).toBe(29);
  expect(bnuLowerBook.units[3]?.lessons[2]?.status).toBe('available');
  expect(bnuLowerBook.units[3]?.lessons[2]?.page).toBe(31);
  expect(bnuLowerBook.units[3]?.lessons[3]?.status).toBe('available');
  expect(bnuLowerBook.units[3]?.lessons[4]?.status).toBe('available');
  expect(bnuLowerBook.units[3]?.lessons[5]?.status).toBe('available');
  expect(bnuLowerBook.units[3]?.lessons[6]?.status).toBe('available');
  expect(bnuLowerBook.units[3]?.lessons[6]?.page).toBe(40);
  expect(bnuLowerBook.units[3]?.lessons[7]?.status).toBe('available');
  expect(bnuLowerBook.units[3]?.lessons[7]?.page).toBe(41);
  expect(bnuLowerBook.units[3]?.lessons[8]?.status).toBe('preparing');
  expect(bnuLowerBook.units[3]?.lessons[8]?.page).toBe(42);
  expect(bnuLowerBook.units[3]?.lessons[5]?.page).toBe(38);
  expect(bnuLowerBook.units[3]?.lessons[4]?.page).toBe(35);
  expect(bnuLowerBook.units[3]?.lessons[3]?.page).toBe(33);
  expect(bnuLowerBook.units[1]?.lessons[0]?.page).toBe(18);
});

it('round-trips partial decomposition, zero and retry history with the earlier addition-table snapshot unchanged', () => {
  const now = '2026-10-04T18:00:00.000Z';
  const old = createSession(
    bnuLowerAdditionTableLesson,
    bnuLowerBook.id,
    'child',
    {
      seed: 1,
      now,
    },
  );
  const snapshot = JSON.parse(JSON.stringify(old));
  const session = createSession(lesson, bnuLowerBook.id, 'child', {
    seed: 2,
    now,
  });
  const index = session.questions.findIndex(({ id }) =>
    id.endsWith('-seven-path'),
  );
  const item = required(session.questions[index]);
  const response = required(session.responses[index]);
  response.draft = [2, 5, 10, 15];
  const wrong = submitResponse(item, response, now);
  wrong.draft = [3, 5, 10, 15];
  session.responses[index] = submitResponse(item, wrong, now);
  required(
    session.responses.find(({ questionId }) =>
      questionId.endsWith('-eight-path'),
    ),
  ).draft = [2, null, null, null];
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
  expect(
    restored.sessions[1]?.responses[index]?.submissions.map(
      ({ correct }) => correct,
    ),
  ).toEqual([false, true]);
});
