import type { Answer } from '../learning/types';

import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  ballPrices,
  basketExpressions,
} from '../learning/bnu-calculation-review';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { outfitConditions } from '../learning/outfit';
import { required } from '../learning/required';
import { initialLibrary } from '../learning/storage';
import { bnuLowerCalculationReviewLesson as lesson } from './bnu-lower-calculation-review';
import { bnuLowerCalculationReviewAudit as audit } from './bnu-lower-calculation-review-audit';
import { bnuLowerCalculationReviewSource as source } from './bnu-lower-calculation-review-source';
import { bnuLowerRecyclingLesson } from './bnu-lower-recycling';

const q = (suffix: string) =>
  required(lesson.questions.find((x) => x.id === `${lesson.id}-${suffix}`));
it('keeps changed review arithmetic within the stated non-carry/non-borrow prerequisite', () => {
  const calculations: [number, '+' | '-', number][] = [
    [24, '+', 3],
    [54, '+', 23],
    [24, '-', 3],
    [54, '-', 23],
    [8, '+', 70],
    [85, '-', 23],
    [30, '+', 42],
    [68, '-', 4],
    [33, '+', 24],
    [43, '-', 11],
  ];
  for (const expression of basketExpressions('review')) {
    const match = required(expression.match(/^(\d+)([+−])(\d+)$/));
    calculations.push([
      Number(match[1]),
      match[2] === '+' ? '+' : '-',
      Number(match[3]),
    ]);
  }
  const balls = ballPrices('review');
  expect(balls).toEqual([41, 32, 24, 8]);
  calculations.push(
    [required(balls[0]), '+', required(balls[3])],
    [required(balls[2]), '-', 20],
  );
  const outfit = outfitConditions('review');
  expect(outfit).toEqual({ budget: 70, prices: [31, 42, 24, 45, 33] });
  for (const top of outfit.prices.slice(0, 3))
    for (const trousers of outfit.prices.slice(3))
      calculations.push([top, '+', trousers]);
  for (const [left, operator, right] of calculations) {
    if (operator === '+') {
      expect((left % 10) + (right % 10)).toBeLessThan(10);
      expect(left + right).toBeLessThan(100);
    } else {
      expect(left % 10).toBeGreaterThanOrEqual(right % 10);
      expect(left).toBeGreaterThanOrEqual(right);
    }
  }
});

