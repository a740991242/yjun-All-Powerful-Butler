import type { Question } from '../learning/types';

import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
} from '../learning/engine';
import { initialLibrary } from '../learning/storage';
import { sujiaoBooks } from './sujiao';
import { sujiaoLowerUnitPatternsDraft as lesson } from './sujiao-lower-unit-patterns';

function task(questions: Question[], suffix: string, review: boolean) {
  return questions.find(
    (q) => q.id === `${lesson.id}-${review ? 'r' : 'q'}-${suffix}`,
  )!;
}
it('distinguishes increasing an addend, the amount removed, the starting amount and both subtraction terms', () => {
  for (const [review, questions] of [
    [false, lesson.questions],
    [true, lesson.reviewQuestions!],
  ] as const) {
    const q = (suffix: string) => task(questions, suffix, review);
    expect(evaluate(q('add-increase').rule, [13, 14, 15])).toBe(true);
    expect(evaluate(q('subtract-decrease').rule, [9, 8, 7])).toBe(true);
    expect(evaluate(q('subtract-decrease').rule, [9, 10, 11])).toBe(false);
    expect(evaluate(q('subtract-increase').rule, [6, 7, 8])).toBe(true);
    expect(evaluate(q('shift-both').rule, review ? [8, 8, 8] : [7, 7, 7])).toBe(
      true,
    );
    expect(
      evaluate(q('shift-both').rule, review ? [8, 9, 10] : [7, 8, 9]),
    ).toBe(false);
    expect(evaluate(q('missing-add').rule, review ? 6 : 7)).toBe(true);
    expect(evaluate(q('missing-subtract').rule, review ? 7 : 8)).toBe(true);
    expect(evaluate(q('claim').rule, 'yes')).toBe(false);
    expect(evaluate(q('claim').rule, 'no')).toBe(true);
    for (const suffix of [
      'equal-add',
      'equal-subtract',
      'many-additions',
      'many-subtractions',
    ]) {
      const item = q(suffix);
      if (item.rule.kind !== 'set')
        throw new Error('missing all-candidate task');
      const target = (() => {
        if (suffix === 'equal-add') return review ? 15 : 14;
        return (() => {
          if (suffix === 'equal-subtract') return review ? 8 : 7;
          return (() => {
            if (suffix === 'many-additions') return review ? 14 : 13;
            return review ? 7 : 6;
          })();
        })();
      })();
      const independentlyComputed = item
        .choices!.filter((choice) => {
          const [a, op, b] = choice.label.split(/([+−-])/);
          return (
            (op === '+' ? Number(a) + Number(b) : Number(a) - Number(b)) ===
            target
          );
        })
        .map((choice) => choice.id);
      expect(item.rule.values).toEqual(independentlyComputed);
      expect(evaluate(item.rule, [...independentlyComputed].toReversed())).toBe(
        true,
      );
      expect(evaluate(item.rule, independentlyComputed.slice(1))).toBe(false);
      expect(
        evaluate(item.rule, [
          ...independentlyComputed,
          independentlyComputed[0]!,
        ]),
      ).toBe(false);
      const wrong = item.choices!.find(
        (choice) => !independentlyComputed.includes(choice.id),
      )!;
      expect(evaluate(item.rule, [...independentlyComputed, wrong.id])).toBe(
        false,
      );
    }
  }
});
it('enumerates the entire ordered two-card search and rejects arithmetically correct unavailable cards', () => {
  for (const [review, questions] of [
    [false, lesson.questions],
    [true, lesson.reviewQuestions!],
  ] as const) {
    const cards = review ? [3, 5, 6, 8] : [4, 6, 7, 9];
    const goal = review ? 7 : 8;
    const q = task(questions, 'cards', review);
    if (q.rule.kind !== 'set') throw new Error('missing all-card task');
    const allowed: string[] = [];
    let inspected = 0;
    for (const a of cards)
      for (const b of cards) {
        if (a === b) continue;
        inspected++;
        if (10 + a - b === goal) allowed.push(`a${a}-b${b}`);
        expect(q.choices!.some((choice) => choice.id === `a${a}-b${b}`)).toBe(
          true,
        );
      }
    expect(inspected).toBe(12);
    expect(allowed).toEqual(review ? ['a3-b6', 'a5-b8'] : ['a4-b6', 'a7-b9']);
    expect(q.rule.values).toEqual(allowed);
    // Every possible candidate selection has exactly one complete legal set.
    let accepted = 0;
    for (let mask = 1; mask < 2 ** q.choices!.length; mask++) {
      const selected = q
        .choices!.filter((_c, index) => mask & (1 << index))
        .map((c) => c.id);
      if (evaluate(q.rule, selected)) accepted++;
    }
    expect(accepted).toBe(1);
    expect(evaluate(q.rule, ['missing-card'])).toBe(false);
    expect(evaluate(task(questions, 'missing-card', review).rule, 'no')).toBe(
      true,
    );
    expect(evaluate(task(questions, 'missing-card', review).rule, 'yes')).toBe(
      false,
    );
  }
});
it('retains wrong-first selections, all-candidate answers, partial steps and separate manual confirmations', () => {
  const state = initialLibrary('整理测试');
  const session = createSession(
    lesson,
    'unregistered-sujiao-lower-draft',
    state.activeProfileId,
  );
  session.phase = 'practice';
  const index = session.questions.findIndex((q) => q.id.endsWith('-q-cards'));
  const q = session.questions[index]!;
  session.responses[index]!.draft = ['missing-card'];
  session.responses[index] = submitResponse(q, session.responses[index]!);
  session.responses[index]!.draft = ['a7-b9', 'a4-b6'];
  session.responses[index] = submitResponse(q, session.responses[index]!);
  const partial = session.questions.findIndex((q) =>
    q.id.endsWith('-q-add-increase'),
  );
  session.responses[partial]!.draft = [13, null, null];
  state.sessions.push(session);
  const restored = parseBackup(exportBackup(state)).data.sessions[0]!;
  expect(restored).toEqual(session);
  expect(restored.responses[index]!.submissions.map((s) => s.correct)).toEqual([
    false,
    true,
  ]);
  expect(statistics(restored).manual).toBe(0);
  expect(lesson.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
    3,
  );
  expect(lesson.questions.filter((q) => q.rule.kind !== 'manual')).toHaveLength(
    13,
  );
  expect(lesson.reviewQuestions).toHaveLength(13);
  expect(
    sujiaoBooks
      .flatMap((book) => book.units.flatMap((unit) => unit.lessons))
      .some((l) => l.id === lesson.id && l.status === 'available'),
  ).toBe(true);
  expect(lesson.status).toBe('preparing');
});
