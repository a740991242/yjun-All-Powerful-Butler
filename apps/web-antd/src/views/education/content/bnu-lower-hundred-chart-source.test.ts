import { expect, it } from 'vitest';

import { bnuLowerHundredChartSource as source } from './bnu-lower-hundred-chart-source';

it('keeps all twenty original givens and eighty blanks in the complete 1–100 chart', () => {
  expect(source.chart).toMatchObject({
    rows: 10,
    columns: 10,
    minimum: 1,
    maximum: 100,
    blankCount: 80,
  });
  expect(source.chart.given).toEqual([
    1, 10, 12, 19, 23, 28, 34, 37, 45, 46, 55, 56, 64, 67, 73, 78, 82, 89, 91,
    100,
  ]);
  expect(new Set(source.chart.given).size).toBe(20);
  expect(100 - source.chart.given.length).toBe(source.chart.blankCount);
  const positions = source.chart.given.map((value) => [
    Math.floor((value - 1) / 10) + 1,
    ((value - 1) % 10) + 1,
  ]);
  expect(positions).toEqual([
    [1, 1],
    [1, 10],
    [2, 2],
    [2, 9],
    [3, 3],
    [3, 8],
    [4, 4],
    [4, 7],
    [5, 5],
    [5, 6],
    [6, 5],
    [6, 6],
    [7, 4],
    [7, 7],
    [8, 3],
    [8, 8],
    [9, 2],
    [9, 9],
    [10, 1],
    [10, 10],
  ]);
  expect(source.chart.boundary).toContain('不是同一行右邻');
});
it('completes every blank of both original three-by-three demonstrations', () => {
  expect(source.firstFragment.given).toEqual([
    [58, null, 60],
    [null, null, null],
    [78, null, 80],
  ]);
  expect(source.firstFragment.completed).toEqual([
    [58, 59, 60],
    [68, 69, 70],
    [78, 79, 80],
  ]);
  expect(source.secondFragment.given).toEqual([
    [null, null, null],
    [null, 67, null],
    [null, null, null],
  ]);
  expect(source.secondFragment.completed).toEqual([
    [56, 57, 58],
    [66, 67, 68],
    [76, 77, 78],
  ]);
  expect(
    source.firstFragment.given.flat().filter((x) => x === null),
  ).toHaveLength(5);
  expect(
    source.secondFragment.given.flat().filter((x) => x === null),
  ).toHaveLength(8);
});
it('preserves all four digit rules with overlap and an explicit hundred boundary', () => {
  expect(source.colourRules.map((x) => [x.key, x.colour])).toEqual([
    ['ones-zero', '绿色'],
    ['ones-seven', '蓝色'],
    ['ones-tens-equal', '黄色'],
    ['ones-one-less', '红色'],
  ]);
  expect(source.colourBoundary).toContain('100十位0/个位0也满足');
  expect(source.colourBoundary).toContain('只看两位数');
  expect(source.colourBoundary).toContain('不冒原书给了唯一涂色答案');
  expect(source.discovery.directions).toEqual([
    '竖着看第三列个位',
    '横着看',
    '斜着看',
  ]);
  expect(source.discovery.boundary).toContain('不把所有斜向固定加11');
});
it('retains all blanks on both different-spaced lines including the two left-hand tens', () => {
  expect(source.numberLines).toEqual([
    { given: [30, 32, 34], step: 2, missing: [36, 38, 40] },
    { given: [70, 80], step: 10, missing: [50, 60, 90, 100] },
  ]);
  expect(source.lineBoundary).toContain('左有两个空、右有两个空');
});
it('fills every cell of all three original practice fragments without rewriting any given', () => {
  expect(source.practiceFragments.map((x) => x.given)).toEqual([
    [
      [27, 28, null],
      [null, 38, null],
      [null, null, 49],
    ],
    [
      [null, 31, null],
      [40, null, 42],
      [null, 51, null],
    ],
    [
      [null, null, null],
      [null, 85, null],
      [null, null, null],
    ],
  ]);
  expect(source.practiceFragments.map((x) => x.completed)).toEqual([
    [
      [27, 28, 29],
      [37, 38, 39],
      [47, 48, 49],
    ],
    [
      [30, 31, 32],
      [40, 41, 42],
      [50, 51, 52],
    ],
    [
      [74, 75, 76],
      [84, 85, 86],
      [94, 95, 96],
    ],
  ]);
  expect(
    source.practiceFragments.map(
      (x) => x.given.flat().filter((y) => y === null).length,
    ),
  ).toEqual([5, 5, 8]);
  for (const fragment of source.practiceFragments)
    for (const [r, row] of fragment.given.entries())
      for (const [c, value] of row.entries())
        if (value !== null) expect(fragment.completed[r]?.[c]).toBe(value);
});
it('records seven source activities without opening a teaching package', () => {
  expect(source.status).toBe('source-checked');
  expect(source.readPrintedPages).toEqual([55, 56]);
  expect(source.activities.map((x) => [x.page, x.key])).toEqual([
    [55, 'fill-full-chart'],
    [55, 'chart-discoveries'],
    [55, 'fragment-fifty-eight'],
    [56, 'fragment-sixty-seven'],
    [56, 'four-colour-rules'],
    [56, 'two-number-lines'],
    [56, 'three-chart-fragments'],
  ]);
});
