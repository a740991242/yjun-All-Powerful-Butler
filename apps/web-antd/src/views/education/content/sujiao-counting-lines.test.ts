import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { initialLibrary } from '../learning/storage';
import { sujiaoCountingLinesDraft as lesson } from './sujiao-counting-lines';

it('checks directions, crossed tens and counts independently rather than regenerating author answers', () => {
  expect(lesson.questions).toHaveLength(20);
  expect(lesson.reviewQuestions).toHaveLength(16);
  const find = (key: string, review = false) =>
    (review ? lesson.reviewQuestions! : lesson.questions).find((q) =>
      q.id.endsWith(`-${key}`),
    )!;
  const sequences: [string, number[], number[]][] = [
    ['forward-one', [28, 29, 30, 31], [38, 39, 40, 41]],
    ['backward-one', [41, 40, 39, 38], [51, 50, 49, 48]],
    ['forward-two', [58, 60, 62, 64], [68, 70, 72, 74]],
    ['forward-five', [50, 55, 60, 65], [60, 65, 70, 75]],
    ['forward-ten', [40, 50, 60, 70], [50, 60, 70, 80]],
    ['backward-two', [72, 70, 68, 66], [82, 80, 78, 76]],
  ];
  for (const [key, main, review] of sequences) {
    expect(find(key).rule).toEqual({ kind: 'steps', values: main });
    expect(find(key, true).rule).toEqual({ kind: 'steps', values: review });
  }
  expect(find('neighbors-0').rule).toEqual({ kind: 'steps', values: [38, 40] });
  expect(find('neighbors-1').rule).toEqual({ kind: 'steps', values: [49, 51] });
  expect(find('neighbors-2', true).rule).toEqual({
    kind: 'steps',
    values: [79, 81],
  });
  expect(find('inclusive-count').rule).toEqual({ kind: 'number', value: 5 });
  expect(evaluate(find('inclusive-count').rule, 4)).toBe(false);
  expect(find('move-count').rule).toEqual({ kind: 'number', value: 2 });
  expect(find('move-count', true).rule).toEqual({ kind: 'number', value: 4 });
  expect(find('near').visual).toEqual({
    kind: 'number-line',
    minimum: 60,
    maximum: 69,
    value: 67,
  });
  expect(find('near').rule).toEqual({ kind: 'choice', value: 'right' });
  expect(find('near', true).rule).toEqual({ kind: 'choice', value: 'left' });
  expect(evaluate(find('strict-between').rule, ['81', '85', '89'])).toBe(true);
  expect(evaluate(find('strict-between').rule, ['80', '81', '85', '89'])).toBe(
    false,
  );
  for (const q of lesson.reviewQuestions!) {
    const original = lesson.questions.find((o) => o.knowledge === q.knowledge)!;
    expect(JSON.stringify([q.prompt, q.visual, q.choices])).not.toBe(
      JSON.stringify([original.prompt, original.visual, original.choices]),
    );
  }
});
it('keeps inclusive-count errors, cross-ten drafts and tool positions through strict backups', () => {
  const library = initialLibrary('数数');
  const session = createSession(
    lesson,
    'sujiao-math-p1-lower-9787574312951',
    library.activeProfileId,
  );
  const index = session.questions.findIndex((q) =>
    q.id.endsWith('-q-inclusive-count'),
  );
  for (const draft of [4, 5]) {
    session.responses[index]!.draft = draft;
    session.responses[index] = submitResponse(
      session.questions[index]!,
      session.responses[index]!,
    );
  }
  expect(session.responses[index]!.submissions.map((s) => s.correct)).toEqual([
    false,
    true,
  ]);
  const forward = session.questions.findIndex((q) =>
    q.id.endsWith('-q-forward-one'),
  );
  session.responses[forward]!.draft = [28, 29, null, null];
  session.tools = { 'step-0': { position: 30 } };
  const reflection = session.questions.findIndex(
    (q) => q.rule.kind === 'reflection',
  );
  session.responses[reflection]!.draft =
    '我需要把包括起点的数与走过的间隔分开核对。';
  session.responses[reflection] = submitResponse(
    session.questions[reflection]!,
    session.responses[reflection]!,
  );
  expect(session.responses[reflection]!.submissions[0]!.correct).toBeNull();
  expect(
    session.responses
      .filter((_, i) => session.questions[i]!.rule.kind === 'manual')
      .every((r) => r.submissions.length === 0),
  ).toBe(true);
  library.sessions.push(session);
  expect(parseBackup(exportBackup(library)).data.sessions[0]).toEqual(session);
});
