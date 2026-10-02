import { expect, it } from 'vitest';

import { sujiaoBeadBudgetDraft as lesson } from '../content/sujiao-bead-budget';
import { exportBackup, parseBackup } from './backup';
import { beadNumbers, isDigitCounterVisual } from './digit-counter';
import { createSession, evaluate, submitResponse } from './engine';
import { initialLibrary } from './storage';
it('enumerates all two-digit values for a fixed bead budget while preserving zero place distinctions', () => {
  expect(beadNumbers(3)).toEqual([12, 21, 30]);
  expect(beadNumbers(4)).toEqual([13, 22, 31, 40]);
  for (let total = 1; total <= 9; total++)
    expect(beadNumbers(total)).toEqual(
      Array.from({ length: 90 }, (_, i) => i + 10).filter(
        (n) => Math.floor(n / 10) + (n % 10) === total,
      ),
    );
  expect(() => beadNumbers(0)).toThrow(Error);
  expect(() => beadNumbers(10)).toThrow(Error);
  expect(
    isDigitCounterVisual({ kind: 'digit-counter', tens: 0, ones: 3 }),
  ).toBe(true);
  for (const v of [
    { kind: 'digit-counter', tens: 10, ones: 0 },
    { kind: 'digit-counter', tens: -1, ones: 0 },
    { kind: 'digit-counter', tens: 1.5, ones: 0 },
    { kind: 'digit-counter', tens: 1, ones: [2] },
    { kind: 'digit-counter', tens: 1, ones: 2, answer: 12 },
  ])
    expect(isDigitCounterVisual(v)).toBe(false);
});
it('checks all possibilities, material count and actual changed review counters independently', () => {
  const q = (key: string) =>
    lesson.questions.find((q) => q.id.endsWith(`-q-${key}`))!;
  expect(evaluate(q('all').rule, ['12', '21', '30'])).toBe(true);
  expect(evaluate(q('all').rule, ['12', '30'])).toBe(false);
  expect(evaluate(q('all').rule, ['3', '12', '21', '30'])).toBe(false);
  for (const [key, value] of [
    ['read-0', 12],
    ['read-1', 21],
    ['read-2', 30],
    ['beads', 3],
    ['max', 30],
    ['min', 12],
    ['move', 21],
  ] as const)
    expect(evaluate(q(key).rule, value)).toBe(true);
  expect(evaluate(q('beads').rule, 12)).toBe(false);
  expect(lesson.questions).toHaveLength(16);
  expect(lesson.reviewQuestions).toHaveLength(12);
  for (const r of lesson.reviewQuestions!) {
    const m = lesson.questions.find((q) => q.knowledge === r.knowledge)!;
    expect(JSON.stringify([r.prompt, r.visual, r.choices])).not.toBe(
      JSON.stringify([m.prompt, m.visual, m.choices]),
    );
  }
});
it('preserves an omitted possibility error, correction and digit-counter snapshots in strict backup', () => {
  const library = initialLibrary('珠数');
  const s = createSession(
    lesson,
    'sujiao-math-p1-lower-9787574312951',
    library.activeProfileId,
  );
  const i = s.questions.findIndex((q) => q.id.endsWith('-q-all'));
  for (const draft of [
    ['12', '30'],
    ['12', '21', '30'],
  ]) {
    s.responses[i]!.draft = draft;
    s.responses[i] = submitResponse(s.questions[i]!, s.responses[i]!);
  }
  expect(s.responses[i]!.submissions.map((a) => a.correct)).toEqual([
    false,
    true,
  ]);
  library.sessions.push(s);
  expect(parseBackup(exportBackup(library)).data.sessions[0]).toEqual(s);
  const bad = JSON.parse(exportBackup(library));
  const j = s.questions.findIndex((q) => q.visual?.kind === 'digit-counter');
  bad.data.sessions[0].questions[j].visual.tens = 10;
  expect(() => parseBackup(JSON.stringify(bad))).toThrow(Error);
  expect(
    s.responses
      .filter((_, i) => s.questions[i]!.rule.kind === 'manual')
      .every((r) => r.submissions.length === 0),
  ).toBe(true);
});
