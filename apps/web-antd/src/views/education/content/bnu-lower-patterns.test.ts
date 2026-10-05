import type { Lesson } from '../learning/types';

import { expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, evaluate, submitResponse } from '../learning/engine';
import { isPlaneCardsVisual } from '../learning/plane-cards';
import { required } from '../learning/required';
import { newReviewQuestions } from '../learning/review';
import { bnuLowerBook } from './bnu-lower';
import { bnuLowerPatternsLesson as lesson } from './bnu-lower-patterns';
import { bnuLowerPatternsSource as source } from './bnu-lower-patterns-source';
import { bnuLowerUnitSixAudit as audit } from './bnu-lower-unit-six-audit';
import { mathBooks } from './math';

const now = '2026-10-06T04:00:00.000Z';
const ready: Lesson = { ...lesson, status: 'available' };
const question = (suffix: string) =>
  required(lesson.questions.find((q) => q.id === `${lesson.id}-${suffix}`));

it('maps both original activities to all objective tasks, seven required real actions and four records while keeping extra exercises optional', () => {
  const activities = audit.activities.filter(
    (activity) => activity.lesson === lesson.id,
  );
  expect(
    activities.map((activity) => [activity.page, activity.sourceActivity]),
  ).toEqual(source.activities.map((activity) => [activity.page, activity.key]));
  const kinds = new Map(
    lesson.questions.map((q) => [
      q.id.slice(lesson.id.length + 1),
      q.rule.kind,
    ]),
  );
  for (const activity of activities) {
    for (const step of activity.steps)
      expect(lesson.steps[step - 1]).toBeDefined();
    for (const suffix of activity.objective)
      expect(['number', 'choice']).toContain(kinds.get(suffix));
    for (const suffix of activity.manual)
      expect(kinds.get(suffix)).toBe('manual');
    for (const suffix of activity.records)
      expect(kinds.get(suffix)).toBe('reflection');
  }
  expect(
    new Set(activities.flatMap((activity) => activity.objective)).size,
  ).toBe(15);
  expect(new Set(activities.flatMap((activity) => activity.manual)).size).toBe(
    7,
  );
  expect(new Set(activities.flatMap((activity) => activity.records)).size).toBe(
    4,
  );
  expect(
    activities
      .flatMap((activity) => activity.manual)
      .some((suffix) => suffix.startsWith('optional-')),
  ).toBe(false);
  expect(audit.pendingPrintedPages).toEqual([84, 85, 86]);
  expect(audit.status).toBe('partial-original-teaching');
});
it('covers all four source patterns and independent selected-part tracing and drawing without inventing whole-artwork requirements', () => {
  expect(lesson.page).toBe(83);
  expect(lesson.status).toBe('available');
  expect(
    bnuLowerBook.units
      .flatMap((u) => u.lessons)
      .some((l) => l.id === lesson.id),
  ).toBe(true);
  expect(source.activities).toHaveLength(2);
  expect(lesson.steps).toHaveLength(9);
  expect(lesson.questions).toHaveLength(28);
  expect(lesson.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
    9,
  );
  expect(
    lesson.questions.filter((q) => q.rule.kind === 'reflection'),
  ).toHaveLength(4);
  source.patterns.forEach((pattern, i) => {
    const q = question(`actual-pattern-${i + 1}`);
    expect(q.prompt).toContain(pattern.title);
    expect(q.rule.kind).toBe('manual');
    expect(evaluate(q.rule, 'confirmed')).toBeNull();
  });
  for (const suffix of ['actual-select', 'actual-trace', 'actual-draw'])
    expect(question(suffix).rule.kind).toBe('manual');
  for (const suffix of ['optional-straight', 'optional-curve'])
    expect(question(suffix).prompt).toContain('本站可选');
  expect(lesson.parentTip).toContain('不能证明这些卡可拼原风车');
  expect(lesson.parentTip).toContain('不强制四幅整图全描');
  expect(lesson.steps[5]?.text).toContain('没有给唯一总数');
  for (const q of [...lesson.questions, ...required(lesson.reviewQuestions)]) {
    const rule = q.rule;
    if (rule.kind === 'choice')
      expect(q.choices?.some((choice) => choice.id === rule.value)).toBe(true);
    if (q.visual?.kind === 'plane-cards')
      expect(isPlaneCardsVisual(q.visual)).toBe(true);
    if (rule.kind === 'reflection')
      expect(evaluate(rule, '未做或另一种真实发现')).toBeNull();
  }
});
it('derives full material counts from the supplied cards while preserving the old ten-card contract and backup schema', () => {
  const full = required(question('site-total').visual);
  if (full.kind !== 'plane-cards')
    throw new Error('Missing full card inventory');
  expect(full.cards.filter((card) => card.size === 2)).toHaveLength(
    source.appreciate.windmillDialogue.largeTriangles,
  );
  expect(full.cards.filter((card) => card.size === 1)).toHaveLength(
    source.appreciate.windmillDialogue.smallTriangles,
  );
  expect(evaluate(question('site-total').rule, full.cards.length)).toBe(true);
  expect(
    evaluate(
      question('site-zero').rule,
      full.cards.filter((card) => card.shape === 'circle').length,
    ),
  ).toBe(true);
  expect(
    isPlaneCardsVisual({
      kind: 'plane-cards',
      cards: Array.from({ length: 11 }, () => ({
        shape: 'triangle',
        size: 2,
        turn: 0,
      })),
    }),
  ).toBe(false);
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
  const i = session.questions.findIndex((q) => q.id.endsWith('-source-total'));
  const q = required(session.questions[i]);
  let response = required(session.responses[i]);
  response.draft = 4;
  response = submitResponse(q, response, now);
  response.draft = 8;
  session.responses[i] = submitResponse(q, response, now);
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
  const bad = JSON.parse(exportBackup(data, now));
  const item = bad.data.sessions[1].questions.find((item: { id: string }) =>
    item.id.endsWith('-site-total'),
  );
  item.visual.cards[0].answer = 8;
  expect(() => parseBackup(JSON.stringify(bad))).toThrow(
    'educationLearning.invalidBackup',
  );
});
it('uses six new review conditions with a complete two-big-four-small subset instead of copying eight-card answers', () => {
  const session = createSession(ready, bnuLowerBook.id, 'child', {
    seed: 3,
    now,
  });
  const i = session.questions.findIndex((q) => q.id.endsWith('-source-total'));
  const response = required(session.responses[i]);
  response.draft = 4;
  session.responses[i] = submitResponse(
    required(session.questions[i]),
    response,
    now,
  );
  const reviews = newReviewQuestions(ready, session, [session]);
  expect(reviews).toHaveLength(6);
  const values = [6, 2, 4, 0, '不会，朝向与类别分清', '不能，另外三图如实待做'];
  reviews.forEach((q, i) =>
    expect(evaluate(q.rule, required(values[i]))).toBe(true),
  );
  for (const q of reviews.filter((q) => q.visual?.kind === 'plane-cards')) {
    if (q.visual?.kind !== 'plane-cards')
      throw new Error('Missing changed inventory');
    expect(q.visual.cards).toHaveLength(6);
    expect(q.visual.cards.filter((card) => card.size === 2)).toHaveLength(2);
    expect(q.visual.cards.filter((card) => card.size === 1)).toHaveLength(4);
  }
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
      { ...session, id: 'seen-patterns-reviews', questions: reviews },
    ]),
  ).toHaveLength(0);
  expect(new Set([...lesson.questions, ...reviews].map((q) => q.id)).size).toBe(
    34,
  );
});
