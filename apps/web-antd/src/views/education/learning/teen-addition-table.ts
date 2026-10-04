export interface TeenAdditionTableVisual {
  kind: 'teen-addition-table';
  variant: 'main' | 'review';
}
export interface TeenAdditionCell {
  left: number;
  right: number;
  label: null | string;
}
export interface TeenAdditionRow {
  total: number;
  cells: TeenAdditionCell[];
}
const printed = new Set([
  '11:3',
  '11:5',
  '11:7',
  '11:8',
  '11:9',
  '12:9',
  '14:7',
  '14:9',
  '15:8',
  '18:9',
]);
/** Fixed source range; no arbitrary equations or answer-bearing fields in snapshots. */
export function teenAdditionRows(
  visual: TeenAdditionTableVisual,
): TeenAdditionRow[] {
  let blank = 0;
  return Array.from({ length: 8 }, (_, row) => {
    const total = row + 11;
    const lefts = Array.from({ length: 19 - total }, (_, i) => 9 - i);
    if (visual.variant === 'review') lefts.reverse();
    return {
      total,
      cells: lefts.map((left) => ({
        left,
        right: total - left,
        label: printed.has(`${total}:${left}`)
          ? null
          : String.fromCodePoint(65 + blank++),
      })),
    };
  });
}
export function isTeenAdditionTableVisual(
  value: unknown,
): value is TeenAdditionTableVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const data = value as Record<string, unknown>;
  return (
    Object.keys(data).length === 2 &&
    data.kind === 'teen-addition-table' &&
    (data.variant === 'main' || data.variant === 'review')
  );
}
