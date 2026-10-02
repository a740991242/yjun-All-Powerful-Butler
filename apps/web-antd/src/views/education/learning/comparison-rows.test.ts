import { expect, it } from 'vitest';

import { sujiaoQuantityDifferenceDraft } from '../content/sujiao-quantity-relations';
import { exportBackup, parseBackup } from './backup';
import { isComparisonRowsVisual } from './comparison-rows';
import { createSession } from './engine';
import { sparseArray } from './sparse-array';
import { initialLibrary } from './storage';
it('allows only two complete rows of bounded original counts, including confirmed zero', () => {
  for (const counts of [
    [13, 6],
    [9, 17],
    [9, 9],
    [9, 0],
    [0, 20],
  ])
    expect(isComparisonRowsVisual({ kind: 'comparison-rows', counts })).toBe(
      true,
    );
  for (const value of [
    null,
    [],
    { kind: ['comparison-rows'], counts: [1, 2] },
    { kind: 'comparison-rows', counts: [null, 2] },
    { kind: 'comparison-rows', counts: [1, '2'] },
    { kind: 'comparison-rows', counts: [-1, 2] },
    { kind: 'comparison-rows', counts: [21, 2] },
    { kind: 'comparison-rows', counts: [1.5, 2] },
    { kind: 'comparison-rows', counts: [1] },
    { kind: 'comparison-rows', counts: [1, 2, 3] },
    { kind: 'comparison-rows', counts: sparseArray(2) },
    { kind: 'comparison-rows', counts: [1, 2], difference: 1 },
  ])
    expect(isComparisonRowsVisual(value)).toBe(false);
});
it('rejects answer-bearing and damaged imported diagrams without turning observation into a grading rule', () => {
  const library = initialLibrary('原数量');
  library.sessions.push(
    createSession(
      sujiaoQuantityDifferenceDraft,
      'sujiao-math-p1-lower-9787574312951',
      library.activeProfileId,
    ),
  );
  const backup = JSON.parse(exportBackup(library));
  // Session questions are shuffled; select the original diagram, not a random first task.
  const index = library.sessions[0]!.questions.findIndex(
    (question) =>
      question.visual?.kind === 'comparison-rows' &&
      question.visual.counts[0] === 13 &&
      question.visual.counts[1] === 6,
  );
  expect(index).toBeGreaterThanOrEqual(0);
  expect(
    parseBackup(JSON.stringify(backup)).data.sessions[0]!.questions[index]!
      .visual,
  ).toEqual({ kind: 'comparison-rows', counts: [13, 6] });
  const q = backup.data.sessions[0].questions[index];
  q.visual.difference = 7;
  expect(() => parseBackup(JSON.stringify(backup))).toThrow(Error);
  delete q.visual.difference;
  q.visual.counts = [13, null];
  expect(() => parseBackup(JSON.stringify(backup))).toThrow(Error);
  q.visual.counts = [13, 6];
  q.rule = q.visual;
  expect(() => parseBackup(JSON.stringify(backup))).toThrow(Error);
});
