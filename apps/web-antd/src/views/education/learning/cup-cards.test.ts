import { expect, it } from 'vitest';

import { sujiaoCupClassificationDraft as lesson } from '../content/sujiao-cup-classification';
import { exportBackup, parseBackup } from './backup';
import { cupCards, cupModel, isCupCardsVisual } from './cup-cards';
import { createSession, evaluate, submitResponse } from './engine';
import { initialLibrary } from './storage';
it('accepts only fixed original variants and rejects arbitrary cups and answer fields', () => {
  for (const review of [false, true])
    expect(isCupCardsVisual(cupModel(review))).toBe(true);
  for (const value of [
    null,
    [],
    { kind: 'cup-cards', variant: ['main'] },
    { kind: 'cup-cards', variant: 'unknown' },
    { ...cupModel(false), answer: 8 },
    { ...cupModel(false), cards: cupCards(false) },
  ])
    expect(isCupCardsVisual(value)).toBe(false);
});
it('separates body, handles and colour with independent distributions and changes actual review maxima', () => {
  const main = cupCards(false);
  const review = cupCards(true);
  expect(main.filter((c) => c.body === 'straight').map((c) => c.id)).toEqual([
    'A',
    'C',
    'D',
    'G',
  ]);
  expect(main.filter((c) => c.handle).map((c) => c.id)).toEqual([
    'A',
    'B',
    'D',
    'E',
    'G',
  ]);
  expect(main.filter((c) => c.color === 'red').map((c) => c.id)).toEqual([
    'A',
    'E',
    'H',
  ]);
  expect(review.filter((c) => c.body === 'straight').map((c) => c.id)).toEqual([
    'A',
    'B',
    'C',
    'E',
    'F',
  ]);
  expect(review.filter((c) => c.handle).map((c) => c.id)).toEqual([
    'B',
    'C',
    'F',
    'H',
  ]);
  expect(review.filter((c) => c.color === 'yellow').map((c) => c.id)).toEqual([
    'B',
    'D',
    'F',
    'H',
  ]);
  for (const cards of [main, review])
    for (const body of ['straight', 'tapered']) {
      expect(cards.some((c) => c.body === body && c.handle)).toBe(true);
      expect(cards.some((c) => c.body === body && !c.handle)).toBe(true);
    }
  const most = lesson.questions.find((q) => q.id.endsWith('-q-body-most'))!;
  expect(most.rule).toEqual({ kind: 'set', values: ['straight', 'tapered'] });
  expect(evaluate(most.rule, ['straight'])).toBe(false);
  expect(
    lesson.reviewQuestions!.find((q) => q.id.endsWith('-r-body-most'))!.rule,
  ).toEqual({ kind: 'set', values: ['straight'] });
  expect(
    lesson.questions.find((q) => q.id.endsWith('-q-color-most'))!.rule,
  ).toEqual({ kind: 'set', values: ['red', 'blue'] });
  expect(
    lesson.reviewQuestions!.find((q) => q.id.endsWith('-r-handle-most'))!.rule,
  ).toEqual({ kind: 'set', values: ['with', 'without'] });
  expect(lesson.questions).toHaveLength(26);
  expect(lesson.reviewQuestions).toHaveLength(21);
  for (const q of lesson.reviewQuestions!) {
    const original = lesson.questions.find((o) => o.knowledge === q.knowledge)!;
    expect(original).toBeDefined();
    expect(JSON.stringify([q.prompt, q.visual, q.choices])).not.toBe(
      JSON.stringify([original.prompt, original.visual, original.choices]),
    );
  }
});
it('retains missed tied body classes before correction and strict original cards through backups', () => {
  const library = initialLibrary('杯子分类');
  const session = createSession(
    lesson,
    'sujiao-math-p1-lower-9787574312951',
    library.activeProfileId,
  );
  const index = session.questions.findIndex((q) =>
    q.id.endsWith('-q-body-most'),
  );
  for (const draft of [['straight'], ['straight', 'tapered']]) {
    session.responses[index]!.draft = draft;
    session.responses[index] = submitResponse(
      session.questions[index]!,
      session.responses[index]!,
    );
  }
  expect(session.responses[index]!.submissions.map((a) => a.correct)).toEqual([
    false,
    true,
  ]);
  library.sessions.push(session);
  expect(parseBackup(exportBackup(library)).data.sessions[0]).toEqual(session);
  const bad = structuredClone(library);
  const q = bad.sessions[0]!.questions.find(
    (q) => q.visual?.kind === 'cup-cards',
  )!;
  if (q.visual?.kind !== 'cup-cards') throw new Error('missing cup cards');
  Object.assign(q.visual, { answer: 8 });
  expect(() => parseBackup(exportBackup(bad))).toThrow(Error);
});
