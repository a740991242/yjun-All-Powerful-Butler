import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { exchangePlaceValue, placeValue } from '../learning/place-value';
import { initialLibrary } from '../learning/storage';
import { sujiaoTwoDigitCompositionDraft as lesson } from './sujiao-two-digit-composition';

it('covers zero placeholders, crossed tens and unit meanings with independently checked changed review data', () => {
  expect(lesson.questions).toHaveLength(19);
  expect(lesson.reviewQuestions).toHaveLength(15);
  const find = (key: string, review = false) =>
    (review ? lesson.reviewQuestions! : lesson.questions).find((q) =>
      q.id.endsWith(`-${key}`),
    )!;
  for (const [review, values] of [
    [false, [20, 21, 29, 30, 64, 99]],
    [true, [40, 42, 49, 50, 73, 98]],
  ] as const) {
    values.forEach((value, index) => {
      expect(find(`compose-${index}`, review).rule).toEqual({
        kind: 'number',
        value,
      });
      expect(find(`compose-${index}`, review).visual).toEqual({
        kind: 'place-value',
        value,
      });
    });
  }
  expect(find('digits-0').rule).toEqual({ kind: 'steps', values: [2, 0] });
  expect(find('digits-1').rule).toEqual({ kind: 'steps', values: [6, 4] });
  expect(find('digits-2', true).rule).toEqual({
    kind: 'steps',
    values: [9, 8],
  });
  expect(find('cross-ten-0').rule).toEqual({ kind: 'number', value: 20 });
  expect(find('cross-ten-1', true).rule).toEqual({ kind: 'number', value: 50 });
  expect(find('all-ones').rule).toEqual({ kind: 'number', value: 64 });
  expect(find('whole-tens').rule).toEqual({ kind: 'number', value: 6 });
  expect(evaluate(find('digits-0').rule, [2, 0])).toBe(true);
  expect(() => evaluate(find('digits-0').rule, [2])).toThrow(
    'educationLearning.answerRequired',
  );
  expect(evaluate(find('all-ones').rule, 4)).toBe(false);
  expect(evaluate(find('whole-tens').rule, 60)).toBe(false);
  for (const q of lesson.reviewQuestions!) {
    const original = lesson.questions.find((o) => o.knowledge === q.knowledge)!;
    expect(JSON.stringify([q.prompt, q.visual, q.choices])).not.toBe(
      JSON.stringify([original.prompt, original.visual, original.choices]),
    );
  }
});
it('preserves swapped-digit corrections and grouping states without marking physical work from reflection', () => {
  const library = initialLibrary('数位');
  const session = createSession(
    lesson,
    'sujiao-math-p1-lower-9787574312951',
    library.activeProfileId,
  );
  const index = session.questions.findIndex((q) =>
    q.id.endsWith('-q-digits-1'),
  );
  for (const draft of [
    [4, 6],
    [6, 4],
  ]) {
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
  const split = exchangePlaceValue(20, undefined, 'split-ten');
  expect(placeValue(20, split)).toMatchObject({ value: 20, tens: 1, ones: 10 });
  const bundled = exchangePlaceValue(20, split, 'bundle-ten');
  expect(placeValue(20, bundled)).toMatchObject({
    value: 20,
    tens: 2,
    ones: 0,
  });
  session.tools = { 'step-1': { placeValue: split } };
  const reflection = session.questions.findIndex(
    (q) => q.rule.kind === 'reflection',
  );
  session.responses[reflection]!.draft = '我还没实际拨珠，需要先看十位的位置。';
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
