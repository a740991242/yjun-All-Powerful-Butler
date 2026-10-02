import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
} from '../learning/engine';
import {
  finalStoryGroups,
  isFinalStoriesVisual,
} from '../learning/final-stories';
import { sujiaoUpperFinalStoriesLesson as lesson } from './sujiao-upper-final-stories';
it('covers four complete independent equations, arrival, one-category removal and all three animal structures', () => {
  expect(lesson.questions).toHaveLength(23);
  expect(lesson.reviewQuestions).toHaveLength(13);
  const q = (key: string, review = false) =>
    (review ? lesson.reviewQuestions! : lesson.questions).find(
      (q) => q.knowledge === `${lesson.id}-${key}`,
    )!;
  for (const [key, main, review] of [
    ['equation-fruit', [2, 5, 7], [4, 3, 7]],
    ['equation-books', [4, 6, 10], [3, 5, 8]],
    ['equation-bottles', [4, 1, 3], [5, 2, 3]],
    ['equation-rabbits', [10, 4, 6], [9, 3, 6]],
    ['playground', [5, 3, 8], [4, 5, 9]],
    ['one-kind', [6, 3, 3], [7, 2, 5]],
    ['garden-ducks', [4, 3, 7], [2, 4, 6]],
    ['garden-rabbits', [3, 2, 5], [3, 3, 6]],
    ['garden-birds', [5, 2, 3], [6, 2, 4]],
  ] as const) {
    expect(evaluate(q(key).rule, [...main])).toBe(true);
    expect(evaluate(q(key, true).rule, [...review])).toBe(true);
    expect(evaluate(q(key, true).rule, [...main])).toBe(false);
  }
  expect(evaluate(q('one-kind').rule, [10, 3, 7])).toBe(false);
  expect(evaluate(q('all-food').rule, 7)).toBe(true);
  expect(evaluate(q('all-food', true).rule, 8)).toBe(true);
  expect(evaluate(q('static-action').rule, 'guess')).toBe(false);
  expect(evaluate(q('open-many').rule, 'many')).toBe(true);
  for (const question of [...lesson.questions, ...lesson.reviewQuestions!]) {
    if (question.rule.kind === 'choice')
      expect(question.choices?.map((c) => c.id)).toContain(question.rule.value);
  }
  for (const review of lesson.reviewQuestions!) {
    const original = lesson.questions.find(
      (q) => q.knowledge === review.knowledge,
    )!;
    const signature = (q: typeof original) =>
      JSON.stringify([q.prompt, q.choices ?? [], q.visual ?? null, q.rule]);
    expect(signature(review)).not.toEqual(signature(original));
  }
  expect(lesson.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
    9,
  );
  for (const key of [
    'actual-fruit',
    'actual-books',
    'actual-bottles',
    'actual-rabbits',
    'actual-playground',
    'actual-one-kind',
    'actual-open-garden',
    'actual-explain',
    'actual-textbook',
  ])
    expect(q(key).rule.kind).toBe('manual');
});
it('keeps fixed scene models strict, every original icon once and removed icons within the original count', () => {
  for (const variant of ['main', 'review'] as const)
    for (const scene of [
      'fruit',
      'books',
      'bottles',
      'rabbits',
      'playground',
      'one-kind',
      'garden',
    ] as const) {
      const model = { kind: 'final-stories' as const, variant, scene };
      expect(isFinalStoriesVisual(model)).toBe(true);
      const groups = finalStoryGroups(model);
      expect(new Set(groups.map((g) => g.label)).size).toBe(groups.length);
      for (const g of groups) {
        expect(g.count).toBeGreaterThan(0);
        expect(g.count).toBeLessThanOrEqual(10);
        expect(g.marked).toBeGreaterThanOrEqual(0);
        expect(g.marked).toBeLessThanOrEqual(g.count);
      }
      for (const patch of [
        { scene: 'unknown' },
        { scene: ['fruit'] },
        { variant: 'old' },
        { counts: [99] },
        { answer: 7 },
      ])
        expect(isFinalStoriesVisual({ ...model, ...patch })).toBe(false);
    }
});
it('preserves wrong category history, partial zero/null drafts and unconfirmed physical/original-book tasks through schema v1 backup', () => {
  const now = '2026-10-02T10:00:00.000Z';
  const s = createSession(lesson, 'sujiao-math-p1-upper-2024', 'child', {
    now,
    seed: 42,
  });
  s.phase = 'practice';
  const index = s.questions.findIndex(
    (q) => q.knowledge === `${lesson.id}-one-kind`,
  );
  s.responses[index]!.draft = [6, null, 0];
  const data = {
    schemaVersion: 1 as const,
    activeProfileId: 'child',
    profiles: [{ id: 'child', nickname: '孩子', createdAt: now }],
    sessions: [s],
  };
  expect(
    parseBackup(exportBackup(data, now)).data.sessions[0]!.responses[index]!
      .draft,
  ).toEqual([6, null, 0]);
  s.responses[index] = submitResponse(
    s.questions[index]!,
    { ...s.responses[index]!, draft: [10, 3, 7] },
    now,
  );
  for (const [i, q] of s.questions.entries()) {
    if (q.rule.kind === 'manual') continue;
    const draft = (() => {
      if (q.rule.kind === 'steps') return q.rule.values;
      if (q.rule.kind === 'choice' || q.rule.kind === 'number')
        return q.rule.value;
      if (q.rule.kind === 'reflection')
        return '隔离测试：实际故事和原教材观察尚未做，未来计划另记。';
      throw new Error('Unexpected rule');
    })();
    s.responses[i] = submitResponse(q, { ...s.responses[i]!, draft }, now);
  }
  expect(statistics(s).finalCorrect).toBe(13);
  expect(statistics(s).manual).toBe(0);
  expect(s.responses[index]!.submissions.map((a) => a.correct)).toEqual([
    false,
    true,
  ]);
  expect(
    s.responses[s.questions.findIndex((q) => q.rule.kind === 'reflection')]!
      .submissions[0]!.correct,
  ).toBeNull();
  expect(parseBackup(exportBackup(data, now)).data.sessions[0]).toEqual(s);
});
