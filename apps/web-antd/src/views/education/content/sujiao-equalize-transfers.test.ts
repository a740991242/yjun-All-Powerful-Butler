import type { Answer } from '../learning/types';

import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { initialLibrary } from '../learning/storage';
import { sujiaoEqualizeTransfersDraft as lesson } from './sujiao-equalize-transfers';
function legalMoves(a: number, b: number) {
  return Array.from({ length: a + 1 }, (_, moved) => moved).filter(
    (moved) => a - moved === b + moved,
  );
}
it('independently enumerates whole-card transfers and distinguishes one-sided changes from conserved totals', () => {
  expect(legalMoves(18, 10)).toEqual([4]);
  expect(legalMoves(20, 8)).toEqual([6]);
  expect(legalMoves(13, 8)).toEqual([]);
  expect(legalMoves(14, 9)).toEqual([]);
  const main: Answer[] = [
    8,
    8,
    4,
    [14, 14],
    28,
    [10, 18],
    'no',
    ['move', 'add', 'remove'],
    0,
    'no',
  ];
  const review: Answer[] = [
    12,
    12,
    6,
    [14, 14],
    28,
    [8, 20],
    'no',
    ['remove', 'move', 'add'],
    0,
    'no',
  ];
  expect(lesson.questions).toHaveLength(15);
  expect(lesson.reviewQuestions).toHaveLength(10);
  lesson.questions
    .slice(0, 10)
    .forEach((q, i) => expect(evaluate(q.rule, main[i]!)).toBe(true));
  lesson.reviewQuestions!.forEach((q, i) => {
    expect(evaluate(q.rule, review[i]!)).toBe(true);
    expect(q.prompt).not.toBe(lesson.questions[i]!.prompt);
    expect(q.knowledge).toBe(lesson.questions[i]!.knowledge);
  });
  expect(evaluate(lesson.questions[2]!.rule, 8)).toBe(false);
  expect(evaluate(lesson.questions[3]!.rule, [18, 14])).toBe(false);
  expect(evaluate(lesson.questions[4]!.rule, 36)).toBe(false);
  expect(evaluate(lesson.questions[7]!.rule, ['move'])).toBe(false);
  expect(
    evaluate(lesson.questions[7]!.rule, [
      'add',
      'remove',
      'move',
      'wrong-direction',
    ]),
  ).toBe(false);
});
it('keeps wrong gap-as-transfer history and independent open descriptions without confirming physical moves', () => {
  const library = initialLibrary('移物');
  const s = createSession(
    lesson,
    'sujiao-math-p1-lower-9787574312951',
    library.activeProfileId,
  );
  library.sessions.push(s);
  const i = s.questions.findIndex((q) => q.id.endsWith('-q-transfer'));
  for (const draft of [8, 4]) {
    s.responses[i]!.draft = draft;
    s.responses[i] = submitResponse(s.questions[i]!, s.responses[i]!);
  }
  expect(s.responses[i]!.submissions.map((a) => a.correct)).toEqual([
    false,
    true,
  ]);
  const partial = s.questions.findIndex((q) =>
    q.id.endsWith('-q-after-transfer'),
  );
  s.responses[partial]!.draft = [14, null];
  for (const suffix of ['-own-method', '-reflection']) {
    const j = s.questions.findIndex((q) => q.id.endsWith(suffix));
    s.responses[j]!.draft =
      suffix === '-own-method'
        ? '只从外面给B添8张，18与18。'
        : '移1张时A少1，B多1，需两边都数。';
    s.responses[j] = submitResponse(s.questions[j]!, s.responses[j]!);
    expect(s.responses[j]!.submissions[0]!.correct).toBeNull();
  }
  expect(
    s.responses
      .filter((_, j) => s.questions[j]!.rule.kind === 'manual')
      .every((r) => r.submissions.length === 0),
  ).toBe(true);
  expect(parseBackup(exportBackup(library)).data.sessions[0]).toEqual(s);
});
