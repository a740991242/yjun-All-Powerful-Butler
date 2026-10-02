import { expect, it } from 'vitest';

import { sujiaoPlaneRecognitionDraft as lesson } from '../content/sujiao-plane-recognition';
import { exportBackup, parseBackup } from './backup';
import { createSession, evaluate, statistics, submitResponse } from './engine';
import { isPlaneCardsVisual, planeShapes } from './plane-cards';
import { sparseArray } from './sparse-array';
import { initialLibrary } from './storage';

it('bounds shape cards and rejects unsupported shapes, rotations, sparse data and answer fields', () => {
  const card = { shape: 'square', size: 2, turn: 45 };
  const model = { kind: 'plane-cards', cards: [card] };
  for (const shape of planeShapes)
    for (const size of [1, 2])
      for (const turn of [0, 45, 90, 135, 180])
        expect(
          isPlaneCardsVisual({ ...model, cards: [{ shape, size, turn }] }),
        ).toBe(true);
  for (const cards of [
    [],
    sparseArray(1),
    Array.from({ length: 7 }, () => card),
    [{ ...card, shape: 'cube' }],
    [{ ...card, size: 0 }],
    [{ ...card, size: '2' }],
    [{ ...card, turn: 360 }],
    [{ ...card, turn: 22.5 }],
    [{ ...card, answer: 'square' }],
  ])
    expect(isPlaneCardsVisual({ ...model, cards })).toBe(false);
  expect(isPlaneCardsVisual({ ...model, answer: 'square' })).toBe(false);
});
it('separates category, straight-edge counts and congruence under rotation and scale', () => {
  for (const [review, questions] of [
    [false, lesson.questions],
    [true, lesson.reviewQuestions!],
  ] as const) {
    const q = (suffix: string) =>
      questions.find(
        (q) => q.id === `${lesson.id}-${review ? 'r' : 'q'}-${suffix}`,
      )!;
    const expected = review
      ? ['circle', 'triangle', 'square', 'rectangle']
      : ['rectangle', 'square', 'triangle', 'circle'];
    const edges = review ? [0, 3, 4, 4] : [4, 4, 3, 0];
    expected.forEach((shape, i) => {
      expect(evaluate(q(`recognize-${i}`).rule, shape)).toBe(true);
      expect(evaluate(q(`edges-${i}`).rule, edges[i]!)).toBe(true);
    });
    expect(evaluate(q('category').rule, 'yes')).toBe(true);
    expect(evaluate(q('exact').rule, 'B')).toBe(true);
    expect(evaluate(q('exact').rule, 'both')).toBe(false);
    expect(evaluate(q('face').rule, review ? 'circle' : 'square')).toBe(true);
    expect(evaluate(q('turn').rule, 'no')).toBe(true);
  }
  expect(
    lesson.questions.filter(
      (q) => !['manual', 'reflection'].includes(q.rule.kind),
    ),
  ).toHaveLength(12);
  for (const q of lesson.reviewQuestions!) {
    const original = lesson.questions.find(
      (old) => old.knowledge === q.knowledge,
    )!;
    expect(q.prompt).not.toBe(original.prompt);
    if (q.visual) expect(q.visual).not.toEqual(original.visual);
  }
});
it('preserves rotated diagrams and wrong-first history through backup without confirming physical activities', () => {
  const state = initialLibrary('图形测试');
  const session = createSession(
    lesson,
    'sujiao-math-p1-lower-9787574312951',
    state.activeProfileId,
  );
  const index = session.questions.findIndex((q) => q.id.endsWith('-q-exact'));
  session.phase = 'practice';
  session.responses[index]!.draft = 'both';
  session.responses[index] = submitResponse(
    session.questions[index]!,
    session.responses[index]!,
  );
  session.responses[index]!.draft = 'B';
  session.responses[index] = submitResponse(
    session.questions[index]!,
    session.responses[index]!,
  );
  state.sessions.push(session);
  expect(parseBackup(exportBackup(state)).data.sessions[0]).toEqual(session);
  expect(session.responses[index]!.submissions.map((s) => s.correct)).toEqual([
    false,
    true,
  ]);
  expect(statistics(session).manual).toBe(0);
  const damaged = structuredClone(state);
  const visual = damaged.sessions[0]!.questions[index]!.visual;
  if (visual?.kind !== 'plane-cards') throw new Error('missing cards');
  Object.assign(visual.cards[0]!, { turn: 22.5 });
  expect(() => parseBackup(exportBackup(damaged))).toThrow(Error);
});
