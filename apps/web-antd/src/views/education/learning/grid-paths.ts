import type { GridPathsVisual } from './types';

import { fold } from './fold';
import { required } from './required';

export function gridPathLength(points: [number, number][]): number {
  return fold(points.slice(1), 0, (total, point, index) => {
    const previous = required(points[index]);
    return (
      total +
      Math.abs(point[0] - previous[0]) +
      Math.abs(point[1] - previous[1])
    );
  });
}

/** Non-overlapping 5×3 or explicit 5×5 paths, with no loops or diagonals. */
export function isGridPathsVisual(value: unknown): value is GridPathsVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const model = value as Record<string, unknown>;
  const square = model.grid === '5x5';
  if (
    Object.keys(model).length !== (square ? 3 : 2) ||
    (!square && Object.hasOwn(model, 'grid')) ||
    model.kind !== 'grid-paths' ||
    !Array.isArray(model.paths) ||
    model.paths.length !== 3
  )
    return false;
  const ids = new Set<string>();
  const occupied = new Set<string>();
  for (const [pathIndex, unknownPath] of model.paths.entries()) {
    if (
      !unknownPath ||
      typeof unknownPath !== 'object' ||
      Array.isArray(unknownPath)
    )
      return false;
    const path = unknownPath as Record<string, unknown>;
    if (
      Object.keys(path).length !== 2 ||
      typeof path.id !== 'string' ||
      path.id !== ['A', 'B', 'C'][pathIndex] ||
      ids.has(path.id) ||
      !Array.isArray(path.points) ||
      path.points.length < 2 ||
      path.points.length > (square ? 7 : 6)
    )
      return false;
    ids.add(path.id);
    const points: [number, number][] = [];
    for (const point of path.points) {
      if (
        !Array.isArray(point) ||
        point.length !== 2 ||
        ![...point].every((item) => Number.isInteger(item)) ||
        point[0] < 0 ||
        point[0] > 5 ||
        point[1] < 0 ||
        point[1] > (square ? 5 : 3)
      )
        return false;
      points.push([point[0], point[1]]);
    }
    const length = gridPathLength(points);
    if (length < 1 || length > (square ? 6 : 5)) return false;
    const start = required(points[0]);
    const startKey = start.join(',');
    if (occupied.has(startKey)) return false;
    occupied.add(startKey);
    for (const [index, point] of points.slice(1).entries()) {
      const previous = required(points[index]);
      const dx = point[0] - previous[0];
      const dy = point[1] - previous[1];
      if ((dx === 0) === (dy === 0)) return false;
      const distance = Math.abs(dx) + Math.abs(dy);
      for (let step = 1; step <= distance; step++) {
        const key = `${previous[0] + Math.sign(dx) * step},${previous[1] + Math.sign(dy) * step}`;
        if (occupied.has(key)) return false;
        occupied.add(key);
      }
    }
  }
  return true;
}
