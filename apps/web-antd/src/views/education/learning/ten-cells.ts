export interface TenCellsVisual {
  kind: 'ten-cells';
}
export function isTenCellsVisual(value: unknown): value is TenCellsVisual {
  return (
    !!value &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.keys(value).length === 1 &&
    'kind' in value &&
    value.kind === 'ten-cells'
  );
}
export function isTenCellsState(value: unknown): value is number[] {
  return (
    Array.isArray(value) &&
    value.length <= 10 &&
    [...value].every((n) => Number.isInteger(n) && n >= 0 && n < 10) &&
    new Set(value).size === value.length
  );
}
export function toggleTenCell(selected: number[], index: number): number[] {
  if (
    !isTenCellsState(selected) ||
    !Number.isInteger(index) ||
    index < 0 ||
    index >= 10
  )
    throw new Error('Invalid ten-cell selection');
  return selected.includes(index)
    ? selected.filter((n) => n !== index)
    : [...selected, index];
}
