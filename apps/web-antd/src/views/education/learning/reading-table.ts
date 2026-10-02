import type { ReadingTableVisual } from './types';

function labels(value: unknown, length: number): value is string[] {
  return (
    Array.isArray(value) &&
    value.length === length &&
    [...value].every(
      (s) => typeof s === 'string' && s.trim().length > 0 && s.length <= 24,
    ) &&
    new Set(value).size === length
  );
}
/** Each cell counts pages read on that day, never cumulative page numbers. */
export function isReadingTableVisual(
  value: unknown,
): value is ReadingTableVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const table = value as Record<string, unknown>;
  return (
    Object.keys(table).length === 4 &&
    table.kind === 'reading-table' &&
    labels(table.names, 2) &&
    labels(table.days, 3) &&
    Array.isArray(table.pages) &&
    table.pages.length === 2 &&
    [...table.pages].every(
      (row) =>
        Array.isArray(row) &&
        row.length === 3 &&
        [...row].every(
          (n) =>
            typeof n === 'number' && Number.isInteger(n) && n >= 0 && n <= 19,
        ),
    )
  );
}
