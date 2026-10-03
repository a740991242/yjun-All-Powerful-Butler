import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { required } from '../learning/required';
import { newReviewQuestions } from '../learning/review';
import { bnuUpperBook } from './bnu';
import { bnuComparisonLesson as compare } from './bnu-comparison';
import { bnuOrganizeLesson as organize } from './bnu-organize';

const q = (suffix: string) =>
  required(compare.questions.find((item) => item.id.endsWith(`-${suffix}`)));
it('accepts all and only legal open integers, including zero, without crossing strict boundaries', () => {
  for (let a = -1; a <= 11; a++) {
    expect(evaluate(q('q10').rule, [a])).toBe(a >= 0 && a < 3);
    for (let b = -1; b <= 11; b++)
      expect(evaluate(q('q14').rule, [a, b])).toBe(
        a >= 0 && a < 2 && b >= 0 && b < 5,
      );
  }
  expect(evaluate(q('q14').rule, [0, 0])).toBe(true);
  expect(() => evaluate(q('q14').rule, [1.5, 2])).toThrow(
    'educationLearning.answerRequired',
  );
  expect(() => evaluate(q('q14').rule, [0, null])).toThrow(
    'educationLearning.answerRequired',
  );
  expect(evaluate(q('q12').rule, ['5', '7', '10'])).toBe(true);
  expect(evaluate(q('q12').rule, ['4', '5', '7', '10'])).toBe(false);
  expect(evaluate(q('q13').rule, ['0', '4'])).toBe(true);
  expect(evaluate(q('q13').rule, ['0', '4', '6'])).toBe(false);
});
it('keeps paired shortages, surplus, reverse comparisons and units separate', () => {
  expect(evaluate(q('q1').rule, 4)).toBe(true);
  expect(evaluate(q('q1').rule, 7)).toBe(false);
  expect(evaluate(q('q2').rule, '>')).toBe(true);
  expect(evaluate(q('q3').rule, '<')).toBe(true);
  expect(evaluate(q('q3').rule, '>')).toBe(false);
  expect(evaluate(q('q4').rule, '=')).toBe(true);
  expect(evaluate(q('q5').rule, 2)).toBe(true);
  expect(evaluate(q('q6').rule, 2)).toBe(true);
  expect(evaluate(q('q9').rule, 6)).toBe(true);
  expect(evaluate(q('q9').rule, 3)).toBe(false);
  expect(evaluate(q('q15').rule, 7)).toBe(true);
});
it('distinguishes record scope, cardinality and changed ordinal direction in organizing tasks', () => {
  const by = (suffix: string) =>
    required(organize.questions.find((item) => item.id.endsWith(`-${suffix}`)));
  for (const [suffix, value] of [
    ['q1', 4],
    ['q2', 3],
    ['q3', 2],
    ['q6', 3],
    ['q7', 6],
    ['q8', 3],
    ['q9', 7],
  ] as const)
    expect(evaluate(by(suffix).rule, value)).toBe(true);
  expect(evaluate(by('q6').rule, 6)).toBe(false);
  expect(evaluate(by('q13').rule, '不能确定')).toBe(true);
  const fresh = required(organize.reviewQuestions);
  expect(evaluate(required(fresh[1]).rule, 4)).toBe(true);
  expect(evaluate(required(fresh[1]).rule, 2)).toBe(false);
  expect(evaluate(required(fresh[2]).rule, 2)).toBe(true);
  expect(evaluate(required(fresh[3]).rule, '不能')).toBe(true);
});
it('keeps partial zero, reflections and new review rules in schema-one backups', () => {
  const now = '2026-10-03T00:00:00.000Z';
  const sessions = [compare, organize].map((lesson) =>
    createSession(lesson, 'bnu-math-p1-upper-2024', 'child', { seed: 11, now }),
  );
  required(
    sessions[0]?.responses.find((item) => item.questionId.endsWith('-q14')),
  ).draft = [0, null];
  const data = {
    schemaVersion: 1 as const,
    profiles: [{ id: 'child', nickname: '隔离测试', createdAt: now }],
    activeProfileId: 'child',
    sessions,
  };
  expect(parseBackup(exportBackup(data, now)).data).toEqual(
    JSON.parse(JSON.stringify(data)),
  );
  for (const [lesson, tasks, manuals, reflections] of [
    [compare, 24, 8, 1],
    [organize, 23, 7, 2],
  ] as const) {
    expect(lesson.steps).toHaveLength(6);
    expect(lesson.questions).toHaveLength(tasks);
    expect(
      lesson.questions.filter((item) => item.rule.kind === 'manual'),
    ).toHaveLength(manuals);
    expect(
      lesson.questions.filter((item) => item.rule.kind === 'reflection'),
    ).toHaveLength(reflections);
    for (const item of lesson.questions.filter(
      (item) => item.rule.kind === 'manual',
    ))
      expect(evaluate(item.rule, 'confirmed')).toBeNull();
    expect(lesson.reviewQuestions).toHaveLength(4);
    for (const fresh of lesson.reviewQuestions ?? [])
      expect(
        lesson.questions.some(
          (old) => old.id === fresh.id || old.prompt === fresh.prompt,
        ),
      ).toBe(false);
  }
  const fresh = required(compare.reviewQuestions?.[2]);
  for (let a = -1; a <= 5; a++)
    for (let b = -1; b <= 3; b++)
      expect(evaluate(fresh.rule, [a, b])).toBe(
        a >= 0 && a < 4 && b >= 0 && b < 2,
      );
});

it('keeps the exact new review tasks per available course after every other main course was visited', () => {
  const now = '2026-10-03T00:00:00.000Z';
  const lessons = bnuUpperBook.units
    .flatMap((unit) => unit.lessons)
    .filter((lesson) => lesson.status === 'available');
  const sessions = lessons.map((lesson) => {
    const session = createSession(lesson, bnuUpperBook.id, 'child', {
      seed: 9,
      now,
    });
    const index = session.questions.findIndex((item) =>
      item.id.endsWith('-q1'),
    );
    const question = required(session.questions[index]);
    const response = required(session.responses[index]);
    if (question.rule.kind === 'number')
      response.draft = question.rule.value === 0 ? 1 : 0;
    else if (question.rule.kind === 'choice') {
      const correct = question.rule.value;
      response.draft = required(
        question.choices?.find((item) => item.id !== correct),
      ).id;
    } else throw new Error('Unexpected first objective');
    session.responses[index] = submitResponse(question, response, now);
    return session;
  });
  for (let index = 0; index < lessons.length; index++)
    expect(
      newReviewQuestions(
        required(lessons[index]),
        required(sessions[index]),
        sessions,
      ),
      required(lessons[index]).id,
    ).toHaveLength(
      required(lessons[index]).id === 'bnu-upper-solid-recognition' ? 5 : 4,
    );
});
