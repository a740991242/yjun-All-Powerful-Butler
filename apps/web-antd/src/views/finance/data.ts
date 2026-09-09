import { publicAsset } from '#/utils/public-asset';
export async function snapshot<T>(file: string): Promise<T> {
  const response = await fetch(publicAsset(`data/finance/${file}.json`));
  if (!response.ok) throw new Error('load');
  return response.json() as Promise<T>;
}
export function number(value: null | number | undefined, digits = 2): string {
  return value === null || value === undefined || !Number.isFinite(value)
    ? '—'
    : value.toLocaleString(undefined, {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
      });
}
export function signed(value: null | number | undefined): string {
  return value === null || value === undefined
    ? '—'
    : `${value > 0 ? '+' : ''}${number(value)}`;
}
