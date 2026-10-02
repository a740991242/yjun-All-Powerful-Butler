export interface SmallArithmeticVisual {
  kind: 'small-arithmetic';
  operation: 'add' | 'subtract';
  rows: number[];
  columns: number[];
  hidden: [number, number][];
}
export function smallArithmeticCell(
  model: SmallArithmeticVisual,
  row: number,
  column: number,
): null | number {
  const r = model.rows[row];
  const c = model.columns[column];
  if (r === undefined || c === undefined) return null;
  return model.operation === 'add' ? r + c : c - r;
}
export function isSmallArithmeticVisual(
  value: unknown,
): value is SmallArithmeticVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const model = value as Record<string, unknown>;
  const axis = (numbers: unknown): numbers is number[] =>
    Array.isArray(numbers) &&
    numbers.length === 3 &&
    [...numbers].every((n) => Number.isInteger(n) && n >= 1 && n <= 19) &&
    new Set(numbers).size === 3;
  if (
    Object.keys(model).length !== 5 ||
    model.kind !== 'small-arithmetic' ||
    typeof model.operation !== 'string' ||
    !['add', 'subtract'].includes(model.operation) ||
    !axis(model.rows) ||
    !axis(model.columns) ||
    !Array.isArray(model.hidden) ||
    model.hidden.length > 9
  )
    return false;
  const columns = model.columns;
  if (
    !model.rows.every((r) =>
      columns.every((c) => {
        const result = model.operation === 'add' ? r + c : c - r;
        return result >= 0 && result <= 20;
      }),
    )
  )
    return false;
  return (
    [...model.hidden].every(
      (p) =>
        Array.isArray(p) &&
        p.length === 2 &&
        [...p].every((n) => Number.isInteger(n) && n >= 0 && n < 3),
    ) &&
    new Set(model.hidden.map((p) => JSON.stringify(p))).size ===
      model.hidden.length
  );
}
