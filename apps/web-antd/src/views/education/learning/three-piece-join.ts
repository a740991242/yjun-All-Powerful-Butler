import type { JoinAction, TrianglePiece } from './shape-join';

import { fold } from './fold';
import { required } from './required';
import { hull, overlaps } from './shape-join';

export interface ThreePieceJoinState {
  selected: number;
  pieces: [TrianglePiece, TrianglePiece, TrianglePiece];
}
const corners = [
  [
    [0, 0],
    [1, 0],
    [0, 1],
  ],
  [
    [1, 0],
    [1, 1],
    [0, 0],
  ],
  [
    [1, 1],
    [0, 1],
    [1, 0],
  ],
  [
    [0, 1],
    [0, 0],
    [1, 1],
  ],
];
export function unitTrianglePoints(piece: TrianglePiece) {
  return required(corners[piece.turn]).map(([x, y]) => ({
    x: required(x) + piece.x,
    y: required(y) + piece.y,
  }));
}
/** Fixed original materials: A is a 2-by-1 rectangle; B/C are unit right triangles. */
export function threePiecePoints(piece: TrianglePiece, index: number) {
  const width = piece.turn % 2 === 0 ? 2 : 1;
  const height = 3 - width;
  const points =
    index === 0
      ? [
          [0, 0],
          [width, 0],
          [width, height],
          [0, height],
        ]
      : required(corners[piece.turn]);
  return points.map(([x, y]) => ({
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
export function isThreePieceJoinState(
  value: unknown,
): value is ThreePieceJoinState {
  if (
    !record(value) ||
    Object.keys(value).length !== 2 ||
    !bounded(value.selected, 2) ||
    !Array.isArray(value.pieces) ||
    value.pieces.length !== 3
  )
    return false;
  const polygons = [];
  for (let index = 0; index < 3; index++) {
    const piece = value.pieces[index];
    if (
      !record(piece) ||
      Object.keys(piece).length !== 3 ||
      !bounded(piece.x, 5) ||
      !bounded(piece.y, 3) ||
      !bounded(piece.turn, 3)
    )
      return false;
    const polygon = threePiecePoints(
      { x: piece.x, y: piece.y, turn: piece.turn },
      index,
    );
    if (polygon.some((point) => point.x > 6 || point.y > 4)) return false;
    polygons.push(polygon);
  }
  return (
    !overlaps(required(polygons[0]), required(polygons[1])) &&
    !overlaps(required(polygons[0]), required(polygons[2])) &&
    !overlaps(required(polygons[1]), required(polygons[2]))
  );
}
export const initialThreePieceJoin = (): ThreePieceJoinState => ({
  selected: 1,
  pieces: [
    { x: 1, y: 1, turn: 0 },
    { x: 4, y: 0, turn: 0 },
    { x: 5, y: 3, turn: 2 },
  ],
});
export function moveThreePiece(
  state: ThreePieceJoinState,
  action: JoinAction,
): ThreePieceJoinState {
  if (!isThreePieceJoinState(state))
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
  return isThreePieceJoinState(next) ? next : structuredClone(state);
}
/** Filled convex boundary only: the hull must exactly cover all three non-overlapping pieces. */
export function threePieceShape(
  state: ThreePieceJoinState,
): 'parallelogram' | 'rectangle' | 'triangle' | null {
  if (!isThreePieceJoinState(state)) return null;
  const boundary = hull(
    state.pieces.flatMap((item, index) => threePiecePoints(item, index)),
  );
  const twiceArea = Math.abs(
    fold(boundary, 0, (sum, point, index) => {
      const next = required(boundary[(index + 1) % boundary.length]);
      return sum + point.x * next.y - point.y * next.x;
    }),
  );
  if (twiceArea !== 6) return null;
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
  return required(vectors[0]).x * required(vectors[1]).x +
    required(vectors[0]).y * required(vectors[1]).y ===
    0
    ? 'rectangle'
    : 'parallelogram';
}
