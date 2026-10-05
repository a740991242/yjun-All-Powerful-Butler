import type { Lesson } from '../learning/types';

import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { bnuTangramPieces, isBnuTangramVisual } from '../learning/bnu-tangram';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { required } from '../learning/required';
import { newReviewQuestions } from '../learning/review';
import { bnuLowerBook } from './bnu-lower';
import { bnuLowerDesignChallengeSource as source } from './bnu-lower-design-challenge-source';
import {
  bnuLowerSquareChallengeLesson as lesson,
  bnuLowerSquareChallengeMapping as mapping,
} from './bnu-lower-square-challenge';
import { mathBooks } from './math';
const ready: Lesson = { ...lesson, status: 'available' };
const now = '2026-10-06T09:00:00.000Z';
it('maps all seven original activities to all31 main tasks with independent two sizes, both four-piece methods, actual overlay and real exchange', () => {
  expect(lesson.steps).toHaveLength(12);
  expect(lesson.questions).toHaveLength(31);
  expect(lesson.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
    10,
  );
  expect(
    lesson.questions.filter((q) => q.rule.kind === 'reflection'),
  ).toHaveLength(6);
  expect(mapping.map((m) => [m.page, m.sourceActivity])).toEqual(
    source.activities.filter((a) => a.page >= 85).map((a) => [a.page, a.key]),
  );
  const main = new Map(
    lesson.questions.map((q) => [q.id.slice(lesson.id.length + 1), q]),
  );
  const mapped = new Set(
    mapping.flatMap((m) => [...m.objective, ...m.manual, ...m.records]),
  );
  expect(mapped).toEqual(new Set(main.keys()));
  for (const m of mapping) {
    for (const step of m.steps) expect(lesson.steps[step - 1]).toBeDefined();
    for (const key of m.manual) expect(main.get(key)?.rule.kind).toBe('manual');
    for (const key of m.records)
      expect(main.get(key)?.rule.kind).toBe('reflection');
    for (const key of m.objective)
      expect(['number', 'choice']).toContain(main.get(key)?.rule.kind);
  }
  for (const q of [...lesson.questions, ...(lesson.reviewQuestions ?? [])]) {
    const r = q.rule;
    if (q.visual) expect(isBnuTangramVisual(q.visual)).toBe(true);
    if (r.kind === 'choice')
      expect(q.choices?.some((c) => c.id === r.value)).toBe(true);
    if (r.kind === 'reflection') expect(evaluate(r, '未实际做')).toBeNull();
  }
  expect(lesson.parentTip).toContain('不推本页已经证明5/6片');
  expect(lesson.steps[8]?.text).toContain('不是只把新片塞');
});
it('keeps page80 geometry IDs, all five selected-piece inventories and the full boundary distinct from material classifications', () => {
  const expected = [
    ['square-two-large', [1, 2]],
    ['square-two-small', [4, 6]],
    ['square-three', [7, 4, 6]],
    ['square-four-square', [1, 5, 4, 6]],
    ['square-four-triangle', [1, 7, 4, 6]],
  ] as const;
  for (const [scene, ids] of expected) {
    expect(
      lesson.steps.some(
        (s) => s.visual?.kind === 'bnu-tangram' && s.visual.scene === scene,
      ),
    ).toBe(true);
    expect(
      bnuTangramPieces({ kind: 'bnu-tangram', scene, variant: 'main' }).map(
        (p) => p.id,
      ),
    ).toEqual(ids);
  }
  expect(lesson.status).toBe('available');
  expect(
    bnuLowerBook.units
      .flatMap((u) => u.lessons)
      .some((l) => l.id === lesson.id),
  ).toBe(true);
});
it('round-trips schema1, zero drafts, wrong-then-correct submissions and existing PEP questions while refusing arbitrary piece and answer fields', () => {
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
  const snapshot = JSON.parse(JSON.stringify(old));
  const session = createSession(ready, bnuLowerBook.id, 'child', {
    seed: 2,
    now,
  });
  const i = session.questions.findIndex((q) => q.id.endsWith('-seven-count'));
  const q = required(session.questions[i]);
  let r = required(session.responses[i]);
  r.draft = 3;
  r = submitResponse(q, r, now);
  r.draft = 7;
  session.responses[i] = submitResponse(q, r, now);
  required(
    session.responses.find((r) => r.questionId.endsWith('-site-zero')),
  ).draft = 0;
  const data = {
    schemaVersion: 1 as const,
    profiles: [{ id: 'child', nickname: '验证', createdAt: now }],
    activeProfileId: 'child',
    sessions: [old, session],
  };
  const raw = exportBackup(data, now);
  const result = parseBackup(raw).data;
  expect(result).toEqual(JSON.parse(JSON.stringify(data)));
  expect(result.sessions[0]).toEqual(snapshot);
  expect(
    result.sessions[1]?.responses[i]?.submissions.map((s) => s.correct),
  ).toEqual([false, true]);
  for (const extra of [{ answer: 7 }, { pieces: [] }, { scene: 'unknown' }]) {
    const bad = JSON.parse(raw);
    Object.assign(bad.data.sessions[1].questions[i].visual, extra);
    expect(() => parseBackup(JSON.stringify(bad))).toThrow(
      'educationLearning.invalidBackup',
    );
  }
});
it('uses seven changed review conditions rather than repeating main material counts and never replays seen reviews', () => {
  const session = createSession(ready, bnuLowerBook.id, 'child', {
    seed: 3,
    now,
  });
  const i = session.questions.findIndex((q) => q.id.endsWith('-seven-count'));
  const r = required(session.responses[i]);
  r.draft = 3;
  session.responses[i] = submitResponse(required(session.questions[i]), r, now);
  const reviews = newReviewQuestions(ready, session, [session]);
  expect(reviews).toHaveLength(7);
  const values = [
    1,
    3,
    1,
    0,
    '不能，当前没有5，需要按当前材料重摆',
    '两片如实确认，三片四片待做',
    '不能，保留为未来研究问题',
  ];
  reviews.forEach((q, i) =>
    expect(evaluate(q.rule, required(values[i]))).toBe(true),
  );
  expect(
    newReviewQuestions(ready, session, [
      session,
      { ...session, id: 'seen-square', questions: reviews },
    ]),
  ).toHaveLength(0);
  expect(new Set([...lesson.questions, ...reviews].map((q) => q.id)).size).toBe(
    38,
  );
});
