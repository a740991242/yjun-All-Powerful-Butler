import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  countGroupsTotal,
  isCountGroupsVisual,
} from '../learning/count-groups';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { tenPracticeGroups } from './sujiao-ten-practice-groups';
import { sujiaoTenReviewLesson as lesson } from './sujiao-ten-review';

it('separates groups from objects and checks strict inequalities without accepting equality', () => {
  for (const [index, questions] of [
    lesson.questions,
    lesson.reviewQuestions!,
  ].entries()) {
    const review = index === 1;
    const q = (suffix: string) =>
      questions.find((item) => item.id.endsWith(suffix))!;
    const visual = q('-groups').visual!;
    expect(isCountGroupsVisual(visual)).toBe(true);
    if (visual.kind !== 'count-groups') throw new Error('Missing groups');
    expect(countGroupsTotal(visual)).toBe(10);
    expect(evaluate(q('-groups').rule, review ? 2 : 5)).toBe(true);
    expect(evaluate(q('-groups').rule, 10)).toBe(false);
    expect(evaluate(q('-objects').rule, 10)).toBe(true);
    expect(evaluate(q('-objects').rule, visual.groups.length)).toBe(false);
    const threshold = review ? 6 : 8;
    const small = Array.from({ length: threshold }, (_, n) => String(n));
    expect(evaluate(q('-less-than').rule, small)).toBe(true);
    expect(evaluate(q('-less-than').rule, [...small, String(threshold)])).toBe(
      false,
    );
    const subtract = review ? 4 : 3;
    const large = Array.from({ length: subtract }, (_, n) =>
      String(11 - subtract + n),
    );
    expect(evaluate(q('-sub-less').rule, large)).toBe(true);
    expect(
      evaluate(q('-sub-less').rule, [...large, String(10 - subtract)]),
    ).toBe(false);
    expect(evaluate(q('-equality').rule, review ? 2 : 4)).toBe(true);
    expect(evaluate(q('-equality').rule, review ? 6 : 10)).toBe(false);
    for (const answer of [
      [0, 10],
      [5, 5],
      [10, 0],
      [4, 6],
    ])
      expect(evaluate(q('-partition').rule, answer)).toBe(true);
    expect(evaluate(q('-partition').rule, [5, 6])).toBe(false);
    expect(evaluate(q('-partition').rule, [-1, 11])).toBe(false);
    expect(() => evaluate(q('-partition').rule, [4.5, 5.5])).toThrow(
      'educationLearning.answerRequired',
    );
  }
});

it('changes review contexts and preserves five-group diagrams, first mistakes and drafts in backup', () => {
  const main = lesson.questions
    .slice(0, 14)
    .filter((q) => q.rule.kind !== 'manual');
  expect(main).toHaveLength(10);
  expect(lesson.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
    9,
  );
  for (const [index, question] of main.entries()) {
    const review = lesson.reviewQuestions![index]!;
    expect(review.knowledge).toBe(question.knowledge);
    expect(review.prompt).not.toBe(question.prompt);
  }
  const now = '2026-10-01T15:00:00.000Z';
  const session = createSession(lesson, 'sujiao-math-p1-upper-2024', 'child', {
    now,
    seed: 17,
  });
  session.phase = 'practice';
  const index = session.questions.findIndex((q) => q.id.endsWith('-groups'));
  session.responses[index] = submitResponse(
    session.questions[index]!,
    { ...session.responses[index]!, draft: 10 },
    now,
  );
  session.responses[index] = submitResponse(
    session.questions[index]!,
    { ...session.responses[index]!, draft: 5 },
    now,
  );
  const partial = session.questions.findIndex((q) => q.id.endsWith('-family'));
  session.responses[partial]!.draft = [10, null, 4];
  const state = {
    schemaVersion: 1 as const,
    activeProfileId: 'child',
    profiles: [{ id: 'child', nickname: '孩子', createdAt: now }],
    sessions: [session],
  };
  const restored = parseBackup(exportBackup(state, now)).data.sessions[0]!;
  expect(restored).toEqual(session);
  expect(restored.responses[index]!.submissions.map((s) => s.correct)).toEqual([
    false,
    true,
  ]);
  const invalid = JSON.parse(exportBackup(state, now));
  invalid.data.sessions[0].questions[index].visual.groups = [2, 2, 2, 2, 3];
  expect(() => parseBackup(JSON.stringify(invalid))).toThrow(Error);
});

