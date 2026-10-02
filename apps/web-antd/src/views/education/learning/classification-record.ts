import type { ClassificationRecordVisual } from './types';
export function isClassificationRecordVisual(
  value: unknown,
): value is ClassificationRecordVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const v = value as Record<string, unknown>;
  if (
    Object.keys(v).length !== 2 ||
    v.kind !== 'classification-record' ||
    !Array.isArray(v.rows) ||
    v.rows.length < 2 ||
    v.rows.length > 4
  )
    return false;
  let total = 0;
  for (const row of v.rows) {
    if (!row || typeof row !== 'object' || Array.isArray(row)) return false;
    const r = row as Record<string, unknown>;
    if (
      Object.keys(r).length !== 3 ||
      typeof r.label !== 'string' ||
      !r.label.trim() ||
      r.label.length > 40 ||
      typeof r.mark !== 'string' ||
      !['circle', 'square', 'tick', 'triangle'].includes(r.mark) ||
      typeof r.count !== 'number' ||
      !Number.isInteger(r.count) ||
      r.count < 0 ||
      r.count > 20
    )
      return false;
    total += r.count;
  }
  return (
    total >= 1 &&
    total <= 30 &&
    new Set(v.rows.map((r) => r.label)).size === v.rows.length
  );
}
