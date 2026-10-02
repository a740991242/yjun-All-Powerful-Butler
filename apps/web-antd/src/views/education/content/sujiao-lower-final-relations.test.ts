import type { Answer } from '../learning/types';

import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { initialLibrary } from '../learning/storage';
import { sujiaoLowerFinalRelationsDraft as lesson } from './sujiao-lower-final-relations';

it('checks all four quantity relations, row totals, capacity constraints and a common reference with new review data', () => {
  const main: Answer[] = [
    7,
    7,
    31,
    19,
    12,
    'whole',
    [32, 23, 38],
    ['Y', 'Z', 'X'],
    ['X', 'Y', 'Z'],
    [28, 31],
    'A',
    19,
    'ask',
    'no',
  ];
  const review: Answer[] = [
    9,
    9,
    27,
    18,
    9,
    'whole',
    [34, 25, 40],
    ['Y', 'Z', 'X'],
    ['X', 'Y', 'Z'],
    [20, 32],
    'A',
    23,
    'ask',
    'no',
  ];
  expect(lesson.steps).toHaveLength(6);
  expect(lesson.questions).toHaveLength(20);
  expect(lesson.reviewQuestions).toHaveLength(14);
  lesson.questions
    .slice(0, 14)
    .forEach((q, i) => expect(evaluate(q.rule, main[i]!)).toBe(true));
  lesson.reviewQuestions!.forEach((q, i) => {
    expect(evaluate(q.rule, review[i]!)).toBe(true);
    expect(q.knowledge).toBe(lesson.questions[i]!.knowledge);
    if (q.visual) expect(q.visual).not.toEqual(lesson.questions[i]!.visual);
  });
  expect(evaluate(lesson.questions[2]!.rule, 7)).toBe(false);
  expect(evaluate(lesson.questions[3]!.rule, 7)).toBe(false);
  expect(evaluate(lesson.questions[7]!.rule, ['X', 'X', 'X'])).toBe(false);
  expect(evaluate(lesson.questions[8]!.rule, ['Z'])).toBe(false);
  expect(evaluate(lesson.questions[9]!.rule, [21, 21])).toBe(false);
  expect(evaluate(lesson.questions[11]!.rule, 7)).toBe(false);
  expect(lesson.questions[12]!.visual).toBeUndefined();
  expect(lesson.reviewQuestions![12]!.visual).toBeUndefined();
  expect(lesson.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
    4,
  );
  expect(
    lesson.questions.filter((q) => q.rule.kind === 'reflection'),
  ).toHaveLength(2);
});
it('preserves partial totals and wrong cross-row calculations without confirming real tasks or adding answers to the table', () => {
  const library = initialLibrary('期末数量关系');
  const s = createSession(
    lesson,
    'sujiao-math-p1-lower-9787574312951',
    library.activeProfileId,
  );
  const i = s.questions.findIndex((q) => q.id.endsWith('-q-class-totals'));
  s.responses[i]!.draft = [32, null, 38];
  library.sessions.push(s);
  expect(
    parseBackup(exportBackup(library)).data.sessions[0]!.responses[i]!.draft,
  ).toEqual([32, null, 38]);
  for (const draft of [
    [32, 33, 38],
    [32, 23, 38],
  ]) {
    s.responses[i]!.draft = draft;
    s.responses[i] = submitResponse(s.questions[i]!, s.responses[i]!);
  }
  expect(s.responses[i]!.submissions.map((x) => x.correct)).toEqual([
    false,
    true,
  ]);
  expect(parseBackup(exportBackup(library)).data.sessions[0]).toEqual(s);
  expect(
    s.responses
      .filter((_, j) =>
        ['manual', 'reflection'].includes(s.questions[j]!.rule.kind),
      )
      .every((r) => r.submissions.length === 0),
  ).toBe(true);
  const bad = JSON.parse(exportBackup(library));
  bad.data.sessions[0].questions[i].visual.assignment = ['Y', 'Z', 'X'];
  expect(() => parseBackup(JSON.stringify(bad))).toThrow(Error);
});
