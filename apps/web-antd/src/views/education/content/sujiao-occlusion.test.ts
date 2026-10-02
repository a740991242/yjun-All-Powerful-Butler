import type { Answer } from '../learning/types';

import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { occlusionScene } from '../learning/occlusion-views';
import { initialLibrary } from '../learning/storage';
import { sujiaoOcclusionDraft as lesson } from './sujiao-occlusion';
it('matches front/back occlusion and observer-relative left/right with moved cup and reordered views', () => {
  const main: Answer[] = [
    '2',
    '4',
    '3',
    '1',
    'A',
    2,
    1,
    'no',
    'B',
    'no',
    'move-observer',
    'no',
  ];
  const review: Answer[] = [
    '4',
    '3',
    '1',
    '2',
    'C',
    2,
    1,
    'no',
    'D',
    'no',
    'move-observer',
    'no',
  ];
  expect(lesson.questions).toHaveLength(17);
  expect(lesson.reviewQuestions).toHaveLength(12);
  for (const [qs, answers, variant] of [
    [lesson.questions.slice(0, 12), main, 'main'],
    [lesson.reviewQuestions!, review, 'review'],
  ] as const) {
    qs.forEach((q, i) => expect(evaluate(q.rule, answers[i]!)).toBe(true));
    const s = occlusionScene(variant);
    // Cup south: from north hidden, east image-left, south front, west image-right.
    const visible =
      s.cupSide === 'bottom'
        ? ['hidden', 'left', 'front', 'right']
        : ['front', 'right', 'hidden', 'left'];
    visible.forEach((view, i) => {
      expect(s.views[i]).toBe(view);
      expect(
        evaluate(
          qs[i]!.rule,
          String(
            s.candidates.indexOf(view as (typeof s.candidates)[number]) + 1,
          ),
        ),
      ).toBe(true);
    });
  }
  lesson.reviewQuestions!.forEach((q, i) => {
    expect(q.knowledge).toBe(lesson.questions[i]!.knowledge);
    expect(q.prompt).not.toBe(lesson.questions[i]!.prompt);
  });
  expect(evaluate(lesson.reviewQuestions![0]!.rule, '2')).toBe(false);
  expect(evaluate(lesson.reviewQuestions![4]!.rule, 'A')).toBe(false);
  expect(evaluate(lesson.reviewQuestions![8]!.rule, 'B')).toBe(false);
  expect(evaluate(lesson.questions[5]!.rule, 1)).toBe(false);
  expect(evaluate(lesson.questions[6]!.rule, 2)).toBe(false);
  for (const i of [7, 9, 11])
    expect(evaluate(lesson.questions[i]!.rule, 'yes')).toBe(false);
  expect(lesson.questions[11]!.visual).toBeUndefined();
  expect(lesson.reviewQuestions![11]!.visual).toBeUndefined();
});
it('retains invisible-cup misconceptions and corrected history while physical observations are independent and unscored', () => {
  const data = initialLibrary('观察遮挡');
  const s = createSession(
    lesson,
    'sujiao-math-p1-lower-9787574312951',
    data.activeProfileId,
  );
  data.sessions.push(s);
  for (const [suffix, wrong, correct] of [
    ['known-total', 1, 2],
    ['picture-left', 'D', 'B'],
  ] as const) {
    const i = s.questions.findIndex((q) => q.id.endsWith(`-q-${suffix}`));
    for (const value of [wrong, correct]) {
      s.responses[i]!.draft = value;
      s.responses[i] = submitResponse(s.questions[i]!, s.responses[i]!);
    }
    expect(s.responses[i]!.submissions.map((a) => a.correct)).toEqual([
      false,
      true,
    ]);
  }
  for (const suffix of ['-own-observation', '-reflection']) {
    const i = s.questions.findIndex((q) => q.id.endsWith(suffix));
    s.responses[i]!.draft =
      suffix === '-own-observation'
        ? '实际眼高更高，小杯露出一部分。'
        : '看不到不等于没有，换到另一侧检查。';
    s.responses[i] = submitResponse(s.questions[i]!, s.responses[i]!);
    expect(s.responses[i]!.submissions[0]!.correct).toBeNull();
  }
  expect(
    s.responses
      .filter((_, i) => s.questions[i]!.rule.kind === 'manual')
      .every((a) => a.submissions.length === 0),
  ).toBe(true);
  expect(parseBackup(exportBackup(data)).data.sessions[0]).toEqual(s);
});
