import { expect, it } from 'vitest';

import { bnuUpperBook } from '../content/bnu';
import { bnuFinalColorPatternsLesson as lesson } from '../content/bnu-final-patterns';
import { exportBackup, parseBackup } from './backup';
import { isBnuFinalColorVisual } from './bnu-final-color';
import { isCountGroupsVisual } from './count-groups';
import { createSession } from './engine';
import { required } from './required';
import { initialLibrary } from './storage';
import { isTriangleRowsVisual, triangleRowDots } from './triangle-rows';

it('keeps every dot, every layer and every circle within the diagram including 15 and 21', () => {
  const expected = [1, 3, 6, 10, 15, 21];
  for (let rows = 1; rows <= 6; rows++) {
    const dots = triangleRowDots(rows);
    expect(dots).toHaveLength(required(expected[rows - 1]));
    for (let row = 1; row <= rows; row++)
      expect(
        dots.filter((dot) => dot.row === row).map((dot) => dot.column),
      ).toEqual(Array.from({ length: row }, (_, i) => i + 1));
    const right = required(dots.find((dot) => dot.row === 1)).x;
    for (let row = 1; row <= rows; row++)
      expect(
        required(dots.find((dot) => dot.row === row && dot.column === row)).x,
      ).toBe(right);
    for (const dot of dots) {
      expect(dot.x - 9).toBeGreaterThanOrEqual(0);
      expect(dot.x + 9).toBeLessThanOrEqual(180);
      expect(dot.y - 9).toBeGreaterThanOrEqual(0);
      expect(dot.y + 9).toBeLessThanOrEqual(160);
    }
  }
  expect(isCountGroupsVisual({ kind: 'count-groups', groups: [10, 5] })).toBe(
    false,
  );
});
it('strictly validates models and backup snapshots without extra solutions, holes, coercion or widening old models', () => {
  expect(
    isTriangleRowsVisual({ kind: 'triangle-rows', rows: [1, 2, 3, 4, 5, 6] }),
  ).toBe(true);
  const sparse = [1, 2, 3];
  Reflect.deleteProperty(sparse, 1);
  for (const rows of [
    [],
    [0],
    [7],
    [1.5],
    ['3'],
    [1, null],
    sparse,
    [1, 2, 3, 4, 5, 6, 1],
  ])
    expect(isTriangleRowsVisual({ kind: 'triangle-rows', rows })).toBe(false);
  expect(
    isTriangleRowsVisual({ kind: 'triangle-rows', rows: [3], answer: 6 }),
  ).toBe(false);
  expect(
    isBnuFinalColorVisual({ kind: 'bnu-final-color', variant: 'main' }),
  ).toBe(true);
  for (const data of [
    { kind: 'bnu-final-color', variant: 'other' },
    { kind: 'bnu-final-color', variant: ['main'] },
    { kind: 'bnu-final-color', variant: 'main', answers: [] },
  ])
    expect(isBnuFinalColorVisual(data)).toBe(false);
  const library = initialLibrary('隔离图备份');
  library.sessions.push(
    createSession(lesson, bnuUpperBook.id, library.activeProfileId),
  );
  const original = exportBackup(library);
  expect(parseBackup(original).data).toEqual(
    JSON.parse(JSON.stringify(library)),
  );
  for (const visual of [
    { kind: 'triangle-rows', rows: [7] },
    { kind: 'bnu-final-color', variant: 'main', answers: ['R6'] },
  ]) {
    const data = JSON.parse(original);
    data.data.sessions[0].questions[0].visual = visual;
    expect(() => parseBackup(JSON.stringify(data))).toThrow(
      'educationLearning.invalidBackup',
    );
  }
});
