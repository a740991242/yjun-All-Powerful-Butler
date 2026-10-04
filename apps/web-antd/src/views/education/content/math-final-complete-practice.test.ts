import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { required } from '../learning/required';
import { initialLibrary } from '../learning/storage';
import {
  finalCompleteComparisons,
  finalCompletePartitions,
  finalGridSourceTasks,
  finalLinkSourceTasks,
} from './math-final-complete-practice';
import { finalPracticeLessons } from './math-final-practice';

it('checks all six comparison positions with independent expected relations', () => {
  for (const review of [false, true]) {
    const questions = finalCompleteComparisons(review);
    const expected = ['=', '>', '<', '<', '>', '='];
    expect(questions).toHaveLength(6);
    for (const [i, q] of questions.entries())
      for (const symbol of ['>', '<', '='])
        expect(evaluate(q.rule, symbol)).toBe(symbol === expected[i]);
    expect(required(questions[1]).prompt).toContain(review ? '19−10' : '17−10');
  }
});
it('accepts all zero-inclusive family partitions while preserving positive-only earlier rules', () => {
  for (const review of [false, true]) {
    const totals = review ? [15, 18] : [14, 17];
    const questions = finalCompletePartitions(review);
    expect(questions).toHaveLength(2);
    for (const [i, q] of questions.entries()) {
      const total = required(totals[i]);
      for (let first = 0; first <= total; first++)
        expect(evaluate(q.rule, [first, total - first])).toBe(true);
      expect(evaluate(q.rule, [0, total - 1])).toBe(false);
      expect(evaluate(q.rule, [-1, total + 1])).toBe(false);
      expect(() => evaluate(q.rule, [0, null])).toThrow(
        'educationLearning.answerRequired',
      );
      expect(q.explanation).toContain('网页两空仅判断分法');
    }
  }
  const old = required(finalPracticeLessons[1]).questions.find((q) =>
    q.id.endsWith('-q12'),
  );
  expect(evaluate(required(old).rule, [0, 13])).toBe(false);
});
it('changes every new review condition and retains the actual concept', () => {
  for (const make of [finalCompleteComparisons, finalCompletePartitions]) {
    const main = make(false);
    const review = make(true);
    expect(review).toHaveLength(main.length);
    for (const [i, q] of main.entries()) {
      const changed = required(review[i]);
      expect(changed.knowledge).toBe(q.knowledge);
      expect(changed.prompt).not.toBe(q.prompt);
    }
  }
});
it('records all original-page requirements separately and leaves real work unscored', () => {
  expect(finalGridSourceTasks).toHaveLength(7);
  expect(finalLinkSourceTasks).toHaveLength(10);
  for (const [i, tasks] of [
    finalGridSourceTasks,
    finalLinkSourceTasks,
  ].entries()) {
    const lesson = required(finalPracticeLessons[i]);
    const session = createSession(lesson, 'pep-math-p1-upper-2024', 'child', {
      seed: 51,
    });
    for (const [key, prompt] of tasks) {
      const q = required(
        lesson.questions.find(
          (q) => q.id === `${lesson.id}-actual-source-${key}`,
        ),
      );
      expect(q.prompt).toBe(prompt);
      expect(q.rule.kind).toBe('manual');
      const index = session.questions.findIndex((x) => x.id === q.id);
      const response = submitResponse(q, {
        ...required(session.responses[index]),
        draft: 'confirmed',
      });
      expect(response.submissions[0]?.correct).toBeNull();
    }
  }
  expect(
    required(finalGridSourceTasks.find(([key]) => key === 'page-106-table'))[1],
  ).toContain('五个要求');
  expect(
    required(
      finalLinkSourceTasks.find(([key]) => key === 'page-109-staircase'),
    )[1],
  ).toContain('不能冒原阶梯已做');
});
it('keeps earlier sessions alongside new versions, zero/blank drafts and wrong-then-correct histories', () => {
  const library = initialLibrary('2026-10-04T00:00:00.000Z');
  for (const [
    i,
    oldVersion,
    oldQuestions,
    oldSteps,
    oldReviews,
    newQuestions,
    newSteps,
    newReviews,
  ] of [
    [0, 1, 22, 5, 4, 35, 7, 10],
    [1, 2, 21, 6, 10, 33, 8, 12],
  ] as const) {
    const lesson = required(finalPracticeLessons[i]);
    const old = createSession(
      {
        ...lesson,
        version: oldVersion,
        questions: lesson.questions.slice(0, oldQuestions),
        steps: lesson.steps.slice(0, oldSteps),
        reviewQuestions: lesson.reviewQuestions?.slice(0, oldReviews),
      },
      'pep-math-p1-upper-2024',
      library.activeProfileId,
      { seed: 51 },
    );
    const current = createSession(lesson, old.bookId, old.profileId, {
      seed: 52,
    });
    expect(current.lessonVersion).toBe(oldVersion + 1);
    expect(current.questions).toHaveLength(newQuestions);
    expect(lesson.steps).toHaveLength(newSteps);
    expect(lesson.reviewQuestions).toHaveLength(newReviews);
    for (const q of old.questions)
      expect(current.questions.find((now) => now.id === q.id)).toEqual(q);
    if (i === 1) {
      const index = current.questions.findIndex((q) =>
        q.id.endsWith('-q-complete-family-1'),
      );
      const q = required(current.questions[index]);
      current.responses[index] = {
        ...required(current.responses[index]),
        draft: [0, null],
      };
      library.sessions.push(old, current);
      expect(parseBackup(exportBackup(library)).data).toEqual(library);
      library.sessions.pop();
      library.sessions.pop();
      const wrong = submitResponse(q, {
        ...required(current.responses[index]),
        draft: [0, 16],
      });
      current.responses[index] = submitResponse(q, {
        ...wrong,
        draft: [0, 17],
      });
      expect(
        current.responses[index]?.submissions.map((x) => x.correct),
      ).toEqual([false, true]);
    }
    library.sessions.push(old, current);
  }
  expect(parseBackup(exportBackup(library)).data).toEqual(library);
});
