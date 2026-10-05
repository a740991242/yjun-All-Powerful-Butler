import type { Answer } from '../learning/types';

import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { required } from '../learning/required';
import { newReviewQuestions } from '../learning/review';
import {
  bnuLowerFinalGeometryLesson as lesson,
  bnuLowerFinalGeometryMapping as mapping,
} from './bnu-lower-final-geometry';
import { bnuLowerFinalSource as source } from './bnu-lower-final-source';
import { mathBooks } from './math';
const now = '2026-10-06T10:00:00.000Z';
it('maps all seven original93–94 activities and all forty tasks without treating source collages as solved', () => {
  expect(mapping.map((m) => [m.page, m.sourceActivity])).toEqual(
    source.activities
      .filter((a) => a.page === 93 || a.page === 94)
      .map((a) => [a.page, a.key]),
  );
  expect(lesson.steps).toHaveLength(15);
  expect(
    lesson.questions.filter(
      (q) => !['manual', 'reflection'].includes(q.rule.kind),
    ),
  ).toHaveLength(18);
  expect(lesson.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
    17,
  );
  expect(
    lesson.questions.filter((q) => q.rule.kind === 'reflection'),
  ).toHaveLength(5);
  const keys = new Set(
    lesson.questions.map((q) => q.id.slice(lesson.id.length + 1)),
  );
  expect(
    new Set(
      mapping.flatMap((m) => [...m.objective, ...m.manual, ...m.records]),
    ),
  ).toEqual(keys);
  for (const m of mapping) {
    for (const step of m.steps) expect(lesson.steps[step - 1]).toBeDefined();
    for (const key of m.manual)
      expect(
        lesson.questions.find((q) => q.id.endsWith(`-${key}`))?.rule.kind,
      ).toBe('manual');
    for (const key of m.records)
      expect(
        lesson.questions.find((q) => q.id.endsWith(`-${key}`))?.rule.kind,
      ).toBe('reflection');
  }
  expect(source.geometry.collageCounts).toBeNull();
  for (const q of lesson.questions.filter((q) =>
    ['manual', 'reflection'].includes(q.rule.kind),
  ))
    expect(
      evaluate(q.rule, q.rule.kind === 'manual' ? 'confirmed' : '待做/待核对'),
    ).toBeNull();
});
it('independently verifies every objective and every changed review scope, including rotated shapes and zero', () => {
  const main: [string, Answer][] = [
    ['plane-circle', 'B'],
    ['plane-square', 'C'],
    ['plane-triangle', 'D'],
    ['plane-rectangle', 'A'],
    ['tangram-types', 'clear'],
    ['robot-counts', [15, 2, 2, 6]],
    ['train-counts', [5, 1, 1, 4]],
    ['boundaries', 'clear'],
    ['cube-face', 'square'],
    ['prism-face', 'triangle'],
    ['cuboid-face', 'rectangle'],
    ['cylinder-face', 'circle'],
    ['not-all-squares', 'clear'],
    ['diagonal-count', 2],
    ['parallel-count', 2],
    ['square-part', 'A'],
    ['dot-arrangement', [6, 11]],
    ['site-zero', 0],
  ];
  const review: [string, Answer][] = [
    ['review-square', 'B'],
    ['review-robot', [13, 2, 2, 4]],
    ['review-train', [5, 1, 0, 4]],
    ['review-diagonal', 3],
    ['review-rectangle', 'B'],
    ['review-dots', [5, 9]],
    ['review-no-square-face', 0],
    ['review-fold-done', 'clear'],
  ];
  for (const [questions, cases] of [
    [
      lesson.questions.filter(
        (q) => !['manual', 'reflection'].includes(q.rule.kind),
      ),
      main,
    ],
    [lesson.reviewQuestions ?? [], review],
  ] as const) {
    expect(questions.map((q) => q.id).toSorted()).toEqual(
      cases.map(([key]) => `${lesson.id}-${key}`).toSorted(),
    );
    for (const [key, answer] of cases)
      expect(
        evaluate(
          required(questions.find((q) => q.id.endsWith(`-${key}`))).rule,
          answer,
        ),
      ).toBe(true);
  }
  for (const [key, wrong] of [
    ['plane-square', 'A'],
    ['dot-arrangement', [11, 6]],
    ['site-zero', 1],
    ['robot-counts', [15, 2, 2, 4]],
    ['cube-face', 'rectangle'],
  ] as [string, Answer][])
    expect(
      evaluate(
        required(lesson.questions.find((q) => q.id.endsWith(`-${key}`))).rule,
        wrong,
      ),
    ).toBe(false);
});
it('preserves old snapshots, partial0, retry histories and schema1, and refuses answer/coordinate injection', () => {
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
  const s = createSession(lesson, 'bnu-math-p1-lower-2024', 'child', {
    seed: 2,
    now,
  });
  const i = s.questions.findIndex((q) => q.id.endsWith('-diagonal-count'));
  let response = required(s.responses[i]);
  response.draft = 1;
  response = submitResponse(required(s.questions[i]), response, now);
  response.draft = 2;
  s.responses[i] = submitResponse(required(s.questions[i]), response, now);
  required(s.responses.find((r) => r.questionId.endsWith('-site-zero'))).draft =
    0;
  required(
    s.responses.find((r) => r.questionId.endsWith('-train-counts')),
  ).draft = [5, null, 0, null];
  const questions = newReviewQuestions(lesson, s, [s]);
  expect(questions).toHaveLength(8);
  expect(
    newReviewQuestions(lesson, s, [s, { ...s, id: 'seen', questions }]),
  ).toHaveLength(0);
  const raw = exportBackup(
    {
      schemaVersion: 1,
      profiles: [{ id: 'child', nickname: '验证', createdAt: now }],
      activeProfileId: 'child',
      sessions: [old, s],
    },
    now,
  );
  expect(parseBackup(raw).data.sessions).toEqual(
    JSON.parse(JSON.stringify([old, s])),
  );
  for (const extra of [
    { answer: 2 },
    { parts: [] },
    { counts: [2] },
    { scene: 'unknown' },
  ]) {
    const bad = JSON.parse(raw);
    Object.assign(
      bad.data.sessions[1].questions.find((q: { id: string }) =>
        q.id.endsWith('-diagonal-count'),
      ).visual,
      extra,
    );
    expect(() => parseBackup(JSON.stringify(bad))).toThrow(
      'educationLearning.invalidBackup',
    );
  }
});
