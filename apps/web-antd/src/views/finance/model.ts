export interface Stock {
  code: string;
  name: string;
  price: null | number;
  priceDate: null | string;
  dividendYield: null | number;
  dividendYear?: number;
  dividendPerShare?: number;
  specialDividendPerShare?: number;
  dividendYieldExSpecial?: number;
  pe: null | number;
  high52Week?: null | number;
  low52Week?: null | number;
  metricsAsOf?: string;
  currency?: string;
  rangeFirstDate?: string;
  rangeLastDate?: string;
  rangeTradingDays?: number;
}
export interface Holding {
  code: string;
  quantity: number;
  cost: number;
}
export interface Point {
  date: string;
  close: number;
}
export interface Fund {
  code: string;
  name: string;
  start: string;
  end: string;
  count: number;
}
export function validateHoldings(value: unknown, codes: string[]): Holding[] {
  if (!Array.isArray(value) || value.length > codes.length)
    throw new Error('invalid');
  const seen = new Set<string>();
  return value.map((row: unknown) => {
    if (
      !row ||
      typeof row !== 'object' ||
      !('code' in row) ||
      !('quantity' in row) ||
      !('cost' in row)
    )
      throw new Error('invalid');
    const { code, quantity, cost } = row;
    if (
      typeof code !== 'string' ||
      !/^\d{6}$/.test(code) ||
      !codes.includes(code) ||
      seen.has(code) ||
      typeof quantity !== 'number' ||
      !Number.isSafeInteger(quantity) ||
      quantity <= 0 ||
      quantity > 1e10 ||
      typeof cost !== 'number' ||
      !Number.isFinite(cost) ||
      cost < 0 ||
      cost > 1e10
    )
      throw new Error('invalid');
    seen.add(code);
    return { code, quantity, cost };
  });
}
export function parseHoldings(text: string, codes: string[]): Holding[] {
  if (text.trim().startsWith('['))
    return validateHoldings(JSON.parse(text), codes);
  const rows: unknown[] = [];
  for (const line of text.split('\n')) {
    const cells = line
      .trim()
      .replaceAll(/^\||\|$/g, '')
      .split('|')
      .map((cell) => cell.trim());
    if (cells.length !== 13 || !/^\d{6}$/.test(cells[1] ?? '')) continue;
    if (!cells[10] && !cells[11]) continue;
    if (!cells[10] || !cells[11]) throw new Error('invalid');
    rows.push({
      code: cells[1],
      quantity: Number(cells[10]),
      cost: Number(cells[11]),
    });
  }
  if (rows.length === 0) throw new Error('invalid');
  return validateHoldings(rows, codes);
}
export function portfolio(stocks: Stock[], holdings: Holding[]) {
  const rows = stocks.map((stock) => {
    const holding = holdings.find((item) => item.code === stock.code);
    const value =
      holding && stock.price !== null ? holding.quantity * stock.price : null;
    const invested = holding ? holding.quantity * holding.cost : null;
    const pnl = value === null || invested === null ? null : value - invested;
    return {
      ...stock,
      quantity: holding?.quantity ?? null,
      cost: holding?.cost ?? null,
      value,
      invested,
      pnl,
      percent: invested && pnl !== null ? (pnl / invested) * 100 : null,
    };
  });
  const value = rows.some((row) => row.quantity !== null && row.value === null)
    ? null
    : rows.reduce((sum, row) => sum + (row.value ?? 0), 0);
  const invested = rows.reduce((sum, row) => sum + (row.invested ?? 0), 0);
  return {
    rows,
    value,
    invested,
    pnl: value === null ? null : value - invested,
    percent:
      value !== null && invested > 0
        ? ((value - invested) / invested) * 100
        : null,
  };
}
export function compare(
  series: { code: string; points: Point[] }[],
  start: string,
) {
  if (series.length === 0) return { dates: [], rows: [] };
  const maps = series.map(
    (s) =>
      new Map(
        s.points
          .filter(
            (p) => p.date >= start && Number.isFinite(p.close) && p.close > 0,
          )
          .map((p) => [p.date, p.close]),
      ),
  );
  const firstMap = maps[0];
  if (!firstMap) return { dates: [], rows: [] };
  const dates = [...firstMap.keys()]
    .filter((date) => maps.every((map) => map.has(date)))
    .toSorted();
  if (dates.length < 2) return { dates, rows: [] };
  const rows = series.map((s, index) => {
    const prices = dates.map((date) => {
      const price = maps[index]?.get(date);
      if (price === undefined) throw new Error('Missing aligned price');
      return price;
    });
    const base = prices[0];
    const close = prices.at(-1);
    if (base === undefined || close === undefined)
      throw new Error('Missing aligned prices');
    let peak = base;
    const drawdown = prices.map((price) => {
      peak = Math.max(peak, price);
      return (price / peak - 1) * 100;
    });
    return {
      code: s.code,
      normalized: prices.map((price) => (price / base) * 100),
      drawdown,
      close,
      change: (close / base - 1) * 100,
      maxDrawdown: Math.min(...drawdown),
    };
  });
  return { dates, rows };
}
export function periodStart(end: string, months: number): string {
  if (!months) return '0000-01-01';
  const date = new Date(`${end}T00:00:00Z`);
  const day = date.getUTCDate();
  date.setUTCDate(1);
  date.setUTCMonth(date.getUTCMonth() - months);
  const last = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0),
  ).getUTCDate();
  date.setUTCDate(Math.min(day, last));
  return date.toISOString().slice(0, 10);
}
