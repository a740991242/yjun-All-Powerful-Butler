import { expect, it } from 'vitest';

import { bnuLowerRecyclingSource as source } from './bnu-lower-recycling-source';

it('records the two read pages and all seven original activities while teaching remains pending', () => {
  expect(source.status).toBe('source-checked');
  expect(source.readPrintedPages).toEqual([72, 73]);
  expect(source.pageImages).toEqual([
    { printedPage: 72, suffix: '076.jpg' },
    { printedPage: 73, suffix: '077.jpg' },
  ]);
  expect(source.activities.map((x) => [x.page, x.key])).toEqual([
    [72, 'read-all-conditions-and-asked-person'],
    [72, 'choose-relevant-information-for-jia'],
    [73, 'sticks-one-to-one-thirteen-plus-three'],
    [73, 'all-thirteen-matched-and-three-extra-circles'],
    [73, 'equation-and-complete-answer'],
    [73, 'check-jia-lin-difference'],
    [73, 'methods-and-information-reflection'],
  ]);
});
it('keeps the asked person separate from the unused comparison relation', () => {
  expect(source.conditions).toEqual({
    lin: 13,
    jiaMoreThanLin: 3,
    qiangFewerThanJia: 4,
    askedPerson: '小佳',
    unit: '个',
  });
  expect(source.relevantForJia).toEqual(['lin', 'jiaMoreThanLin']);
  expect(source.unusedForJia).toEqual(['qiangFewerThanJia']);
  expect(source.equation).toEqual({
    operation: '+',
    values: [13, 3, 16],
    unit: '个',
  });
  expect(source.check).toEqual({ jia: 16, lin: 13, difference: 3 });
  expect(source.check.jia - source.check.lin).toBe(source.check.difference);
  expect(source.check.jia - source.conditions.qiangFewerThanJia).toBe(12);
  expect(source.check.jia).not.toBe(12);
});
it('checks all matched and extra circles and one-stick correspondence without counting a bundle picture as one stick', () => {
  expect(source.circles).toEqual({
    linRow: 13,
    jiaMatched: 13,
    jiaExtra: 3,
    jiaRow: 16,
  });
  expect(source.rods).toEqual({
    bottlePerStick: 1,
    bundleMeaning: 10,
    beforeLoose: 3,
    extraLoose: 3,
    beforeSticks: 13,
    afterSticks: 16,
  });
  expect(source.rods.bundleMeaning + source.rods.beforeLoose).toBe(
    source.rods.beforeSticks,
  );
  expect(source.rods.beforeSticks + source.rods.extraLoose).toBe(
    source.rods.afterSticks,
  );
  expect(source.circles.jiaMatched + source.circles.jiaExtra).toBe(
    source.circles.jiaRow,
  );
});
