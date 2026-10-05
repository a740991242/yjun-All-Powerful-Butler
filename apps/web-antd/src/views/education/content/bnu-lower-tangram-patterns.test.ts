import type { Lesson } from '../learning/types';

import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { bnuTangramPieces } from '../learning/bnu-tangram';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { required } from '../learning/required';
import { newReviewQuestions } from '../learning/review';
import { bnuLowerBook } from './bnu-lower';
import {
  bnuLowerTangramPatternFrames as frames,
  bnuLowerTangramPatternsLesson as lesson,
} from './bnu-lower-tangram-patterns';
import { bnuLowerTangramSource as source } from './bnu-lower-tangram-source';
import { mathBooks } from './math';

const now = '2026-10-06T04:00:00.000Z';
const ready: Lesson = { ...lesson, status: 'available' };
const question = (suffix: string) =>
  required(lesson.questions.find((q) => q.id === `${lesson.id}-${suffix}`));
it('covers every original two-row frame independently and keeps story invention, cooperation, assembly and telling distinct', () => {
  expect(lesson.page).toBe(81);
  expect(lesson.status).toBe('available');
  expect(
    bnuLowerBook.units
      .flatMap((u) => u.lessons)
      .some((l) => l.id === lesson.id),
  ).toBe(true);
  expect(source.activities.filter((a) => a.page === 81)).toHaveLength(3);
  expect(frames.map((frame) => frame.location)).toEqual([
    '上排左',
    '上排中',
    '上排右',
    '下排左',
    '下排中',
    '下排右',
  ]);
  expect(lesson.steps).toHaveLength(12);
  expect(lesson.questions).toHaveLength(31);
  expect(lesson.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
    11,
  );
  expect(
    lesson.questions.filter((q) => q.rule.kind === 'reflection'),
  ).toHaveLength(10);
  frames.forEach((frame, i) => {
    expect(lesson.steps[i + 3]?.text).toContain(frame.location);
    const manual = question(`actual-frame-${i + 1}`);
    const record = question(`frame-record-${i + 1}`);
    expect(manual.prompt).toContain(frame.location);
    expect(record.prompt).toContain(frame.location);
    expect(manual.rule.kind).toBe('manual');
    expect(record.rule.kind).toBe('reflection');
    expect(evaluate(manual.rule, 'confirmed')).toBeNull();
    expect(evaluate(record.rule, '我觉得像一种自己的作品')).toBeNull();
  });
  for (const suffix of ['invent', 'cooperate', 'assemble', 'tell'])
    expect(question(`actual-story-${suffix}`).rule.kind).toBe('manual');
  expect(lesson.parentTip).toContain('未要求每幅全用七片');
  expect(lesson.parentTip).toContain('不冒原鹅头姿势比例');
  expect(lesson.parentTip).toContain('不限定故事');
  expect(question('plan').rule.kind).toBe('reflection');
  for (const q of [...lesson.questions, ...required(lesson.reviewQuestions)]) {
    const rule = q.rule;
    if (rule.kind === 'choice')
      expect(q.choices?.some((c) => c.id === rule.value)).toBe(true);
  }
});
it('preserves part-versus-whole geometry, changed-subset answers and blank versus zero without rewriting prior PEP records', () => {
  const fish = question('fish-pieces');
  const zero = question('site-zero');
  if (
    fish.visual?.kind !== 'bnu-tangram' ||
    zero.visual?.kind !== 'bnu-tangram'
  )
    throw new Error('Missing selected subset');
  expect(bnuTangramPieces(fish.visual).map((p) => p.id)).toEqual([1, 2]);
  expect(evaluate(fish.rule, bnuTangramPieces(fish.visual).length)).toBe(true);
  expect(evaluate(zero.rule, 0)).toBe(true);
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
  const i = session.questions.findIndex((q) => q.id.endsWith('-fish-pieces'));
  const item = required(session.questions[i]);
  let response = required(session.responses[i]);
  response.draft = 1;
  response = submitResponse(item, response, now);
  response.draft = 2;
  session.responses[i] = submitResponse(item, response, now);
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
    restored.sessions[1]?.responses[i]?.submissions.map((s) => s.correct),
  ).toEqual([false, true]);
  expect(
    restored.sessions[1]?.responses.find((r) =>
      r.questionId.endsWith('-site-zero'),
    )?.draft,
  ).toBe(0);
});
it('adds six genuinely changed review tasks and never substitutes a fixed story or figure name', () => {
  const session = createSession(ready, bnuLowerBook.id, 'child', {
    seed: 3,
    now,
  });
  const i = session.questions.findIndex((q) => q.id.endsWith('-fish-pieces'));
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
    '三幅已试，下排三幅待做',
    '不需要，保留合理表达',
    '未来计划，未记已合作拼好',
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
      { ...session, id: 'seen-pattern-reviews', questions: reviews },
    ]),
  ).toHaveLength(0);
  expect(new Set([...lesson.questions, ...reviews].map((q) => q.id)).size).toBe(
    37,
  );
});
