import type { Answer, NumberTowerVisual, TowerRows } from './types';

function cell(value: unknown): value is null | number {
  return (
    value === null ||
    (typeof value === 'number' &&
      Number.isInteger(value) &&
      value >= 0 &&
      value <= 19)
  );
}
export function isTowerRows(value: unknown): value is TowerRows {
  return (
    Array.isArray(value) &&
    value.length === 3 &&
    [...value].every(
      (row, index) =>
        Array.isArray(row) &&
        row.length === index + 1 &&
        [...row].every((item) => cell(item)),
    ) &&
    value.flat().some((n) => n !== null)
  );
}
export function towerBlankCount(rows: TowerRows): number {
  return rows.flat().filter((n) => n === null).length;
}
/** Enumerate every legal filling, never attach solved values to the diagram. */
export function towerSolutions(rows: TowerRows): number[][] {
  const solutions: number[][] = [];
  for (let left = 0; left <= 19; left++) {
    if (rows[2][0] !== null && rows[2][0] !== left) continue;
    for (let middle = 0; middle <= 19 - left; middle++) {
      if (rows[2][1] !== null && rows[2][1] !== middle) continue;
      for (let right = 0; right <= 19 - left - 2 * middle; right++) {
        if (rows[2][2] !== null && rows[2][2] !== right) continue;
        const filled = [
          left + 2 * middle + right,
          left + middle,
          middle + right,
          left,
          middle,
          right,
        ];
        const given = rows.flat();
        if (given.every((n, index) => n === null || n === filled[index])) {
          solutions.push(filled.filter((_n, index) => given[index] === null));
        }
      }
    }
  }
  return solutions;
}
export function matchesTower(rows: TowerRows, answer: Answer | null): boolean {
  if (!Array.isArray(answer) || answer.length !== towerBlankCount(rows))
    return false;
  let index = 0;
  const filled = rows.flat().map((n) => (n === null ? answer[index++] : n));
  if (
    !filled.every(
      (n) => typeof n === 'number' && Number.isInteger(n) && n >= 0 && n <= 19,
    )
  )
    return false;
  const [top, left, right, a, b, c] = filled;
  return (
    typeof a === 'number' &&
    typeof b === 'number' &&
    typeof c === 'number' &&
    left === a + b &&
    right === b + c &&
    top === left + right
  );
}
export function isNumberTowerVisual(
  value: unknown,
): value is NumberTowerVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const model = value as Record<string, unknown>;
  return (
    Object.keys(model).length === 2 &&
    model.kind === 'number-tower' &&
    isTowerRows(model.rows) &&
    towerSolutions(model.rows).length > 0
  );
}
export function isTowerRule(
  value: unknown,
): value is { kind: 'tower'; rows: TowerRows } {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const rule = value as Record<string, unknown>;
  return (
    Object.keys(rule).length === 2 &&
    rule.kind === 'tower' &&
    isTowerRows(rule.rows) &&
    towerBlankCount(rule.rows) > 0 &&
    towerSolutions(rule.rows).length > 0
  );
}
