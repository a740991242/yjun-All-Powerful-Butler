import { describe, expect, it } from 'vitest';

import {
  mergeQuotes,
  QUOTE_OVERRIDES_KEY,
  readQuoteOverrides,
  validateQuoteOverrides,
  writeQuoteOverrides,
} from './quote-overrides';

describe('manual quote overrides', () => {
  it('validates prices and dates for known securities', () => {
    expect(
      validateQuoteOverrides({
        '601888': { price: 49.99, date: '2026-11-17' },
        '513130': { price: 0.451, date: '2026-11-17' },
      }),
    ).toEqual({
      '601888': { price: 49.99, date: '2026-11-17' },
      '513130': { price: 0.451, date: '2026-11-17' },
    });
    for (const invalid of [
      null,
      [],
      { '999999': { price: 1, date: '2026-11-17' } },
      { '601888': { price: 0, date: '2026-11-17' } },
      { '601888': { price: 50, date: '2026-02-30' } },
      { '601888': { price: 50, date: '17/11/2026' } },
    ])
      expect(() => validateQuoteOverrides(invalid)).toThrow('invalid');
  });

  it('merges overrides without dropping automatic quotes', () => {
    expect(
      mergeQuotes(
        {
          '601888': { price: 51.81, date: '2026-11-16' },
          '601868': { price: 2.23, date: '2026-11-16' },
        },
        { '601888': { price: 50, date: '2026-11-17' } },
      ),
    ).toEqual({
      '601888': { price: 50, date: '2026-11-17' },
      '601868': { price: 2.23, date: '2026-11-16' },
    });
  });

  it('reads and writes a validated local override map', () => {
    const values = new Map<string, string>();
    const storage = {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
    };
    expect(readQuoteOverrides(storage)).toEqual({});
    writeQuoteOverrides(storage, {
      '601868': { price: 2, date: '2026-11-17' },
    });
    expect(values.has(QUOTE_OVERRIDES_KEY)).toBe(true);
    expect(readQuoteOverrides(storage)).toEqual({
      '601868': { price: 2, date: '2026-11-17' },
    });
  });

  it('drops overrides whose securities are no longer selectable', () => {
    const storage = {
      getItem: () =>
        JSON.stringify({
          '600219': { price: 4, date: '2026-11-17' },
          '601888': { price: 49.9, date: '2026-11-17' },
        }),
    };
    expect(readQuoteOverrides(storage)).toEqual({
      '601888': { price: 49.9, date: '2026-11-17' },
    });
  });
});
