export interface TenTablesVisual {
  kind: 'ten-tables';
  display: 'add-sub' | 'five-chains' | 'nine-rows';
  variant: 'main' | 'review';
}
export function tenTableRows(model: TenTablesVisual): number[] {
  const rows = Array.from(
    { length: model.display === 'nine-rows' ? 9 : 5 },
    (_, i) => i + 1,
  );
  return model.variant === 'review' ? rows.toReversed() : rows;
}
export function tenArithmeticRows(model: TenTablesVisual) {
  const add = [1, 3, 5, 7, 9];
  const subtract = [2, 4, 6, 8, 10];
  return model.variant === 'review'
    ? { add: add.toReversed(), subtract: subtract.toReversed() }
    : { add, subtract };
}
export function isTenTablesVisual(value: unknown): value is TenTablesVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const m = value as Record<string, unknown>;
  return (
    Object.keys(m).length === 3 &&
    m.kind === 'ten-tables' &&
    (m.display === 'five-chains' ||
      m.display === 'nine-rows' ||
      m.display === 'add-sub') &&
    (m.variant === 'main' || m.variant === 'review')
  );
}

export const tenTableSymbols = (left: number) =>
  Array.from({ length: 10 }, (_, i) => (i < left ? 'A' : 'B')).join(', ');
