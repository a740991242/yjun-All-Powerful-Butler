import { expect, it } from 'vitest';

import { sujiaoViewpointHouseDraft } from '../content/sujiao-viewpoint-house';
import { exportBackup, parseBackup } from './backup';
import { createSession } from './engine';
import { initialLibrary } from './storage';
import { houseScene, isViewpointHouseVisual } from './viewpoint-house';
it('allows only fixed inspected variants, not arbitrary answer maps, transparent models or enum arrays', () => {
  for (const variant of ['main', 'review'])
    expect(isViewpointHouseVisual({ kind: 'viewpoint-house', variant })).toBe(
      true,
    );
  for (const value of [
    null,
    [],
    { kind: ['viewpoint-house'], variant: 'main' },
    { kind: 'viewpoint-house', variant: ['main'] },
    { kind: 'viewpoint-house', variant: 'other' },
    { kind: 'viewpoint-house', variant: 'main', answers: ['4', '1', '2', '3'] },
    { kind: 'viewpoint-house', variant: 'main', transparent: true },
  ])
    expect(isViewpointHouseVisual(value)).toBe(false);
});
it('rotates the actual same side features clockwise and independently reorders candidates without shared mutable arrays', () => {
  const main = houseScene('main');
  const review = houseScene('review');
  expect(main.faces).toEqual(['windows', 'circle', 'door', 'blank']);
  expect(main.candidates).toEqual(['circle', 'door', 'blank', 'windows']);
  expect(review.faces).toEqual([
    main.faces[3],
    main.faces[0],
    main.faces[1],
    main.faces[2],
  ]);
  expect(review.candidates).toEqual(['blank', 'circle', 'door', 'windows']);
  main.faces[0] = 'blank';
  expect(houseScene('main').faces[0]).toBe('windows');
});
it('preserves a scene snapshot while rejecting extra answer fields and diagrams as grading rules', () => {
  const library = initialLibrary('观察位置');
  library.sessions.push(
    createSession(
      sujiaoViewpointHouseDraft,
      'sujiao-math-p1-lower-9787574312951',
      library.activeProfileId,
    ),
  );
  const backup = JSON.parse(exportBackup(library));
  const index = library.sessions[0]!.questions.findIndex(
    (question) => question.visual?.kind === 'viewpoint-house',
  );
  expect(index).toBeGreaterThanOrEqual(0);
  const q = backup.data.sessions[0].questions[index];
  expect(
    parseBackup(JSON.stringify(backup)).data.sessions[0]!.questions[index]!
      .visual,
  ).toEqual({ kind: 'viewpoint-house', variant: 'main' });
  q.visual.answer = '4';
  expect(() => parseBackup(JSON.stringify(backup))).toThrow(Error);
  delete q.visual.answer;
  q.visual.variant = ['main'];
  expect(() => parseBackup(JSON.stringify(backup))).toThrow(Error);
  q.visual.variant = 'main';
  q.rule = q.visual;
  expect(() => parseBackup(JSON.stringify(backup))).toThrow(Error);
});
