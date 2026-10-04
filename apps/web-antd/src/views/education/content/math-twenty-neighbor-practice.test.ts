import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { required } from '../learning/required';
import { initialLibrary } from '../learning/storage';
import { twentyNeighborQuestions } from './math-twenty-interval-practice';
import { twentyPracticeLessons } from './math-twenty-practice';

it('checks both adjacency directions with independent card positions and retains partial blanks', () => {
  const cards = Array.from({ length: 21 }, (_, i) => i);
  for (const review of [false, true]) {
    const q = required(twentyNeighborQuestions(review)[0]);
    const largerIndex = cards.indexOf(review ? 16 : 14);
    const smallerIndex = cards.indexOf(review ? 13 : 18);
    const answer = [
      required(cards[largerIndex + 1]),
      required(cards[smallerIndex - 1]),
    ];
    expect(evaluate(q.rule, answer)).toBe(true);
    expect(evaluate(q.rule, answer.toReversed())).toBe(false);
    expect(
      evaluate(q.rule, [
        required(cards[largerIndex - 1]),
        required(cards[smallerIndex + 1]),
      ]),
    ).toBe(false);
    expect(() => evaluate(q.rule, [required(answer[0]), null])).toThrow(
      'educationLearning.answerRequired',
    );
  }
});
it('covers closer to each endpoint and equal distances without counting the starting point', () => {
  for (const review of [false, true]) {
    const qs = twentyNeighborQuestions(review);
    for (const [index, value, leftIntervals, rightIntervals, answer] of (review
      ? [
          [1, 13, [12, 11, 10], [14, 15, 16, 17, 18, 19, 20], '10'],
          [2, 17, [16, 15, 14, 13, 12, 11, 10], [18, 19, 20], '20'],
        ]
      : [
          [1, 12, [11, 10], [13, 14, 15, 16, 17, 18, 19, 20], '10'],
          [2, 18, [17, 16, 15, 14, 13, 12, 11, 10], [19, 20], '20'],
        ]) as [number, number, number[], number[], string][]) {
      const q = required(qs[index]);
      expect(q.visual).toEqual({
        kind: 'number-line',
        minimum: 0,
        maximum: 20,
        value,
      });
      expect(leftIntervals.at(-1)).toBe(10);
      expect(rightIntervals.at(-1)).toBe(20);
      expect(leftIntervals.includes(value)).toBe(false);
      expect(rightIntervals.includes(value)).toBe(false);
      expect(leftIntervals.length < rightIntervals.length ? '10' : '20').toBe(
        answer,
      );
      for (const choice of required(q.choices))
        expect(evaluate(q.rule, choice.id)).toBe(choice.id === answer);
    }
  }
  const equal = required(twentyNeighborQuestions(false)[3]);
  for (const choice of required(equal.choices))
    expect(evaluate(equal.rule, choice.id)).toBe(choice.id === '同样近');
  const equalReview = required(twentyNeighborQuestions(true)[3]);
  expect(evaluate(equalReview.rule, [5, 5])).toBe(true);
  expect(evaluate(equalReview.rule, [6, 6])).toBe(false);
  expect(evaluate(equalReview.rule, [5, 6])).toBe(false);
  for (const [i, main] of twentyNeighborQuestions(false).entries()) {
    const review = required(twentyNeighborQuestions(true)[i]);
    expect(review.knowledge).toBe(main.knowledge);
    expect(review.prompt).not.toBe(main.prompt);
  }
});
it('preserves v3 snapshots alongside v4 partial drafts, first mistakes and independently confirmed source activities', () => {
  const lesson = required(twentyPracticeLessons[1]);
  const state = initialLibrary('2026-10-04T00:00:00.000Z');
  const old = createSession(
    {
      ...lesson,
      version: 3,
      questions: lesson.questions.slice(0, 38),
      steps: lesson.steps.slice(0, 7),
      reviewQuestions: lesson.reviewQuestions?.slice(0, 15),
    },
    'pep-math-p1-upper-2024',
    state.activeProfileId,
    { seed: 11 },
  );
  const current = createSession(
    lesson,
    'pep-math-p1-upper-2024',
    state.activeProfileId,
    { seed: 12 },
  );
  expect(current.lessonVersion).toBe(4);
  expect(current.questions).toHaveLength(44);
  expect(lesson.steps).toHaveLength(8);
  expect(lesson.reviewQuestions).toHaveLength(19);
  for (const q of old.questions)
    expect(
      current.questions.find((currentQuestion) => currentQuestion.id === q.id),
    ).toEqual(q);
  const i = current.questions.findIndex((q) =>
    q.id.endsWith('-q-neighbor-adjacent'),
  );
  current.responses[i] = {
    ...required(current.responses[i]),
    draft: [15, null],
  };
  const equalIndex = current.questions.findIndex((q) =>
    q.id.endsWith('-q-neighbor-equal'),
  );
  const equal = required(current.questions[equalIndex]);
  let response = required(current.responses[equalIndex]);
  response = submitResponse(equal, { ...response, draft: '20' });
  response = submitResponse(equal, { ...response, draft: '同样近' });
  expect(response.submissions.map((s) => s.correct)).toEqual([false, true]);
  current.responses[equalIndex] = response;
  const addedSource = current.questions.filter(
    (q) =>
      q.id.endsWith('-actual-source-two-adjacent-blanks') ||
      q.id.endsWith('-actual-source-near-ten-twenty'),
  );
  expect(addedSource).toHaveLength(2);
  for (const q of addedSource) {
    expect(q.rule.kind).toBe('manual');
    const index = current.questions.indexOf(q);
    current.responses[index] = submitResponse(q, {
      ...required(current.responses[index]),
      draft: 'confirmed',
    });
    expect(current.responses[index]?.submissions[0]?.correct).toBeNull();
  }
  state.sessions.push(old, current);
  expect(parseBackup(exportBackup(state)).data).toEqual(state);
});
