import { expect, it } from 'vitest';

import { sujiaoNatureClassificationDraft as lesson } from '../content/sujiao-nature-classification';
import { exportBackup, parseBackup } from './backup';
import { createSession, evaluate, submitResponse } from './engine';
import {
  isNatureCardsVisual,
  leafCards,
  natureModel,
  plantCards,
} from './nature-cards';
import { initialLibrary } from './storage';
it('accepts only the fixed original decks and variants without embedded answers', () => {
  for (const deck of ['plants', 'leaves'] as const)
    for (const review of [false, true])
      expect(isNatureCardsVisual(natureModel(deck, review))).toBe(true);
  for (const model of [
    null,
    [],
    { kind: 'nature-cards', deck: ['plants'], variant: 'main' },
    { kind: 'nature-cards', deck: 'leaves', variant: ['review'] },
    { kind: 'nature-cards', deck: 'flowers', variant: 'main' },
    { ...natureModel('leaves', false), answer: 3 },
    { ...natureModel('leaves', false), cards: [] },
  ])
    expect(isNatureCardsVisual(model)).toBe(false);
});
it('counts cards rather than kinds and changes original category quantities and tied maxima in review', () => {
  expect(
    plantCards(false)
      .filter((c) => ['flower', 'tree'].includes(c.object))
      .map((c) => c.id),
  ).toEqual(['A', 'C', 'E', 'F', 'H']);
  expect(
    plantCards(true)
      .filter((c) => ['flower', 'tree'].includes(c.object))
      .map((c) => c.id),
  ).toEqual(['B', 'D', 'F', 'H']);
  const main = leafCards(false);
  const review = leafCards(true);
  expect(
    ['long', 'fan', 'lobed'].map(
      (shape) => main.filter((c) => c.shape === shape).length,
    ),
  ).toEqual([3, 2, 3]);
  expect(
    ['long', 'fan', 'lobed'].map(
      (shape) => review.filter((c) => c.shape === shape).length,
    ),
  ).toEqual([2, 4, 2]);
  expect(
    ['red', 'green', 'yellow'].map(
      (color) => main.filter((c) => c.color === color).length,
    ),
  ).toEqual([4, 2, 2]);
  expect(
    ['red', 'green', 'yellow'].map(
      (color) => review.filter((c) => c.color === color).length,
    ),
  ).toEqual([1, 3, 4]);
  const most = lesson.questions.find((q) => q.id.endsWith('-q-shape-most'))!;
  expect(most.rule).toEqual({ kind: 'set', values: ['long', 'lobed'] });
  expect(evaluate(most.rule, ['long'])).toBe(false);
  expect(evaluate(most.rule, ['long', 'lobed', 'fan'])).toBe(false);
  expect(
    lesson.reviewQuestions!.find((q) => q.id.endsWith('-r-plants-most'))!.rule,
  ).toEqual({ kind: 'set', values: ['plant', 'animal'] });
  expect(lesson.questions).toHaveLength(27);
  expect(lesson.reviewQuestions).toHaveLength(22);
  for (const q of lesson.reviewQuestions!) {
    const original = lesson.questions.find((o) => o.knowledge === q.knowledge)!;
    expect(original).toBeDefined();
    expect(JSON.stringify([q.visual, q.prompt, q.choices])).not.toBe(
      JSON.stringify([original.visual, original.prompt, original.choices]),
    );
  }
});
it('preserves missed tied maxima and original models through backup and refresh snapshots', () => {
  const library = initialLibrary('植物与树叶');
  const session = createSession(
    lesson,
    'sujiao-math-p1-lower-9787574312951',
    library.activeProfileId,
  );
  const index = session.questions.findIndex((q) =>
    q.id.endsWith('-q-shape-most'),
  );
  for (const draft of [['long'], ['long', 'lobed']]) {
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
    (q) => q.visual?.kind === 'nature-cards',
  )!;
  if (q.visual?.kind !== 'nature-cards') throw new Error('missing visual');
  Object.assign(q.visual, { answer: 8 });
  expect(() => parseBackup(exportBackup(bad))).toThrow(Error);
});
