import { expect, it } from 'vitest';

import { bnuLowerCountBeansSource as source } from './bnu-lower-count-beans-source';
it('keeps estimate-before-count and original outcomes separate from personal actual quantities', () => {
  expect(source.estimate).toMatchObject({
    firstEstimate: 50,
    firstCount: 28,
    secondEstimate: 20,
    secondCount: 22,
  });
  expect(source.estimate.boundary).toContain('不能先数倒填估计');
  expect(source.firstCounters).toEqual([
    { tens: 2, ones: 8, whole: 28 },
    { tens: 2, ones: 2, whole: 22 },
  ]);
});
it('checks every bead grouping through one hundred without treating one hundred bead as one item', () => {
  expect(source.nextCounters).toEqual([
    { hundreds: 0, tens: 9, ones: 7, whole: 97 },
    { hundreds: 0, tens: 9, ones: 8, whole: 98 },
    { hundreds: 0, tens: 9, ones: 9, whole: 99 },
    { hundreds: 1, tens: 0, ones: 0, whole: 100 },
  ]);
  for (const row of source.nextCounters)
    expect(row.hundreds * 100 + row.tens * 10 + row.ones).toBe(row.whole);
  expect(source.thinkTry).toMatchObject({
    given: 42,
    tens: 4,
    ones: 2,
    rods: 4,
    cubes: 2,
    toMake: 34,
  });
  expect(source.practice26).toMatchObject({
    whole: 26,
    tens: 2,
    ones: 6,
    bundlesShown: 2,
  });
  expect(source.beadBoundary).toContain('不是全数只一件');
});
it('separates all three meanings of 100 and both given historical reading examples', () => {
  expect(
    source.lifeRead.map((x) => [x.printedNumber, x.value, x.unit]),
  ).toEqual([
    ['二十七', 27, '次'],
    ['九十九', 99, '道弯'],
  ]);
  expect(source.lifeHundred.map((x) => [x.mark, x.meaning])).toEqual([
    ['100', '书页页码'],
    ['100号', '地址门牌号码'],
    ['100片', '包装标示片数'],
  ]);
  expect(source.lifeHundred[0].boundary).toContain('不证明全书恰有100页');
  expect(source.lifeHundred[2].boundary).toContain('不推当前瓶内剩余');
});
it('retains seven inspected activities separate from the authored teaching audit', () => {
  expect(source.readPrintedPages).toEqual([48, 49]);
  expect(source.status).toBe('source-checked');
  expect(source.activities.map((x) => [x.page, x.key])).toEqual([
    [48, 'estimate-grab'],
    [48, 'counter-and-write'],
    [48, 'recognize-hundred'],
    [49, 'think-try'],
    [49, 'practice-twenty-six'],
    [49, 'read-mark-draw-write'],
    [49, 'find-hundred'],
  ]);
});
