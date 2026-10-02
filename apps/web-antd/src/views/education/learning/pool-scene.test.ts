import { expect, it } from 'vitest';

import { sujiaoPoolClassificationDraft as lesson } from '../content/sujiao-pool-classification';
import { exportBackup, parseBackup } from './backup';
import { createSession, evaluate, submitResponse } from './engine';
import { isPoolSceneVisual, poolModel, poolPeople } from './pool-scene';
import { initialLibrary } from './storage';
it('limits fixed original variants and rejects arbitrary people, answer fields and array enums', () => {
  for (const review of [false, true])
    expect(isPoolSceneVisual(poolModel(review))).toBe(true);
  for (const value of [
    null,
    [],
    { kind: 'pool-scene', variant: ['main'] },
    { kind: 'pool-scene', variant: 'unknown' },
    { ...poolModel(false), answer: 8 },
    { ...poolModel(false), people: poolPeople(false) },
  ])
    expect(isPoolSceneVisual(value)).toBe(false);
});
it('uses independent criteria without changing people, changes review distributions, and keeps all tied maxima', () => {
  const main = poolPeople(false);
  const review = poolPeople(true);
  expect(main.filter((p) => p.role === 'child').map((p) => p.id)).toEqual([
    'A',
    'B',
    'D',
    'E',
    'G',
    'H',
  ]);
  expect(main.filter((p) => p.place === 'pool').map((p) => p.id)).toEqual([
    'A',
    'B',
    'E',
    'F',
    'G',
    'H',
  ]);
  expect(main.filter((p) => p.ring !== 'none').map((p) => p.id)).toEqual([
    'A',
    'D',
    'E',
    'H',
  ]);
  expect(review.filter((p) => p.role === 'adult').map((p) => p.id)).toEqual([
    'A',
    'D',
    'G',
  ]);
  expect(review.filter((p) => p.place === 'pool').map((p) => p.id)).toEqual([
    'B',
    'D',
    'E',
    'H',
  ]);
  expect(review.filter((p) => p.ring !== 'none').map((p) => p.id)).toEqual([
    'B',
    'E',
    'F',
  ]);
  expect(main.filter((p) => p.ring === 'red')).toHaveLength(2);
  expect(main.filter((p) => p.ring === 'blue')).toHaveLength(2);
  expect(review.filter((p) => p.ring === 'red')).toHaveLength(1);
  expect(review.filter((p) => p.ring === 'blue')).toHaveLength(2);
  const most = lesson.questions.find((q) => q.id.endsWith('-q-ring-most'))!;
  expect(most.rule).toEqual({ kind: 'set', values: ['with', 'without'] });
  expect(evaluate(most.rule, ['with'])).toBe(false);
  expect(
    lesson.reviewQuestions!.find((q) => q.id.endsWith('-r-ring-most'))!.rule,
  ).toEqual({ kind: 'set', values: ['without'] });
  expect(
    lesson.reviewQuestions!.find((q) => q.id.endsWith('-r-place-most'))!.rule,
  ).toEqual({ kind: 'set', values: ['pool', 'deck'] });
  expect(lesson.questions).toHaveLength(27);
  expect(lesson.reviewQuestions).toHaveLength(22);
  for (const q of lesson.reviewQuestions!) {
    const original = lesson.questions.find((o) => o.knowledge === q.knowledge)!;
    expect(original).toBeDefined();
    expect(JSON.stringify([q.prompt, q.visual, q.choices])).not.toBe(
      JSON.stringify([original.prompt, original.visual, original.choices]),
    );
  }
});
it('preserves wrong incomplete maxima before correction and strict original scenes in backups', () => {
  const library = initialLibrary('泳池图分类');
  const session = createSession(
    lesson,
    'sujiao-math-p1-lower-9787574312951',
    library.activeProfileId,
  );
  const index = session.questions.findIndex((q) =>
    q.id.endsWith('-q-ring-most'),
  );
  for (const draft of [['with'], ['with', 'without']]) {
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
    (q) => q.visual?.kind === 'pool-scene',
  )!;
  if (q.visual?.kind !== 'pool-scene') throw new Error('missing scene');
  Object.assign(q.visual, { answer: 8 });
  expect(() => parseBackup(exportBackup(bad))).toThrow(Error);
});
