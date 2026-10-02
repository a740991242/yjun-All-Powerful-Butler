import { fold } from './fold';
import { required } from './required';
export interface TrianglePiece {
  x: number;
  y: number;
  turn: number;
}
export interface ShapeJoinState {
  selected: number;
  pieces: [TrianglePiece, TrianglePiece];
}
export type JoinAction = 'down' | 'left' | 'right' | 'rotate' | 'up';
interface Point {
  x: number;
  y: number;
}
const corners = [
  [
    [0, 0],
    [2, 0],
    [0, 2],
  ],
  [
    [2, 0],
    [2, 2],
    [0, 0],
  ],
  [
    [2, 2],
    [0, 2],
    [2, 0],
  ],
  [
    [0, 2],
    [0, 0],
    [2, 2],
  ],
];
export function trianglePoints(piece: TrianglePiece): Point[] {
  return required(corners[piece.turn]).map(([x, y]) => ({
    x: required(x) + piece.x,
    y: required(y) + piece.y,
  }));
}
const record = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);
const bounded = (value: unknown, maximum: number): value is number =>
  typeof value === 'number' &&
  Number.isInteger(value) &&
  value >= 0 &&
  value <= maximum;
/** Separating-axis test: touching edges are permitted, intersecting interiors are not. */
export function overlaps(a: Point[], b: Point[]) {
  for (const polygon of [a, b]) {
    for (let index = 0; index < polygon.length; index++) {
      const p = required(polygon[index]);
      const q = required(polygon[(index + 1) % polygon.length]);
      const axis = { x: p.y - q.y, y: q.x - p.x };
      const ap = a.map((point) => point.x * axis.x + point.y * axis.y);
      const bp = b.map((point) => point.x * axis.x + point.y * axis.y);
      if (
        Math.max(...ap) <= Math.min(...bp) ||
        Math.max(...bp) <= Math.min(...ap)
      )
        return false;
    }
  }
  return true;
}
export function isShapeJoinState(value: unknown): value is ShapeJoinState {
  if (
    !record(value) ||
    Object.keys(value).length !== 2 ||
    !bounded(value.selected, 1) ||
    !Array.isArray(value.pieces) ||
    value.pieces.length !== 2
  )
    return false;
  const pieces: TrianglePiece[] = [];
  for (const piece of value.pieces) {
    if (
      !record(piece) ||
      Object.keys(piece).length !== 3 ||
      !bounded(piece.x, 4) ||
      !bounded(piece.y, 2) ||
      !bounded(piece.turn, 3)
    )
      return false;
    pieces.push({ x: piece.x, y: piece.y, turn: piece.turn });
  }
  return !overlaps(
    trianglePoints(required(pieces[0])),
    trianglePoints(required(pieces[1])),
  );
}
export const initialShapeJoin = (): ShapeJoinState => ({
  selected: 1,
  pieces: [
    { x: 0, y: 0, turn: 0 },
    { x: 4, y: 2, turn: 2 },
  ],
});
export function moveTriangle(
  state: ShapeJoinState,
  action: JoinAction,
): ShapeJoinState {
  if (!isShapeJoinState(state))
    throw new Error('educationLearning.invalidRecord');
  const next = structuredClone(state);
  const piece = required(next.pieces[next.selected]);
  switch (action) {
    case 'left': {
      piece.x--;
      break;
    }
    case 'right': {
      piece.x++;
      break;
    }
    case 'up': {
      piece.y--;
      break;
    }
    case 'down': {
      piece.y++;
      break;
    }
    case 'rotate': {
      piece.turn = (piece.turn + 1) % 4;
      break;
    }
  }
  return isShapeJoinState(next) ? next : structuredClone(state);
}
const cross = (o: Point, a: Point, b: Point) =>
  (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
export function hull(points: Point[]) {
  const sorted = points
    .toSorted((a, b) => a.x - b.x || a.y - b.y)
    .filter(
      (point, index, list) =>
        index === 0 ||
        point.x !== required(list[index - 1]).x ||
        point.y !== required(list[index - 1]).y,
    );
  const half = (list: Point[]) => {
    const result: Point[] = [];
    for (const point of list) {
      while (
        result.length >= 2 &&
        cross(required(result.at(-2)), required(result.at(-1)), point) <= 0
      )
        result.pop();
      result.push(point);
    }
    return result.slice(0, -1);
  };
  return [...half(sorted), ...half(sorted.toReversed())];
}
/** A shape is recognized only when its convex outer area equals the two tiles' total area. */
export function joinedShape(
  state: ShapeJoinState,
): 'parallelogram' | 'square' | 'triangle' | null {
  if (!isShapeJoinState(state)) return null;
  const boundary = hull(state.pieces.flatMap((item) => trianglePoints(item)));
  const twiceArea = Math.abs(
    fold(boundary, 0, (sum, point, index) => {
      const next = required(boundary[(index + 1) % boundary.length]);
      return sum + point.x * next.y - point.y * next.x;
    }),
  );
  if (twiceArea !== 8) return null;
  if (boundary.length === 3) return 'triangle';
  if (boundary.length !== 4) return null;
  const vectors = boundary.map((point, index) => {
    const next = required(boundary[(index + 1) % 4]);
    return { x: next.x - point.x, y: next.y - point.y };
  });
  if (
    required(vectors[0]).x !== -required(vectors[2]).x ||
    required(vectors[0]).y !== -required(vectors[2]).y ||
    required(vectors[1]).x !== -required(vectors[3]).x ||
    required(vectors[1]).y !== -required(vectors[3]).y
  )
    return null;
  const lengths = vectors.map((vector) => vector.x ** 2 + vector.y ** 2);
  return required(vectors[0]).x * required(vectors[1]).x +
    required(vectors[0]).y * required(vectors[1]).y ===
    0 && lengths.every((length) => length === lengths[0])
    ? 'square'
    : 'parallelogram';
}
