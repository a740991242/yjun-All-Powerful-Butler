import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { required } from '../learning/required';
import { initialLibrary } from '../learning/storage';
import {
  carryOrganizeCompleteQuestions,
  carryProcessCompleteQuestions,
} from './math-carry-complete-practice';
import { carryPracticeLessons } from './math-carry-practice';

it('checks all eighteen comparisons including equality and reversed result/expression positions', () => {
  const expected = [
    [
      '<',
      '=',
      '>',
      '<',
      '=',
      '>',
      '>',
      '=',
      '<',
      '>',
      '=',
      '<',
      '>',
      '<',
      '=',
      '<',
      '>',
      '=',
    ],
    [
      '>',
      '<',
      '=',
      '=',
      '>',
      '<',
      '>',
      '=',
      '<',
      '>',
      '=',
      '<',
      '>',
      '<',
      '=',
      '<',
      '>',
      '=',
    ],
  ];
  for (const review of [false, true]) {
    const qs = [
      ...carryProcessCompleteQuestions(review).slice(0, 12),
      ...carryOrganizeCompleteQuestions(review).slice(0, 6),
    ];
    expect(qs).toHaveLength(18);
    for (const [i, q] of qs.entries()) {
      for (const choice of required(q.choices))
        expect(evaluate(q.rule, choice.id)).toBe(
          choice.id === required(expected[review ? 1 : 0])[i],
        );
    }
  }
});
it('fills complete adjacent pairs, chain intermediates and all twelve missing addends', () => {
  for (const review of [false, true]) {
    const organize = carryOrganizeCompleteQuestions(review);
    const process = carryProcessCompleteQuestions(review);
    const missing = review
      ? [9, 8, 10, 6, 9, 9, 9, 5, 9, 9, 9, 10]
      : [8, 7, 8, 5, 7, 8, 8, 4, 8, 8, 8, 9];
    const qs = [...process.slice(12, 18), ...organize.slice(6, 12)];
    for (const [i, q] of qs.entries()) {
      const answer = required(missing[i]);
      expect(evaluate(q.rule, answer)).toBe(true);
      expect(evaluate(q.rule, answer + 1)).toBe(false);
    }
    const adjacent = required(process[18]);
    const pairs = review
      ? [17, 12, 11, 14, 11, 12, 13]
      : [13, 12, 11, 14, 11, 12, 17];
    expect(evaluate(adjacent.rule, pairs)).toBe(true);
    const partial: (null | number)[] = [...pairs];
    partial[1] = null;
    expect(() => evaluate(adjacent.rule, partial)).toThrow(
      'educationLearning.answerRequired',
    );
    expect(evaluate(adjacent.rule, [...pairs.slice(0, 6), 52])).toBe(false);
    const totals = review ? [14, 16, 18, 13, 12, 14] : [13, 15, 17, 12, 13, 13];
    for (const [i, q] of process.slice(19, 25).entries()) {
      const total = required(totals[i]);
      expect(evaluate(q.rule, [10, total, total])).toBe(true);
      expect(evaluate(q.rule, [total, total, total])).toBe(false);
    }
    expect(
      evaluate(
        required(process[25]).rule,
        review ? [11, 11, 12, 13, 13] : [10, 10, 11, 12, 12],
      ),
    ).toBe(true);
  }
});
it('selects both operations and requires genuinely changed review tasks for every new objective', () => {
  for (const review of [false, true]) {
    for (const [i, q] of carryOrganizeCompleteQuestions(review)
      .slice(12, 16)
      .entries()) {
      expect(evaluate(q.rule, i % 2 === 0 ? '+' : '−')).toBe(true);
      expect(evaluate(q.rule, i % 2 === 0 ? '−' : '+')).toBe(false);
    }
  }
  for (const make of [
    carryProcessCompleteQuestions,
    carryOrganizeCompleteQuestions,
  ]) {
    const main = make(false);
    const reviews = make(true);
    expect(reviews).toHaveLength(main.length);
    for (const [i, q] of main.entries()) {
      const r = required(reviews[i]);
      expect(r.knowledge).toBe(q.knowledge);
      expect(r.prompt).not.toBe(q.prompt);
    }
  }
});
it('accepts every nonnegative partition including both zero endpoints without changing positive-only rules', () => {
  for (const review of [false, true]) {
    const totals = review ? [12, 19] : [11, 20];
    const questions = carryOrganizeCompleteQuestions(review).slice(16);
    expect(questions).toHaveLength(2);
    for (const [i, q] of questions.entries()) {
      const total = required(totals[i]);
      for (let left = 0; left <= total; left++)
        expect(evaluate(q.rule, [left, total - left])).toBe(true);
      expect(evaluate(q.rule, [-1, total + 1])).toBe(false);
      expect(evaluate(q.rule, [0, total - 1])).toBe(false);
      expect(() => evaluate(q.rule, [0, null])).toThrow(
        'educationLearning.answerRequired',
      );
    }
  }
  const old = required(carryPracticeLessons[2]).questions.find(
    (q) => q.id === 'mu-carry-organize-q6',
  );
  expect(evaluate(required(old).rule, [0, 20])).toBe(false);
});
it('keeps all three v1 snapshots with v2 records, seven-field partial drafts and source confirmations', () => {
  const state = initialLibrary('2026-10-04T00:00:00.000Z');
  for (const [i, oldCount, oldSteps, newCount, newSteps, reviews] of [
    [0, 18, 5, 51, 7, 30],
    [1, 17, 5, 27, 6, 4],
    [2, 19, 6, 48, 9, 22],
  ] as const) {
    const lesson = required(carryPracticeLessons[i]);
    const old = createSession(
      {
        ...lesson,
        version: 1,
        questions: lesson.questions.slice(0, oldCount),
        steps: lesson.steps.slice(0, oldSteps),
        reviewQuestions: lesson.reviewQuestions?.slice(0, 4),
      },
      'pep-math-p1-upper-2024',
      state.activeProfileId,
      { seed: 22 },
    );
    const current = createSession(
      lesson,
      'pep-math-p1-upper-2024',
      state.activeProfileId,
      { seed: 23 },
    );
    expect(current.lessonVersion).toBe(2);
    expect(lesson.steps).toHaveLength(newSteps);
    expect(current.questions).toHaveLength(newCount);
    expect(lesson.reviewQuestions).toHaveLength(reviews);
    for (const q of old.questions)
      expect(current.questions.find((x) => x.id === q.id)).toEqual(q);
    for (const q of current.questions.filter((q) =>
      q.id.includes('-actual-source-'),
    )) {
      expect(q.rule.kind).toBe('manual');
      const index = current.questions.indexOf(q);
      current.responses[index] = submitResponse(q, {
        ...required(current.responses[index]),
        draft: 'confirmed',
      });
      expect(current.responses[index]?.submissions[0]?.correct).toBeNull();
    }
    if (i === 0) {
      const index = current.questions.findIndex((q) =>
        q.id.endsWith('-q-complete-adjacent-pairs'),
      );
      current.responses[index] = {
        ...required(current.responses[index]),
        draft: [13, null, 11, 14, 11, 12, 17],
      };
      const compareIndex = current.questions.findIndex((q) =>
        q.id.endsWith('-q-complete-nine-compare-1'),
      );
      const q = required(current.questions[compareIndex]);
      let response = submitResponse(q, {
        ...required(current.responses[compareIndex]),
        draft: '>',
      });
      response = submitResponse(q, { ...response, draft: '=' });
      expect(response.submissions.map((s) => s.correct)).toEqual([false, true]);
      current.responses[compareIndex] = response;
    }
    if (i === 2) {
      const index = current.questions.findIndex((q) =>
        q.id.endsWith('-q-complete-zero-partition-1'),
      );
      current.responses[index] = {
        ...required(current.responses[index]),
        draft: [0, null],
      };
      state.sessions.push(current);
      expect(parseBackup(exportBackup(state)).data).toEqual(state);
      state.sessions.pop();
      const q = required(current.questions[index]);
      const wrong = submitResponse(q, {
        ...required(current.responses[index]),
        draft: [0, 19],
      });
      current.responses[index] = submitResponse(q, {
        ...wrong,
        draft: [0, 20],
      });
      expect(
        current.responses[index]?.submissions.map((x) => x.correct),
      ).toEqual([false, true]);
    }
    state.sessions.push(old, current);
  }
  expect(parseBackup(exportBackup(state)).data).toEqual(state);
});
