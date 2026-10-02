import { expect, it } from 'vitest';

import { isMonthWeatherVisual, monthWeatherRecords } from './month-weather';
it('accepts only fixed month variants and rejects forged records and totals', () => {
  for (const variant of ['main', 'review'])
    expect(isMonthWeatherVisual({ kind: 'month-weather', variant })).toBe(true);
  for (const value of [
    null,
    [],
    {},
    { kind: 'month-weather', variant: 'actual' },
    { kind: 'month-weather', variant: 'main', records: [1, 2, 3] },
    { kind: 'month-weather', variant: 'main', total: 30 },
  ])
    expect(isMonthWeatherVisual(value)).toBe(false);
});
it('contains exactly thirty different days, one category per day and changed review counts', () => {
  for (const variant of ['main', 'review'] as const) {
    const records = monthWeatherRecords(variant);
    expect(records.map((r) => r.day)).toEqual(
      Array.from({ length: 30 }, (_, i) => i + 1),
    );
    expect(
      [1, 2, 3].map((code) => records.filter((r) => r.code === code).length),
    ).toEqual(variant === 'main' ? [12, 7, 11] : [13, 7, 10]);
    expect(
      records.every((r) => ['cloudy', 'rainy', 'sunny'].includes(r.kind)),
    ).toBe(true);
    expect(
      records.filter((r) => r.code === 1).every((r) => r.kind === 'sunny'),
    ).toBe(true);
    expect(
      records.filter((r) => r.code === 2).every((r) => r.kind === 'cloudy'),
    ).toBe(true);
    expect(
      records.filter((r) => r.code === 3).every((r) => r.kind === 'rainy'),
    ).toBe(true);
    records[0]!.day = 99;
    expect(monthWeatherRecords(variant)[0]!.day).toBe(1);
  }
  expect(monthWeatherRecords('review').map((r) => r.code)).not.toEqual(
    monthWeatherRecords('main').map((r) => r.code),
  );
});
