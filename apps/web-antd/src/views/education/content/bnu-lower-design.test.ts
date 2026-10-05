import type { Lesson } from '../learning/types';

import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { isBnuPatternDesignVisual } from '../learning/bnu-pattern-design';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { required } from '../learning/required';
import { newReviewQuestions } from '../learning/review';
import { bnuLowerBook } from './bnu-lower';
import { bnuLowerDesignLesson as lesson } from './bnu-lower-design';
import { bnuLowerDesignChallengeSource as source } from './bnu-lower-design-challenge-source';
import { bnuLowerUnitSixAudit as audit } from './bnu-lower-unit-six-audit';
import { mathBooks } from './math';
const now = '2026-10-06T08:00:00.000Z';
const ready: Lesson = { ...lesson, status: 'available' };
it('covers all three original activities, all four coloring regions and independent real design and explanation without requiring unfamiliar names', () => {
  expect(lesson.page).toBe(84);
  expect(lesson.steps).toHaveLength(9);
  expect(source.activities.filter((a) => a.page === 84)).toHaveLength(3);
  expect(lesson.questions).toHaveLength(25);
  expect(lesson.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
    8,
  );
  expect(
    lesson.questions.filter((q) => q.rule.kind === 'reflection'),
  ).toHaveLength(4);
  expect(lesson.parentTip).toContain('不要求先背名称');
  expect(lesson.parentTip).toContain('如实记待合作');
  for (let i = 1; i <= 4; i++)
    expect(
      lesson.questions.find((q) => q.id.endsWith(`actual-color-${i}`))?.rule
        .kind,
    ).toBe('manual');
  for (const q of [...lesson.questions, ...(lesson.reviewQuestions ?? [])]) {
    if (q.visual) expect(isBnuPatternDesignVisual(q.visual)).toBe(true);
    const rule = q.rule;
    if (rule.kind === 'choice')
      expect(q.choices?.some((c) => c.id === rule.value)).toBe(true);
    if (q.rule.kind === 'reflection')
      expect(evaluate(q.rule, '尚未实际完成')).toBeNull();
  }
});
it('preserves strict schema1, zero drafts, wrong-then-correct history and existing PEP records while rejecting injected answers', () => {
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
    { now, seed: 1 },
  );
  const snapshot = JSON.parse(JSON.stringify(old));
  const session = createSession(ready, bnuLowerBook.id, 'child', {
    now,
    seed: 2,
  });
  const i = session.questions.findIndex((q) => q.id.endsWith('-windmill-four'));
  const q = required(session.questions[i]);
  let r = required(session.responses[i]);
  r.draft = 3;
  r = submitResponse(q, r, now);
  r.draft = 4;
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
  const result = parseBackup(exportBackup(data, now)).data;
  expect(result).toEqual(JSON.parse(JSON.stringify(data)));
  expect(result.sessions[0]).toEqual(snapshot);
  expect(
    result.sessions[1]?.responses[i]?.submissions.map((s) => s.correct),
  ).toEqual([false, true]);
  const bad = JSON.parse(exportBackup(data, now));
  bad.data.sessions[1].questions.find((q: { id: string }) =>
    q.id.endsWith('-site-zero'),
  ).visual.answer = 0;
  expect(() => parseBackup(JSON.stringify(bad))).toThrow(
    'educationLearning.invalidBackup',
  );
});
it('offers six independently changed reviews including a three-region division and five-row grid, without replaying seen reviews', () => {
  const session = createSession(ready, bnuLowerBook.id, 'child', {
    seed: 3,
    now,
  });
  const i = session.questions.findIndex((q) => q.id.endsWith('-windmill-four'));
  const r = required(session.responses[i]);
  r.draft = 3;
  session.responses[i] = submitResponse(required(session.questions[i]), r, now);
  const reviews = newReviewQuestions(ready, session, [session]);
  expect(reviews).toHaveLength(6);
  const values = ['C和D', 3, 5, 'C和D', 0, '只确认上左，其余待做'];
  reviews.forEach((q, i) =>
    expect(evaluate(q.rule, required(values[i]))).toBe(true),
  );
  expect(
    newReviewQuestions(ready, session, [
      session,
      { ...session, id: 'seen-design', questions: reviews },
    ]),
  ).toHaveLength(0);
  expect(new Set([...lesson.questions, ...reviews].map((q) => q.id)).size).toBe(
    31,
  );
});

it('maps the three original page84 activities to every main task and leaves only pages85–86 of this unit pending', () => {
  const rows = audit.activities.filter((a) => a.lesson === lesson.id);
  expect(rows.map((a) => [a.page, a.sourceActivity])).toEqual(
    source.activities.filter((a) => a.page === 84).map((a) => [a.page, a.key]),
  );
  const mapped = new Set(
    rows.flatMap((a) => [...a.objective, ...a.manual, ...a.records]),
  );
  expect(mapped.size).toBe(25);
  expect(
    new Set(lesson.questions.map((q) => q.id.slice(lesson.id.length + 1))),
  ).toEqual(mapped);
  for (const a of rows) {
    for (const step of a.steps) expect(lesson.steps[step - 1]).toBeDefined();
    for (const suffix of a.manual)
      expect(
        lesson.questions.find((q) => q.id.endsWith(`-${suffix}`))?.rule.kind,
      ).toBe('manual');
    for (const suffix of a.records)
      expect(
        lesson.questions.find((q) => q.id.endsWith(`-${suffix}`))?.rule.kind,
      ).toBe('reflection');
  }
  expect(audit.pendingPrintedPages).toEqual([85, 86]);
  expect(
    bnuLowerBook.units.flatMap((u) => u.lessons).find((l) => l.id === lesson.id)
      ?.status,
  ).toBe('available');
});
