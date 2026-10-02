import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { regroupStickGroups } from '../learning/regroup-sticks';
import { initialLibrary } from '../learning/storage';
import { sujiaoLowerFinalNumbersDraft as lesson } from './sujiao-lower-final-numbers';
it('distinguishes material counts, digit values, strict bounds and independent operations', () => {
  const expected = [
    {
      read: 47,
      composition: [4, 7],
      beads: 11,
      next: 50,
      gaps: [40, 60],
      category: ['10', '47', '70'],
      between: ['41', '47', '49'],
      order: ['9', '40', '47', '70'],
      'add-units': [63, 45, 51],
      'subtract-units': [23, 41, 35],
      carry: 54,
      borrow: 64,
      'small-add': 15,
      'small-subtract': 8,
    },
    {
      read: 62,
      composition: [6, 2],
      beads: 8,
      next: 70,
      gaps: [50, 70],
      category: ['20', '62', '90'],
      between: ['61', '67', '69'],
      order: ['8', '60', '62', '90'],
      'add-units': [84, 57, 61],
      'subtract-units': [24, 51, 47],
      carry: 62,
      borrow: 73,
      'small-add': 14,
      'small-subtract': 9,
    },
  ];
  for (const [index, questions] of [
    lesson.questions,
    lesson.reviewQuestions!,
  ].entries()) {
    for (const [key, answer] of Object.entries(expected[index]!)) {
      const q = questions.find((q) => q.id.endsWith(`-${key}`))!;
      expect(evaluate(q.rule, answer)).toBe(true);
    }
    for (const [key, answer] of Object.entries({
      zero: 'keep',
      swap: 'no',
      classify: 'different',
      unknown: 'ask',
    }))
      expect(
        evaluate(questions.find((q) => q.id.endsWith(`-${key}`))!.rule, answer),
      ).toBe(true);
    expect(
      evaluate(
        questions.find((q) => q.id.endsWith('-beads'))!.rule,
        index === 0 ? 47 : 62,
      ),
    ).toBe(false);
    expect(
      evaluate(
        questions.find((q) => q.id.endsWith('-between'))!.rule,
        index === 0
          ? ['40', '41', '47', '49', '50']
          : ['60', '61', '67', '69', '70'],
      ),
    ).toBe(false);
    expect(
      evaluate(
        questions.find((q) => q.id.endsWith('-order'))!.rule,
        index === 0 ? ['70', '47', '40', '9'] : ['90', '62', '60', '8'],
      ),
    ).toBe(false);
    expect(
      questions.find((q) => q.id.endsWith('-unknown'))!.visual,
    ).toBeUndefined();
    for (const key of ['carry', 'borrow']) {
      const q = questions.find((q) => q.id.endsWith(`-${key}`))!;
      if (q.visual?.kind !== 'regroup-sticks')
        throw new Error('missing original regrouping diagram');
      expect(q.visual.stage).toBe('original');
      const before = regroupStickGroups(q.visual);
      const changed = regroupStickGroups({ ...q.visual, stage: 'regroup' });
      const final = regroupStickGroups({ ...q.visual, stage: 'result' });
      const start = before.bundles * 10 + before.loose;
      expect(changed.bundles * 10 + changed.loose).toBe(
        q.visual.operation === 'add' ? start + q.visual.amount : start,
      );
      expect(final.bundles * 10 + final.loose).toBe(
        q.visual.operation === 'add'
          ? start + q.visual.amount
          : start - q.visual.amount,
      );
    }
  }
  expect(lesson.steps).toHaveLength(6);
  expect(lesson.questions).toHaveLength(24);
  expect(lesson.reviewQuestions).toHaveLength(18);
});
it('keeps a partially filled independent calculation and its wrong attempt in backups', () => {
  const library = initialLibrary('期末数与运算');
  const s = createSession(
    lesson,
    'sujiao-math-p1-lower-9787574312951',
    library.activeProfileId,
  );
  const i = s.questions.findIndex((q) => q.id.endsWith('-add-units'));
  s.responses[i]!.draft = [63, null, 51];
  library.sessions.push(s);
  expect(
    parseBackup(exportBackup(library)).data.sessions[0]!.responses[i]!.draft,
  ).toEqual([63, null, 51]);
  for (const answer of [
    [63, 65, 73],
    [63, 45, 51],
  ]) {
    s.responses[i]!.draft = answer;
    s.responses[i] = submitResponse(s.questions[i]!, s.responses[i]!);
  }
  expect(s.responses[i]!.submissions.map((a) => a.correct)).toEqual([
    false,
    true,
  ]);
  for (const [index, q] of s.questions.entries())
    if (q.rule.kind === 'reflection') {
      s.responses[index]!.draft =
        '我还需要用实物解释换捆，未完成的活动如实记录。';
      s.responses[index] = submitResponse(q, s.responses[index]!);
      expect(s.responses[index]!.submissions[0]!.correct).toBeNull();
    }
  expect(
    s.responses
      .filter((_, index) => s.questions[index]!.rule.kind === 'manual')
      .every((r) => r.submissions.length === 0),
  ).toBe(true);
  expect(parseBackup(exportBackup(library)).data.sessions[0]).toEqual(s);
});
