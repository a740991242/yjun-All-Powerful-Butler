import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { initialLibrary } from '../learning/storage';
import { sujiaoNumberUnitReviewDraft as lesson } from './sujiao-number-unit-review';
it('distinguishes labels, counts and current rank, checking tens and all changed numeric conditions', () => {
  expect(lesson.questions).toHaveLength(18);
  expect(lesson.reviewQuestions).toHaveLength(10);
  const find = (key: string, review = false) =>
    (review ? lesson.reviewQuestions! : lesson.questions).find(
      (q) => q.knowledge === `${lesson.id}-${key}`,
    )!;
  for (const [key, main, review] of [
    ['compose', 43, 54],
    ['order', 37, 46],
    ['reason', 43, 54],
  ] as const) {
    expect(find(key).rule).toEqual({ kind: 'number', value: main });
    expect(find(key, true).rule).toEqual({ kind: 'number', value: review });
    expect(evaluate(find(key, true).rule, main)).toBe(false);
  }
  expect(find('zero-digit').rule).toEqual({ kind: 'steps', values: [4, 0] });
  expect(find('zero-digit', true).rule).toEqual({
    kind: 'steps',
    values: [5, 0],
  });
  expect(find('count-by-two').rule).toEqual({
    kind: 'steps',
    values: [30, 32],
  });
  expect(find('count-by-two', true).rule).toEqual({
    kind: 'steps',
    values: [40, 42],
  });
  expect(evaluate(find('zero-digit').rule, [4, 0])).toBe(true);
  expect(() => evaluate(find('zero-digit').rule, [4])).toThrow(
    'educationLearning.answerRequired',
  );
  expect(find('compare').rule).toEqual({ kind: 'choice', value: '>' });
  expect(find('compare', true).rule).toEqual({ kind: 'choice', value: '<' });
  expect(evaluate(find('life-meaning').rule, 'count')).toBe(false);
  expect(evaluate(find('unknown').rule, 'zero')).toBe(false);
  expect(find('order').prompt).toContain('没有漏号');
  expect(
    lesson.questions.find((q) => q.knowledge.endsWith('-manual-classroom'))
      ?.prompt,
  ).toContain('家庭计数不冒充全班');
});
it('preserves wrong-first rank history and all three open evaluations without implying actual tasks were done', () => {
  const library = initialLibrary('单元整理');
  const session = createSession(
    lesson,
    'sujiao-math-p1-lower-9787574312951',
    library.activeProfileId,
  );
  const index = session.questions.findIndex((q) =>
    q.knowledge.endsWith('-order'),
  );
  for (const value of [38, 37]) {
    session.responses[index]!.draft = value;
    session.responses[index] = submitResponse(
      session.questions[index]!,
      session.responses[index]!,
    );
  }
  expect(session.responses[index]?.submissions.map((s) => s.correct)).toEqual([
    false,
    true,
  ]);
  const evaluations = session.questions.filter(
    (q) => q.rule.kind === 'reflection',
  );
  expect(evaluations.map((q) => q.knowledge).toSorted()).toEqual(
    ['composition', 'comparison', 'reasoning']
      .map((key) => `${lesson.id}-evaluation-${key}`)
      .toSorted(),
  );
  for (const q of evaluations) {
    const i = session.questions.indexOf(q);
    session.responses[i]!.draft = '我还没完成实际任务，准备再核对。';
    session.responses[i] = submitResponse(q, session.responses[i]!);
    expect(session.responses[i]?.submissions[0]?.correct).toBeNull();
  }
  expect(
    session.questions.filter((q) => q.rule.kind === 'manual'),
  ).toHaveLength(5);
  expect(
    session.responses
      .filter((_, i) => session.questions[i]!.rule.kind === 'manual')
      .every((r) => r.submissions.length === 0),
  ).toBe(true);
  library.sessions.push(session);
  expect(parseBackup(exportBackup(library)).data.sessions[0]).toEqual(session);
});
