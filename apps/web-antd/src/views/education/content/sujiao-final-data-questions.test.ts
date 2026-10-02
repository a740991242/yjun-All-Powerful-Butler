import type { Answer } from '../learning/types';

import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { initialLibrary } from '../learning/storage';
import { sujiaoFinalDataQuestionsDraft as lesson } from './sujiao-final-data-questions';

it('jointly matches all four readings and changes every numeric comparison under review without treating relative words as thresholds', () => {
  const main: Answer[] = [
    [30, 31, 68, 24],
    'no',
    'context',
    17,
    9,
    8,
    'unknown',
    22,
    6,
    'difference',
    'pending',
  ];
  const review: Answer[] = [
    [40, 42, 79, 34],
    'no',
    'context',
    18,
    7,
    11,
    'unknown',
    25,
    7,
    'difference',
    'pending',
  ];
  expect(lesson.questions).toHaveLength(18);
  expect(lesson.reviewQuestions).toHaveLength(11);
  lesson.questions
    .slice(0, 11)
    .forEach((q, i) => expect(evaluate(q.rule, main[i]!)).toBe(true));
  lesson.reviewQuestions!.forEach((q, i) => {
    expect(evaluate(q.rule, review[i]!)).toBe(true);
    expect(q.knowledge).toBe(lesson.questions[i]!.knowledge);
  });
  for (const i of [0, 3, 4, 5, 7, 8])
    expect(evaluate(lesson.reviewQuestions![i]!.rule, main[i]!)).toBe(false);
  for (const wrong of [
    [30, 31, 24, 68],
    [30, 30, 68, 24],
  ])
    expect(evaluate(lesson.questions[0]!.rule, wrong)).toBe(false);
  expect(() => evaluate(lesson.questions[0]!.rule, [30, 31, 68])).toThrow(
    'educationLearning.answerRequired',
  );
  expect(evaluate(lesson.questions[4]!.rule, 41)).toBe(false);
  expect(evaluate(lesson.questions[5]!.rule, 17)).toBe(false);
  expect(evaluate(lesson.questions[6]!.rule, 'same')).toBe(false);
  expect(evaluate(lesson.questions[9]!.rule, 'third')).toBe(false);
  expect(lesson.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
    4,
  );
});
it('preserves mistaken whole matching, unfinished drafts and null reflections without claiming actual question generation or discussion', () => {
  const library = initialLibrary('读数据');
  const session = createSession(
    lesson,
    'sujiao-math-p1-lower-9787574312951',
    library.activeProfileId,
  );
  const i = session.questions.findIndex((q) =>
    q.knowledge.endsWith('-joint-reading'),
  );
  for (const answer of [
    [30, 31, 24, 68],
    [30, 31, 68, 24],
  ]) {
    session.responses[i]!.draft = answer;
    session.responses[i] = submitResponse(
      session.questions[i]!,
      session.responses[i]!,
    );
  }
  expect(session.responses[i]!.submissions.map((a) => a.correct)).toEqual([
    false,
    true,
  ]);
  const j = session.questions.findIndex((q) =>
    q.knowledge.endsWith('-jump-rain-wind'),
  );
  session.responses[j]!.draft = 7;
  for (const q of session.questions.filter(
    (q) => q.rule.kind === 'reflection',
  )) {
    const k = session.questions.findIndex((item) => item.id === q.id);
    session.responses[k]!.draft = '还没自己提问或交流，计划下一步做。';
    session.responses[k] = submitResponse(q, session.responses[k]!);
    expect(session.responses[k]!.submissions[0]!.correct).toBeNull();
  }
  expect(
    session.responses.every(
      (r, k) =>
        session.questions[k]!.rule.kind !== 'manual' ||
        r.submissions.length === 0,
    ),
  ).toBe(true);
  library.sessions.push(session);
  expect(parseBackup(exportBackup(library)).data.sessions[0]).toEqual(session);
});
