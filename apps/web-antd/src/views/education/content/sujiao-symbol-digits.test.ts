import type { Answer } from '../learning/types';

import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { initialLibrary } from '../learning/storage';
import { sujiaoSymbolDigitsDraft as lesson } from './sujiao-symbol-digits';
function candidates(target: number) {
  const pairs: number[][] = [];
  for (let tens = 1; tens <= 9; tens++) {
    for (let ones = 0; ones <= 9; ones++) {
      if (10 * tens + ones - tens === target) pairs.push([tens, ones]);
    }
  }
  return pairs;
}
it('checks independent digit enumeration, unique and multiple solutions and actual changed review conditions', () => {
  expect(candidates(64)).toEqual([[7, 1]]);
  expect(candidates(55)).toEqual([[6, 1]]);
  expect(candidates(72)).toEqual([
    [7, 9],
    [8, 0],
  ]);
  expect(candidates(63)).toEqual([
    [6, 9],
    [7, 0],
  ]);
  const main: Answer[] = [
    [7, 1],
    71,
    64,
    'tens',
    'no',
    'no',
    80,
    7,
    'yes',
    'both',
    'no',
    'no',
  ];
  const review: Answer[] = [
    [6, 1],
    61,
    55,
    'tens',
    'no',
    'no',
    60,
    8,
    'yes',
    'both',
    'no',
    'no',
  ];
  expect(lesson.questions).toHaveLength(17);
  expect(lesson.reviewQuestions).toHaveLength(12);
  lesson.questions
    .slice(0, 12)
    .forEach((q, i) => expect(evaluate(q.rule, main[i]!)).toBe(true));
  lesson.reviewQuestions!.forEach((q, i) => {
    expect(evaluate(q.rule, review[i]!)).toBe(true);
    expect(q.prompt).not.toBe(lesson.questions[i]!.prompt);
    expect(q.knowledge).toBe(lesson.questions[i]!.knowledge);
  });
  expect(evaluate(lesson.questions[0]!.rule, [1, 7])).toBe(false);
  expect(evaluate(lesson.questions[0]!.rule, [6, 7])).toBe(false);
  expect(evaluate(lesson.questions[1]!.rule, 8)).toBe(false);
  expect(evaluate(lesson.questions[6]!.rule, 8)).toBe(false);
  expect(evaluate(lesson.questions[8]!.rule, 'no')).toBe(false);
  for (const choice of ['a', 'b'])
    expect(evaluate(lesson.questions[9]!.rule, choice)).toBe(false);
  expect(57 - 5).toBe(52);
  expect(lesson.reviewQuestions![10]!.prompt).toContain('57－5＝52');
});
it('retains incomplete digit drafts, reversed-place mistake, correction and ungraded reflections independently', () => {
  const library = initialLibrary('数位探索');
  const s = createSession(
    lesson,
    'sujiao-math-p1-lower-9787574312951',
    library.activeProfileId,
  );
  library.sessions.push(s);
  const i = s.questions.findIndex((q) => q.id.endsWith('-q-pair'));
  s.responses[i]!.draft = [7, null];
  expect(
    parseBackup(exportBackup(library)).data.sessions[0]!.responses[i]!.draft,
  ).toEqual([7, null]);
  for (const draft of [
    [1, 7],
    [7, 1],
  ]) {
    s.responses[i]!.draft = draft;
    s.responses[i] = submitResponse(s.questions[i]!, s.responses[i]!);
  }
  expect(s.responses[i]!.submissions.map((a) => a.correct)).toEqual([
    false,
    true,
  ]);
  const reflection = s.questions.findIndex((q) => q.id.endsWith('-attempts'));
  s.responses[reflection]!.draft = '我试67减6得到61，不是64，再试71减7。';
  s.responses[reflection] = submitResponse(
    s.questions[reflection]!,
    s.responses[reflection]!,
  );
  expect(s.responses[reflection]!.submissions[0]!.correct).toBeNull();
  expect(
    s.responses
      .filter((_, j) => s.questions[j]!.rule.kind === 'manual')
      .every((r) => r.submissions.length === 0),
  ).toBe(true);
  expect(parseBackup(exportBackup(library)).data.sessions[0]).toEqual(s);
});
