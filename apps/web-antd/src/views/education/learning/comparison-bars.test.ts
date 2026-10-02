import { expect, it } from 'vitest';

import { sujiaoQuantityApplicationsDraft } from '../content/sujiao-quantity-applications';
import { exportBackup, parseBackup } from './backup';
import { isComparisonBarsVisual } from './comparison-bars';
import { createSession } from './engine';
import { initialLibrary } from './storage';
it('validates only given conditions and bounded nonnegative quantities, not arbitrary answer fields', () => {
  for (let reference = 1; reference <= 99; reference++) {
    for (let difference = 0; difference <= 99; difference++) {
      expect(
        isComparisonBarsVisual({
          kind: 'comparison-bars',
          reference,
          difference,
          direction: 'more',
        }),
      ).toBe(reference + difference <= 99);
      expect(
        isComparisonBarsVisual({
          kind: 'comparison-bars',
          reference,
          difference,
          direction: 'less',
        }),
      ).toBe(difference <= reference);
    }
  }
  const good = {
    kind: 'comparison-bars',
    reference: 32,
    difference: 7,
    direction: 'more',
  };
  for (const value of [
    null,
    [],
    { ...good, kind: ['comparison-bars'] },
    { ...good, reference: '32' },
    { ...good, reference: 0 },
    { ...good, reference: 100 },
    { ...good, reference: 1.5 },
    { ...good, difference: null },
    { ...good, difference: -1 },
    { ...good, difference: 7.5 },
    { ...good, direction: ['more'] },
    { ...good, direction: 'equal' },
    { ...good, target: 39 },
  ])
    expect(isComparisonBarsVisual(value)).toBe(false);
});
it('preserves original comparison conditions and rejects damaged imports or diagrams used as grading rules', () => {
  const library = initialLibrary('原条件');
  library.sessions.push(
    createSession(
      sujiaoQuantityApplicationsDraft,
      'sujiao-math-p1-lower-9787574312951',
      library.activeProfileId,
    ),
  );
  const backup = JSON.parse(exportBackup(library));
  const i = backup.data.sessions[0].questions.findIndex((q: { id: string }) =>
    q.id.endsWith('-q-bar-more'),
  );
  const q = backup.data.sessions[0].questions[i];
  expect(
    parseBackup(JSON.stringify(backup)).data.sessions[0]!.questions[i]!.visual,
  ).toEqual({
    kind: 'comparison-bars',
    reference: 32,
    difference: 7,
    direction: 'more',
  });
  q.visual.target = 39;
  expect(() => parseBackup(JSON.stringify(backup))).toThrow(Error);
  delete q.visual.target;
  q.visual.reference = 98;
  expect(() => parseBackup(JSON.stringify(backup))).toThrow(Error);
  q.visual.reference = 32;
  q.rule = q.visual;
  expect(() => parseBackup(JSON.stringify(backup))).toThrow(Error);
});
