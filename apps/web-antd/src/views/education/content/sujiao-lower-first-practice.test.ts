import type { Answer } from '../learning/types';

import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { initialLibrary } from '../learning/storage';
import { sujiaoLowerFirstPracticeDraft as lesson } from './sujiao-lower-first-practice';
import { sujiaoLowerFirstReviewDraft } from './sujiao-lower-first-review';

it('checks all shuffled inputs, boundary outputs and conservation independently', () => {
  const main: Answer[] = [
    [19, 9, 12, 17, 10, 15, 13, 18, 11, 16, 14],
    [10, 1, 5, 3, 8, 2, 9, 4, 7, 6],
    [14, 14, 14],
    'move',
    7,
    [15, 15],
    [7, 7],
    [8, 6, 3],
    'no',
  ];
  const review: Answer[] = [
    [16, 11, 18, 13, 19, 9, 15, 10, 17, 14, 12],
    [4, 9, 2, 7, 1, 10, 5, 8, 3, 6],
    [15, 15, 15],
    'move',
    7,
    [17, 17],
    [7, 7],
    [8, 6, 5],
    'no',
  ];
  expect(lesson.questions).toHaveLength(14);
  expect(lesson.reviewQuestions).toHaveLength(9);
  lesson.questions
    .slice(0, 9)
    .forEach((q, i) => expect(evaluate(q.rule, main[i]!)).toBe(true));
  lesson.reviewQuestions!.forEach((q, i) => {
    expect(q.knowledge).toBe(lesson.questions[i]!.knowledge);
    expect(q.prompt).not.toBe(lesson.questions[i]!.prompt);
    expect(evaluate(q.rule, review[i]!)).toBe(true);
  });
  expect(
    evaluate(
      lesson.questions[0]!.rule,
      [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
    ),
  ).toBe(false);
  expect(
    evaluate(lesson.questions[1]!.rule, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  ).toBe(false);
  expect(evaluate(lesson.questions[2]!.rule, [14, 13, 12])).toBe(false);
  expect(evaluate(lesson.questions[3]!.rule, 'remove')).toBe(false);
  expect(evaluate(lesson.questions[6]!.rule, [10, 7])).toBe(false);
  expect(evaluate(lesson.reviewQuestions![0]!.rule, main[0]!)).toBe(false);
});

it('preserves long partial tables and ordered mistakes without marking actual paper activities complete', () => {
  const state = initialLibrary('完整输入表');
  const old = createSession(
    sujiaoLowerFirstReviewDraft,
    'sujiao-math-p1-lower-9787574312951',
    state.activeProfileId,
  );
  const session = createSession(lesson, old.bookId, state.activeProfileId);
  state.sessions.push(old, session);
  const index = session.questions.findIndex((q) =>
    q.knowledge.endsWith('-whole-add-list'),
  );
  session.responses[index]!.draft = [
    19,
    null,
    12,
    17,
    10,
    15,
    13,
    18,
    11,
    16,
    null,
  ];
  expect(
    parseBackup(exportBackup(state)).data.sessions[1]!.responses[index]!.draft,
  ).toEqual(session.responses[index]!.draft);
  for (const answer of [
    [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
    [19, 9, 12, 17, 10, 15, 13, 18, 11, 16, 14],
  ]) {
    session.responses[index]!.draft = answer;
    session.responses[index] = submitResponse(
      session.questions[index]!,
      session.responses[index]!,
    );
  }
  expect(session.responses[index]!.submissions.map((s) => s.correct)).toEqual([
    false,
    true,
  ]);
  expect(
    session.questions.filter((q) => q.rule.kind === 'manual'),
  ).toHaveLength(5);
  expect(
    session.responses
      .filter((_, i) => session.questions[i]!.rule.kind === 'manual')
      .every((r) => r.submissions.length === 0),
  ).toBe(true);
  expect(parseBackup(exportBackup(state)).data.sessions).toEqual(
    state.sessions,
  );
});
