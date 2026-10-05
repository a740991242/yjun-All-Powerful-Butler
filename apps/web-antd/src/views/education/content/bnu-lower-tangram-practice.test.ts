import type { Lesson } from '../learning/types';

import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { bnuTangramPieces } from '../learning/bnu-tangram';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { required } from '../learning/required';
import { newReviewQuestions } from '../learning/review';
import { bnuLowerBook } from './bnu-lower';
import { bnuLowerTangramPracticeLesson as lesson } from './bnu-lower-tangram-practice';
import { bnuLowerTangramSource as source } from './bnu-lower-tangram-source';
import { mathBooks } from './math';

const now = '2026-10-06T03:00:00.000Z';
const ready: Lesson = { ...lesson, status: 'available' };
const question = (suffix: string) =>
  required(lesson.questions.find((q) => q.id === `${lesson.id}-${suffix}`));
it('covers all four printed-page activities, three people and three hare figures as independent actions without fixing open stories', () => {
  expect(lesson.page).toBe(82);
  expect(lesson.status).toBe('available');
  expect(
    bnuLowerBook.units
      .flatMap((u) => u.lessons)
      .some((l) => l.id === lesson.id),
  ).toBe(true);
  expect(
    source.activities.filter((a) => a.page === 82).map((a) => a.key),
  ).toEqual([
    'compose-two-larger-triangles',
    'describe-three-people-stories-and-piece-shapes',
    'compose-and-tell-three-waiting-for-hare-patterns',
    'create-a-favourite-pattern-and-show-classmates',
  ]);
  expect(lesson.steps).toHaveLength(9);
  expect(lesson.questions).toHaveLength(35);
  expect(lesson.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
    14,
  );
  expect(
    lesson.questions.filter((q) => q.rule.kind === 'reflection'),
  ).toHaveLength(8);
  for (const suffix of [
    'actual-person-1',
    'actual-person-2',
    'actual-person-3',
    'actual-hare-1',
    'actual-hare-2',
    'actual-hare-3',
    'actual-first-triangle',
    'actual-second-triangle',
    'actual-create',
    'actual-show',
    'actual-people-exchange',
  ]) {
    expect(question(suffix).rule.kind).toBe('manual');
    expect(evaluate(question(suffix).rule, 'confirmed')).toBeNull();
  }
  for (const suffix of [
    'person-record-1',
    'person-record-2',
    'person-record-3',
    'hare-record',
    'creation-record',
    'plan',
  ]) {
    expect(question(suffix).rule.kind).toBe('reflection');
    expect(evaluate(question(suffix).rule, '自己的另一种合理讲法')).toBeNull();
  }
  expect(lesson.parentTip).toContain('足球只是');
  expect(lesson.parentTip).toContain('唯一答案');
  expect(lesson.steps[7]?.text).toContain('原题没有强制每个图案全部用七片');
  expect(lesson.steps[8]?.text).toContain('拼好了与展示过是两件事');
  for (const q of [...lesson.questions, ...required(lesson.reviewQuestions)]) {
    const rule = q.rule;
    if (rule.kind === 'choice')
      expect(q.choices?.some((c) => c.id === rule.value)).toBe(true);
  }
});
it('binds objective counts to complete selected diagrams and retains zero, retry, manual skips and old snapshots through schema 1', () => {
  for (const [suffix, ids] of [
    ['first-pieces', [1, 2]],
    ['second-pieces', [4, 6]],
  ] as const) {
    const q = question(suffix);
    if (q.visual?.kind !== 'bnu-tangram')
      throw new Error('Missing complete selected diagram');
    const pieces = bnuTangramPieces(q.visual);
    expect(pieces.map((p) => p.id)).toEqual(ids);
    expect(evaluate(q.rule, pieces.length)).toBe(true);
  }
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
  const session = createSession(ready, bnuLowerBook.id, 'child', {
    seed: 2,
    now,
  });
  const i = session.questions.findIndex((q) => q.id.endsWith('-first-pieces'));
  const q = required(session.questions[i]);
  let response = required(session.responses[i]);
  response.draft = 1;
  response = submitResponse(q, response, now);
  response.draft = 2;
  session.responses[i] = submitResponse(q, response, now);
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
    restored.sessions[1]?.responses.filter((r) => r.submissions.length > 0),
  ).toHaveLength(1);
  expect(
    restored.sessions[1]?.responses.find((r) =>
      r.questionId.endsWith('-site-zero'),
    )?.draft,
  ).toBe(0);
});
it('offers six new review conditions, keeps all correct choices present and does not replay seen reviews', () => {
  const session = createSession(ready, bnuLowerBook.id, 'child', {
    seed: 3,
    now,
  });
  const i = session.questions.findIndex((q) => q.id.endsWith('-first-pieces'));
  const response = required(session.responses[i]);
  response.draft = 1;
  session.responses[i] = submitResponse(
    required(session.questions[i]),
    response,
    now,
  );
  const reviews = newReviewQuestions(ready, session, [session]);
  expect(reviews).toHaveLength(6);
  const values = [
    1,
    0,
    '三角形',
    '不必，核对实际外轮廓和材料',
    '说明是自己的想象续编',
    '未来计划，未当已经修改',
  ];
  reviews.forEach((q, i) =>
    expect(evaluate(q.rule, required(values[i]))).toBe(true),
  );
  expect(
    reviews.every(
      (q) =>
        !lesson.questions.some(
          (main) => main.id === q.id || main.prompt === q.prompt,
        ),
    ),
  ).toBe(true);
  expect(
    newReviewQuestions(ready, session, [
      session,
      { ...session, id: 'seen-practice-review', questions: reviews },
    ]),
  ).toHaveLength(0);
  expect(new Set([...lesson.questions, ...reviews].map((q) => q.id)).size).toBe(
    41,
  );
});
