import { describe, expect, it } from 'vitest';

import { matchesStockMarket, stockBoard } from './stock-board';

describe('a-share board filters', () => {
  it.each([
    ['600690', 'main'],
    ['601169', 'main'],
    ['603259', 'main'],
    ['605499', 'main'],
    ['000001', 'main'],
    ['001330', 'main'],
    ['002352', 'main'],
    ['003816', 'main'],
    ['004001', 'main'],
    ['688543', 'star'],
    ['689009', 'star'],
    ['300750', 'chinext'],
    ['301001', 'chinext'],
    ['309800', 'chinext'],
    ['920001', 'bse'],
    ['900901', 'other'],
    ['200002', 'other'],
    ['999999', 'other'],
    ['HK0700', null],
    ['60069', null],
    ['', null],
  ])('classifies %s as %s', (code, expected) => {
    expect(stockBoard(code)).toBe(expected);
  });
  it('keeps board selection confined to A shares', () => {
    expect(matchesStockMarket('688543', 'a', 'star')).toBe(true);
    expect(matchesStockMarket('600690', 'a', 'star')).toBe(false);
    expect(matchesStockMarket('HK0700', 'a', 'all')).toBe(false);
    expect(matchesStockMarket('HK0700', 'hk', 'star')).toBe(true);
    expect(matchesStockMarket('600690', 'hk', 'all')).toBe(false);
    expect(matchesStockMarket('600690', 'all', 'star')).toBe(true);
    expect(matchesStockMarket('999999', 'a', 'other')).toBe(true);
    expect(matchesStockMarket('60069', 'a', 'all')).toBe(false);
  });
});
