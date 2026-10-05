import { expect, it } from 'vitest';

import { bnuLowerBreedingSource as source } from './bnu-lower-breeding-source';

it('checks the three labelled quantities without replacing labels by the number of pictured animals', () => {
  expect(source.givenAnimals).toEqual([
    { name: '鸡', quantity: 100, unit: '只' },
    { name: '鹅', quantity: 22, unit: '只' },
    { name: '鸭', quantity: 92, unit: '只' },
  ]);
  expect(source.firstLine.ticks).toEqual([
    10, 20, 30, 40, 50, 60, 70, 80, 90, 100,
  ]);
  expect(source.firstLine.markedValues).toEqual([22, 92, 100]);
  expect(source.animalBoundary).toContain('第53页才');
  expect(source.animalBoundary).toContain('不把前页未知当0');
});
it('keeps every direction of the original qualitative comparisons scoped to this context', () => {
  expect(source.language.map((x) => [x.comparison, x.value])).toEqual([
    ['鸡鸭鹅三种中谁最多', '鸡'],
    ['鸡鸭鹅三种中谁最少', '鹅'],
    ['鸡比鹅', '多得多'],
    ['鸡比鸭', '多一些'],
    ['鸭比鸡', '少一些'],
    ['鹅比鸡', '少得多'],
    ['鸡和鸭的数量', '差不多'],
  ]);
  expect(source.languageBoundary).toContain(
    '不从此补造普遍的固定差数或比例阈值',
  );
  expect(source.sheep).toMatchObject({
    reference: '鹅',
    referenceQuantity: 22,
    candidates: [70, 26, 3],
    selected: 26,
  });
});
it('uses all responses to distinguish remaining candidates from a confirmed rabbit number', () => {
  expect(source.rabbit).toMatchObject({
    candidates: [18, 26, 90, 97],
    firstGuess: 18,
    firstReply: '比18多得多',
    remainingAfterClue: [90, 97],
    nextGuess: 90,
    nextReply: '不是',
    finalGuess: 97,
    finalReply: '你猜对了',
  });
  expect(source.rabbit.boundary).toContain('只听多得多不能');
});
it('retains all five cards, both sorting methods and distinct adjacent fifty and fifty-one marks', () => {
  expect(source.sort.originalOrder).toEqual([50, 98, 38, 10, 51]);
  expect(source.sort.ascending).toEqual([10, 38, 50, 51, 98]);
  expect([...source.sort.originalOrder].toSorted((a, b) => a - b)).toEqual(
    source.sort.ascending,
  );
  expect(source.sort.methods).toEqual([
    '每次从剩下的数中找最小',
    '先比较前两个再逐个插入已有顺序',
  ]);
  expect(source.sort.markedValues).toEqual([10, 38, 50, 51, 98]);
  expect(source.sort.secondLineTicks).toEqual([
    10, 20, 30, 40, 50, 60, 70, 80, 90, 100,
  ]);
  expect(source.sort.boundary).toContain('不是同一个数');
});
it('records seven inspected activities separately from an unimplemented teaching package', () => {
  expect(source.status).toBe('source-checked');
  expect(source.readPrintedPages).toEqual([52, 53]);
  expect(source.activities.map((x) => [x.page, x.key])).toEqual([
    [52, 'observe-three'],
    [52, 'line-and-language'],
    [52, 'sheep-candidates'],
    [53, 'rabbit-clues'],
    [53, 'sort-five'],
    [53, 'two-methods'],
    [53, 'mark-line'],
  ]);
});
