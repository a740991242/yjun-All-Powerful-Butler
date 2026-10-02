import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { initialLibrary } from '../learning/storage';
import { sujiaoGuessAndDigitsDraft as lesson } from './sujiao-guess-and-digits';
it('enumerates all values in 1–99 including one-digit units while combining strict guess bounds', () => {
  const find = (key: string, review = false) =>
    (review ? lesson.reviewQuestions! : lesson.questions).find(
      (q) => q.knowledge === `${lesson.id}-${key}`,
    )!;
  expect(lesson.questions).toHaveLength(14);
  expect(lesson.reviewQuestions).toHaveLength(10);
  for (const review of [false, true])
    for (const [key, test] of [
      ['ones-all', (n: number) => n % 10 === (review ? 7 : 5)],
      ['tens-all', (n: number) => Math.floor(n / 10) === (review ? 6 : 5)],
      ['zero-all', (n: number) => n % 10 === 0],
    ] as const) {
      const expected = Array.from({ length: 99 }, (_, i) => i + 1)
        .filter((item) => test(item))
        .map(String);
      expect(find(key, review).rule).toEqual({ kind: 'set', values: expected });
      const choices = find(key, review).choices!;
      expect(new Set(choices.map((c) => c.id)).size).toBe(choices.length);
      expect(
        expected.every((value) => choices.some((c) => c.id === value)),
      ).toBe(true);
      expect(evaluate(find(key, review).rule, expected)).toBe(true);
    }
  const values = ['5', '15', '25', '35', '45', '55', '65', '75', '85', '95'];
  expect(evaluate(find('ones-all').rule, values.slice(1))).toBe(false);
  expect(evaluate(find('ones-all', true).rule, values)).toBe(false);
  expect(find('first').rule).toEqual({
    kind: 'set',
    values: ['31', '43', '59'],
  });
  expect(find('narrow', true).rule).toEqual({
    kind: 'set',
    values: ['61', '64', '69'],
  });
  expect(find('answer').rule).toEqual({ kind: 'number', value: 43 });
  expect(find('answer', true).rule).toEqual({ kind: 'number', value: 64 });
  expect(evaluate(find('answer', true).rule, 43)).toBe(false);
  expect(find('next').choices?.find((c) => c.id === 'keep')?.label).toContain(
    '还没确定唯一数',
  );
});
it('preserves a missed one-digit candidate before correction without marking physical games from reflection', () => {
  const library = initialLibrary('猜数');
  const session = createSession(
    lesson,
    'sujiao-math-p1-lower-9787574312951',
    library.activeProfileId,
  );
  const i = session.questions.findIndex((q) =>
    q.knowledge.endsWith('-ones-all'),
  );
  for (const values of [
    ['15', '25', '35', '45', '55', '65', '75', '85', '95'],
    ['5', '15', '25', '35', '45', '55', '65', '75', '85', '95'],
  ]) {
    session.responses[i]!.draft = values;
    session.responses[i] = submitResponse(
      session.questions[i]!,
      session.responses[i]!,
    );
  }
  expect(session.responses[i]?.submissions.map((s) => s.correct)).toEqual([
    false,
    true,
  ]);
  const r = session.questions.findIndex((q) => q.rule.kind === 'reflection');
  session.responses[r]!.draft = '还没做真实游戏，准备记录每轮线索。';
  session.responses[r] = submitResponse(
    session.questions[r]!,
    session.responses[r]!,
  );
  expect(session.responses[r]?.submissions[0]?.correct).toBeNull();
  expect(
    session.questions.filter((q) => q.rule.kind === 'manual'),
  ).toHaveLength(3);
  expect(
    session.responses
      .filter((_, i) => session.questions[i]!.rule.kind === 'manual')
      .every((r) => r.submissions.length === 0),
  ).toBe(true);
  library.sessions.push(session);
  expect(parseBackup(exportBackup(library)).data.sessions[0]).toEqual(session);
});
