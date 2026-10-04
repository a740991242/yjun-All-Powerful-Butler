import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { required } from '../learning/required';
import { initialLibrary } from '../learning/storage';
import { twentyIntervalQuestions } from './math-twenty-interval-practice';
import { twentyPracticeLessons } from './math-twenty-practice';

it('fills all five blanks in each forward/backward strip and rejects wrong direction and partial inputs', () => {
  for (const review of [false, true]) {
    const questions = twentyIntervalQuestions(review);
    for (const [index, first, step] of [
      [0, review ? 1 : 0, 1],
      [1, review ? 19 : 20, -1],
    ] as const) {
      const q = required(questions[index]);
      if (q.visual?.kind !== 'number-strip' || q.rule.kind !== 'steps')
        throw new Error('Missing complete strip');
      const expected: number[] = [];
      const filled = q.visual.values.map((n, i) => {
        const value = first + step * i;
        if (n === null) expected.push(value);
        else expect(n).toBe(value);
        return value;
      });
      expect(q.visual.values).toHaveLength(9);
      expect(expected).toHaveLength(5);
      expect(q.rule.values).toEqual(expected);
      for (let i = 1; i < filled.length; i++)
        expect(required(filled[i]) - required(filled[i - 1])).toBe(step);
      expect(evaluate(q.rule, expected)).toBe(true);
      expect(evaluate(q.rule, expected.toReversed())).toBe(false);
      const partial: (null | number)[] = [...expected];
      partial[2] = null;
      expect(() => evaluate(q.rule, partial)).toThrow(
        'educationLearning.answerRequired',
      );
    }
  }
});
it('counts visible ordinal from the declared hidden prefix and follows elapsed days across the week boundary', () => {
  for (const review of [false, true]) {
    const qs = twentyIntervalQuestions(review);
    const first = review ? 6 : 5;
    const target = review ? 14 : 11;
    const visible = Array.from({ length: 21 }, (_, n) => n).slice(first);
    const answer = visible.indexOf(target) + 1;
    for (let n = 0; n <= 20; n++)
      expect(evaluate(required(qs[2]).rule, n)).toBe(n === answer);
    expect(answer).toBe(review ? 9 : 7);
    const calendar = review
      ? ['星期六', '星期日', '星期一', '星期二']
      : ['星期五', '星期六', '星期日', '星期一'];
    const q = required(qs[3]);
    expect(q.prompt).toContain(required(calendar[0]));
    for (const choice of required(q.choices))
      expect(evaluate(q.rule, choice.id)).toBe(choice.id === calendar[3]);
  }
  for (const [i, main] of twentyIntervalQuestions(false).entries()) {
    const review = required(twentyIntervalQuestions(true)[i]);
    expect(review.knowledge).toBe(main.knowledge);
    expect(review.rule).not.toEqual(main.rule);
  }
});
it('retains v2 and v3 snapshots for all three courses with independent original-source records and partial five-field drafts', () => {
  const state = initialLibrary('2026-10-04T00:00:00.000Z');
  for (const [index, oldCount, oldSteps, oldReviews, newCount, newSteps] of [
    [0, 23, 6, 4, 25, 7],
    [1, 25, 6, 11, 38, 7],
    [2, 57, 8, 35, 61, 9],
  ] as const) {
    const lesson = required(twentyPracticeLessons[index]);
    const old = createSession(
      {
        ...lesson,
        version: 2,
        questions: lesson.questions.slice(0, oldCount),
        steps: lesson.steps.slice(0, oldSteps),
        reviewQuestions: lesson.reviewQuestions?.slice(0, oldReviews),
      },
      'pep-math-p1-upper-2024',
      state.activeProfileId,
      { seed: 4 },
    );
    const current = createSession(
      lesson,
      'pep-math-p1-upper-2024',
      state.activeProfileId,
      { seed: 5 },
    );
    expect(current.lessonVersion).toBe(3);
    expect(current.questions).toHaveLength(newCount);
    expect(lesson.steps).toHaveLength(newSteps);
    const oldIds = new Set(old.questions.map((q) => q.id));
    const added = current.questions.filter((q) => !oldIds.has(q.id));
    expect(added).toHaveLength(newCount - oldCount);
    for (const q of added.filter((q) => q.rule.kind === 'manual')) {
      const i = current.questions.indexOf(q);
      const response = required(current.responses[i]);
      current.responses[i] = submitResponse(q, {
        ...response,
        draft: 'confirmed',
      });
      expect(current.responses[i]?.submissions[0]?.correct).toBeNull();
    }
    if (index === 1) {
      const i = current.questions.findIndex((q) =>
        q.id.endsWith('-q-interval-ascending'),
      );
      const q = required(current.questions[i]);
      let response = required(current.responses[i]);
      response = submitResponse(q, { ...response, draft: [1, 3, 4, 6, 7] });
      response = submitResponse(q, { ...response, draft: [1, 3, 4, 6, 8] });
      expect(response.submissions.map((s) => s.correct)).toEqual([false, true]);
      current.responses[i] = response;
      const descending = current.questions.findIndex((q) =>
        q.id.endsWith('-q-interval-descending'),
      );
      current.responses[descending] = {
        ...required(current.responses[descending]),
        draft: [19, null, 16, 14, 12],
      };
    }
    state.sessions.push(old, current);
  }
  expect(parseBackup(exportBackup(state)).data).toEqual(state);
});
