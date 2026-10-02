import type { Answer } from '../learning/types';

import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { initialLibrary } from '../learning/storage';
import { sujiaoArithmeticTablesDraft } from './sujiao-arithmetic-tables';
import { sujiaoLowerFirstReviewDraft as lesson } from './sujiao-lower-first-review';

it('selects only requested categories and excludes overlapping subgroups and future plans', () => {
  const main: Answer[] = [
    ['ducks', 'geese'],
    14,
    2,
    'no',
    'no',
    'read',
    9,
    [8, 8, 2],
    'many',
  ];
  const review: Answer[] = [
    ['ducks', 'geese'],
    16,
    3,
    'no',
    'no',
    'read',
    10,
    [9, 9, 4],
    'many',
  ];
  expect(lesson.questions).toHaveLength(17);
  expect(lesson.reviewQuestions).toHaveLength(9);
  lesson.questions
    .slice(0, 9)
    .forEach((q, i) => expect(evaluate(q.rule, main[i]!)).toBe(true));
  lesson.reviewQuestions!.forEach((q, i) => {
    expect(evaluate(q.rule, review[i]!)).toBe(true);
    expect(q.knowledge).toBe(lesson.questions[i]!.knowledge);
    expect(q.prompt).not.toBe(lesson.questions[i]!.prompt);
  });
  expect(evaluate(lesson.questions[0]!.rule, ['ducks', 'geese', 'male'])).toBe(
    false,
  );
  expect(evaluate(lesson.questions[0]!.rule, ['ducks'])).toBe(false);
  expect(evaluate(lesson.questions[1]!.rule, 18)).toBe(false);
  expect(evaluate(lesson.questions[2]!.rule, 10)).toBe(false);
  expect(evaluate(lesson.questions[5]!.rule, 'tomorrow')).toBe(false);
  expect(evaluate(lesson.questions[7]!.rule, [8, 8, 8])).toBe(false);
  expect(evaluate(lesson.reviewQuestions![2]!.rule, 2)).toBe(false);
});

it('keeps nested-category mistakes and three independent null self-evaluations without completing real activities', () => {
  const state = initialLibrary('第一单元回顾');
  const old = createSession(
    sujiaoArithmeticTablesDraft,
    'sujiao-math-p1-lower-9787574312951',
    state.activeProfileId,
  );
  const session = createSession(lesson, old.bookId, state.activeProfileId);
  state.sessions.push(old, session);
  const index = session.questions.findIndex((q) =>
    q.knowledge.endsWith('-nested-part'),
  );
  session.responses[index]!.draft = 10;
  session.responses[index] = submitResponse(
    session.questions[index]!,
    session.responses[index]!,
  );
  session.responses[index]!.draft = 2;
  session.responses[index] = submitResponse(
    session.questions[index]!,
    session.responses[index]!,
  );
  expect(session.responses[index]!.submissions.map((s) => s.correct)).toEqual([
    false,
    true,
  ]);
  const evaluations = session.questions.filter((q) =>
    q.id.includes('-evaluation-'),
  );
  expect(evaluations).toHaveLength(3);
  for (const q of evaluations) {
    const i = session.questions.findIndex((item) => item.id === q.id);
    session.responses[i]!.draft =
      '还需要帮助，实际游戏尚未做，准备下次尝试，这是计划。';
    session.responses[i] = submitResponse(q, session.responses[i]!);
    expect(session.responses[i]!.submissions[0]!.correct).toBeNull();
  }
  expect(
    session.responses
      .filter((_, i) => session.questions[i]!.rule.kind === 'manual')
      .every((r) => r.submissions.length === 0),
  ).toBe(true);
  const steps = session.questions.findIndex((q) =>
    q.knowledge.endsWith('-open-equations'),
  );
  session.responses[steps]!.draft = [8, null, 2];
  const restored = parseBackup(exportBackup(state)).data.sessions;
  expect(restored[0]).toEqual(old);
  expect(restored[1]).toEqual(session);
  expect(restored[1]!.responses[steps]!.draft).toEqual([8, null, 2]);
});

it('rechecks changed subgroup and total in review instead of accepting the previous answer', () => {
  const state = initialLibrary('换条件回顾');
  const review = createSession(
    lesson,
    'sujiao-math-p1-lower-9787574312951',
    state.activeProfileId,
    {
      mode: 'review',
      questions: lesson.reviewQuestions!.filter((q) =>
        q.knowledge.endsWith('-nested-part'),
      ),
    },
  );
  for (const answer of [2, 3]) {
    review.responses[0]!.draft = answer;
    review.responses[0] = submitResponse(
      review.questions[0]!,
      review.responses[0]!,
    );
  }
  expect(review.responses[0]!.submissions.map((s) => s.correct)).toEqual([
    false,
    true,
  ]);
  state.sessions.push(review);
  expect(parseBackup(exportBackup(state)).data.sessions).toEqual(
    state.sessions,
  );
});
