import type { SquareMosaicState, SquareMosaicVisual } from './types';

import { required } from './required';
const record = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);
export function mosaicCount(cells: boolean[][]) {
  return cells.flat().filter(Boolean).length;
}
function validCells(value: unknown, minimum: number): value is boolean[][] {
  if (!Array.isArray(value) || value.length === 0 || value.length > 5)
    return false;
  const first = value[0];
  if (!Array.isArray(first) || first.length === 0 || first.length > 5)
    return false;
  for (const row of value) {
    if (
      !Array.isArray(row) ||
      row.length !== first.length ||
      ![...row].every((c) => typeof c === 'boolean')
    )
      return false;
  }
  const count = mosaicCount(value);
  return count >= minimum && count <= 16;
}
export function isSquareMosaicVisual(
  value: unknown,
): value is SquareMosaicVisual {
  return (
    record(value) &&
    Object.keys(value).length === 3 &&
    value.kind === 'square-mosaic' &&
    typeof value.seams === 'boolean' &&
    validCells(value.cells, 1)
  );
}
export function isSquareMosaicState(
  value: unknown,
): value is SquareMosaicState {
  return (
    record(value) &&
    Object.keys(value).length === 1 &&
    validCells(value.cells, 0)
  );
}
export function matchingMosaicState(
  state: unknown,
  visual: SquareMosaicVisual,
): state is SquareMosaicState {
  return (
    isSquareMosaicState(state) &&
    state.cells.length === visual.cells.length &&
    required(state.cells[0]).length === required(visual.cells[0]).length &&
    mosaicCount(state.cells) <= mosaicCount(visual.cells)
  );
}
export function toggleMosaic(
  visual: SquareMosaicVisual,
  state: SquareMosaicState,
  row: number,
  column: number,
): SquareMosaicState {
  if (
    !isSquareMosaicVisual(visual) ||
    !matchingMosaicState(state, visual) ||
    !Number.isInteger(row) ||
    !Number.isInteger(column) ||
    row < 0 ||
    row >= state.cells.length ||
    column < 0 ||
    column >= required(state.cells[0]).length
  )
    throw new Error('educationLearning.invalidRecord');
  const next = structuredClone(state);
  if (
    !required(next.cells[row])[column] &&
    mosaicCount(next.cells) === mosaicCount(visual.cells)
  )
    return next;
  required(next.cells[row])[column] = !required(next.cells[row])[column];
  return next;
}
export function mosaicShape(
  cells: boolean[][],
): 'empty' | 'other' | 'rectangle' | 'square' {
  const points = cells.flatMap((row, y) =>
    row.flatMap((active, x) => (active ? [[x, y] as const] : [])),
  );
  if (points.length === 0) return 'empty';
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  const h = Math.max(...ys) - Math.min(...ys) + 1;
  const w = Math.max(...xs) - Math.min(...xs) + 1;
  return (() => {
    if (points.length === w * h) return w === h ? 'square' : 'rectangle';
    return 'other';
  })();
}
export function mosaicEdges(
  cells: boolean[][],
): [number, number, number, number][] {
  const edges: [number, number, number, number][] = [];
  for (let row = 0; row < cells.length; row++)
    for (let col = 0; col < required(cells[row]).length; col++) {
      if (!required(cells[row])[col]) continue;
      if (!cells[row - 1]?.[col]) edges.push([col, row, col + 1, row]);
      if (!cells[row]?.[col + 1]) edges.push([col + 1, row, col + 1, row + 1]);
      if (!cells[row + 1]?.[col]) edges.push([col, row + 1, col + 1, row + 1]);
      if (!cells[row]?.[col - 1]) edges.push([col, row, col, row + 1]);
    }
  return edges;
}
export function rotateMosaic(cells: boolean[][]): boolean[][] {
  return required(cells[0]).map((_, x) =>
    cells.map((row) => required(row[x])).toReversed(),
  );
}
