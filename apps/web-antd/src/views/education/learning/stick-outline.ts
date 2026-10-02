import type { StickOutlineVisual } from './types';

import { required } from './required';

interface Point {
  x: number;
  y: number;
}
const altitude = Math.sqrt(3) / 2;
const layouts = {
  'twelve-square': [
    [0, 0],
    [3, 0],
    [3, 3],
    [0, 3],
  ],
  'twelve-rectangle': [
    [0, 0],
    [4, 0],
    [4, 2],
    [0, 2],
  ],
  'twelve-triangle': [
    [0, 0],
    [4, 0],
    [2, 4 * altitude],
  ],
  'twelve-slanted': [
    [0, 0],
    [4, 0],
    [5, 2 * altitude],
    [1, 2 * altitude],
  ],
  square: [
    [0, 0],
    [1, 0],
    [1, 1],
    [0, 1],
  ],
  'slanted-four': [
    [0, 0],
    [1, 0],
    [1.5, altitude],
    [0.5, altitude],
  ],
  rectangle: [
    [0, 0],
    [2, 0],
    [2, 1],
    [0, 1],
  ],
  'slanted-six': [
    [0, 0],
    [2, 0],
    [2.5, altitude],
    [0.5, altitude],
  ],
  triangle: [
    [0, 0],
    [2, 0],
    [1, 2 * altitude],
  ],
  'six-sided': [
    [0, 0],
    [1, 0],
    [1.5, altitude],
    [1, 2 * altitude],
    [0, 2 * altitude],
    [-0.5, altitude],
  ],
};
export function isStickOutlineVisual(
  value: unknown,
): value is StickOutlineVisual {
  if (typeof value !== 'object' || value === null || Array.isArray(value))
    return false;
  const model = value as Record<string, unknown>;
  return (
    Object.keys(model).length === 3 &&
    model.kind === 'stick-outline' &&
    typeof model.layout === 'string' &&
    Object.hasOwn(layouts, model.layout) &&
    (model.turn === 0 || model.turn === 90)
  );
}
/** Original closed examples. Each segment is one whole unit stick, including collinear joins. */
export function stickSegments(model: StickOutlineVisual): [Point, Point][] {
  const vertices = layouts[model.layout].map(([x, y]): Point =>
    model.turn === 90
      ? { x: -required(y), y: required(x) }
      : { x: required(x), y: required(y) },
  );
  return vertices.flatMap((start, index) => {
    const end = required(vertices[(index + 1) % vertices.length]);
    const count = Math.round(Math.hypot(end.x - start.x, end.y - start.y));
    return Array.from({ length: count }, (_, i): [Point, Point] => [
      {
        x: start.x + ((end.x - start.x) * i) / count,
        y: start.y + ((end.y - start.y) * i) / count,
      },
      {
        x: start.x + ((end.x - start.x) * (i + 1)) / count,
        y: start.y + ((end.y - start.y) * (i + 1)) / count,
      },
    ]);
  });
}
export function stickSideCount(model: StickOutlineVisual) {
  return layouts[model.layout].length;
}
export function displayStickSegments(model: StickOutlineVisual) {
  const segments = stickSegments(model);
  const points = segments.flat();
  const centerX =
    (Math.min(...points.map((p) => p.x)) +
      Math.max(...points.map((p) => p.x))) /
    2;
  const centerY =
    (Math.min(...points.map((p) => p.y)) +
      Math.max(...points.map((p) => p.y))) /
    2;
  const extent = Math.max(
    Math.max(...points.map((p) => p.x)) - Math.min(...points.map((p) => p.x)),
    Math.max(...points.map((p) => p.y)) - Math.min(...points.map((p) => p.y)),
  );
  const scale = Math.min(80, 240 / extent);
  return segments.map(
    ([a, b]) =>
      [a, b].map((p) => ({
        x: 160 + (p.x - centerX) * scale,
        y: 160 + (p.y - centerY) * scale,
      })) as [Point, Point],
  );
}
