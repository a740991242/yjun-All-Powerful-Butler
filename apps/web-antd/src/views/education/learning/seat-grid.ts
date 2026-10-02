import type { SeatGridVisual } from './types';

export type SeatDirection = 'front' | 'left' | 'rear' | 'right';

export function seatPosition(model: SeatGridVisual, label: string) {
  for (const [row, labels] of model.rows.entries()) {
    const column = labels.indexOf(label);
    if (column !== -1) return { row: row + 1, column: column + 1 };
  }
  return undefined;
}

export function seatNeighbour(
  model: SeatGridVisual,
  label: string,
  direction: SeatDirection,
) {
  const position = seatPosition(model, label);
  if (!position) return undefined;
  const row =
    position.row -
    1 +
    (() => {
      if (direction === 'front') return -1;
      return direction === 'rear' ? 1 : 0;
    })();
  const column =
    position.column -
    1 +
    (() => {
      if (direction === 'left') return -1;
      return direction === 'right' ? 1 : 0;
    })();
  return model.rows[row]?.[column];
}

/** Fixed top-down view: every seat faces the top edge, with nine unique labels. */
export function isSeatGridVisual(value: unknown): value is SeatGridVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const model = value as Record<string, unknown>;
  if (
    Object.keys(model).length !== 2 ||
    model.kind !== 'seat-grid' ||
    !Array.isArray(model.rows) ||
    model.rows.length !== 3
  )
    return false;
  const names = new Set<string>();
  for (const row of model.rows) {
    if (!Array.isArray(row) || row.length !== 3) return false;
    for (const label of row) {
      if (
        typeof label !== 'string' ||
        label.length === 0 ||
        label.length > 4 ||
        label.trim() !== label ||
        /[\r\n]/.test(label) ||
        names.has(label)
      )
        return false;
      names.add(label);
    }
  }
  return true;
}
