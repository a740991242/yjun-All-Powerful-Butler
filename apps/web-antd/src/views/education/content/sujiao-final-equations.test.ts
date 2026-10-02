import type { Answer } from '../learning/types';

import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { initialLibrary } from '../learning/storage';
import { sujiaoFinalEquationsDraft as lesson } from './sujiao-final-equations';

it('fills both complete small tables and changes equal-result selections and whole-number unknowns in review', () => {
  const main: Answer[] = [
    [15, 17, 19, 13, 15, 17, 11, 13, 15],
    [9, 10, 11, 8, 9, 10, 7, 8, 9],
    ['0-0', '1-1', '2-2'],
    ['0-0', '1-1', '2-2'],
    42,
    48,
    7,
    0,
    'good',
    'good',
    'good',
    'good',
  ];
  const review: Answer[] = [
    [9, 13, 11, 13, 17, 15, 11, 15, 13],
    [9, 11, 10, 11, 13, 12, 10, 12, 11],
    ['0-1', '1-0', '2-2'],
    ['0-1', '1-0', '2-2'],
    33,
    57,
    6,
    0,
    'good',
    'good',
    'good',
    'good',
  ];
  expect(lesson.questions).toHaveLength(19);
  expect(lesson.reviewQuestions).toHaveLength(12);
  lesson.questions
    .slice(0, 12)
    .forEach((q, i) => expect(evaluate(q.rule, main[i]!)).toBe(true));
  lesson.reviewQuestions!.forEach((q, i) => {
    expect(evaluate(q.rule, review[i]!)).toBe(true);
    expect(q.knowledge).toBe(lesson.questions[i]!.knowledge);
  });
  expect(evaluate(lesson.questions[4]!.rule, 40)).toBe(false);
  expect(evaluate(lesson.questions[5]!.rule, 38)).toBe(false);
  expect(() => evaluate(lesson.questions[7]!.rule, null)).toThrow(
    'educationLearning.answerRequired',
  );
  expect(evaluate(lesson.reviewQuestions![0]!.rule, main[0]!)).toBe(false);
  expect(evaluate(lesson.reviewQuestions![2]!.rule, main[2]!)).toBe(false);
  expect(evaluate(lesson.reviewQuestions![4]!.rule, 42)).toBe(false);
});
it('preserves wrong attempts, table snapshots and independent unscored process records through strict backups', () => {
  const library = initialLibrary('等式');
  const session = createSession(
    lesson,
    'sujiao-math-p1-lower-9787574312951',
    library.activeProfileId,
  );
  const index = session.questions.findIndex((q) =>
    q.knowledge.endsWith('-left-unknown'),
  );
  for (const answer of [40, 42]) {
    session.responses[index]!.draft = answer;
    session.responses[index] = submitResponse(
      session.questions[index]!,
      session.responses[index]!,
    );
  }
  expect(session.responses[index]!.submissions.map((a) => a.correct)).toEqual([
    false,
    true,
  ]);
  const tableIndex = session.questions.findIndex((q) =>
    q.knowledge.endsWith('-table-subtract'),
  );
  session.responses[tableIndex]!.draft = [
    9,
    10,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ];
  for (const q of session.questions.filter(
    (q) => q.rule.kind === 'reflection',
  )) {
    const i = session.questions.findIndex((item) => item.id === q.id);
    session.responses[i]!.draft = '还没在纸上做，想下次填写，这是计划。';
    session.responses[i] = submitResponse(q, session.responses[i]!);
    expect(session.responses[i]!.submissions[0]!.correct).toBeNull();
  }
  library.sessions.push(session);
  expect(parseBackup(exportBackup(library)).data.sessions[0]).toEqual(session);
  const invalid = JSON.parse(exportBackup(library));
  invalid.data.sessions[0].questions[tableIndex].visual.answer = 9;
  expect(() => parseBackup(JSON.stringify(invalid))).toThrow(
    'educationLearning.invalidBackup',
  );
  expect(
    session.responses.every(
      (r, i) =>
        session.questions[i]!.rule.kind !== 'manual' ||
        r.submissions.length === 0,
    ),
  ).toBe(true);
});
