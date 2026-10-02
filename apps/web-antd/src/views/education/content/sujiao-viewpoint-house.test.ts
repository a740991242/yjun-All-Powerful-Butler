import type { Answer } from '../learning/types';

import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { initialLibrary } from '../learning/storage';
import { sujiaoViewpointHouseDraft as lesson } from './sujiao-viewpoint-house';
it('checks independent observer-view associations and conditional visibility rather than memorised photo numbers', () => {
  const main: Answer[] = [
    '4',
    '1',
    '2',
    '3',
    'C',
    1,
    'no',
    'not-always',
    'no',
    'no',
  ];
  const review: Answer[] = [
    '1',
    '4',
    '2',
    '3',
    'D',
    1,
    'no',
    'not-always',
    'no',
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
    expect(q.visual).toEqual({ kind: 'viewpoint-house', variant: 'review' });
  });
  expect(evaluate(lesson.questions[0]!.rule, '1')).toBe(false);
  expect(evaluate(lesson.reviewQuestions![0]!.rule, '4')).toBe(false);
  expect(evaluate(lesson.reviewQuestions![4]!.rule, 'C')).toBe(false);
  expect(evaluate(lesson.questions[5]!.rule, 4)).toBe(false);
  expect(evaluate(lesson.questions[7]!.rule, 'always')).toBe(false);
});
it('keeps wrong observer matching and corrected history, while preserving open observations and independent manual tasks', () => {
  const library = initialLibrary('小屋盒');
  const s = createSession(
    lesson,
    'sujiao-math-p1-lower-9787574312951',
    library.activeProfileId,
  );
  library.sessions.push(s);
  const i = s.questions.findIndex((q) => q.id.endsWith('-q-observer-A'));
  for (const draft of ['1', '4']) {
    s.responses[i]!.draft = draft;
    s.responses[i] = submitResponse(s.questions[i]!, s.responses[i]!);
  }
  expect(s.responses[i]!.submissions.map((a) => a.correct)).toEqual([
    false,
    true,
  ]);
  for (const suffix of ['-own-observation', '-reflection']) {
    const j = s.questions.findIndex((q) => q.id.endsWith(suffix));
    s.responses[j]!.draft =
      suffix === '-own-observation'
        ? '我换位置看空白方盒，有两个面看起来相同。'
        : '先看位置与面对哪面，不背编号。';
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
