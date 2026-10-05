import type { Answer } from '../learning/types';

import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { required } from '../learning/required';
import { newReviewQuestions } from '../learning/review';
import {
  bnuLowerFinalPracticeLesson as lesson,
  bnuLowerFinalPracticeMapping as mapping,
} from './bnu-lower-final-practice';
import { bnuLowerFinalSource as source } from './bnu-lower-final-source';
import { mathBooks } from './math';

const now = '2026-10-06T10:00:00.000Z';
it('covers every original practice activity, all nine blanks, all three life expressions and every actual cooperation stage', () => {
  expect(mapping.map((m) => [m.page, m.sourceActivity])).toEqual(
    source.activities.filter((a) => a.page === 95).map((a) => [a.page, a.key]),
  );
  expect(lesson.steps).toHaveLength(11);
  expect(
    lesson.questions.filter(
      (q) => !['manual', 'reflection'].includes(q.rule.kind),
    ),
  ).toHaveLength(16);
  expect(lesson.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
    13,
  );
  expect(
    lesson.questions.filter((q) => q.rule.kind === 'reflection'),
  ).toHaveLength(6);
  expect(
    new Set(
      mapping.flatMap((m) => [...m.objective, ...m.manual, ...m.records]),
    ),
  ).toEqual(
    new Set(lesson.questions.map((q) => q.id.slice(lesson.id.length + 1))),
  );
  for (const m of mapping) {
    for (const step of m.steps) expect(lesson.steps[step - 1]).toBeDefined();
    for (const [keys, kind] of [
      [m.manual, 'manual'],
      [m.records, 'reflection'],
    ] as const)
      for (const key of keys)
        expect(
          lesson.questions.find((q) => q.id.endsWith(`-${key}`))?.rule.kind,
        ).toBe(kind);
  }
  for (const q of lesson.questions.filter((q) =>
    ['manual', 'reflection'].includes(q.rule.kind),
  ))
    expect(
      evaluate(
        q.rule,
        q.rule.kind === 'manual' ? 'confirmed' : '尚未合作，计划另列',
      ),
    ).toBeNull();
});
it('independently checks all main and changed-review answers, including every continuation slot and zero', () => {
  const main: [string, Answer][] = [
    ['faces-1', 'happy'],
    ['faces-2', 'happy'],
    ['faces-3', 'sad'],
    ['cups-1', 'right'],
    ['cups-2', 'left'],
    ['cups-3', 'right'],
    ['divisions-1', 'horizontal'],
    ['divisions-2', 'vertical'],
    ['divisions-3', 'horizontal'],
    ['faces-unit', 3],
    ['cups-unit', 2],
    ['divisions-unit', 2],
    ['site-zero', 0],
    ['expression', 'clear'],
    ['cooperation', 'clear'],
    ['story-order', 'clear'],
  ];
  const review: [string, Answer][] = [
    ['review-faces-1', 'sad'],
    ['review-faces-2', 'happy'],
    ['review-faces-3', 'happy'],
    ['review-cups-1', 'left'],
    ['review-cups-2', 'right'],
    ['review-cups-3', 'left'],
    ['review-divisions-1', 'vertical'],
    ['review-divisions-2', 'horizontal'],
    ['review-divisions-3', 'vertical'],
    ['review-cooperation', 'clear'],
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
    ['faces-2', 'sad'],
    ['cups-2', 'right'],
    ['divisions-2', 'horizontal'],
    ['faces-unit', 2],
    ['site-zero', 1],
    ['cooperation', 'other'],
  ] as [string, Answer][])
    expect(
      evaluate(
        required(lesson.questions.find((q) => q.id.endsWith(`-${key}`))).rule,
        wrong,
      ),
    ).toBe(false);
});
it('retains zero drafts, retry histories, old PEP snapshots and schema1 while rejecting injected continuation answers', () => {
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
  const i = s.questions.findIndex((q) => q.id.endsWith('-cups-unit'));
  let response = required(s.responses[i]);
  response.draft = 3;
  response = submitResponse(required(s.questions[i]), response, now);
  response.draft = 2;
  s.responses[i] = submitResponse(required(s.questions[i]), response, now);
  required(s.responses.find((r) => r.questionId.endsWith('-site-zero'))).draft =
    0;
  const questions = newReviewQuestions(lesson, s, [s]);
  expect(questions).toHaveLength(10);
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
    { answer: 'happy' },
    { cells: [] },
    { scene: 'wall' },
    { slots: 4 },
  ]) {
    const bad = JSON.parse(raw);
    Object.assign(
      bad.data.sessions[1].questions.find((q: { id: string }) =>
        q.id.endsWith('-faces-1'),
      ).visual,
      extra,
    );
    expect(() => parseBackup(JSON.stringify(bad))).toThrow(
      'educationLearning.invalidBackup',
    );
  }
});
