import type { PeriodicFlagsVisual } from './types';

import { expect, it } from 'vitest';

import { sujiaoPeriodicFlagsDraft as lesson } from '../content/sujiao-periodic-flags';
import { exportBackup, parseBackup } from './backup';
import { createSession, evaluate, statistics, submitResponse } from './engine';
import { fold } from './fold';
import { flagAt, flagCounts, isPeriodicFlagsVisual } from './periodic-flags';
import { sparseArray } from './sparse-array';
import { initialLibrary } from './storage';

it('counts every position including incomplete groups for all six three-colour orders', () => {
  const patterns: PeriodicFlagsVisual['pattern'][] = [
    ['A', 'B', 'C'],
    ['A', 'C', 'B'],
    ['B', 'A', 'C'],
    ['B', 'C', 'A'],
    ['C', 'A', 'B'],
    ['C', 'B', 'A'],
  ];
  for (const pattern of patterns)
    for (let total = 6; total <= 19; total++)
      for (let shown = 6; shown <= total; shown += 3) {
        const model: PeriodicFlagsVisual = {
          kind: 'periodic-flags',
          pattern,
          total,
          shown,
        };
        expect(isPeriodicFlagsVisual(model)).toBe(true);
        const expected = [0, 0, 0];
        for (let i = 0; i < total; i++) {
          const code = pattern[i % 3]!;
          expected[['A', 'B', 'C'].indexOf(code)]!++;
          expect(flagAt(model, i)).toBe(code);
        }
        expect(flagCounts(model)).toEqual(expected);
        expect(fold(expected, 0, (a, b) => a + b)).toBe(total);
        for (const i of [-1, 0.5, total, Number.NaN])
          expect(flagAt(model, i)).toBeUndefined();
      }
});
it('rejects sparse, repeated or non-string categories and invalid segment bounds', () => {
  const model: PeriodicFlagsVisual = {
    kind: 'periodic-flags',
    pattern: ['A', 'B', 'C'],
    total: 14,
    shown: 6,
  };
  for (const pattern of [
    sparseArray(3),
    ['A', 'A', 'C'],
    ['A', 'B'],
    ['A', 'B', 'D'],
    ['A', 'B', 3],
    [Reflect.construct(String, ['A']), 'B', 'C'],
  ])
    expect(isPeriodicFlagsVisual({ ...model, pattern })).toBe(false);
  for (const total of [5, 20, 6.5, Number.NaN])
    expect(isPeriodicFlagsVisual({ ...model, total })).toBe(false);
  for (const shown of [3, 7, 15, 6.5])
    expect(isPeriodicFlagsVisual({ ...model, shown })).toBe(false);
  expect(isPeriodicFlagsVisual({ ...model, answer: ['A'] })).toBe(false);
});
it('checks colours, counts and tail groups independently in practice and review', () => {
  for (const [review, questions] of [
    [false, lesson.questions],
    [true, lesson.reviewQuestions!],
  ] as const) {
    const q = (suffix: string) =>
      questions.find(
        (q) => q.id === `${lesson.id}-${review ? 'r' : 'q'}-${suffix}`,
      )!;
    const colours = review ? ['B', 'C', 'B'] : ['A', 'B', 'B'];
    colours.forEach((colour, i) =>
      expect(evaluate(q(`colour-${i}`).rule, colour)).toBe(true),
    );
    expect(evaluate(q('total').rule, review ? 16 : 14)).toBe(true);
    expect(evaluate(q('total').rule, review ? 9 : 6)).toBe(false);
    expect(evaluate(q('categories').rule, review ? [5, 6, 5] : [5, 5, 4])).toBe(
      true,
    );
    expect(evaluate(q('categories').rule, review ? [5, 5, 5] : [4, 4, 4])).toBe(
      false,
    );
    expect(evaluate(q('groups-tail').rule, review ? 16 : 14)).toBe(true);
    expect(evaluate(q('recolour').rule, 'no')).toBe(true);
  }
  expect(lesson.questions.filter((q) => q.rule.kind !== 'manual')).toHaveLength(
    10,
  );
  expect(lesson.reviewQuestions).toHaveLength(10);
  expect(lesson.status).toBe('preparing');
});
it('retains original flags, partial category counts and first errors without confirming paper activities', () => {
  const state = initialLibrary('彩旗测试');
  const session = createSession(
    lesson,
    'unregistered-sujiao-lower-draft',
    state.activeProfileId,
  );
  session.phase = 'practice';
  const i = session.questions.findIndex((q) => q.id.endsWith('-q-total'));
  session.responses[i]!.draft = 6;
  session.responses[i] = submitResponse(
    session.questions[i]!,
    session.responses[i]!,
  );
  session.responses[i]!.draft = 14;
  session.responses[i] = submitResponse(
    session.questions[i]!,
    session.responses[i]!,
  );
  const partial = session.questions.findIndex((q) =>
    q.id.endsWith('-q-categories'),
  );
  session.responses[partial]!.draft = [5, null, 4];
  state.sessions.push(session);
  expect(parseBackup(exportBackup(state)).data.sessions[0]).toEqual(session);
  expect(session.responses[i]!.submissions.map((s) => s.correct)).toEqual([
    false,
    true,
  ]);
  expect(statistics(session).manual).toBe(0);
  const damaged = structuredClone(state);
  const visual = damaged.sessions[0]!.questions[i]!.visual;
  if (visual?.kind !== 'periodic-flags') throw new Error('missing flags');
  visual.pattern = ['A', 'A', 'C'];
  expect(() => parseBackup(exportBackup(damaged))).toThrow(Error);
});
