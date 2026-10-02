import { expect, it } from 'vitest';

import {
  blockModel,
  sujiaoClassificationApplicationsDraft as lesson,
  sportsCards,
} from '../content/sujiao-classification-applications';
import { exportBackup, parseBackup } from './backup';
import { blockGroups, isBlockCardsVisual } from './block-cards';
import { createSession, evaluate, submitResponse } from './engine';
import { fold } from './fold';
import { sparseArray } from './sparse-array';
import { initialLibrary } from './storage';
it('rejects sparse, unsupported and answer-bearing block cards', () => {
  const visual = blockModel(false);
  expect(isBlockCardsVisual(visual)).toBe(true);
  for (const cards of [
    [],
    sparseArray(8),
    Array.from({ length: 13 }, () => visual.cards[0]),
    [{ shape: 'cube', color: 'green' }],
    [{ shape: 'cone', color: 'red' }],
    [{ shape: ['cube'], color: 'red' }],
    [{ shape: 'cube', color: 'red', answer: 1 }],
  ])
    expect(isBlockCardsVisual({ ...visual, cards })).toBe(false);
  expect(isBlockCardsVisual({ ...visual, answer: 8 })).toBe(false);
});
it('groups original objects by independent criteria and changes actual review data', () => {
  expect(blockGroups(blockModel(false), 'shape').map((g) => g.letters)).toEqual(
    [['A', 'C', 'F'], ['B', 'G'], ['D', 'H'], ['E']],
  );
  expect(blockGroups(blockModel(false), 'color').map((g) => g.letters)).toEqual(
    [['A', 'D', 'F', 'G'], ['B', 'C', 'H'], ['E']],
  );
  expect(
    blockGroups(blockModel(true), 'shape').map((g) => g.letters.length),
  ).toEqual([1, 3, 2, 2]);
  expect(
    blockGroups(blockModel(true), 'color').map((g) => g.letters.length),
  ).toEqual([1, 4, 3]);
  for (const review of [false, true])
    for (const criterion of ['shape', 'color'] as const)
      expect(
        fold(
          blockGroups(blockModel(review), criterion),
          0,
          (n, g) => n + g.letters.length,
        ),
      ).toBe(8);
  expect(
    sportsCards(false)
      .filter((c) => c.kind === 'monkey')
      .map((c) => c.id),
  ).toEqual(['A', 'C', 'E', 'G']);
  expect(
    sportsCards(false)
      .filter((c) => c.activity === 'run')
      .map((c) => c.id),
  ).toEqual(['A', 'B', 'D', 'E', 'H']);
  expect(
    sportsCards(true)
      .filter((c) => c.kind === 'monkey')
      .map((c) => c.id),
  ).toEqual(['B', 'E', 'G']);
  expect(
    sportsCards(true)
      .filter((c) => c.activity === 'run')
      .map((c) => c.id),
  ).toEqual(['B', 'F', 'I']);
  expect(lesson.questions).toHaveLength(25);
  expect(lesson.reviewQuestions).toHaveLength(20);
  for (const q of lesson.reviewQuestions!) {
    const main = lesson.questions.find((m) => m.knowledge === q.knowledge)!;
    expect(main).toBeDefined();
    expect(
      JSON.stringify([q.prompt, q.visual, q.material, q.choices]),
    ).not.toBe(
      JSON.stringify([main.prompt, main.visual, main.material, main.choices]),
    );
  }
});
it('preserves incomplete selection before correction and strict original visuals in backups', () => {
  const library = initialLibrary('分类综合');
  const session = createSession(
    lesson,
    'sujiao-math-p1-lower-9787574312951',
    library.activeProfileId,
  );
  const index = session.questions.findIndex((q) =>
    q.id.endsWith('-q-shape-select'),
  );
  expect(evaluate(session.questions[index]!.rule, ['A', 'C', 'F', 'G'])).toBe(
    false,
  );
  for (const draft of [['A'], ['A', 'C', 'F']]) {
    session.responses[index]!.draft = draft;
    session.responses[index] = submitResponse(
      session.questions[index]!,
      session.responses[index]!,
    );
  }
  expect(session.responses[index]!.submissions.map((s) => s.correct)).toEqual([
    false,
    true,
  ]);
  library.sessions.push(session);
  expect(parseBackup(exportBackup(library)).data.sessions[0]).toEqual(session);
  const bad = structuredClone(library);
  const q = bad.sessions[0]!.questions.find(
    (q) => q.visual?.kind === 'block-cards',
  )!;
  if (q.visual?.kind !== 'block-cards') throw new Error('missing blocks');
  Object.assign(q.visual.cards[0]!, { answer: 3 });
  expect(() => parseBackup(exportBackup(bad))).toThrow(Error);
});
