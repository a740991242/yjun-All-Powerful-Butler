import { expect, it } from 'vitest';

import { bnuLowerRabbitGuestsSource as source } from './bnu-lower-rabbit-guests-source';

it('preserves the original two groups of plates and all three whole-ten addition methods', () => {
  expect(source.status).toBe('source-checked');
  expect(source.readPrintedPages).toEqual([62, 63]);
  expect(source.pageImages).toEqual([
    { printedPage: 62, suffix: '066.jpg' },
    { printedPage: 63, suffix: '067.jpg' },
  ]);
  expect(source.fruitAddition).toMatchObject({
    perPlate: 10,
    plateGroups: [2, 3],
    platesTotal: 5,
    values: [20, 30, 50],
    forwardAfter20: [30, 40, 50],
    tens: [2, 3, 5],
  });
  expect(2 * 10 + 3 * 10).toBe(50);
});
it('answers the amount carried away rather than accidentally substituting the forty left on the table', () => {
  expect(source.fruitTaken).toMatchObject({
    before: 50,
    leftOnTable: 40,
    taken: 10,
    values: [50, 40, 10],
    backwardAfter50: [40, 30, 20, 10],
    tens: [5, 4, 1],
  });
  expect(source.fruitTaken.before - source.fruitTaken.leftOnTable).toBe(
    source.fruitTaken.taken,
  );
  expect(source.fruitTaken.boundary).toContain('不冒实际小刺猬背走40');
  expect(source.operationNames.addition).toEqual([
    { value: 20, name: '加数' },
    { value: 30, name: '加数' },
    { value: 50, name: '和' },
  ]);
  expect(source.operationNames.subtraction).toEqual([
    { value: 50, name: '被减数' },
    { value: 40, name: '减数' },
    { value: 10, name: '差' },
  ]);
});
it('keeps observed stick counts separate from explicitly named temporal assumptions and checks both complete number-line arrows', () => {
  expect(source.sticks).toMatchObject({
    perBundle: 10,
    observedTableBundles: [4, 4],
    observedHeldBundles: [2, 2],
    words: ['再加2捆', '拿走2捆'],
    siteExplicitBeforeTableReading: {
      add: [40, 20, 60],
      subtract: [40, 20, 20],
    },
    alternativeAlreadyTakenReading: { tableAfter: 40, taken: 20, before: 60 },
  });
  expect(source.sticks.boundary).toContain('不能混用时刻');
  expect(source.numberLines).toEqual([
    {
      operation: '+',
      labels: [20, 30, 40, 50, 60, 70, 80, 90],
      start: 30,
      jump: 50,
      end: 80,
      values: [30, 50, 80],
    },
    {
      operation: '−',
      labels: [50, 60, 70, 80, 90, 100],
      start: 90,
      jump: 30,
      end: 60,
      values: [90, 30, 60],
    },
  ]);
  expect(30 + 50).toBe(80);
  expect(90 - 30).toBe(60);
});
it('leaves self-authored peach questions open without silently capping the legitimate three-person total at one hundred', () => {
  expect(source.openPeaches.people).toEqual([
    { name: '丁丁', picked: 40 },
    { name: '当当', picked: 30 },
    { name: '毛毛', picked: 50 },
  ]);
  expect(source.openPeaches.pairTotals).toEqual([40 + 30, 40 + 50, 30 + 50]);
  expect(source.openPeaches.pairDifferences).toEqual([
    40 - 30,
    50 - 40,
    50 - 30,
  ]);
  expect(source.openPeaches.allThreeTotal).toBe(40 + 30 + 50);
  expect(source.openPeaches.boundary).toContain('超过本课100以内');
  expect(source.activities.map((a) => [a.page, a.key])).toEqual([
    [62, 'fruit-addition-three-methods'],
    [62, 'taken-not-left'],
    [63, 'name-each-operation-position'],
    [63, 'two-stick-actions-and-units'],
    [63, 'both-arrow-lines'],
    [63, 'own-peach-question-and-answer'],
  ]);
});
