import type { Lesson } from '../learning/types';

import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { isBnuTangramVisual } from '../learning/bnu-tangram';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { required } from '../learning/required';
import { newReviewQuestions } from '../learning/review';
import { bnuLowerBook } from './bnu-lower';
import { bnuLowerTangramRecognizeLesson as lesson } from './bnu-lower-tangram-recognize';
import { bnuLowerTangramSource as source } from './bnu-lower-tangram-source';
import { mathBooks } from './math';

const question = (suffix: string) =>
  required(lesson.questions.find((q) => q.id === `${lesson.id}-${suffix}`));
it('covers every numbered piece, all four original blanks and three actual traces while leaving later pages and publication pending', () => {
  expect(lesson.page).toBe(80);
  expect(lesson.status).toBe('available');
  expect(
    bnuLowerBook.units
      .flatMap((u) => u.lessons)
      .some((l) => l.id === lesson.id),
  ).toBe(true);
  expect(source.activities.filter((a) => a.page === 80)).toHaveLength(2);
  expect(lesson.steps).toHaveLength(9);
  expect(lesson.questions).toHaveLength(29);
  expect(lesson.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
    9,
  );
  expect(
    lesson.questions.filter((q) => q.rule.kind === 'reflection'),
  ).toHaveLength(4);
  for (const [id, name] of [
    [1, 'triangle'],
    [2, 'triangle'],
    [3, 'parallelogram'],
    [4, 'triangle'],
    [5, 'square'],
    [6, 'triangle'],
    [7, 'triangle'],
  ] as const)
    expect(evaluate(question(`piece-${id}`).rule, name)).toBe(true);
  for (const [suffix, value] of [
    ['blank-kinds', 3],
    ['blank-triangles', 5],
    ['blank-large-pair', 2],
    ['blank-small-pair', 6],
  ] as const)
    expect(evaluate(question(suffix).rule, value)).toBe(true);
  for (const q of [...lesson.questions, ...required(lesson.reviewQuestions)]) {
    if (q.visual?.kind === 'bnu-tangram')
      expect(isBnuTangramVisual(q.visual)).toBe(true);
    if (q.rule.kind === 'manual' || q.rule.kind === 'reflection')
      expect(evaluate(q.rule, 'confirmed')).toBeNull();
  }
  const manualIds = lesson.questions
    .filter((q) => q.rule.kind === 'manual')
    .map((q) => q.id.slice(lesson.id.length + 1));
  expect(manualIds).toEqual([
    'actual-source-scene',
    'actual-large-pair',
    'actual-small-pair',
    'actual-four-blanks',
    'actual-trace-square',
    'actual-trace-parallelogram',
    'actual-trace-triangle',
    'actual-say-three',
    'actual-background',
  ]);
  expect(lesson.parentTip).toContain('81～82');
  expect(lesson.steps.map((step) => step.text).join(' ')).toContain(
    '不只准7号',
  );
});
it('preserves zero drafts, wrong-then-right count history and old PEP sessions in the existing backup schema', () => {
  const now = '2026-10-06T02:00:00.000Z';
  const ready: Lesson = { ...lesson, status: 'available' };
  const book = required(
    mathBooks.find((b) => b.id === 'pep-math-p1-upper-2024'),
  );
  const oldLesson = required(
    book.units.flatMap((u) => u.lessons).find((l) => l.status === 'available'),
  );
  const old = createSession(oldLesson, book.id, 'child', { seed: 1, now });
  const oldSnapshot = JSON.parse(JSON.stringify(old));
  const session = createSession(ready, bnuLowerBook.id, 'child', {
    seed: 2,
    now,
  });
  const i = session.questions.findIndex((q) =>
    q.id.endsWith('-blank-triangles'),
  );
  const item = required(session.questions[i]);
  let response = required(session.responses[i]);
  response.draft = 3;
  response = submitResponse(item, response, now);
  response.draft = 5;
  session.responses[i] = submitResponse(item, response, now);
  expect(session.responses[i]?.submissions.map((s) => s.correct)).toEqual([
    false,
    true,
  ]);
  required(
    session.responses.find((r) => r.questionId.endsWith('-site-zero')),
  ).draft = 0;
  const data = {
    schemaVersion: 1 as const,
    profiles: [{ id: 'child', nickname: '验证', createdAt: now }],
    activeProfileId: 'child',
    sessions: [old, session],
  };
  const restored = parseBackup(exportBackup(data, now)).data;
  expect(restored).toEqual(JSON.parse(JSON.stringify(data)));
  expect(restored.sessions[0]).toEqual(oldSnapshot);
  expect(
    restored.sessions[1]?.responses.find((r) =>
      r.questionId.endsWith('-site-zero'),
    )?.draft,
  ).toBe(0);
});
it('uses changed complete subsets for all seven reviews rather than copying original totals or fixing the only valid triangle choice', () => {
  const ready: Lesson = { ...lesson, status: 'available' };
  const session = createSession(ready, bnuLowerBook.id, 'child', {
    seed: 3,
    now: '2026-10-06T02:00:00.000Z',
  });
  const index = session.questions.findIndex((q) =>
    q.id.endsWith('-blank-triangles'),
  );
  const response = required(session.responses[index]);
  response.draft = 3;
  session.responses[index] = submitResponse(
    required(session.questions[index]),
    response,
    '2026-10-06T02:00:00.000Z',
  );
  const reviews = newReviewQuestions(ready, session, [session]);
  expect(reviews).toHaveLength(7);
  const values = [
    3,
    1,
    1,
    2,
    0,
    '满足，仍三类各一片',
    '不能，需要核对三类轮廓',
  ];
  reviews.forEach((q, i) =>
    expect(evaluate(q.rule, required(values[i]))).toBe(true),
  );
  expect(
    reviews.every(
      (q) =>
        !lesson.questions.some(
          (old) => old.id === q.id || old.prompt === q.prompt,
        ),
    ),
  ).toBe(true);
  const seen = {
    ...session,
    id: 'already-seen-tangram-reviews',
    questions: reviews,
  };
  expect(newReviewQuestions(ready, session, [session, seen])).toHaveLength(0);
  expect(new Set([...lesson.questions, ...reviews].map((q) => q.id)).size).toBe(
    36,
  );
});
