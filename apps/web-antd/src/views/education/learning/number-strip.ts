export interface NumberStripVisual {
  kind: 'number-strip';
  values: (null | number)[];
}
export function isNumberStripVisual(
  value: unknown,
): value is NumberStripVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const data = value as Record<string, unknown>;
  return (
    Object.keys(data).length === 2 &&
    data.kind === 'number-strip' &&
    Array.isArray(data.values) &&
    data.values.length >= 2 &&
    data.values.length <= 12 &&
    [...data.values].every(
      (n) =>
        n === null ||
        (typeof n === 'number' && Number.isSafeInteger(n) && n >= 0 && n <= 99),
    ) &&
    data.values.some((n) => n !== null)
  );
}
