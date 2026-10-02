import type { Answer } from '../learning/types';

import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { initialLibrary } from '../learning/storage';
import {
  sujiaoQuantityDifferenceDraft as difference,
  sujiaoComparisonTargetDraft as target,
} from './sujiao-quantity-relations';
it('checks independent difference, equality, empty rows and changed which-row direction', () => {
  const main: Answer[] = [
    7,
    7,
    [7, 7],
    'subtract',
    7,
    'total',
    7,
    7,
    0,
    9,
    'A',
    'no',
  ];
  const review: Answer[] = [
    8,
    8,
    [8, 8],
    'subtract',
    8,
    'total',
    8,
    8,
    0,
    7,
    'B',
    'no',
  ];
  expect(difference.questions).toHaveLength(16);
  expect(difference.reviewQuestions).toHaveLength(12);
  difference.questions
    .slice(0, 12)
    .forEach((q, i) => expect(evaluate(q.rule, main[i]!)).toBe(true));
  difference.reviewQuestions!.forEach((q, i) => {
    expect(evaluate(q.rule, review[i]!)).toBe(true);
    expect(q.prompt).not.toBe(difference.questions[i]!.prompt);
    expect(q.knowledge).toBe(difference.questions[i]!.knowledge);
  });
  expect(difference.questions[0]!.visual).toEqual({
    kind: 'comparison-rows',
    counts: [13, 6],
  });
  expect(difference.reviewQuestions![0]!.visual).toEqual({
    kind: 'comparison-rows',
    counts: [9, 17],
  });
  expect(evaluate(difference.questions[0]!.rule, 19)).toBe(false);
  expect(evaluate(difference.questions[1]!.rule, -7)).toBe(false);
  expect(evaluate(difference.questions[8]!.rule, 9)).toBe(false);
});
it('checks reference and target rather than keyword shortcuts, with no unknown total drawn in objective questions', () => {
  const main: Answer[] = [
    19,
    9,
    'A',
    'difference',
    9,
    19,
    'subtract',
    14,
    'A-count',
    'no',
    [19, 9],
    24,
  ];
  const review: Answer[] = [
    29,
    17,
    'A',
    'difference',
    17,
    29,
    'subtract',
    23,
    'A-count',
    'no',
    [29, 17],
    35,
  ];
  expect(target.questions).toHaveLength(16);
  expect(target.reviewQuestions).toHaveLength(12);
  target.questions.slice(0, 12).forEach((q, i) => {
    expect(evaluate(q.rule, main[i]!)).toBe(true);
    expect(q.visual).toBeUndefined();
  });
  target.reviewQuestions!.forEach((q, i) => {
    expect(evaluate(q.rule, review[i]!)).toBe(true);
    expect(q.prompt).not.toBe(target.questions[i]!.prompt);
    expect(q.knowledge).toBe(target.questions[i]!.knowledge);
    expect(q.visual).toBeUndefined();
  });
  expect(evaluate(target.questions[4]!.rule, 19)).toBe(false);
  expect(evaluate(target.questions[5]!.rule, 9)).toBe(false);
  expect(evaluate(target.questions[7]!.rule, 0)).toBe(false);
  expect(evaluate(target.questions[8]!.rule, 'none')).toBe(false);
  expect(evaluate(target.questions[10]!.rule, [19, 14])).toBe(false);
});
it('preserves total-for-difference and keyword errors, corrected histories and partial drafts independently of real activities', () => {
  const library = initialLibrary('比较关系');
  for (const [lesson, suffix, wrong, right] of [
    [difference, '-q-more', 19, 7],
    [target, '-q-more-word-less-target', 19, 9],
  ] as const) {
    const s = createSession(
      lesson,
      'sujiao-math-p1-lower-9787574312951',
      library.activeProfileId,
    );
    const i = s.questions.findIndex((q) => q.id.endsWith(suffix));
    for (const draft of [wrong, right]) {
      s.responses[i]!.draft = draft;
      s.responses[i] = submitResponse(s.questions[i]!, s.responses[i]!);
    }
    expect(s.responses[i]!.submissions.map((a) => a.correct)).toEqual([
      false,
      true,
    ]);
    const parts = s.questions.findIndex((q) => q.rule.kind === 'steps');
    s.responses[parts]!.draft = [lesson.id === difference.id ? 7 : 19, null];
    const reflection = s.questions.findIndex(
      (q) => q.rule.kind === 'reflection',
    );
    s.responses[reflection]!.draft = '我先说清求谁，再检查是不是合计或相差。';
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
    library.sessions.push(s);
  }
  expect(parseBackup(exportBackup(library)).data.sessions).toEqual(
    library.sessions,
  );
});
