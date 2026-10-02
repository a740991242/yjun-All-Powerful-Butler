import type { JoinAction, TrianglePiece } from './shape-join';
import type {
  TriangleMosaicState,
  TriangleMosaicVisual,
  TriangleMoveVisual,
} from './types';

import { fold } from './fold';
import { required } from './required';
import { hull, overlaps } from './shape-join';
import { unitTrianglePoints } from './three-piece-join';
export const triangleMosaicPoints = unitTrianglePoints;
const record = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);
const integer = (value: unknown, max: number): value is number =>
  typeof value === 'number' &&
  Number.isInteger(value) &&
  value >= 0 &&
  value <= max;
function pieces(value: unknown): value is TrianglePiece[] {
  if (!Array.isArray(value) || value.length === 0 || value.length > 16)
    return false;
  const polygons = [];
  for (const piece of value) {
    if (
      !record(piece) ||
      Object.keys(piece).length !== 3 ||
      !integer(piece.x, 5) ||
      !integer(piece.y, 3) ||
      !integer(piece.turn, 3)
    )
      return false;
    polygons.push(
      unitTrianglePoints({ x: piece.x, y: piece.y, turn: piece.turn }),
    );
  }
  for (let i = 0; i < polygons.length; i++)
    for (let j = i + 1; j < polygons.length; j++)
      if (overlaps(required(polygons[i]), required(polygons[j]))) return false;
  return true;
}
export function isTriangleMosaicVisual(
  value: unknown,
): value is TriangleMosaicVisual {
  return (
    record(value) &&
    Object.keys(value).length === 3 &&
    value.kind === 'triangle-mosaic' &&
    typeof value.seams === 'boolean' &&
    pieces(value.pieces)
  );
}
export function isTriangleMosaicState(
  value: unknown,
): value is TriangleMosaicState {
  return (
    record(value) &&
    Object.keys(value).length === 2 &&
    pieces(value.pieces) &&
    integer(value.selected, value.pieces.length - 1)
  );
}
export function matchingTriangleState(
  state: unknown,
  visual: TriangleMosaicVisual,
): state is TriangleMosaicState {
  return (
    isTriangleMosaicState(state) && state.pieces.length === visual.pieces.length
  );
}
export function moveTriangleMosaic(
  state: TriangleMosaicState,
  action: JoinAction,
): TriangleMosaicState {
  if (!isTriangleMosaicState(state))
    throw new Error('educationLearning.invalidRecord');
  const next = {
    selected: state.selected,
    pieces: state.pieces.map((p) => ({ ...p })),
  };
  const piece = required(next.pieces[next.selected]);
  if (action === 'left') piece.x--;
  if (action === 'right') piece.x++;
  if (action === 'up') piece.y--;
  if (action === 'down') piece.y++;
  if (action === 'rotate') piece.turn = (piece.turn + 1) % 4;
  return isTriangleMosaicState(next)
    ? next
    : { selected: state.selected, pieces: state.pieces.map((p) => ({ ...p })) };
}
export function triangleMosaicShape(
  state: TriangleMosaicState,
): 'parallelogram' | 'rectangle' | 'square' | 'triangle' | null {
  if (!isTriangleMosaicState(state)) return null;
  const boundary = hull(
    state.pieces.flatMap((item) => unitTrianglePoints(item)),
  );
  const twiceArea = Math.abs(
    fold(boundary, 0, (sum, p, i) => {
      const next = required(boundary[(i + 1) % boundary.length]);
      return sum + p.x * next.y - p.y * next.x;
    }),
  );
  if (twiceArea !== state.pieces.length) return null;
  if (boundary.length === 3) return 'triangle';
  if (boundary.length !== 4) return null;
  const v = boundary.map((p, i) => ({
    x: required(boundary[(i + 1) % 4]).x - p.x,
    y: required(boundary[(i + 1) % 4]).y - p.y,
  }));
  if (
    required(v[0]).x !== -required(v[2]).x ||
    required(v[0]).y !== -required(v[2]).y ||
    required(v[1]).x !== -required(v[3]).x ||
    required(v[1]).y !== -required(v[3]).y
  )
    return null;
  if (
    required(v[0]).x * required(v[1]).x +
      required(v[0]).y * required(v[1]).y !==
    0
  )
    return 'parallelogram';
  return required(v[0]).x ** 2 + required(v[0]).y ** 2 ===
    required(v[1]).x ** 2 + required(v[1]).y ** 2
    ? 'square'
    : 'rectangle';
}
export function triangleMosaicEdges(
  list: TrianglePiece[],
): [number, number, number, number][] {
  const edges = new Map<
    string,
    { edge: [number, number, number, number]; count: number }
  >();
  for (const piece of list) {
    const vertices = unitTrianglePoints(piece);
    for (let i = 0; i < 3; i++) {
      const a = required(vertices[i]);
      const b = required(vertices[(i + 1) % 3]);
      const key = [`${a.x},${a.y}`, `${b.x},${b.y}`].toSorted().join(';');
      const old = edges.get(key);
      if (old) old.count++;
      else edges.set(key, { edge: [a.x, a.y, b.x, b.y], count: 1 });
    }
  }
  return [...edges.values()]
    .filter((item) => item.count === 1)
    .map((item) => item.edge);
}
export function changedTriangle(visual: TriangleMoveVisual): number {
  const changed = visual.before.pieces.flatMap((p, i) => {
    const q = visual.after.pieces[i];
    return q && (p.x !== q.x || p.y !== q.y || p.turn !== q.turn) ? [i] : [];
  });
  return changed.length === 1 ? required(changed[0]) : -1;
}
export function triangleMovement(
  visual: TriangleMoveVisual,
): JoinAction | null {
  const index = changedTriangle(visual);
  if (index < 0) return null;
  for (const action of ['left', 'right', 'up', 'down', 'rotate'] as const) {
    const next = moveTriangleMosaic(
      { selected: index, pieces: visual.before.pieces },
      action,
    );
    if (JSON.stringify(next.pieces) === JSON.stringify(visual.after.pieces))
      return action;
  }
  return null;
}
export function isTriangleMoveVisual(
  value: unknown,
): value is TriangleMoveVisual {
  return (
    record(value) &&
    Object.keys(value).length === 3 &&
    value.kind === 'triangle-move' &&
    isTriangleMosaicVisual(value.before) &&
    isTriangleMosaicVisual(value.after) &&
    value.before.pieces.length === value.after.pieces.length &&
    triangleMovement(value as unknown as TriangleMoveVisual) !== null
  );
}
