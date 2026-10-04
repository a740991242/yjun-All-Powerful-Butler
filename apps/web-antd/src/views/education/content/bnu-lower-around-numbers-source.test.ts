import { expect, it } from 'vitest';

import { bnuLowerAroundNumbersSource as source } from './bnu-lower-around-numbers-source';

it('independently counts every source marker and distinguishes pictures from represented quantities', () => {
  const rows = [10, 10, 10, 10, 10, 10, 2];
  expect(source.circles.representedPeanuts).toBe(
    rows.reduce((a, b) => a + b, 0),
  );
  expect(source.circles).toMatchObject({
    fullRows: 6,
    perRow: 10,
    remaining: 2,
    eachRepresents: 1,
  });
  expect(source.triangles).toMatchObject({
    large: 7,
    small: 5,
    drawnMarkers: 12,
    representedPeanuts: 75,
  });
  expect(source.triangles.large * 10 + source.triangles.small).toBe(75);
  expect(source.triangles.drawnMarkers).not.toBe(
    source.triangles.representedPeanuts,
  );
  expect(source.triangles.boundary).toContain('分组约定');
});
it('keeps crossing a decade, life units, two actual rounds and open investigations distinct', () => {
  expect(source.counting.oneAtATime).toEqual([18, 19, 20]);
  expect(source.counting.nextAfterTwenty).toBe(21);
  expect(source.counting.otherSequence).toEqual([27, 28, 29]);
  expect(source.counting.nextAfterTwentyNine).toBe(30);
  expect(source.lifeExamples).toMatchObject({
    chessPieces: { value: 32, unit: '个' },
    crayons: { value: 36, unit: '支' },
    originalClass: { value: 36, unit: '名' },
    skippingRounds: [92, 94],
    skippingUnit: '次',
  });
  expect(source.counting.boundary).toContain('未从低分辨率插画猜总数');
  expect(source.lifeExamples.boundary).toContain('不冒学习者班级人数');
  expect(source.ownQuestions.boundary).toContain('计划不自动当实际结果');
});
it('declares only inspected pages without inferring whole-unit teaching completion', () => {
  expect(source.readPrintedPages).toEqual([44, 45]);
  expect(source.status).toBe('source-checked');
  expect(source.activities.map(({ page, key }) => [page, key])).toEqual([
    [44, 'compare-before-count'],
    [44, 'one-by-one'],
    [44, 'check-count'],
    [45, 'represent-circles'],
    [45, 'represent-triangles'],
    [45, 'numbers-around'],
    [45, 'own-question'],
  ]);
});
