import type { TileGridVisual } from './types';

export function tileCounts(model: TileGridVisual) {
  const filled = model.cells.flat().filter(Boolean).length;
  return { filled, empty: model.cells.flat().length - filled };
}

/** Same-sized, one-layer cells; no hidden overlap or implied area units. */
export function isTileGridVisual(value: unknown): value is TileGridVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const grid = value as Record<string, unknown>;
  if (
    Object.keys(grid).length !== 2 ||
    grid.kind !== 'tile-grid' ||
    !Array.isArray(grid.cells)
  )
    return false;
  const rows = grid.cells;
  if (rows.length < 2 || rows.length > 4 || !Array.isArray(rows[0]))
    return false;
  const columns = rows[0].length;
  if (
    columns < 2 ||
    columns > 4 ||
    !rows.every(
      (row) =>
        Array.isArray(row) &&
        row.length === columns &&
        row.every((cell) => typeof cell === 'boolean'),
    )
  )
    return false;
  const filled = rows.flat().filter(Boolean).length;
  return filled <= 10 && rows.length * columns - filled <= 10;
}
