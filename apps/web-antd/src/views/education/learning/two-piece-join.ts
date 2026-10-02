export type PairArrangement =
  | 'rectangle-long'
  | 'rectangle-square'
  | 'square-rectangle'
  | 'triangle-big'
  | 'triangle-parallelogram'
  | 'triangle-square';
export interface TwoPieceJoinVisual {
  kind: 'two-piece-join';
  arrangement: PairArrangement;
  reflected: boolean;
}
export type PairPoint = [number, number];
export function pairJoinPolygons(arrangement: PairArrangement): PairPoint[][] {
  switch (arrangement) {
    case 'square-rectangle': {
      return [
        [
          [0, 0],
          [1, 0],
          [1, 1],
          [0, 1],
        ],
        [
          [1, 0],
          [2, 0],
          [2, 1],
          [1, 1],
        ],
      ];
    }
    case 'rectangle-square': {
      return [
        [
          [0, 0],
          [2, 0],
          [2, 1],
          [0, 1],
        ],
        [
          [0, 1],
          [2, 1],
          [2, 2],
          [0, 2],
        ],
      ];
    }
    case 'rectangle-long': {
      return [
        [
          [0, 0],
          [2, 0],
          [2, 1],
          [0, 1],
        ],
        [
          [2, 0],
          [4, 0],
          [4, 1],
          [2, 1],
        ],
      ];
    }
    case 'triangle-square': {
      return [
        [
          [0, 0],
          [1, 0],
          [0, 1],
        ],
        [
          [1, 0],
          [1, 1],
          [0, 1],
        ],
      ];
    }
    case 'triangle-parallelogram': {
      return [
        [
          [0, 0],
          [1, 0],
          [0, 1],
        ],
        [
          [0, 0],
          [0, 1],
          [-1, 1],
        ],
      ];
    }
    case 'triangle-big': {
      return [
        [
          [0, 0],
          [1, 0],
          [0, 1],
        ],
        [
          [0, 0],
          [0, -1],
          [1, 0],
        ],
      ];
    }
  }
}
/** Center every complete outline, including models using negative local coordinates. */
export function pairJoinCanvasPolygons(
  arrangement: PairArrangement,
): PairPoint[][] {
  const polygons = pairJoinPolygons(arrangement);
  const xs = polygons.flatMap((p) => p.map((point) => point[0]));
  const ys = polygons.flatMap((p) => p.map((point) => point[1]));
  const maxX = Math.max(...xs);
  const minX = Math.min(...xs);
  const maxY = Math.max(...ys);
  const minY = Math.min(...ys);
  const offsetX = (310 - (maxX - minX) * 55) / 2 - minX * 55;
  const offsetY = (210 - (maxY - minY) * 55) / 2 - minY * 55;
  return polygons.map((p) =>
    p.map(([x, y]): PairPoint => [offsetX + x * 55, offsetY + y * 55]),
  );
}
export function pairJoinResult(
  arrangement: PairArrangement,
): 'parallelogram' | 'rectangle' | 'square' | 'triangle' {
  switch (arrangement) {
    case 'rectangle-square':
    case 'triangle-square': {
      return 'square';
    }
    case 'square-rectangle':
    case 'rectangle-long': {
      return 'rectangle';
    }
    case 'triangle-parallelogram': {
      return 'parallelogram';
    }
    case 'triangle-big': {
      return 'triangle';
    }
  }
}
export function pairJoinArea(arrangement: PairArrangement) {
  if (['rectangle-long', 'rectangle-square'].includes(arrangement)) return 4;
  if (arrangement === 'square-rectangle') return 2;
  return 1;
}
export function isTwoPieceJoinVisual(
  value: unknown,
): value is TwoPieceJoinVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const model = value as Record<string, unknown>;
  return (
    Object.keys(model).length === 3 &&
    model.kind === 'two-piece-join' &&
    typeof model.reflected === 'boolean' &&
    typeof model.arrangement === 'string' &&
    [
      'rectangle-long',
      'rectangle-square',
      'square-rectangle',
      'triangle-big',
      'triangle-parallelogram',
      'triangle-square',
    ].includes(String(model.arrangement))
  );
}
