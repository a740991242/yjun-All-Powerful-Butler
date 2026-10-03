import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { required } from '../learning/required';
import { bnuSixTenLesson as lesson } from './bnu-six-ten';

const q = (suffix: string) =>
  required(lesson.questions.find((item) => item.id.endsWith(`-${suffix}`)));
it('counts six through ten without confusing digit count, objects or ordinal direction', () => {
  for (let value = 6; value <= 10; value++) {
    const question = q(`q${value - 5}`);
    expect(question.visual).toEqual({ kind: 'count', count: value });
    expect(evaluate(question.rule, value)).toBe(true);
    expect(evaluate(question.rule, value - 1)).toBe(false);
  }
  expect(evaluate(q('q6').rule, 2)).toBe(true);
  expect(evaluate(q('q6').rule, 10)).toBe(false);
  expect(evaluate(q('q7').rule, 10)).toBe(true);
  expect(evaluate(q('q8').rule, 3)).toBe(true);
  expect(evaluate(q('q8').rule, 4)).toBe(false);
  expect(evaluate(q('q10').rule, 10)).toBe(true);
  expect(evaluate(q('q11').rule, '从9起')).toBe(true);
  expect(evaluate(q('q11').rule, '从1起')).toBe(false);
  expect(() => evaluate(q('q1').rule, null)).toThrow(
    'educationLearning.answerRequired',
  );
});
it('records writing and the actual number path separately, with new review demands', () => {
  expect(lesson.steps).toHaveLength(6);
  expect(lesson.questions).toHaveLength(19);
  const actual = lesson.questions.filter((item) => item.rule.kind === 'manual');
  expect(actual).toHaveLength(7);
  for (const question of actual)
    expect(evaluate(question.rule, 'confirmed')).toBeNull();
  expect(evaluate(q('reflection').rule, '还未写')).toBeNull();
  const reviews = required(lesson.reviewQuestions);
  expect(reviews).toHaveLength(4);
  for (const question of reviews)
    expect(
      lesson.questions.some(
        (old) => old.id === question.id || old.prompt === question.prompt,
      ),
    ).toBe(false);
  expect(evaluate(required(reviews[0]).rule, 8)).toBe(true);
  expect(evaluate(required(reviews[1]).rule, 9)).toBe(true);
  expect(evaluate(required(reviews[1]).rule, 10)).toBe(false);
  expect(evaluate(required(reviews[2]).rule, '10个圆点')).toBe(true);
  expect(evaluate(required(reviews[3]).rule, 5)).toBe(true);
});
it('keeps mistakes and a real zero draft through schema-one export', () => {
  const now = '2026-10-03T00:00:00.000Z';
  const session = createSession(lesson, 'bnu-math-p1-upper-2024', 'child', {
    seed: 7,
    now,
  });
  const index = session.questions.findIndex((item) => item.id.endsWith('-q1'));
  const question = required(session.questions[index]);
  const response = required(session.responses[index]);
  response.draft = 0;
  const wrong = submitResponse(question, response, now);
  wrong.draft = 6;
  session.responses[index] = submitResponse(question, wrong, now);
  expect(
    required(session.responses[index]).submissions.map((item) => item.correct),
  ).toEqual([false, true]);
  required(
    session.responses.find((item) => item.questionId.endsWith('-q2')),
  ).draft = 0;
  const data = {
    schemaVersion: 1 as const,
    profiles: [{ id: 'child', nickname: '隔离测试', createdAt: now }],
    activeProfileId: 'child',
    sessions: [session],
  };
  expect(parseBackup(exportBackup(data, now)).data).toEqual(
    JSON.parse(JSON.stringify(data)),
  );
});
