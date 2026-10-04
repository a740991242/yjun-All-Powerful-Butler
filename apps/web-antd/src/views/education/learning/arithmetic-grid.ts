import type { ArithmeticGridVisual } from './types';

export function arithmeticAxes(mode: ArithmeticGridVisual['mode']) {
  const columns = (() => {
    if (mode === 'borrow-complete' || mode === 'bnu-subtract')
      return Array.from({ length: 9 }, (_n, i) => 9 - i);
    return mode === 'sum-grid'
      ? Array.from({ length: 9 }, (_n, i) => 1 + i)
      : Array.from({ length: 8 }, (_n, i) => 9 - i);
  })();
  const rows = (() => {
    if (mode === 'borrow-complete' || mode === 'bnu-subtract')
      return Array.from({ length: 9 }, (_n, i) => 10 + i);
    if (mode === 'borrow-subtract')
      return Array.from({ length: 8 }, (_n, i) => 11 + i);
    return mode === 'sum-grid'
      ? Array.from({ length: 9 }, (_n, i) => 1 + i)
      : Array.from({ length: 8 }, (_n, i) => 2 + i);
  })();
  return { rows, columns };
}
export function arithmeticCell(
  mode: ArithmeticGridVisual['mode'],
  row: number,
  column: number,
) {
  const axes = arithmeticAxes(mode);
  const c = axes.columns[column];
  const r = axes.rows[row];
  if (r === undefined || c === undefined) return null;
  if (mode === 'bnu-subtract') {
    const subtract = r - c;
    return subtract >= 1 && subtract <= 9
      ? { expression: `${r}−${subtract}`, value: c }
      : null;
  }
  if (mode === 'carry-add')
    return r + c > 10 ? { expression: `${c}+${r}`, value: c + r } : null;
  if (mode === 'borrow-subtract' || mode === 'borrow-complete')
    return r % 10 < c ? { expression: `${r}−${c}`, value: r - c } : null;
  return { expression: `${r}+${c}`, value: r + c };
}
export function sumFrequency(sum: number): number {
  let count = 0;
  for (let a = 1; a <= 9; a++)
    for (let b = 1; b <= 9; b++) if (a + b === sum) count++;
  return count;
}
export function isArithmeticGridVisual(
  value: unknown,
): value is ArithmeticGridVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const model = value as Record<string, unknown>;
  if (
    !Object.keys(model).every((key) =>
      ['hidden', 'kind', 'marked', 'mode'].includes(key),
    ) ||
    model.kind !== 'arithmetic-grid' ||
    typeof model.mode !== 'string' ||
    ![
      'bnu-subtract',
      'borrow-complete',
      'borrow-subtract',
      'carry-add',
      'sum-grid',
    ].includes(String(model.mode)) ||
    !Array.isArray(model.hidden) ||
    model.hidden.length > (model.mode === 'bnu-subtract' ? 19 : 6)
  )
    return false;
  const mode = model.mode as ArithmeticGridVisual['mode'];
  if (
    ![...model.hidden].every(
      (position) =>
        Array.isArray(position) &&
        position.length === 2 &&
        [...position].every(
          (n) => typeof n === 'number' && Number.isInteger(n) && n >= 0,
        ) &&
        arithmeticCell(mode, position[0], position[1]) !== null,
    ) ||
    new Set(model.hidden.map((p) => JSON.stringify(p))).size !==
      model.hidden.length
  )
    return false;
  return (
    model.marked === undefined ||
    (mode === 'sum-grid' &&
      Array.isArray(model.marked) &&
      model.marked.length > 0 &&
      model.marked.length <= 3 &&
      [...model.marked].every(
        (n) => Number.isInteger(n) && n >= 2 && n <= 18,
      ) &&
      new Set(model.marked).size === model.marked.length)
  );
}
