import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { required } from '../learning/required';
import { newReviewQuestions } from '../learning/review';
import { initialLibrary } from '../learning/storage';
import {
  borrowCompleteBranches,
  borrowCompleteChains,
  borrowCompleteClassifications,
  borrowCompleteComparisons,
  borrowCompleteHidden,
  borrowCompleteMissing,
  borrowCompletePairs,
  borrowCompleteQueues,
  borrowOrganizeSourceTasks,
  borrowProcessSourceTasks,
  borrowRelationSourceTasks,
} from './math-borrow-complete-practice';
import { borrowPracticeLessons } from './math-borrow-practice';

it('independently checks every intermediate result, comparison, missing number and branch', () => {
  const expected = [
    {
      compare: ['<', '>', '=', '>', '<', '<'],
      missing: [
        [5, 5],
        [5, 5],
        [8, 8],
        [7, 7],
        [7, 7],
        [7, 7],
      ],
      branches: [
        [8, 7, 6],
        [8, 7, 6],
        [8, 7, 6],
        [7, 6, 5],
        [7, 6, 5],
        [7, 6, 5],
      ],
      chains: [
        [10, 2],
        [14, 5],
        [13, 5],
        [9, 10],
        [3, 0],
        [10, 5],
        [7, 11],
        [6, 15],
        [13, 18],
        [15, 6],
        [9, 1],
        [4, 12],
        [5, 9],
        [12, 5],
        [14, 6],
        [9, 5],
        [13, 6],
        [9, 17],
      ],
      hidden: [
        [4, 17],
        [2, 13],
        [4, 11],
      ],
      classifications: [
        [9, 10],
        [9, 10],
      ],
      queues: [
        [1, 8],
        [1, 0],
      ],
    },
    {
      compare: ['=', '>', '<', '=', '<', '>'],
      missing: [
        [4, 4],
        [8, 8],
        [6, 6],
        [8, 8],
        [9, 9],
        [4, 4],
      ],
      branches: [
        [10, 9, 8],
        [10, 9, 8],
        [10, 9, 8],
        [9, 8, 7],
        [9, 8, 7],
        [9, 8, 7],
      ],
      chains: [
        [10, 2],
        [15, 6],
        [13, 5],
        [7, 10],
        [5, 0],
        [8, 4],
        [7, 11],
        [6, 14],
        [14, 18],
        [15, 6],
        [9, 1],
        [6, 14],
        [5, 9],
        [13, 6],
        [15, 7],
        [7, 3],
        [14, 7],
        [9, 17],
      ],
      hidden: [
        [6, 19],
        [3, 16],
        [5, 12],
      ],
      classifications: [
        [9, 10],
        [11, 10],
      ],
      queues: [
        [1, 7],
        [1, 0],
      ],
    },
  ];
  for (const [i, review] of [false, true].entries()) {
    const e = required(expected[i]);
    const groups = [
      [borrowCompleteMissing(review), e.missing],
      [borrowCompleteBranches(review), e.branches],
      [borrowCompleteChains(review), e.chains],
      [borrowCompleteHidden(review), e.hidden],
      [borrowCompleteClassifications(review), e.classifications],
      [borrowCompleteQueues(review), e.queues],
    ] as const;
    for (const [questions, answers] of groups) {
      expect(questions).toHaveLength(answers.length);
      for (const [index, q] of questions.entries()) {
        const answer = required(answers[index]);
        expect(evaluate(q.rule, answer)).toBe(true);
        expect(
          evaluate(
            q.rule,
            answer.map((n, j) => n + (j === answer.length - 1 ? 1 : 0)),
          ),
        ).toBe(false);
        expect(() => evaluate(q.rule, [null, ...answer.slice(1)])).toThrow(
          'educationLearning.answerRequired',
        );
      }
    }
    for (const [index, q] of borrowCompleteComparisons(review).entries())
      for (const symbol of ['>', '<', '='])
        expect(evaluate(q.rule, symbol)).toBe(symbol === e.compare[index]);
  }
});
it('finds all same-difference pairs across the entire given set, including within the smaller values', () => {
  for (const [i, review] of [false, true].entries()) {
    const values = required(
      [
        [2, 3, 6, 7, 8, 11, 12, 13, 14, 15],
        [1, 2, 5, 6, 7, 10, 11, 12, 13, 14],
      ][i],
    );
    const independent: string[] = [];
    for (let a = 0; a < values.length; a++)
      for (let b = a + 1; b < values.length; b++)
        if (required(values[b]) - required(values[a]) === 5)
          independent.push(`${String(values[b])}−${values[a]}`);
    expect(independent).toHaveLength(5);
    const q = required(borrowCompletePairs(review)[0]);
    expect(evaluate(q.rule, independent)).toBe(true);
    expect(evaluate(q.rule, independent.slice(1))).toBe(false);
    expect(evaluate(q.rule, [...independent, review ? '14−10' : '15−11'])).toBe(
      false,
    );
    expect(independent).toContain(review ? '6−1' : '7−2');
    expect(independent).toContain(review ? '7−2' : '8−3');
  }
});
it('changes each review condition and limits a real missed question to that concept', () => {
  for (const lesson of borrowPracticeLessons) {
    const signatures = new Set(
      lesson.questions.map((q) => JSON.stringify([q.prompt, q.visual, q.rule])),
    );
    for (const q of lesson.reviewQuestions ?? [])
      expect(
        signatures.has(JSON.stringify([q.prompt, q.visual, q.rule])),
        q.id,
      ).toBe(false);
  }

  for (const make of [
    borrowCompleteBranches,
    borrowCompleteChains,
    borrowCompleteClassifications,
    borrowCompleteComparisons,
    borrowCompleteHidden,
    borrowCompleteMissing,
    borrowCompletePairs,
    borrowCompleteQueues,
  ]) {
    const changed = make(true);
    const main = make(false);
    expect(changed).toHaveLength(main.length);
    for (const [i, q] of main.entries()) {
      expect(required(changed[i]).knowledge).toBe(q.knowledge);
      expect(required(changed[i]).prompt).not.toBe(q.prompt);
    }
  }
  const lesson = required(borrowPracticeLessons[2]);
  const session = createSession(lesson, 'pep-math-p1-lower-2024', 'child', {
    seed: 71,
  });
  const i = session.questions.findIndex((q) =>
    q.id.endsWith('-q-complete-hidden-0'),
  );
  const q = required(session.questions[i]);
  session.responses[i] = submitResponse(q, {
    ...required(session.responses[i]),
    draft: [4, 16],
  });
  const fresh = newReviewQuestions(lesson, session, [session]);
  expect(fresh.map((q) => q.id)).toEqual(
    borrowCompleteHidden(true).map((q) => q.id),
  );
  const used = createSession(lesson, session.bookId, session.profileId, {
    mode: 'review',
    originalSessionId: session.id,
    questions: fresh,
  });
  expect(newReviewQuestions(lesson, session, [session, used])).toEqual([]);
});
it('records every complete original activity separately, without grading actual material work', () => {
  const groups = [
    borrowProcessSourceTasks,
    borrowRelationSourceTasks,
    borrowOrganizeSourceTasks,
  ];
  expect(groups.map((x) => x.length)).toEqual([14, 16, 16]);
  for (const [i, tasks] of groups.entries()) {
    const lesson = required(borrowPracticeLessons[i]);
    expect(new Set(tasks.map(([key]) => key)).size).toBe(tasks.length);
    for (const [key, prompt] of tasks) {
      const q = required(
        lesson.questions.find(
          (q) => q.id === `${lesson.id}-actual-source-${key}`,
        ),
      );
      expect(q.prompt).toBe(prompt);
      expect(q.rule.kind).toBe('manual');
      expect(evaluate(q.rule, 'confirmed')).toBeNull();
    }
  }
  expect(
    required(
      borrowOrganizeSourceTasks.find(([key]) => key === 'page-15-matching'),
    )[1],
  ).toContain('包含结果5');
  expect(
    required(
      borrowOrganizeSourceTasks.find(([key]) => key === 'page-22-pairs'),
    )[1],
  ).toContain('同一排');
  expect(
    required(
      borrowProcessSourceTasks.find(([key]) => key === 'page-16-branches'),
    )[1],
  ).toContain('共九空');
});
it('preserves old v1 snapshots, zero and partial drafts, and wrong-then-correct histories in the same backup', () => {
  const library = initialLibrary('2026-10-04T00:00:00.000Z');
  for (const [
    index,
    oldQuestions,
    oldSteps,
    newQuestions,
    newSteps,
    newReviews,
  ] of [
    [0, 18, 5, 44, 7, 16],
    [1, 18, 5, 38, 7, 8],
    [2, 20, 6, 64, 9, 32],
  ] as const) {
    const lesson = required(borrowPracticeLessons[index]);
    const old = createSession(
      {
        ...lesson,
        version: 1,
        questions: lesson.questions.slice(0, oldQuestions),
        steps: lesson.steps.slice(0, oldSteps),
        reviewQuestions: lesson.reviewQuestions?.slice(0, 4),
      },
      'pep-math-p1-lower-2024',
      library.activeProfileId,
      { seed: 71 },
    );
    const current = createSession(lesson, old.bookId, old.profileId, {
      seed: 72,
    });
    expect(current.lessonVersion).toBe(2);
    expect(current.questions).toHaveLength(newQuestions);
    expect(lesson.steps).toHaveLength(newSteps);
    expect(lesson.reviewQuestions).toHaveLength(newReviews);
    for (const q of old.questions)
      expect(current.questions.find((n) => n.id === q.id)).toEqual(q);
    if (index === 1) {
      const i = current.questions.findIndex((q) =>
        q.id.endsWith('-q-complete-queue-1'),
      );
      const q = required(current.questions[i]);
      current.responses[i] = {
        ...required(current.responses[i]),
        draft: [1, null],
      };
      library.sessions.push(old, current);
      expect(parseBackup(exportBackup(library)).data).toEqual(library);
      library.sessions.pop();
      library.sessions.pop();
      const wrong = submitResponse(q, {
        ...required(current.responses[i]),
        draft: [1, 1],
      });
      current.responses[i] = submitResponse(q, { ...wrong, draft: [1, 0] });
      expect(current.responses[i]?.submissions.map((x) => x.correct)).toEqual([
        false,
        true,
      ]);
    }
    library.sessions.push(old, current);
  }
  expect(parseBackup(exportBackup(library)).data).toEqual(library);
});
