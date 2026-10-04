import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { required } from '../learning/required';
import { bnuLowerAncientCountLesson, bnuLowerBook } from './bnu-lower';
import { bnuLowerPlaceValueLesson as lesson } from './bnu-lower-place-value';

it('covers both printed pages with all blanks and comparisons, preserving separate physical work', () => {
  expect(lesson.page).toBe(4);
  expect(lesson.steps).toHaveLength(7);
  expect(lesson.questions).toHaveLength(33);
  const answers = [
    ['same-material', '11'],
    ['tens', 1],
    ['ones', 8],
    ['ten-zero', 0],
    ['twenty-tens', 2],
    ['add-1', 11],
    ['add-9', 19],
    ['add-10', 20],
    ['draw-2', 12],
    ['draw-5', 15],
    ['ascending-0', 14],
    ['ascending-1', 15],
    ['ascending-2', 16],
    ['ascending-3', 17],
    ['descending-0', 14],
    ['descending-1', 12],
    ['descending-2', 10],
    ['compare-0', '<'],
    ['compare-1', '>'],
    ['compare-2', '>'],
    ['compare-3', '<'],
    ['compare-4', '='],
  ] as const;
  const objective = lesson.questions.filter(
    ({ rule }) => !['manual', 'reflection'].includes(rule.kind),
  );
  expect(objective).toHaveLength(answers.length);
  for (const [suffix, value] of answers) {
    const q = required(objective.find(({ id }) => id.endsWith(`-${suffix}`)));
    expect(evaluate(q.rule, value)).toBe(true);
  }
  const ones = required(objective.find(({ id }) => id.endsWith('-ones')));
  expect(evaluate(ones.rule, 18)).toBe(false);
  const zero = required(objective.find(({ id }) => id.endsWith('-ten-zero')));
  expect(() => evaluate(zero.rule, null)).toThrow(
    'educationLearning.answerRequired',
  );
  expect(evaluate(zero.rule, 10)).toBe(false);
  const manual = lesson.questions.filter(({ rule }) => rule.kind === 'manual');
  expect(manual).toHaveLength(9);
  manual.forEach(({ rule }) => expect(evaluate(rule, 'confirmed')).toBeNull());
  const record = lesson.questions.filter(
    ({ rule }) => rule.kind === 'reflection',
  );
  expect(record).toHaveLength(2);
  record.forEach(({ rule }) =>
    expect(evaluate(rule, '尚未做，下一次准备练习')).toBeNull(),
  );
});

it('uses distinct review conditions and independently checked results', () => {
  const review = required(lesson.reviewQuestions);
  expect(review).toHaveLength(4);
  for (const [index, answer] of [16, 0, '>', 13].entries()) {
    const q = required(review[index]);
    expect(evaluate(q.rule, answer)).toBe(true);
    expect(
      lesson.questions.some(
        ({ id, prompt }) => id === q.id || prompt === q.prompt,
      ),
    ).toBe(false);
  }
});

it('preserves old first-course snapshots and new zero drafts, error history and stable book identity', () => {
  const now = '2026-10-04T13:00:00.000Z';
  const old = createSession(
    bnuLowerAncientCountLesson,
    bnuLowerBook.id,
    'child',
    { seed: 1, now },
  );
  const before = JSON.parse(JSON.stringify(old));
  const session = createSession(lesson, bnuLowerBook.id, 'child', {
    seed: 2,
    now,
  });
  const index = session.questions.findIndex(({ id }) => id.endsWith('-draw-2'));
  const q = required(session.questions[index]);
  let response = required(session.responses[index]);
  response.draft = 3;
  response = submitResponse(q, response, now);
  response.draft = 12;
  session.responses[index] = submitResponse(q, response, now);
  expect(
    required(session.responses[index]).submissions.map(
      ({ correct }) => correct,
    ),
  ).toEqual([false, true]);
  required(
    session.responses.find(({ questionId }) =>
      questionId.endsWith('-ten-zero'),
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
  expect(restored.sessions[1]?.lessonId).toBe('bnu-lower-ancient-count-two');
});
