import type { Answer, MagicCells, MagicGridVisual } from './types';

import { fold } from './fold';
import { required } from './required';

/** The eight rotations/reflections of the normal 1–9 square. */
function completeGrids(): number[][] {
  let grid = [8, 1, 6, 3, 5, 7, 4, 9, 2];
  const result: number[][] = [];
  for (let turn = 0; turn < 4; turn++) {
    result.push(grid, [
      required(grid[2]),
      required(grid[1]),
      required(grid[0]),
      required(grid[5]),
      required(grid[4]),
      required(grid[3]),
      required(grid[8]),
      required(grid[7]),
      required(grid[6]),
    ]);
    grid = [
      required(grid[6]),
      required(grid[3]),
      required(grid[0]),
      required(grid[7]),
      required(grid[4]),
      required(grid[1]),
      required(grid[8]),
      required(grid[5]),
      required(grid[2]),
    ];
  }
  return result;
}
const GRIDS = completeGrids();
const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
export function isMagicCells(value: unknown): value is MagicCells {
  if (
    !Array.isArray(value) ||
    value.length !== 3 ||
    ![...value].every(
      (row) =>
        Array.isArray(row) &&
        row.length === 3 &&
        [...row].every(
          (n) =>
            n === null ||
            (typeof n === 'number' && Number.isInteger(n) && n >= 1 && n <= 9),
        ),
    )
  )
    return false;
  const given = value.flat().filter((n) => n !== null);
  return given.length > 0 && new Set(given).size === given.length;
}
export function magicBlankCount(cells: MagicCells): number {
  return cells.flat().filter((n) => n === null).length;
}
/** Used to validate feasibility, not rendered as hints or attached answers. */
export function magicSolutions(cells: MagicCells): number[][] {
  const given = cells.flat();
  return GRIDS.filter((grid) =>
    given.every((n, i) => n === null || n === grid[i]),
  ).map((grid) => grid.filter((_n, i) => given[i] === null));
}
export function matchesMagicGrid(
  cells: MagicCells,
  answer: Answer | null,
): boolean {
  if (!Array.isArray(answer) || answer.length !== magicBlankCount(cells))
    return false;
  let index = 0;
  const filled = cells.flat().map((n) => (n === null ? answer[index++] : n));
  if (
    !filled.every(
      (n): n is number =>
        typeof n === 'number' && Number.isInteger(n) && n >= 1 && n <= 9,
    ) ||
    new Set(filled).size !== 9
  )
    return false;
  return LINES.every(
    (line) => fold(line, 0, (sum, i) => sum + required(filled[i])) === 15,
  );
}
export function isMagicGridVisual(value: unknown): value is MagicGridVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const model = value as Record<string, unknown>;
  return (
    Object.keys(model).length === 2 &&
    model.kind === 'magic-grid' &&
    isMagicCells(model.cells) &&
    magicSolutions(model.cells).length > 0
  );
}
export function isMagicGridRule(
  value: unknown,
): value is { kind: 'magic-grid'; cells: MagicCells } {
  return isMagicGridVisual(value) && magicBlankCount(value.cells) > 0;
}
