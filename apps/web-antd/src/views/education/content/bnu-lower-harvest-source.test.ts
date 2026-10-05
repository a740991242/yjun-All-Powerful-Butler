import { expect, it } from 'vitest';

import { bnuLowerHarvestSource as source } from './bnu-lower-harvest-source';

it('preserves all four source labels, ages, one-minute counts and independent counters without inferring health rules', () => {
  expect(source.readPrintedPages).toEqual([57]);
  expect(source.status).toBe('source-checked');
  expect(source.heartbeat.original).toEqual([
    { name: '冬冬', age: 6, times: 95 },
    { name: '希希', age: 9, times: 92 },
    { name: '果果', age: 12, times: 85 },
    { name: '田田', age: 18, times: 79 },
  ]);
  expect(source.heartbeat.duration).toEqual({ value: 1, unit: '分钟' });
  expect(source.heartbeat.counters).toEqual([
    { tens: 9, ones: 5 },
    { tens: 9, ones: 2 },
    { tens: 8, ones: 5 },
    { tens: 7, ones: 9 },
  ]);
  for (const [i, c] of source.heartbeat.counters.entries())
    expect(c.tens * 10 + c.ones).toBe(source.heartbeat.original[i]?.times);
  expect(source.heartbeat.descending).toEqual([95, 92, 85, 79]);
  expect(source.heartbeat.most).toBe('冬冬');
  expect(source.heartbeat.boundary).toContain('不要求真实测量');
});
it('separates representation value, material count, specified website convention and two open branches', () => {
  expect(source.representations.value).toBe(85);
  expect(source.representations.counter).toEqual({ tens: 8, ones: 5 });
  expect(source.representations.expression).toEqual({
    tensValue: 80,
    onesValue: 5,
  });
  expect(source.representations.drawnSymbols).toEqual({
    rectangles: 8,
    triangles: 5,
  });
  expect(source.representations.emptyBranches).toBe(2);
  expect(source.representations.boundary).toContain('没有独立写出单位图例');
  expect(source.representations.boundary).toContain('不同合理表示');
});
it('keeps all three original activities and open reflection separate from teaching release', () => {
  expect(source.activities.map((a) => [a.page, a.key])).toEqual([
    [57, 'heartbeat-counters-comparison'],
    [57, 'eighty-five-representations'],
    [57, 'open-question-bank'],
  ]);
  expect(source.questionBank.boundary).toContain('不设是或否唯一正确答案');
  expect(source.questionBank.boundary).toContain('反思correct:null');
  expect(source.pageImages).toEqual([{ printedPage: 57, suffix: '061.jpg' }]);
});
