import { expect, it } from 'vitest';

import { bnuLowerRedFruitSource as source } from './bnu-lower-red-fruit-source';

it('checks both original comparison methods and separates equivalent representations', () => {
  expect(source.story).toMatchObject({
    fruitCounts: [21, 18],
    countUp: [18, 19, 20, 21],
    benchmark: 20,
    larger: 21,
  });
  expect(source.doAndFill.materialCounts).toEqual([21, 18]);
  expect(source.doAndFill.counterCounts).toEqual([21, 18]);
  expect(source.doAndFill.relation).toBe('>');
  expect(source.doAndFill.boundary).toContain('不能合成42与36');
  expect(source.writeCompare).toEqual([
    { values: [32, 34], relation: '<' },
    { values: [100, 99], relation: '>' },
  ]);
  expect(source.counterBoundary).toContain('不比较珠子颗数');
});
it('retains all three practice pairs including the independently enlarged 89 counter', () => {
  expect(source.practiceCompare).toEqual([
    { values: [45, 54], relation: '<' },
    { values: [79, 80], relation: '<' },
    { values: [100, 89], relation: '>' },
  ]);
  for (const row of [...source.writeCompare, ...source.practiceCompare]) {
    const [left, right] = row.values;
    expect(left < right ? '<' : '>').toBe(row.relation);
  }
});
it('keeps every open blank distinct from ruler ticks and from a proposed website range', () => {
  expect(source.ruler.values).toEqual([
    35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100,
  ]);
  expect(source.ruler.values).toHaveLength(14);
  expect(source.ruler.prompts).toEqual(['45 < □', '90 > □']);
  expect(source.practiceOpen).toEqual(['15 < □', '□ > 89', '□ < 30', '80 > □']);
  expect(source.ruler.boundary).toContain('不限定只能填图上5的倍数');
  expect(source.openBoundary).toContain('原题未另设统一填数上限');
  expect(source.openBoundary).toContain('0符合条件时可用');
});
it('partitions all nine cards exactly once with strict sixty boundaries', () => {
  expect(source.connect.cards).toEqual([8, 29, 73, 62, 59, 100, 55, 17, 86]);
  expect(source.connect.pivot).toBe(60);
  expect(source.connect.less).toEqual([8, 29, 59, 55, 17]);
  expect(source.connect.greater).toEqual([73, 62, 100, 86]);
  expect(source.connect.cards.filter((n) => n < 60)).toEqual(
    source.connect.less,
  );
  expect(source.connect.cards.filter((n) => n > 60)).toEqual(
    source.connect.greater,
  );
  expect(
    new Set([...source.connect.less, ...source.connect.greater]).size,
  ).toBe(9);
  expect(source.connect.boundary).toContain('均不含60');
});
it('records both inspected pages and all seven activities without claiming a course release', () => {
  expect(source.status).toBe('source-checked');
  expect(source.readPrintedPages).toEqual([50, 51]);
  expect(source.pageImages).toEqual([
    { printedPage: 50, suffix: '054.jpg' },
    { printedPage: 51, suffix: '055.jpg' },
  ]);
  expect(source.imageBoundary).toContain('实际查看印刷页码51');
  expect(source.activities.map((x) => [x.page, x.key])).toEqual([
    [50, 'compare-story'],
    [50, 'do-and-fill'],
    [50, 'write-and-compare'],
    [51, 'number-ruler'],
    [51, 'practice-compare'],
    [51, 'practice-open'],
    [51, 'connect-all'],
  ]);
});
