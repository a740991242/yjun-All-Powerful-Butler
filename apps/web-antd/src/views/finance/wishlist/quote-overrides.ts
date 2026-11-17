import type { Quote } from './model';

import { catalog } from './model';

export interface QuoteOverride {
  date: string;
  price: number;
}

export type QuoteOverrideMap = Record<string, QuoteOverride>;

export const QUOTE_OVERRIDES_KEY =
  'all-in-one-butler:finance:quote-overrides:v1';

function validDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value))
    return false;
  const parsed = new Date(value);
  return (
    Number.isFinite(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === value
  );
}

export function validateQuoteOverrides(input: unknown): QuoteOverrideMap {
  if (!input || typeof input !== 'object' || Array.isArray(input))
    throw new Error('invalid');
  const result: QuoteOverrideMap = {};
  for (const [code, value] of Object.entries(input)) {
    if (!catalog.some((security) => security.code === code))
      throw new Error('invalid');
    if (!value || typeof value !== 'object' || Array.isArray(value))
      throw new Error('invalid');
    const row = value as Record<string, unknown>;
    if (
      typeof row.price !== 'number' ||
      !Number.isFinite(row.price) ||
      row.price <= 0 ||
      row.price > 1e6 ||
      !validDate(row.date)
    )
      throw new Error('invalid');
    result[code] = { price: row.price, date: row.date };
  }
  return result;
}

export function readQuoteOverrides(
  storage: Pick<Storage, 'getItem'>,
): QuoteOverrideMap {
  const current = storage.getItem(QUOTE_OVERRIDES_KEY);
  return current === null ? {} : validateQuoteOverrides(JSON.parse(current));
}

export function writeQuoteOverrides(
  storage: Pick<Storage, 'setItem'>,
  overrides: QuoteOverrideMap,
) {
  const normalized = validateQuoteOverrides(overrides);
  storage.setItem(QUOTE_OVERRIDES_KEY, JSON.stringify(normalized));
  return normalized;
}

export function mergeQuotes(
  marketQuotes: Record<string, Quote>,
  overrides: QuoteOverrideMap,
): Record<string, Quote> {
  const merged = { ...marketQuotes };
  for (const [code, override] of Object.entries(overrides))
    merged[code] = { price: override.price, date: override.date };
  return merged;
}
