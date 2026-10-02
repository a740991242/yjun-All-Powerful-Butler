export interface ZeroNumberChartVisual {
  kind: 'zero-number-chart';
  value: number;
}
export function isZeroNumberChartVisual(
  value: unknown,
): value is ZeroNumberChartVisual {
  if (typeof value !== 'object' || value === null || Array.isArray(value))
    return false;
  const data = value as Record<string, unknown>;
  return (
    Object.keys(data).length === 2 &&
    data.kind === 'zero-number-chart' &&
    typeof data.value === 'number' &&
    Number.isInteger(data.value) &&
    data.value >= 0 &&
    data.value <= 99
  );
}
/** The first row is 0–9. A numeric successor at a row boundary is not a right neighbor. */
export function zeroNumberPosition(value: number) {
  if (!Number.isInteger(value) || value < 0 || value > 99)
    throw new Error('Invalid zero-number-chart position');
  const column = (value % 10) + 1;
  const row = Math.floor(value / 10) + 1;
  return {
    value,
    row,
    column,
    left: column > 1 ? value - 1 : null,
    right: column < 10 ? value + 1 : null,
    up: row > 1 ? value - 10 : null,
    down: row < 10 ? value + 10 : null,
  };
}
export function zeroNumberRows() {
  return Array.from({ length: 10 }, (_, row) => ({
    id: row,
    ...Object.fromEntries(
      Array.from({ length: 10 }, (_, column) => [
        `c${column}`,
        row * 10 + column,
      ]),
    ),
  }));
}