it('checks complete original group sizes and independently verifies every calculation and legal equality fill', () => {
  const operation = (a: number, op: string, b: number) =>
    op === '+' ? a + b : a - b;
  for (const review of [false, true]) {
    const tasks = tenPracticeGroups(review);
    expect(tasks).toHaveLength(37);
    for (const [group, count] of [
      ['oral', 12],
      ['matching', 10],
      ['sequential', 6],
      ['application', 3],
      ['equality', 6],
    ] as const)
      expect(
        tasks.filter((q) => q.knowledge.includes(`full-${group}-`)),
      ).toHaveLength(count);
    for (const q of tasks) {
      if (q.knowledge.includes('application')) continue;
      const match = q.prompt.match(
        /：([0-9]+) ([+-]) ([0-9]+)(?: ([+-]) ([0-9]+))?/,
      );
      expect(match).not.toBeNull();
      const a = Number(match![1]);
      const op = match![2]!;
      const b = Number(match![3]);
      const middle = operation(a, op, b);
      expect(middle).toBeGreaterThanOrEqual(0);
      expect(middle).toBeLessThanOrEqual(10);
      if (q.knowledge.includes('sequential')) {
        const end = operation(middle, match![4]!, Number(match![5]));
        expect(evaluate(q.rule, [middle, end])).toBe(true);
        expect(() => evaluate(q.rule, [null, end])).toThrow(
          'educationLearning.answerRequired',
        );
        expect(evaluate(q.rule, [middle, end + 1])).toBe(false);
      } else if (q.knowledge.includes('equality')) {
        const right = Number(q.prompt.match(/= ([0-9]+) \+ □/)![1]);
        for (let value = 0; value <= 10; value++)
          expect(evaluate(q.rule, value)).toBe(middle === right + value);
        expect(evaluate(q.rule, middle)).toBe(false);
      } else if (q.knowledge.includes('matching')) {
        expect(q.choices!.some((c) => c.id === String(middle))).toBe(true);
        for (const choice of q.choices!)
          expect(evaluate(q.rule, choice.id)).toBe(
            Number(choice.id) === middle,
          );
      } else {
        expect(evaluate(q.rule, middle)).toBe(true);
        expect(evaluate(q.rule, middle + 1)).toBe(false);
      }
    }
    const apps = tasks.filter((q) => q.knowledge.includes('application'));
    const first = review ? 4 : 6;
    const second = review ? 6 : 3;
    const total = first + second;
    for (const [index, values] of [
      [first, second, total],
      [total, first, second],
      [total, second, first],
    ].entries()) {
      expect(evaluate(apps[index]!.rule, values)).toBe(true);
      expect(() =>
        evaluate(apps[index]!.rule, [values[0]!, values[1]!, null]),
      ).toThrow('educationLearning.answerRequired');
    }
  }
  const main = tenPracticeGroups(false);
  const review = tenPracticeGroups(true);
  for (const [index, q] of main.entries()) {
    expect(review[index]!.knowledge).toBe(q.knowledge);
    expect(review[index]!.prompt).not.toBe(q.prompt);
  }
});

it('keeps v1 snapshots alongside v2 groups, zero, partial steps, mistakes and unconfirmed source work', () => {
  const now = '2026-10-04T03:00:00.000Z';
  const oldLesson = {
    ...lesson,
    version: 1,
    steps: lesson.steps.slice(0, 4),
    questions: lesson.questions.slice(0, 14),
    reviewQuestions: lesson.reviewQuestions!.slice(0, 10),
  };
  const old = createSession(oldLesson, 'sujiao-math-p1-upper-2024', 'child', {
    now,
    seed: 1,
  });
  const current = createSession(lesson, 'sujiao-math-p1-upper-2024', 'child', {
    now,
    seed: 2,
  });
  const zero = current.questions.findIndex(
    (q) => q.knowledge === 'sj-upper-ten-review-full-oral-5',
  );
  current.responses[zero] = submitResponse(
    current.questions[zero]!,
    { ...current.responses[zero]!, draft: 1 },
    now,
  );
  current.responses[zero] = submitResponse(
    current.questions[zero]!,
    { ...current.responses[zero]!, draft: 0 },
    now,
  );
  const partial = current.questions.findIndex(
    (q) => q.knowledge === 'sj-upper-ten-review-full-sequential-0',
  );
  current.responses[partial]!.draft = [6, null];
  const manual = current.questions.findIndex(
    (q) => q.knowledge === 'sj-upper-ten-review-actual-source-oral',
  );
  expect(current.responses[manual]!.submissions).toEqual([]);
  current.responses[manual] = submitResponse(
    current.questions[manual]!,
    { ...current.responses[manual]!, draft: 'confirmed' },
    now,
  );
  expect(current.responses[manual]!.submissions[0]!.correct).toBeNull();
  const state = {
    schemaVersion: 1 as const,
    activeProfileId: 'child',
    profiles: [{ id: 'child', nickname: '孩子', createdAt: now }],
    sessions: [old, current],
  };
  const restored = parseBackup(exportBackup(state, now)).data;
  expect(restored.sessions).toEqual([old, current]);
  expect(restored.sessions[0]!.questions).toHaveLength(14);
  expect(restored.sessions[1]!.questions).toHaveLength(56);
  expect(
    restored.sessions[1]!.responses[zero]!.submissions.map((s) => s.correct),
  ).toEqual([false, true]);
  expect(restored.sessions[1]!.responses[partial]!.draft).toEqual([6, null]);
});
