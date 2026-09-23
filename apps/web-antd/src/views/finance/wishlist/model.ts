export interface Target {
  code: string;
  price: number;
  rule: 'around' | 'atMost' | 'below';
  near: number;
  note: string;
}
export interface Quote {
  price: null | number;
  date: null | string;
}
export const catalog = [
  { code: '510210', name: '上证指数ETF富国', kind: 'etf', price: 0.67 },
  { code: '513130', name: '恒生科技ETF华泰柏瑞', kind: 'etf', price: 0.53 },
  { code: '510300', name: '沪深300ETF华泰柏瑞', kind: 'etf', price: 3.5 },
  { code: '513100', name: '纳指ETF国泰', kind: 'etf', price: 1.2 },
  { code: '601328', name: '交通银行', kind: 'stock', price: 6.4 },
  { code: '600050', name: '中国联通', kind: 'stock', price: 4 },
  { code: '600219', name: '南山铝业', kind: 'stock', price: 4 },
  { code: '601818', name: '光大银行', kind: 'stock', price: 2.9 },
  { code: '600900', name: '长江电力', kind: 'stock', price: 20 },
  { code: '600036', name: '招商银行', kind: 'stock', price: 36 },
  { code: '000776', name: '广发证券', kind: 'stock', price: 20 },
  { code: '000651', name: '格力电器', kind: 'stock', price: 36 },
  { code: '002563', name: '森马服饰', kind: 'stock', price: 5 },
  { code: '600690', name: '海尔智家', kind: 'stock', price: 19.5 },
] as const;
export function defaults(): Target[] {
  return catalog.map((item) => {
    let rule: Target['rule'] = 'around';
    if (item.code === '600900') rule = 'below';
    else if (
      ['002563', '600050', '600219', '600690', '601818'].includes(item.code)
    )
      rule = 'atMost';
    return {
      code: item.code,
      price: item.price,
      near: 3,
      rule,
      note:
        item.code === '510210'
          ? '上证指数约 3750 点考虑买入（独立观察条件）'
          : '',
    };
  });
}
export function validateTargets(input: unknown): Target[] {
  if (!Array.isArray(input) || input.length > catalog.length)
    throw new Error('invalid');
  const seen = new Set<string>();
  return input.map((value: unknown) => {
    if (!value || typeof value !== 'object') throw new Error('invalid');
    const row = value as Record<string, unknown>;
    if (
      typeof row.code !== 'string' ||
      !catalog.some((s) => s.code === row.code) ||
      seen.has(row.code) ||
      typeof row.price !== 'number' ||
      !Number.isFinite(row.price) ||
      row.price <= 0 ||
      row.price > 1e6 ||
      typeof row.near !== 'number' ||
      !Number.isFinite(row.near) ||
      row.near < 0 ||
      row.near > 100 ||
      !['around', 'atMost', 'below'].includes(String(row.rule)) ||
      typeof row.note !== 'string' ||
      row.note.length > 500
    )
      throw new Error('invalid');
    seen.add(row.code);
    return {
      code: row.code,
      price: row.price,
      near: row.near,
      note: row.note,
      rule: row.rule as Target['rule'],
    };
  });
}
export function upgradeLegacyTargets(input: unknown): Target[] {
  const saved = validateTargets(input);
  const additions = defaults().filter(
    (target) =>
      target.code === '002563' &&
      !saved.some((row) => row.code === target.code),
  );
  return [...saved, ...additions];
}
export function upgradeV2Targets(input: unknown): Target[] {
  const saved = validateTargets(input);
  const additions = defaults().filter(
    (target) =>
      target.code === '600690' &&
      !saved.some((row) => row.code === target.code),
  );
  return [...saved, ...additions];
}
export function evaluate(
  target: Target,
  quote: Quote | undefined,
  today: string,
) {
  const price = quote?.price;
  const date = quote?.date;
  if (
    typeof price !== 'number' ||
    !Number.isFinite(price) ||
    price <= 0 ||
    !date ||
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    !Number.isFinite(Date.parse(date)) ||
    new Date(date).toISOString().slice(0, 10) !== date
  )
    return { status: 'missing', gap: null, below: null } as const;
  const age = (Date.parse(today) - Date.parse(date)) / 86_400_000;
  if (age < 0 || age > 4)
    return { status: 'stale', gap: null, below: null } as const;
  const reached =
    target.rule === 'below' ? price < target.price : price <= target.price;
  const near = price <= target.price * (1 + target.near / 100);
  let status: 'near' | 'reached' | 'waiting' = 'waiting';
  if (reached) status = 'reached';
  else if (near) status = 'near';
  return {
    status,
    gap: Math.max(0, ((price - target.price) / price) * 100),
    below: Math.max(0, ((target.price - price) / target.price) * 100),
  } as const;
}
export const statusOrder = {
  reached: 0,
  near: 1,
  waiting: 2,
  stale: 3,
  missing: 4,
};
