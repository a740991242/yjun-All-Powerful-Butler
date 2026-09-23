export type StockBoard = 'bse' | 'chinext' | 'main' | 'other' | 'star';
export type BoardFilter = 'all' | StockBoard;
export type MarketFilter = 'a' | 'all' | 'hk';

// References: https://www.szse.cn/marketServices/technicalservice/doc/P020241212550140892927.pdf
// https://www.bse.cn/qt/200026972.html
// Exchange code ranges; apply only to the stock snapshot, never to arbitrary securities.
export function stockBoard(code: string): null | StockBoard {
  if (!/^\d{6}$/.test(code)) return null;
  if (/^68[89]/.test(code)) return 'star';
  if (code.startsWith('30')) return 'chinext';
  if (/^(?:60[0135]|00[0-4])/.test(code)) return 'main';
  if (code.startsWith('920')) return 'bse';
  return 'other';
}

export function matchesStockMarket(
  code: string,
  market: MarketFilter,
  board: BoardFilter,
): boolean {
  if (market === 'all') return true;
  if (market === 'hk') return /^HK\d{4,5}$/.test(code);
  const category = stockBoard(code);
  return category !== null && (board === 'all' || board === category);
}
