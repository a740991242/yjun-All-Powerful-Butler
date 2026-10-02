import { describe, expect, it } from 'vitest';

import { sujiaoViewpointJugDraft } from '../content/sujiao-viewpoint-jug';
import { exportBackup, parseBackup } from './backup';
import { createSession } from './engine';
import { initialLibrary } from './storage';
import { isViewpointJugVisual, jugScene, jugView } from './viewpoint-jug';
describe('opaque jug viewpoint conditions', () => {
  it('distinguishes axial hiding and opposite side order for all rotations', () => {
    for (let spout = 0; spout < 4; spout++) {
      expect(jugView(spout, spout)).toBe('spout-only');
      expect(jugView((spout + 2) % 4, spout)).toBe('handle-only');
      expect(jugView((spout + 3) % 4, spout)).toBe('spout-left');
      expect(jugView((spout + 1) % 4, spout)).toBe('spout-right');
      for (let observer = 0; observer < 4; observer++)
        expect(jugView((observer + 1) % 4, (spout + 1) % 4)).toBe(
          jugView(observer, spout),
        );
    }
  });
  it('reorders review candidates independently and returns fresh arrays', () => {
    const main = jugScene('main');
    const review = jugScene('review');
    expect(main.views.map((view) => main.candidates.indexOf(view) + 1)).toEqual(
      [4, 3, 2, 1],
    );
    expect(
      review.views.map((view) => review.candidates.indexOf(view) + 1),
    ).toEqual([3, 2, 1, 4]);
    main.candidates.reverse();
    expect(jugScene('main').candidates[0]).toBe('spout-only');
  });
  it('rejects noncardinal geometry and data carrying answers', () => {
    for (const n of [-1, 4, 0.5, Number.NaN, Infinity]) {
      expect(() => jugView(n, 0)).toThrow(RangeError);
      expect(() => jugView(0, n)).toThrow(RangeError);
    }
    expect(
      isViewpointJugVisual({ kind: 'viewpoint-jug', variant: 'main' }),
    ).toBe(true);
    expect(
      isViewpointJugVisual({ kind: 'viewpoint-jug', variant: 'review' }),
    ).toBe(true);
    for (const value of [
      null,
      [],
      { kind: 'viewpoint-jug', variant: [] },
      { kind: 'viewpoint-jug', variant: 'other' },
      { kind: 'viewpoint-jug', variant: 'main', answer: 4 },
    ])
      expect(isViewpointJugVisual(value)).toBe(false);
  });
});

it('roundtrips visual snapshots but rejects added answers, enum arrays and visuals as grading rules', () => {
  const library = initialLibrary('茶壶观察');
  library.sessions.push(
    createSession(
      sujiaoViewpointJugDraft,
      'sujiao-math-p1-lower-9787574312951',
      library.activeProfileId,
    ),
  );
  const backup = JSON.parse(exportBackup(library));
  const index = library.sessions[0]!.questions.findIndex(
    (q) => q.visual?.kind === 'viewpoint-jug',
  );
  expect(index).toBeGreaterThanOrEqual(0);
  const q = backup.data.sessions[0].questions[index];
  expect(
    parseBackup(JSON.stringify(backup)).data.sessions[0]?.questions[index]
      ?.visual,
  ).toEqual({ kind: 'viewpoint-jug', variant: 'main' });
  q.visual.answer = '4';
  expect(() => parseBackup(JSON.stringify(backup))).toThrow(Error);
  delete q.visual.answer;
  q.visual.variant = ['main'];
  expect(() => parseBackup(JSON.stringify(backup))).toThrow(Error);
  q.visual.variant = 'main';
  q.rule = q.visual;
  expect(() => parseBackup(JSON.stringify(backup))).toThrow(Error);
});
