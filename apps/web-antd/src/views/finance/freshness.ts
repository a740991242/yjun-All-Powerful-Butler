export type Freshness = 'fresh' | 'future' | 'missing' | 'stale';
export function dateOnly(value: null | string | undefined) {
  if (!value) return null;
  const date = /^\d{14}$/.test(value)
    ? `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`
    : value.slice(0, 10);
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    !Number.isFinite(Date.parse(date)) ||
    new Date(date).toISOString().slice(0, 10) !== date
  )
    return null;
  return date;
}
export function freshness(
  value: null | string | undefined,
  valid: boolean,
  today: string,
  maxDays: number,
): Freshness {
  const date = dateOnly(value);
  if (!date || !valid) return 'missing';
  const age = (Date.parse(today) - Date.parse(date)) / 86_400_000;
  if (age < 0) return 'future';
  return age > maxDays ? 'stale' : 'fresh';
}
