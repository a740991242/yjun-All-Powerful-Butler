import type { TrianglePiece } from './shape-join';

import { required } from './required';
import { unitTrianglePoints } from './three-piece-join';
export interface EmbeddedShapesVisual {
  kind: 'embedded-shapes';
  pattern: 0 | 1 | 2 | 3 | 4 | 5;
  highlight: 0 | 1 | 2 | 3 | 4 | 5 | null;
}
const cells = (rows: string[]): TrianglePiece[] =>
  rows.flatMap((row, y) =>
    [...row].flatMap((v, x) =>
      v === '1'
        ? [
            { x, y, turn: 0 },
            { x, y, turn: 2 },
          ]
        : [],
    ),
  );
export const embeddedPieces: TrianglePiece[][] = [
  [
    { x: 0, y: 0, turn: 2 },
    { x: 1, y: 0, turn: 3 },
    ...cells(['00', '11', '11']),
  ],
  cells(['10', '11']),
  cells(['100', '110', '111']),
  cells(['11', '11']),
  cells(['11', '11', '11']),
  [
    { x: 0, y: 0, turn: 2 },
    { x: 1, y: 0, turn: 3 },
    ...cells(['000', '111', '111']),
  ],
];
type Point = [number, number];
interface Region {
  shape: 'parallelogram' | 'rectangle' | 'square' | 'triangle';
  points: Point[];
}
export const embeddedRegions: Region[][] = [
  [
    {
      shape: 'square',
      points: [
        [0, 1],
        [1, 1],
        [1, 2],
        [0, 2],
      ],
    },
    {
      shape: 'square',
      points: [
        [0, 1],
        [2, 1],
        [2, 3],
        [0, 3],
      ],
    },
    {
      shape: 'rectangle',
      points: [
        [0, 1],
        [2, 1],
        [2, 2],
        [0, 2],
      ],
    },
    {
      shape: 'triangle',
      points: [
        [0, 1],
        [1, 0],
        [2, 1],
      ],
    },
    {
      shape: 'triangle',
      points: [
        [0, 1],
        [2, 1],
        [0, 3],
      ],
    },
    {
      shape: 'parallelogram',
      points: [
        [0, 1],
        [1, 1],
        [2, 2],
        [1, 2],
      ],
    },
  ],
  [
    {
      shape: 'rectangle',
      points: [
        [0, 0],
        [1, 0],
        [1, 2],
        [0, 2],
      ],
    },
    {
      shape: 'triangle',
      points: [
        [0, 0],
        [0, 1],
        [1, 1],
      ],
    },
    {
      shape: 'square',
      points: [
        [0, 1],
        [1, 1],
        [1, 2],
        [0, 2],
      ],
    },
    {
      shape: 'parallelogram',
      points: [
        [0, 0],
        [1, 1],
        [1, 2],
        [0, 1],
      ],
    },
    {
      shape: 'triangle',
      points: [
        [0, 0],
        [2, 2],
        [0, 2],
      ],
    },
    {
      shape: 'rectangle',
      points: [
        [0, 1],
        [2, 1],
        [2, 2],
        [0, 2],
      ],
    },
  ],
  [
    {
      shape: 'square',
      points: [
        [0, 2],
        [1, 2],
        [1, 3],
        [0, 3],
      ],
    },
    {
      shape: 'square',
      points: [
        [0, 1],
        [2, 1],
        [2, 3],
        [0, 3],
      ],
    },
    {
      shape: 'rectangle',
      points: [
        [0, 2],
        [3, 2],
        [3, 3],
        [0, 3],
      ],
    },
    {
      shape: 'triangle',
      points: [
        [0, 2],
        [0, 3],
        [1, 3],
      ],
    },
    {
      shape: 'triangle',
      points: [
        [0, 0],
        [3, 3],
        [0, 3],
      ],
    },
    {
      shape: 'parallelogram',
      points: [
        [0, 0],
        [1, 1],
        [1, 3],
        [0, 2],
      ],
    },
  ],
];
export function embeddedGeometry(model: EmbeddedShapesVisual) {
  return {
    pieces: required(embeddedPieces[model.pattern]).map((piece) =>
      unitTrianglePoints(piece),
    ),
    region:
      model.highlight === null
        ? null
        : required(required(embeddedRegions[model.pattern])[model.highlight]),
  };
}
export function isEmbeddedShapesVisual(
  value: unknown,
): value is EmbeddedShapesVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const m = value as Record<string, unknown>;
  return (
    Object.keys(m).length === 3 &&
    m.kind === 'embedded-shapes' &&
    typeof m.pattern === 'number' &&
    Number.isInteger(m.pattern) &&
    m.pattern >= 0 &&
    m.pattern <= 5 &&
    (m.highlight === null ||
      (m.pattern <= 2 &&
        typeof m.highlight === 'number' &&
        Number.isInteger(m.highlight) &&
        m.highlight >= 0 &&
        m.highlight <= 5))
  );
}