it('independently checks all twenty-eight objectives including every equation, basket, comparison and source shopping task', () => {
  const answers: [string, Answer][] = [
    ['harvest-all', [19, 59, 11, 11]],
    ['place-alignment', '十位对十位，个位对个位'],
    ['add-parts', [50, 9, 59]],
    ['sub-parts', [10, 1, 11]],
    ['problem-exploration', 26],
    ['counter-1', 67],
    ['counter-2', 62],
    ['counter-3', 63],
    ['counter-4', 54],
    ['written-1', [4, 6]],
    ['written-2', [9, 9]],
    ['written-3', [7, 9]],
    ['written-4', [6, 4]],
    ['baskets-all', ['1', '3', '4', '6', '7', '8']],
    ['baskets-results', [68, 64, 68, 68, 78, 68, 68, 68]],
    ['compare-1', '>'],
    ['compare-2', '<'],
    ['compare-3', '>'],
    ['compare-4', '='],
    ['compare-5', '<'],
    ['compare-6', '<'],
    ['ball-prices', [42, 30, 23, 6]],
    ['buy-two', 48],
    ['shortfall', 3],
    ['outfit', [1, 4]],
    ['outfit-example-total', 99],
    ['outfit-example-change', 1],
    ['site-zero', 0],
  ];
  expect(
    lesson.questions
      .filter((x) => !['manual', 'reflection'].includes(x.rule.kind))
      .map((x) => x.id)
      .toSorted(),
  ).toEqual(answers.map(([id]) => q(id).id).toSorted());
  for (const [id, answer] of answers)
    expect(evaluate(q(id).rule, answer), id).toBe(true);
  for (const [id, answer] of [
    ['baskets-all', ['1', '3', '4', '6', '7']],
    ['baskets-all', ['1', '2', '3', '4', '6', '7', '8']],
    ['shortfall', -3],
    ['outfit', [2, 4]],
    ['written-1', [6, 4]],
    ['compare-4', '>'],
  ] as [string, Answer][])
    expect(evaluate(q(id).rule, answer), id).toBe(false);
  for (const pair of [
    [1, 4],
    [1, 5],
    [2, 5],
    [3, 4],
    [3, 5],
  ])
    expect(evaluate(q('outfit').rule, pair)).toBe(true);
});
it('maps all eight source activities, with ten real activities and five open records', () => {
  expect(lesson.steps).toHaveLength(10);
  expect(lesson.questions).toHaveLength(43);
  expect(audit.activities.map((a) => [a.page, a.sourceActivity])).toEqual(
    source.activities.map((a) => [a.page, a.key]),
  );

  const ids: string[] = [];
  for (const a of audit.activities) {
    for (const step of a.steps) expect(lesson.steps[step - 1]).toBeDefined();
    for (const [kind, names] of [
      ['objective', a.objective],
      ['manual', a.manual],
      ['reflection', a.records],
    ] as const)
      for (const name of names) {
        const task = q(name);
        ids.push(task.id);
        expect(
          kind === 'objective'
            ? !['manual', 'reflection'].includes(task.rule.kind)
            : task.rule.kind === kind,
        ).toBe(true);
      }
  }
  expect(ids.toSorted()).toEqual(lesson.questions.map((x) => x.id).toSorted());
  expect(lesson.questions.filter((x) => x.rule.kind === 'manual')).toHaveLength(
    10,
  );
  expect(
    lesson.questions.filter((x) => x.rule.kind === 'reflection'),
  ).toHaveLength(5);
  for (const task of lesson.questions.filter((x) =>
    ['manual', 'reflection'].includes(x.rule.kind),
  ))
    expect(
      evaluate(
        task.rule,
        task.rule.kind === 'manual' ? 'confirmed' : '真实活动与计划分开',
      ),
    ).toBeNull();
  expect(audit.finalTeacherReview).toBe('not-verified');
});
it('checks every changed review and rejects copied original answers', () => {
  const answers: [string, Answer][] = [
    ['harvest', [27, 77, 21, 31]],
    ['counters', [78, 62, 72, 64]],
    ['written', [5, 7]],
    ['baskets', ['1', '2', '4', '6', '7']],
    ['compare', '<'],
    ['buy', 49],
    ['shortfall', 4],
    ['outfit', [3, 5]],
  ];
  const find = (id: string) =>
    required(
      lesson.reviewQuestions?.find((x) => x.id === `${lesson.id}-review-${id}`),
    );
  expect(lesson.reviewQuestions).toHaveLength(8);
  for (const [id, answer] of answers)
    expect(evaluate(find(id).rule, answer), id).toBe(true);
  for (const pair of [
    [1, 5],
    [3, 4],
    [3, 5],
  ])
    expect(evaluate(find('outfit').rule, pair)).toBe(true);
  expect(evaluate(find('outfit').rule, [1, 4])).toBe(false);
  expect(evaluate(find('baskets').rule, ['1', '3', '4', '6', '7', '8'])).toBe(
    false,
  );
});
it('preserves partial outfit/digit drafts and old snapshots, tracks wrong then right, and rejects price/rule mismatches', () => {
  const library = initialLibrary('整理与复习');
  const old = createSession(
    bnuLowerRecyclingLesson,
    'bnu-math-p1-lower-2024',
    library.activeProfileId,
  );
  const snapshot = structuredClone(old);
  const session = createSession(
    lesson,
    'bnu-math-p1-lower-2024',
    library.activeProfileId,
  );
  library.sessions = [old, session];
  const index = session.questions.findIndex((x) => x.id === q('outfit').id);
  const written = session.questions.findIndex(
    (x) => x.id === q('written-1').id,
  );
  required(session.responses[index]).draft = [3, null];
  required(session.responses[written]).draft = [4, null];
  expect(parseBackup(exportBackup(library)).data.sessions[1]).toEqual(session);
  for (const draft of [
    [2, 4],
    [3, 5],
  ])
    session.responses[index] = submitResponse(
      required(session.questions[index]),
      { ...required(session.responses[index]), draft },
    );
  const zero = session.questions.findIndex((x) => x.id === q('site-zero').id);
  session.responses[zero] = submitResponse(required(session.questions[zero]), {
    ...required(session.responses[zero]),
    draft: 0,
  });
  const restored = parseBackup(exportBackup(library)).data;
  expect(restored.sessions[0]).toEqual(snapshot);
  expect(restored.sessions[1]).toEqual(session);
  expect(
    required(session.responses[index]).submissions.map((x) => x.correct),
  ).toEqual([false, true]);
  expect(required(session.responses[zero]).submissions[0]?.correct).toBe(true);
  for (const key of [
    'extra-rule',
    'extra-visual',
    'mismatch',
    'wrong-scene',
    'draft-length',
  ]) {
    const invalid = JSON.parse(exportBackup(library));
    const target = invalid.data.sessions[1];
    if (key === 'extra-rule') target.questions[index].rule.budget = 100;
    if (key === 'extra-visual') target.questions[index].visual.answers = [1, 4];
    if (key === 'mismatch') target.questions[index].visual.variant = 'review';
    if (key === 'wrong-scene') target.questions[index].visual.scene = 'balls';
    if (key === 'draft-length') target.responses[index].draft = [1, 4, 5];
    expect(() => parseBackup(JSON.stringify(invalid))).toThrow(
      'educationLearning.invalidBackup',
    );
  }
});
