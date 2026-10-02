import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { initialLibrary } from '../learning/storage';
import { sujiaoSelectedNumberExtremaDraft as lesson } from './sujiao-selected-number-extrema';
it('compares only the selected three numbers rather than the entire digit domain', () => {
  const find = (key: string, review = false) =>
    (review ? lesson.reviewQuestions! : lesson.questions).find(
      (q) => q.knowledge === `${lesson.id}-${key}`,
    )!;
  for (const [review, groups] of [
    [
      false,
      [
        [26, 66, 46],
        [60, 68, 63],
      ],
    ],
    [
      true,
      [
        [73, 23, 53],
        [79, 70, 74],
      ],
    ],
  ] as const)
    groups.forEach((numbers, i) => {
      const sorted = [...numbers].toSorted((a, b) => a - b);
      expect(evaluate(find(`sort-${i}`, review).rule, sorted)).toBe(true);
      expect(
        evaluate(find(`extrema-${i}`, review).rule, [sorted[0]!, sorted[2]!]),
      ).toBe(true);
    });
  expect(evaluate(find('extrema-0').rule, [16, 96])).toBe(false);
  expect(evaluate(find('extrema-1').rule, [60, 69])).toBe(false);
  expect(evaluate(find('extrema-0', true).rule, [26, 66])).toBe(false);
  expect(lesson.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
    2,
  );
  expect(
    lesson.questions
      .filter((q) => q.rule.kind === 'manual')
      .every((q) => q.prompt.includes('实际') && q.prompt.includes('这三个')),
  ).toBe(true);
});
it('retains a whole-domain mistake and actual tasks pending through backup', () => {
  const library = initialLibrary('选三数');
  const s = createSession(
    lesson,
    'sujiao-math-p1-lower-9787574312951',
    library.activeProfileId,
  );
  const i = s.questions.findIndex((q) => q.knowledge.endsWith('-extrema-0'));
  for (const answer of [
    [16, 96],
    [26, 66],
  ]) {
    s.responses[i]!.draft = answer;
    s.responses[i] = submitResponse(s.questions[i]!, s.responses[i]!);
  }
  expect(s.responses[i]!.submissions.map((x) => x.correct)).toEqual([
    false,
    true,
  ]);
  const r = s.questions.findIndex((q) => q.rule.kind === 'reflection');
  s.responses[r]!.draft = '还没写自己的三张卡，准备选数。';
  s.responses[r] = submitResponse(s.questions[r]!, s.responses[r]!);
  expect(s.responses[r]!.submissions[0]!.correct).toBeNull();
  expect(
    s.responses
      .filter((_, i) => s.questions[i]!.rule.kind === 'manual')
      .every((x) => x.submissions.length === 0),
  ).toBe(true);
  library.sessions.push(s);
  expect(parseBackup(exportBackup(library)).data.sessions[0]).toEqual(s);
});
