import { expect, it } from 'vitest';

import { bnuLowerCountHundredSource as source } from './bnu-lower-count-hundred-source';
it('distinguishes source nine bundles plus ten loose sticks from the separate ninety-nine predecessor', () => {
  expect(source.eggs).toMatchObject({
    eachFullTray: 10,
    firstFullTrays: 9,
    firstTableEggs: 9,
    firstHandEggs: 1,
    packedFullTrays: 10,
    packedTotal: 100,
  });
  expect(source.sticks).toMatchObject({
    bundleSize: 10,
    looseToBundle: 10,
    sourceBundles: 9,
    sourceLoose: 10,
    representedTotal: 100,
    normalizedTens: 10,
    hundredBundles: 1,
  });
  expect(source.sticks.sourceBundles * 10 + source.sticks.sourceLoose).toBe(
    100,
  );
  expect(source.nextAfterNinetyNine).toBe(100);
  expect(source.sticks.boundary).toContain('不误写九捆九根或99');
  expect(source.eggs.boundary).toContain('不把空盒计10个蛋');
});
it('independently checks original starting quantities without extending a tens jump past the target', () => {
  expect(source.fromSeventyFour).toMatchObject({
    bundles: 7,
    ones: 4,
    whole: 74,
    sourceOneByOne: [75, 76, 77],
    sourceTens: [74, 84, 94],
  });
  expect(source.practiceMaterials.sticks).toEqual({
    bundles: 6,
    ones: 7,
    whole: 67,
  });
  expect(source.practiceMaterials.blocks).toEqual({
    tensRods: 8,
    unitCubes: 8,
    whole: 88,
  });
  expect(source.spokenSequences.downGiven).toEqual([90, 80, 70, 60]);
  expect(source.spokenSequences.upGiven).toEqual([22, 32, 42, 52]);
  expect(source.fromSeventyFour.boundary).toContain('不能直接跳104');
});
it('checks every weather cell against independent row counts and does not double-count the sun in a cloud icon', () => {
  expect(source.weather.rows).toHaveLength(7);
  const rowCounts = source.weather.rows.map(
    (row) => [...row].filter((icon) => icon === 'S').length,
  );
  expect(rowCounts).toEqual([10, 0, 3, 7, 4, 6, 5]);
  for (const row of source.weather.rows) {
    expect(row).toHaveLength(10);
    expect(row).toMatch(/^[SC]+$/);
  }
  expect(source.weather.sunny).toBe(35);
  expect(source.weather.partlyCloudy).toBe(35);
  expect(source.weather.totalDays).toBe(70);
  expect(source.weather.rows.join('').replaceAll('C', '')).toHaveLength(35);
  expect(source.weather.rows.join('').replaceAll('S', '')).toHaveLength(35);
  expect(source.weather.boundary).toContain('不叫下雨');
});
it('records only inspected source pages and keeps source inspection separate from the teaching audit', () => {
  expect(source.readPrintedPages).toEqual([46, 47]);
  expect(source.status).toBe('source-checked');
  expect(source.activities.map(({ page, key }) => [page, key])).toEqual([
    [46, 'count-eggs'],
    [46, 'make-ten'],
    [46, 'make-hundred'],
    [47, 'from-seventy-four'],
    [47, 'continue-speaking'],
    [47, 'practice-count-hundred'],
    [47, 'weather-days'],
  ]);
});
