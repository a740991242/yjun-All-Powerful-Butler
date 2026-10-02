import type { JoinAction } from './shape-join';
import type {
  TriangleMosaicPiece,
  TriangleMosaicState,
  TriangleMosaicVisual,
} from './types';

import { expect, it } from 'vitest';

import { sujiaoSquareMosaicsDraft } from '../content/sujiao-square-mosaics';
import { exportBackup, parseBackup } from './backup';
import { createSession } from './engine';
import { sparseArray } from './sparse-array';
import { initialLibrary } from './storage';
import {
  changedTriangle,
  isTriangleMosaicState,
  isTriangleMosaicVisual,
  isTriangleMoveVisual,
  matchingTriangleState,
  moveTriangleMosaic,
  triangleMosaicEdges,
  triangleMosaicPoints,
  triangleMosaicShape,
  triangleMovement,
} from './triangle-mosaic';

const square: TriangleMosaicPiece[] = [
  { x: 2, y: 1, turn: 2 },
  { x: 3, y: 1, turn: 3 },
  { x: 3, y: 2, turn: 0 },
  { x: 2, y: 2, turn: 1 },
];
const rectangle: TriangleMosaicPiece[] = [
  { x: 1, y: 1, turn: 0 },
  { x: 1, y: 1, turn: 2 },
  { x: 2, y: 1, turn: 0 },
  { x: 2, y: 1, turn: 2 },
];
const triangle: TriangleMosaicPiece[] = [
  { x: 1, y: 1, turn: 0 },
  { x: 1, y: 1, turn: 2 },
  { x: 2, y: 1, turn: 0 },
  { x: 1, y: 2, turn: 0 },
];
const parallelogram: TriangleMosaicPiece[] = [
  { x: 0, y: 1, turn: 2 },
  { x: 1, y: 1, turn: 0 },
  { x: 1, y: 1, turn: 2 },
  { x: 2, y: 1, turn: 0 },
];
const visual = (
  pieces: TriangleMosaicPiece[],
  seams = true,
): TriangleMosaicVisual => ({ kind: 'triangle-mosaic', pieces, seams });
const actions: JoinAction[] = ['left', 'right', 'up', 'down', 'rotate'];

it('uses four congruent triangles to fill each complete outline, retaining concave or disconnected alternatives neutrally', () => {
  for (const [pieces, shape] of [
    [square, 'square'],
    [rectangle, 'rectangle'],
    [triangle, 'triangle'],
    [parallelogram, 'parallelogram'],
  ] as const) {
    expect(isTriangleMosaicVisual(visual(pieces))).toBe(true);
    expect(triangleMosaicShape({ selected: 0, pieces })).toBe(shape);
    for (const piece of pieces) {
      const points = triangleMosaicPoints(piece);
      const a = points[0]!;
      const b = points[1]!;
      const c = points[2]!;
      expect(
        Math.abs((b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)),
      ).toBe(1);
    }
  }
  const separated = moveTriangleMosaic(
    { selected: 0, pieces: rectangle },
    'up',
  );
  expect(isTriangleMosaicState(separated)).toBe(true);
  expect(triangleMosaicShape(separated)).toBeNull();
});

it('preserves holes and removes shared boundaries without inventing hidden partition lines', () => {
  const pair = rectangle.slice(0, 2);
  expect(triangleMosaicEdges(pair)).toHaveLength(4);
  expect(triangleMosaicEdges(pair)).not.toContainEqual([2, 1, 1, 2]);
  const ring: TriangleMosaicPiece[] = [];
  for (let y = 0; y < 3; y++)
    for (let x = 0; x < 3; x++) {
      if (x === 1 && y === 1) continue;
      ring.push({ x, y, turn: 0 }, { x, y, turn: 2 });
    }
  expect(isTriangleMosaicVisual(visual(ring, false))).toBe(true);
  expect(triangleMosaicShape({ selected: 0, pieces: ring })).toBeNull();
  expect(triangleMosaicEdges(ring)).toHaveLength(16);
  const inner = triangleMosaicEdges(ring).filter(
    ([x1, y1, x2, y2]) =>
      x1 >= 1 &&
      x1 <= 2 &&
      x2 >= 1 &&
      x2 <= 2 &&
      y1 >= 1 &&
      y1 <= 2 &&
      y2 >= 1 &&
      y2 <= 2,
  );
  expect(inner).toHaveLength(4);
});

it('rejects corrupt materials, extra answer fields, overlaps and out-of-board states', () => {
  for (const pieces of [
    [],
    sparseArray(4),
    [...square, square[0]],
    [{ x: 6, y: 0, turn: 0 }],
    [{ x: 0, y: 4, turn: 0 }],
    [{ x: 0, y: 0, turn: 4 }],
    [{ x: 0.5, y: 0, turn: 0 }],
    [{ x: 0, y: 0, turn: 0, answer: 1 }],
    Array.from({ length: 17 }, () => ({ x: 0, y: 0, turn: 0 })),
  ]) {
    expect(isTriangleMosaicVisual({ ...visual(square), pieces })).toBe(false);
    expect(isTriangleMosaicState({ selected: 0, pieces })).toBe(false);
  }
  expect(isTriangleMosaicVisual({ ...visual(square), seams: 1 })).toBe(false);
  expect(isTriangleMosaicVisual({ ...visual(square), answer: 'square' })).toBe(
    false,
  );
  expect(isTriangleMosaicState({ selected: 4, pieces: square })).toBe(false);
  expect(
    matchingTriangleState({ selected: 0, pieces: rectangle }, visual(square)),
  ).toBe(true);
  expect(
    matchingTriangleState(
      { selected: 0, pieces: rectangle.slice(0, 2) },
      visual(square),
    ),
  ).toBe(false);
  expect(() =>
    moveTriangleMosaic({ selected: -1, pieces: square }, 'left'),
  ).toThrow(Error);
});

