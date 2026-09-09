import { describe, expect, it } from 'vitest';

import en from '../../locales/langs/en-US/finance.json';
import zh from '../../locales/langs/zh-CN/finance.json';
import {
  compare,
  parseHoldings,
  periodStart,
  portfolio,
  validateHoldings,
} from './model';
describe('local portfolio', () => {
  const stocks = [
    {
      code: '000001',
      name: 'Test',
      price: 12,
      priceDate: '2026-09-08',
      dividendYield: null,
      pe: null,
    },
    {
      code: '000002',
      name: 'Other',
      price: 5,
      priceDate: '2026-09-08',
      dividendYield: null,
      pe: null,
    },
  ];
  it('weights profit by invested capital rather than averaging percentages', () => {
    const result = portfolio(stocks, [
      { code: '000001', quantity: 100, cost: 10 },
      { code: '000002', quantity: 1000, cost: 6 },
    ]);
    expect(result.value).toBe(6200);
    expect(result.invested).toBe(7000);
    expect(result.pnl).toBe(-800);
    expect(result.percent).toBeCloseTo((-800 / 7000) * 100);
  });
  it('distinguishes no holding and zero cost', () => {
    expect(portfolio(stocks, []).rows[0]?.value).toBeNull();
    expect(
      portfolio(stocks, [{ code: '000001', quantity: 1, cost: 0 }]).percent,
    ).toBeNull();
  });
  it('rejects malformed, unknown, duplicate and non-finite input', () => {
    for (const value of [
      [{ code: '000001', quantity: 0, cost: 1 }],
      [{ code: '000001', quantity: 1.1, cost: 1 }],
      [{ code: '000001', quantity: 1, cost: Infinity }],
      [{ code: '999999', quantity: 1, cost: 1 }],
      [
        { code: '000001', quantity: 1, cost: 1 },
        { code: '000001', quantity: 1, cost: 2 },
      ],
    ])
      expect(() => validateHoldings(value, ['000001'])).toThrow('invalid');
  });
  it('imports Markdown quantity and cost without treating blanks as zero', () => {
    expect(
      parseHoldings('| Test | 000001 | date | 12 | | | | | | | 100 | 10 | |', [
        '000001',
      ]),
    ).toEqual([{ code: '000001', quantity: 100, cost: 10 }]);
    expect(() =>
      parseHoldings('| Test | 000001 | date | 12 | | | | | | | 100 | | |', [
        '000001',
      ]),
    ).toThrow('invalid');
    expect(
      parseHoldings('[{"code":"000001","quantity":100,"cost":10}]', ['000001']),
    ).toHaveLength(1);
  });
});
describe('eTF price comparison', () => {
  it('aligns dates before rebasing and computes interval drawdown', () => {
    const result = compare(
      [
        {
          code: 'A',
          points: [
            { date: '2026-01-01', close: 50 },
            { date: '2026-01-02', close: 100 },
            { date: '2026-01-03', close: 120 },
            { date: '2026-01-04', close: 90 },
          ],
        },
        {
          code: 'B',
          points: [
            { date: '2026-01-02', close: 10 },
            { date: '2026-01-03', close: 11 },
            { date: '2026-01-04', close: 12 },
          ],
        },
      ],
      '2026-01-01',
    );
    expect(result.dates).toHaveLength(3);
    expect(result.rows[0]?.normalized).toEqual([100, 120, 90]);
    expect(result.rows[0]?.maxDrawdown).toBe(-25);
    expect(result.rows[0]?.change).toBeCloseTo(-10);
  });
  it('requires two valid shared sessions and excludes invalid prices', () => {
    expect(
      compare(
        [{ code: 'A', points: [{ date: '2026-01-01', close: 0 }] }],
        '2026-01-01',
      ).rows,
    ).toEqual([]);
    expect(compare([], '2026-01-01').rows).toEqual([]);
  });
  it('clamps month ends when looking back from the snapshot', () => {
    expect(periodStart('2024-03-31', 1)).toBe('2024-02-29');
  });
});

it('provides matching Chinese and English finance translations', () => {
  function keys(value: Record<string, unknown>, prefix = ''): string[] {
    return Object.entries(value)
      .flatMap(([key, item]) =>
        item && typeof item === 'object'
          ? keys(item as Record<string, unknown>, `${prefix}${key}.`)
          : [`${prefix}${key}`],
      )
      .toSorted();
  }
  expect(keys(zh)).toEqual(keys(en));
});

it('keeps missing prices out of valuations instead of treating them as zero', () => {
  const result = portfolio(
    [
      {
        code: '600887',
        name: 'Test',
        price: null,
        priceDate: null,
        dividendYield: null,
        pe: null,
      },
    ],
    [{ code: '600887', quantity: 100, cost: 10 }],
  );
  expect(result.rows[0]?.value).toBeNull();
  expect(result.value).toBeNull();
  expect(result.pnl).toBeNull();
  expect(result.percent).toBeNull();
  expect(result.invested).toBe(1000);
});
it('does not mix Hong Kong holdings into CNY portfolio totals', () => {
  expect(() =>
    validateHoldings([{ code: 'HK0700', quantity: 100, cost: 10 }], ['HK0700']),
  ).toThrow('invalid');
});
