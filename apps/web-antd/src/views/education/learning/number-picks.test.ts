import { expect, it } from 'vitest';

import { sujiaoNumberConditionsDraft as lesson } from '../content/sujiao-number-conditions';
import { exportBackup, parseBackup } from './backup';
import { createSession, evaluate, submitResponse } from './engine';
import { isNumberPicksRule, matchesNumberPicks } from './number-picks';
import { sparseArray } from './sparse-array';
import { initialLibrary } from './storage';
it('accepts all legal alternatives and positional bounds without allowing repeats or equality', () => {
  const question = (key: string) =>
    lesson.questions.find((q) => q.id.endsWith(`-q-${key}`))!;
  for (let n = 0; n < 100; n++) {
    expect(evaluate(question('same').rule, [n])).toBe(n >= 11 && n % 11 === 0);
    expect(evaluate(question('less-left').rule, [n])).toBe(n < 50);
    expect(evaluate(question('between').rule, [n])).toBe(n > 80 && n < 90);
  }
  expect(evaluate(question('ones').rule, [96, 16, 56])).toBe(true);
  expect(evaluate(question('ones').rule, [16, 16, 56])).toBe(false);
  expect(evaluate(question('ones').rule, [6, 16, 56])).toBe(false);
  expect(evaluate(question('tens').rule, [69, 60, 65])).toBe(true);
  expect(evaluate(question('two-sides').rule, [0, 99])).toBe(true);
  expect(evaluate(question('two-sides').rule, [99, 0])).toBe(false);
  expect(evaluate(question('two-sides').rule, [40, 41])).toBe(false);
  for (const q of lesson.reviewQuestions!) {
    const main = lesson.questions.find((m) => m.knowledge === q.knowledge)!;

    expect(q.rule).not.toEqual(main.rule);
  }
});
it('rejects impossible or malformed rules and sparse answers while preserving valid zero', () => {
  const rule = {
    kind: 'number-picks' as const,
    fields: [[0, 1], [1]],
    distinct: true,
  };
  expect(isNumberPicksRule(rule)).toBe(true);
  expect(matchesNumberPicks(rule, [0, 1])).toBe(true);
  for (const bad of [
    { ...rule, fields: [[1], [1]] },
    { ...rule, fields: [[0, 0], [1]] },
    { ...rule, fields: [[100], [1]] },
    { ...rule, fields: [[0.5], [1]] },
    { ...rule, fields: [[]] },
    { ...rule, fields: sparseArray(2) },
    { ...rule, answer: 0 },
    { ...rule, distinct: 'true' },
  ])
    expect(isNumberPicksRule(bad)).toBe(false);
  expect(matchesNumberPicks(rule, sparseArray(2))).toBe(false);
  expect(matchesNumberPicks(rule, [0])).toBe(false);
});
it('round-trips alternate answers, partial zero drafts and incorrect attempts with strict backup validation', () => {
  const library = initialLibrary('找数');
  const session = createSession(
    lesson,
    'sujiao-math-p1-lower-9787574312951',
    library.activeProfileId,
  );
  const i = session.questions.findIndex((q) => q.id.endsWith('-q-two-sides'));
  for (const draft of [
    [100, -1],
    [0, 99],
    [39, 41],
  ]) {
    session.responses[i]!.draft = draft;
    session.responses[i] = submitResponse(
      session.questions[i]!,
      session.responses[i]!,
    );
  }
  expect(session.responses[i]!.submissions.map((s) => s.correct)).toEqual([
    false,
    true,
    true,
  ]);
  session.responses[i]!.draft = [0, null];
  library.sessions.push(session);
  expect(parseBackup(exportBackup(library)).data.sessions[0]).toEqual(session);
  for (const draft of [[0], ['0', null], [0, 0.5]]) {
    const bad = JSON.parse(exportBackup(library));
    bad.data.sessions[0].responses[i].draft = draft;
    expect(() => parseBackup(JSON.stringify(bad))).toThrow(Error);
  }
  const forged = JSON.parse(exportBackup(library));
  forged.data.sessions[0].responses[i].submissions[0].correct = true;
  expect(() => parseBackup(JSON.stringify(forged))).toThrow(Error);
  expect(
    session.responses
      .filter((_, index) =>
        ['manual', 'reflection'].includes(session.questions[index]!.rule.kind),
      )
      .every((r) => r.submissions.length === 0),
  ).toBe(true);
});