it('moves exactly one selected piece immutably, refusing collision or boundaries and validating before/after comparisons', () => {
  const state = { selected: 0, pieces: rectangle };
  const snapshot = structuredClone(state);
  const after = moveTriangleMosaic(state, 'up');
  expect(state).toEqual(snapshot);
  expect(after.pieces.slice(1)).toEqual(rectangle.slice(1));
  const comparison = {
    kind: 'triangle-move' as const,
    before: visual(rectangle),
    after: visual(after.pieces),
  };
  expect(isTriangleMoveVisual(comparison)).toBe(true);
  expect(changedTriangle(comparison)).toBe(0);
  expect(triangleMovement(comparison)).toBe('up');
  expect(
    isTriangleMoveVisual({ ...comparison, after: comparison.before }),
  ).toBe(false);
  const multi = moveTriangleMosaic({ ...after, selected: 3 }, 'right');
  expect(
    isTriangleMoveVisual({ ...comparison, after: visual(multi.pieces) }),
  ).toBe(false);
  expect(isTriangleMoveVisual({ ...comparison, answer: 'A' })).toBe(false);
  expect(moveTriangleMosaic(state, 'rotate')).toEqual(state);
  const boundary = { selected: 0, pieces: [{ x: 0, y: 0, turn: 0 }] };
  for (const action of ['left', 'up'] as const) {
    const next = moveTriangleMosaic(boundary, action);
    expect(next).toEqual(boundary);
    expect(next.pieces[0]).not.toBe(boundary.pieces[0]);
  }
});

/** Search actual legal button moves, with all unselected pieces held fixed. */
function route(
  start: TriangleMosaicState,
  target: TriangleMosaicPiece,
): JoinAction[] | null {
  const key = (s: TriangleMosaicState) => JSON.stringify(s.pieces[s.selected]);
  const queue = [{ state: start, path: [] as JoinAction[] }];
  const seen = new Set([key(start)]);
  for (let i = 0; i < queue.length; i++) {
    const current = queue[i]!;
    if (key(current.state) === JSON.stringify(target)) return current.path;
    for (const action of actions) {
      const next = moveTriangleMosaic(current.state, action);
      const id = key(next);
      if (seen.has(id)) continue;
      seen.add(id);
      queue.push({ state: next, path: [...current.path, action] });
    }
  }
  return null;
}

it('can build all four target outlines through actual legal single-piece controls without resizing, cutting or teleporting', () => {
  const buffers = [
    { x: 0, y: 0, turn: 0 },
    { x: 5, y: 0, turn: 1 },
    { x: 5, y: 3, turn: 2 },
    { x: 0, y: 3, turn: 3 },
  ];
  for (const target of [rectangle, triangle, parallelogram]) {
    let state: TriangleMosaicState = {
      selected: 0,
      pieces: structuredClone(square),
    };
    for (const destinations of [buffers, target])
      for (let selected = 0; selected < 4; selected++) {
        state = { ...state, selected };
        const path = route(state, destinations[selected]!);
        expect(
          path,
          `reachable piece ${selected}, ${JSON.stringify(destinations[selected])}`,
        ).not.toBeNull();
        for (const action of path!) {
          state = moveTriangleMosaic(state, action);
          expect(isTriangleMosaicState(state)).toBe(true);
          expect(state.pieces).toHaveLength(4);
        }
      }
    expect(state.pieces).toEqual(target);
  }
});

it('round-trips saved triangle tools only when bound to a matching manual question, preserving old records', () => {
  const lesson = structuredClone(sujiaoSquareMosaicsDraft);
  const manual = lesson.questions.find((q) => q.rule.kind === 'manual')!;
  manual.visual = visual(square);
  const state = initialLibrary('三角形拼组');
  const session = createSession(
    lesson,
    'sujiao-math-p1-lower-9787574312951',
    state.activeProfileId,
  );
  const tool = moveTriangleMosaic({ selected: 0, pieces: rectangle }, 'up');
  session.tools = {
    'step-0': { triangleMosaic: tool },
    [`question-${manual.id}`]: { triangleMosaic: tool },
  };
  state.sessions.push(session);
  expect(parseBackup(exportBackup(state)).data.sessions[0]).toEqual(session);
  const objective = session.questions.find((q) => q.rule.kind !== 'manual')!;
  for (const key of [`question-${objective.id}`, 'question-missing']) {
    const invalid = structuredClone(state);
    invalid.sessions[0]!.tools = { [key]: { triangleMosaic: tool } };
    expect(() => parseBackup(exportBackup(invalid))).toThrow(Error);
  }
  const mismatch = structuredClone(state);
  mismatch.sessions[0]!.tools![`question-${manual.id}`]!.triangleMosaic = {
    selected: 0,
    pieces: rectangle.slice(0, 2),
  };
  expect(() => parseBackup(exportBackup(mismatch))).toThrow(Error);
  const old = structuredClone(state);
  delete old.sessions[0]!.tools;
  expect(parseBackup(exportBackup(old)).data.sessions[0]).toEqual(
    old.sessions[0],
  );
});
