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
import { sujiaoLowerSource as source } from './sujiao-lower-source';
import { sujiaoNineSubtractDraft as lesson } from './sujiao-nine-subtract';

it('keeps the printed activity order and separates approval from unverified copyright dates', () => {
  expect(source.contents.map((item) => [item.id, item.page])).toEqual([
    ['u1', 1],
    ['u2', 22],
    ['shape-joining', 32],
    ['u3', 36],
    ['u4', 42],
    ['fifty', 53],
    ['u5', 57],
    ['u6', 71],
    ['u7', 78],
    ['math-comic', 85],
    ['review', 88],
  ]);
  expect(source.isbn).toBe('978-7-5743-1295-1');
  expect(source.approvalYear).toBe(2024);
  expect(source.edition).toBeNull();
  expect(source.printing).toBeNull();
  expect(source.printedPageOffset + lesson.page).toBe(11);
  expect(lesson.status).toBe('preparing');
  expect(
    sujiaoBooks
      .flatMap((book) => book.units.flatMap((unit) => unit.lessons))
      .some((item) => item.id === lesson.id && item.status === 'available'),
  ).toBe(true);
});

it('checks all three subtraction strategies and rejects counting the starting point or dropping untouched ones', () => {
  for (const [review, questions] of [
    [false, lesson.questions],
    [true, lesson.reviewQuestions!],
  ] as const) {
    const total = review ? 16 : 14;
    const ones = total - 10;
    const task = (suffix: string) =>
      questions.find((q) => q.id.endsWith(suffix))!;
    expect(evaluate(task('-count-back').rule, total - 9)).toBe(true);
    expect(evaluate(task('-count-back').rule, total - 8)).toBe(false);
    expect(evaluate(task('-reach-ten').rule, ones)).toBe(true);
    expect(evaluate(task('-remaining-removal').rule, 9 - ones)).toBe(true);
    expect(evaluate(task('-remaining-removal').rule, 9)).toBe(false);
    expect(evaluate(task('-break-ten').rule, 1)).toBe(false);
    expect(evaluate(task('-inverse').rule, total - 9)).toBe(true);
    expect(evaluate(task('-story').rule, total + 9)).toBe(false);
    expect(evaluate(task('-same-result').rule, 'both')).toBe(true);
    for (const choice of ['first', 'second'])
      expect(evaluate(task('-same-result').rule, choice)).toBe(false);
  }
  expect(lesson.questions.filter((q) => q.rule.kind !== 'manual')).toHaveLength(
    11,
  );
  expect(lesson.reviewQuestions).toHaveLength(11);
  expect(lesson.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
    3,
  );
});

it('retains the wrong first subtraction, corrected retry, original diagram and separate physical confirmations in backup', () => {
  const state = initialLibrary('测试');
  const session = createSession(
    lesson,
    'unregistered-sujiao-lower-draft',
    state.activeProfileId,
  );
  session.phase = 'practice';
  const index = session.questions.findIndex((q) =>
    q.id.endsWith('-q-count-back'),
  );
  const question = session.questions[index]!;
  session.responses[index]!.draft = 6;
  session.responses[index] = submitResponse(
    question,
    session.responses[index]!,
  );
  session.responses[index]!.draft = 5;
  session.responses[index] = submitResponse(
    question,
    session.responses[index]!,
  );
  expect(statistics(session).manual).toBe(0);
  state.sessions.push(session);
  const restored = parseBackup(exportBackup(state)).data.sessions[0]!;
  expect(restored).toEqual(session);
  expect(
    restored.responses[index]!.submissions.map(
      (submission) => submission.correct,
    ),
  ).toEqual([false, true]);
  expect(restored.questions[index]!.visual).toEqual({
    kind: 'number-line',
    minimum: 0,
    maximum: 19,
    value: 14,
  });
  for (const [position, item] of restored.questions.entries()) {
    if (item.rule.kind === 'manual')
      expect(restored.responses[position]!.submissions).toHaveLength(0);
  }
});

it('distinguishes an exact ten from sufficient loose ones at both subtraction boundaries', () => {
  expect(lesson.version).toBe(2);
  for (const questions of [lesson.questions, lesson.reviewQuestions!]) {
    const ten = questions.find((q) => q.id.endsWith('-ten-boundary'))!;
    const nineteen = questions.find((q) =>
      q.id.endsWith('-nineteen-boundary'),
    )!;
    expect(evaluate(ten.rule, 1)).toBe(true);
    expect(evaluate(ten.rule, 0)).toBe(false);
    expect(evaluate(nineteen.rule, 10)).toBe(true);
    expect(evaluate(nineteen.rule, 1)).toBe(false);
  }
});
