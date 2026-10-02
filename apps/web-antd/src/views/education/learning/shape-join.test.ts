import type { JoinAction, ShapeJoinState, TrianglePiece } from './shape-join';

import { describe, expect, it } from 'vitest';

import { fold } from './fold';
import {
  initialShapeJoin,
  isShapeJoinState,
  joinedShape,
  moveTriangle,
  trianglePoints,
} from './shape-join';

const state = (a: TrianglePiece, b: TrianglePiece): ShapeJoinState => ({
  selected: 1,
  pieces: [a, b],
});
const piece = (x: number, y: number, turn: number): TrianglePiece => ({
  x,
  y,
  turn,
});

describe('two-triangle composition', () => {
  it('recognizes whole outer boundaries without counting internal seams or mere contact', () => {
    expect(joinedShape(state(piece(0, 0, 0), piece(0, 0, 2)))).toBe('square');
    expect(joinedShape(state(piece(0, 0, 1), piece(2, 0, 0)))).toBe('triangle');
    expect(joinedShape(state(piece(0, 0, 1), piece(2, 0, 3)))).toBe(
      'parallelogram',
    );
    expect(joinedShape(state(piece(0, 0, 0), piece(2, 0, 0)))).toBeNull();
    expect(joinedShape(state(piece(0, 0, 1), piece(2, 1, 0)))).toBeNull();
    expect(joinedShape(initialShapeJoin())).toBeNull();
  });
  it('rejects overlaps, off-board coordinates and malformed saved states', () => {
    for (const value of [
      null,
      {},
      { ...initialShapeJoin(), selected: 2 },
      { ...initialShapeJoin(), unexpected: true },
      state(piece(0, 0, 0), piece(0, 0, 0)),
      state(piece(0, 0, 0), piece(5, 0, 0)),
      state(piece(0, 0, 0), piece(2, 3, 0)),
      state(piece(0, 0, 0), piece(2, 0, 4)),
      state(piece(0, 0, 0), piece(2.5, 0, 0)),
    ])
      expect(isShapeJoinState(value)).toBe(false);
    expect(() =>
      moveTriangle(state(piece(0, 0, 0), piece(0, 0, 0)), 'left'),
    ).toThrow('invalidRecord');
  });
  it('keeps every valid configuration bounded and non-overlapping through all controls, without mutation', () => {
    const placements: TrianglePiece[] = [];
    for (let x = 0; x <= 4; x++)
      for (let y = 0; y <= 2; y++)
        for (let turn = 0; turn < 4; turn++) placements.push(piece(x, y, turn));
    const actions: JoinAction[] = ['left', 'right', 'up', 'down', 'rotate'];
    for (const a of placements)
      for (const b of placements)
        for (const selected of [0, 1]) {
          const current = { selected, pieces: [a, b] } as ShapeJoinState;
          if (!isShapeJoinState(current)) continue;
          const before = structuredClone(current);
          for (const action of actions) {
            const next = moveTriangle(current, action);
            expect(isShapeJoinState(next)).toBe(true);
            expect(next.pieces[1 - selected]).toEqual(
              current.pieces[1 - selected],
            );
            for (const tile of next.pieces) {
              const vertices = trianglePoints(tile);
              const area = fold(vertices, 0, (sum, p, i) => {
                const q = vertices[(i + 1) % 3]!;
                return sum + p.x * q.y - p.y * q.x;
              });
              expect(Math.abs(area)).toBe(4);
            }
          }
          expect(current).toEqual(before);
        }
  });
  it('refuses collision and boundary moves and provides fresh reset states', () => {
    const square = state(piece(0, 0, 0), piece(0, 0, 2));
    expect(moveTriangle(square, 'rotate')).toEqual(square);
    expect(moveTriangle(initialShapeJoin(), 'right')).toEqual(
      initialShapeJoin(),
    );
    const reset = initialShapeJoin();
    reset.pieces[0].x = 1;
    expect(initialShapeJoin().pieces[0].x).toBe(0);
  });
});
