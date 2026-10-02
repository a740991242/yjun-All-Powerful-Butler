export interface PartitionedSquareVisual {
  kind: 'partitioned-square';
  layout: 'rectangles' | 'triangles';
}

export interface SquarePiece {
  letter: string;
  points: readonly (readonly [number, number])[];
}

export function squarePieces(visual: PartitionedSquareVisual): SquarePiece[] {
  const points: SquarePiece['points'][] =
    visual.layout === 'rectangles'
      ? [
          [
            [0, 0],
            [1, 0],
            [1, 2],
            [0, 2],
          ],
          [
            [1, 0],
            [3, 0],
            [3, 1],
            [1, 1],
          ],
          [
            [2, 1],
            [3, 1],
            [3, 3],
            [2, 3],
          ],
          [
            [0, 2],
            [2, 2],
            [2, 3],
            [0, 3],
          ],
          [
            [1, 1],
            [2, 1],
            [2, 2],
            [1, 2],
          ],
        ]
      : [
          [
            [0, 0],
            [2, 0],
            [0, 1],
          ],
          [
            [2, 0],
            [3, 0],
            [3, 2],
          ],
          [
            [3, 2],
            [3, 3],
            [1, 3],
          ],
          [
            [1, 3],
            [0, 3],
            [0, 1],
          ],
          [
            [2, 0],
            [3, 2],
            [1, 3],
            [0, 1],
          ],
        ];
  return points.map((polygon, index) => ({
    letter: String.fromCodePoint(65 + index),
    points: polygon,
  }));
}

export function isPartitionedSquareVisual(
  value: unknown,
): value is PartitionedSquareVisual {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.keys(value).length === 2 &&
    'kind' in value &&
    value.kind === 'partitioned-square' &&
    'layout' in value &&
    (value.layout === 'rectangles' || value.layout === 'triangles')
  );
}
