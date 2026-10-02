import type { Answer } from '../learning/types';

import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { initialLibrary } from '../learning/storage';
import { sujiaoFinalCountingDraft as lesson } from './sujiao-final-counting';
it('checks both grouping methods, all six points and changed ordering and ranges without equating containers and books', () => {
  const main: Answer[] = [
    8,
    40,
    4,
    40,
    [30, 35, 40],
    [10, 20, 30, 40],
    [36, 62, 53, 47, 60, 41],
    ['A', 'F', 'D', 'C', 'E', 'B'],
    ['A', 'D', 'F'],
    40,
    'good',
    'good',
  ];
  const review: Answer[] = [
    6,
    30,
    3,
    30,
    [20, 25, 30],
    [10, 20, 30],
    [57, 34, 66, 42, 60, 49],
    ['B', 'D', 'F', 'A', 'E', 'C'],
    ['C', 'E'],
    60,
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
  for (const index of [0, 1, 2, 3, 4, 6, 7, 8, 9])
    expect(evaluate(lesson.reviewQuestions![index]!.rule, main[index]!)).toBe(
      false,
    );
  expect(evaluate(lesson.questions[0]!.rule, 40)).toBe(false);
  expect(evaluate(lesson.questions[1]!.rule, 8)).toBe(false);
  expect(evaluate(lesson.questions[9]!.rule, 41)).toBe(false);
  expect(lesson.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
    4,
  );
});
it('restores six-point partial drafts and original models, preserving wrong attempts, unscored reflections and actual-task independence', () => {
  const library = initialLibrary('数书与标点');
  const session = createSession(
    lesson,
    'sujiao-math-p1-lower-9787574312951',
    library.activeProfileId,
  );
  const i = session.questions.findIndex((q) =>
    q.knowledge.endsWith('-six-points'),
  );
  for (const answer of [
    [36, 62, 53, 47, 60, 42],
    [36, 62, 53, 47, 60, 41],
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
    q.knowledge.endsWith('-ordered-points'),
  );
  session.responses[j]!.draft = ['A', 'F', '', '', '', ''];
  for (const q of session.questions.filter(
    (q) => q.rule.kind === 'reflection',
  )) {
    const k = session.questions.findIndex((item) => item.id === q.id);
    session.responses[k]!.draft = '没有实际画线，计划下次做。';
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
  const bad = JSON.parse(exportBackup(library));
  bad.data.sessions[0].questions[i].visual.answer = 36;
  expect(() => parseBackup(JSON.stringify(bad))).toThrow(
    'educationLearning.invalidBackup',
  );
});
