export interface TriangleRowsVisual {
  kind: 'triangle-rows';
  rows: number[];
}

export function isTriangleRowsVisual(
  value: unknown,
): value is TriangleRowsVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const data = value as Record<string, unknown>;
  return (
    Object.keys(data).length === 2 &&
    data.kind === 'triangle-rows' &&
    Array.isArray(data.rows) &&
    data.rows.length > 0 &&
    data.rows.length <= 6 &&
    [...data.rows].every(
      (row) =>
        typeof row === 'number' &&
        Number.isInteger(row) &&
        row >= 1 &&
        row <= 6,
    )
  );
}

export function triangleRowDots(rows: number) {
  return Array.from({ length: rows }, (_, row) =>
    Array.from({ length: row + 1 }, (_, column) => ({
      row: row + 1,
      column: column + 1,
      x: 90 + ((rows - 1) / 2 - row + column) * 26,
      y: 20 + row * 26,
    })),
  ).flat();
}
