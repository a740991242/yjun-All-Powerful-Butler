import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  bnuComicDuckCounts,
  bnuComicFacts,
  isBnuComicVisual,
} from '../learning/bnu-comic';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { required } from '../learning/required';
import { newReviewQuestions } from '../learning/review';
import { bnuLowerBook } from './bnu-lower';
import {
  bnuLowerComicLesson as lesson,
  bnuLowerComicMapping as mapping,
} from './bnu-lower-comic';
import { bnuLowerComicSource as source } from './bnu-lower-comic-source';
import { mathBooks } from './math';
const ready = { ...lesson, status: 'available' as const };
const now = '2026-10-06T09:00:00.000Z';
it('covers eleven source activities, independent real creation and exchanges, and three subjective star records', () => {
  expect(lesson.status).toBe('available');
  expect(bnuLowerBook.units.find((u) => u.id === 'comic')?.lessons).toEqual([
    lesson,
  ]);
  expect(lesson.steps).toHaveLength(12);
  expect(lesson.questions).toHaveLength(35);
  expect(mapping.map((m) => [m.page, m.sourceActivity])).toEqual(
    source.activities.map((a) => [a.page, a.key]),
  );
  const main = new Map(
    lesson.questions.map((q) => [q.id.slice(lesson.id.length + 1), q]),
  );
  expect(
    new Set(
      mapping.flatMap((m) => [...m.objective, ...m.manual, ...m.records]),
    ),
  ).toEqual(new Set(main.keys()));
  for (const m of mapping) {
    for (const step of m.steps) expect(lesson.steps[step - 1]).toBeDefined();
    for (const key of m.manual) expect(main.get(key)?.rule.kind).toBe('manual');
    for (const key of m.records)
      expect(main.get(key)?.rule.kind).toBe('reflection');
    for (const key of m.objective)
      expect(['choice', 'number']).toContain(main.get(key)?.rule.kind);
  }
  expect(lesson.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
    10,
  );
  expect(
    lesson.questions.filter((q) => q.rule.kind === 'reflection'),
  ).toHaveLength(8);
  const stars = lesson.questions.filter((q) => q.id.includes('-stars-'));
  expect(stars).toHaveLength(3);
  for (const q of stars) {
    expect(q.rule.kind).toBe('reflection');
    for (const answer of ['0颗，未完成', '待评价', '2颗，能说条件但还有困难'])
      expect(evaluate(q.rule, answer)).toBeNull();
  }
  expect(lesson.steps[3]?.text).toContain('另定格数');
  expect(lesson.steps[6]?.text).toContain('不能算已经看过同伴作品');
});
it('uses exact given story conditions and new review conditions, with strict closed diagram variants and no answer fields', () => {
  expect(bnuComicFacts('main')).toEqual({
    price: 13,
    tendered: 20,
    start: 6,
    arrive: 8,
    leave: 5,
  });
  expect(bnuComicFacts('review')).toEqual({
    price: 16,
    tendered: 20,
    start: 7,
    arrive: 6,
    leave: 4,
  });
  expect(bnuComicDuckCounts('main')).toEqual([6, 8, 5, 0]);
  expect(bnuComicDuckCounts('review')).toEqual([7, 6, 4, 0]);
  for (const scene of ['milk', 'ducks'])
    for (const variant of ['main', 'review'])
      expect(isBnuComicVisual({ kind: 'bnu-comic', scene, variant })).toBe(
        true,
      );
  for (const extra of [
    { answer: 9 },
    { price: 13 },
    { panels: [] },
    { scene: 'other' },
    { variant: ['main'] },
  ])
    expect(
      isBnuComicVisual({
        kind: 'bnu-comic',
        scene: 'milk',
        variant: 'main',
        ...extra,
      }),
    ).toBe(false);
  for (const q of [...lesson.questions, ...(lesson.reviewQuestions ?? [])]) {
    if (q.visual) expect(isBnuComicVisual(q.visual)).toBe(true);
    const r = q.rule;
    if (r.kind === 'choice')
      expect(q.choices?.some((c) => c.id === r.value)).toBe(true);
  }
  const original = createSession(ready, 'bnu-math-p1-lower-2024', 'child', {
    seed: 1,
    now,
  });
  const originalIndex = original.questions.findIndex((q) =>
    q.id.endsWith('-milk-change'),
  );
  const first = required(original.questions[originalIndex]);
  const response = required(original.responses[originalIndex]);
  response.draft = 99;
  original.responses[originalIndex] = submitResponse(first, response, now);
  const review = newReviewQuestions(ready, original, [original]);
  expect(review).toHaveLength(8);
  expect(
    newReviewQuestions(ready, original, [
      original,
      { ...original, id: 'seen', questions: review },
    ]),
  ).toHaveLength(0);
  expect(review.map((q) => q.id)).toEqual(
    lesson.reviewQuestions?.map((q) => q.id),
  );
  expect(new Set([...lesson.questions, ...review].map((q) => q.id)).size).toBe(
    43,
  );
  const get = (suffix: string) =>
    required(review.find((q) => q.id.endsWith(suffix)));
  expect(evaluate(get('review-change').rule, 7)).toBe(false);
  expect(evaluate(get('review-change').rule, 4)).toBe(true);
  expect(evaluate(get('review-after-arrive').rule, 14)).toBe(false);
  expect(evaluate(get('review-after-arrive').rule, 13)).toBe(true);
});
it('preserves old PEP snapshots, zero, incorrect then correct attempts, open stars and schema1 while rejecting injected diagram facts', () => {
  const book = required(
    mathBooks.find((b) => b.id === 'pep-math-p1-upper-2024'),
  );
  const old = createSession(
    required(
      book.units
        .flatMap((u) => u.lessons)
        .find((l) => l.status === 'available'),
    ),
    book.id,
    'child',
    { seed: 1, now },
  );
  const oldSnapshot = JSON.parse(JSON.stringify(old));
  const session = createSession(ready, 'bnu-math-p1-lower-2024', 'child', {
    seed: 2,
    now,
  });
  const i = session.questions.findIndex((q) => q.id.endsWith('-milk-change'));
  const q = required(session.questions[i]);
  let r = required(session.responses[i]);
  r.draft = 3;
  r = submitResponse(q, r, now);
  r.draft = 7;
  session.responses[i] = submitResponse(q, r, now);
  required(
    session.responses.find((r) => r.questionId.endsWith('-site-zero')),
  ).draft = 0;
  const starIndex = session.questions.findIndex((q) =>
    q.id.endsWith('-stars-understand'),
  );
  const starResponse = required(session.responses[starIndex]);
  starResponse.draft = '待评价，没读他人的作品';
  session.responses[starIndex] = submitResponse(
    required(session.questions[starIndex]),
    starResponse,
    now,
  );
  const data = {
    schemaVersion: 1 as const,
    profiles: [{ id: 'child', nickname: '验证', createdAt: now }],
    activeProfileId: 'child',
    sessions: [old, session],
  };
  const raw = exportBackup(data, now);
  const restored = parseBackup(raw).data;
  expect(restored).toEqual(JSON.parse(JSON.stringify(data)));
  expect(restored.sessions[0]).toEqual(oldSnapshot);
  expect(
    restored.sessions[1]?.responses[i]?.submissions.map((s) => s.correct),
  ).toEqual([false, true]);
  expect(
    restored.sessions[1]?.responses[starIndex]?.submissions[0]?.correct,
  ).toBeNull();
  for (const extra of [{ answer: 7 }, { price: 1 }, { scene: 'unknown' }]) {
    const bad = JSON.parse(raw);
    Object.assign(bad.data.sessions[1].questions[i].visual, extra);
    expect(() => parseBackup(JSON.stringify(bad))).toThrow(
      'educationLearning.invalidBackup',
    );
  }
});
