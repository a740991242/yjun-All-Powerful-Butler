import { expect, it } from 'vitest';

import { bnuLowerUnitThreeReviewSource as source } from './bnu-lower-unit-three-review-source';

it('distinguishes the original two methods, exchanging units and the beyond-twenty question', () => {
  expect(source.plants).toEqual({
    jun: 13,
    ning: 6,
    difference: 7,
    unit: '种',
  });
  expect(source.methods.splitPart.pieces).toEqual([3, 3]);
  expect(source.methods.splitWhole.pieces).toEqual([10, 3]);
  expect(source.methods.counter).toEqual({
    initialTens: 1,
    initialOnes: 3,
    exchangedTens: 0,
    exchangedOnes: 13,
    remove: 6,
    remaining: 7,
  });
  expect(source.openQuestion).toMatchObject({ whole: 25, part: 9, result: 16 });
  expect(source.stories).toEqual({
    hats: 13,
    glovePairs: 6,
    parkingPlaces: 13,
    cars: 6,
  });
});
it('checks all twelve row-major calculations and separately counted original objects', () => {
  expect(source.calculations.map(([a, b]) => a - b)).toEqual([
    8, 9, 6, 13, 7, 8, 12, 7, 6, 7, 10, 8,
  ]);
  expect(
    source.circledPictures.map(({ whole, remove, remaining }) => [
      whole,
      remove,
      remaining,
    ]),
  ).toEqual([
    [13, 8, 5],
    [15, 9, 6],
  ]);
  expect(source.numberLine).toMatchObject({ whole: 18, part: 9, remaining: 9 });
  expect(source.furniture).toMatchObject({
    chairs: 14,
    tables: 9,
    missingTables: 5,
  });
  expect(source.furniture.countBasis).toContain('桌子上三、中三、下三');
  expect(source.activities.find((item) => item.key === 'furniture')?.task).toBe(
    '14椅9桌每椅配一桌求缺',
  );
  expect(source.shuttleKicks).toEqual({
    lan: 5,
    gang: 7,
    fang: 13,
    requiredOwnQuestions: 2,
  });
});
it('keeps three fact families, all three animal quantities and open equation scopes independent of course release', () => {
  expect(source.factFamilies).toEqual([
    [5, 9, 14],
    [4, 8, 12],
    [6, 7, 13],
  ]);
  expect(source.animals.counts).toEqual([10, 6, 2]);
  expect(source.animals.comparison).toEqual([10, 6, 4]);
  expect(source.animals.addition).toEqual([10, 2, 12]);
  expect(source.animals.boundary).toContain('不是三只大蟹');
  expect(source.freeEquations.results).toEqual([12, 14]);
  expect(source.freeEquations.boundary).toContain('不是可说算式总数上限');
  expect(source.activities.map(({ page, key }) => [page, key])).toEqual([
    [41, 'plants-methods'],
    [41, 'stories'],
    [41, 'own-question'],
    [42, 'circle'],
    [42, 'number-line'],
    [42, 'calculations'],
    [42, 'furniture'],
    [42, 'own-kicks'],
    [43, 'families'],
    [43, 'animals'],
    [43, 'free-equations'],
  ]);
  expect(source.status).toBe('source-checked');
});
