import type { QuantityTableVisual } from './types';
function label(value: unknown): value is string {
  return (
    typeof value === 'string' && value.trim().length > 0 && value.length <= 24
  );
}
function cell(value: unknown): value is null | number {
  return (
    value === null ||
    (typeof value === 'number' &&
      Number.isInteger(value) &&
      value >= 0 &&
      value <= 19)
  );
}
/** Each independent column describes part A + part B = total, with at most one blank. */
export function isQuantityTableVisual(
  value: unknown,
): value is QuantityTableVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const model = value as Record<string, unknown>;
  if (
    Object.keys(model).length !== 4 ||
    model.kind !== 'quantity-table' ||
    !Array.isArray(model.columns) ||
    model.columns.length === 0 ||
    model.columns.length > 4 ||
    ![...model.columns].every((item) => label(item)) ||
    new Set(model.columns).size !== model.columns.length ||
    !Array.isArray(model.parts) ||
    model.parts.length !== 2 ||
    ![...model.parts].every((item) => label(item)) ||
    model.parts[0] === model.parts[1] ||
    !Array.isArray(model.values) ||
    model.values.length !== 3
  )
    return false;
  const rows = model.values;
  const width = model.columns.length;
  if (
    !rows.every(
      (row) =>
        Array.isArray(row) &&
        row.length === width &&
        [...row].every((item) => cell(item)),
    )
  )
    return false;
  for (let column = 0; column < width; column++) {
    const a = rows[0][column];
    const b = rows[1][column];
    const total = rows[2][column];
    if ([a, b, total].filter((n) => n === null).length > 1) return false;
    if (a === null) {
      if (total === null || b === null || total < b) return false;
    } else if (b === null) {
      if (total === null || total < a) return false;
    } else if (total === null) {
      if (a + b > 19) return false;
    } else if (a + b !== total) return false;
  }
  return true;
}
export function quantityTableMissing(model: QuantityTableVisual): number[] {
  const result: number[] = [];
  for (let column = 0; column < model.columns.length; column++) {
    const a = model.values[0][column];
    const b = model.values[1][column];
    const total = model.values[2][column];
    if (a === null && typeof b === 'number' && typeof total === 'number')
      result.push(total - b);
    else if (b === null && typeof a === 'number' && typeof total === 'number')
      result.push(total - a);
    else if (total === null && typeof a === 'number' && typeof b === 'number')
      result.push(a + b);
  }
  return result;
}
