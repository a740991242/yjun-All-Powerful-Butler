export interface SolidRecomposeVisual {
  kind: 'solid-recompose';
  scene:
    | 'count-corner'
    | 'count-rows'
    | 'count-stair'
    | 'cube-join'
    | 'cube-split'
    | 'cylinder-join'
    | 'cylinder-split'
    | 'pair-cubes'
    | 'pair-cylinders';
  variant: 'main' | 'review';
}
export type SolidCell = [number, number, number];
export interface SolidPiece {
  id: string;
  kind: 'cubes' | 'cylinder';
  cells: SolidCell[];
  height: number;
  segmented: boolean;
}
const column = (height: number, x = 0, y = 0): SolidCell[] =>
  Array.from({ length: height }, (_, z) => [x, y, z]);
const cube = (id: string, cells: SolidCell[]): SolidPiece => ({
  id,
  kind: 'cubes',
  cells,
  height: 0,
  segmented: false,
});
const cylinder = (
  id: string,
  height: number,
  segmented = false,
): SolidPiece => ({ id, kind: 'cylinder', cells: [], height, segmented });
export function solidRecomposeData(model: SolidRecomposeVisual): {
  input: SolidPiece[];
  choices: SolidPiece[][];
} {
  const review = model.variant === 'review';
  switch (model.scene) {
    case 'pair-cubes': {
      const horizontal = cube('joined', [
        [0, 0, 0],
        [1, 0, 0],
      ]);
      const vertical = cube('joined', column(2));
      return {
        input: [cube('P1', column(1)), cube('P2', column(1))],
        choices: review
          ? [[cube('A', column(3))], [horizontal], [vertical]]
          : [[horizontal], [vertical], [cube('C', column(1))]],
      };
    }
    case 'pair-cylinders': {
      const h = review ? 2 : 1;
      return {
        input: [cylinder('P1', h), cylinder('P2', h)],
        choices: review
          ? [
              [cylinder('A', h)],
              [cylinder('B1', h), cylinder('B2', h)],
              [cylinder('C', h * 2)],
            ]
          : [
              [cylinder('A', h * 2)],
              [cylinder('B1', h), cylinder('B2', h)],
              [cylinder('C', h * 3)],
            ],
      };
    }
    case 'cube-join': {
      return {
        input: review
          ? [cube('P1', column(2)), cube('P2', column(3))]
          : [
              cube('P1', column(1)),
              cube('P2', column(1)),
              cube('P3', column(2)),
            ],
        choices: [
          [
            cube(
              'A',
              review
                ? Array.from({ length: 5 }, (_, x) => [x, 0, 0])
                : [...column(2, 0), ...column(2, 1)],
            ),
          ],
          [cube('B', column(review ? 5 : 4))],
          [
            cube(
              'C',
              review
                ? [...column(2, 0), ...column(2, 1)]
                : Array.from({ length: 3 }, (_, x) => [x, 0, 0]),
            ),
          ],
        ],
      };
    }
    case 'cylinder-join': {
      return {
        input: [cylinder('P1', 1), cylinder('P2', review ? 3 : 2)],
        choices: [2, 3, 4].map((h, i) => [
          cylinder(String.fromCodePoint(65 + i), h),
        ]),
      };
    }
    case 'cube-split': {
      return {
        input: [cube('M', column(review ? 4 : 3))],
        choices: (review
          ? [
              [2, 2],
              [3, 1],
              [2, 1],
            ]
          : [
              [2, 1],
              [2, 2],
              [1, 1],
            ]
        ).map((heights, i) =>
          heights.map((h, j) =>
            cube(`${String.fromCodePoint(65 + i)}${j + 1}`, column(h)),
          ),
        ),
      };
    }
    case 'cylinder-split': {
      return {
        input: [cylinder('M', review ? 5 : 4, true)],
        choices: (review
          ? [
              [3, 2],
              [2, 2],
              [3, 1],
            ]
          : [
              [3, 1],
              [2, 2],
              [2, 1],
            ]
        ).map((heights, i) =>
          heights.map((h, j) =>
            cylinder(`${String.fromCodePoint(65 + i)}${j + 1}`, h, true),
          ),
        ),
      };
    }
    case 'count-stair': {
      return {
        input: [
          cube('M', [
            ...column(review ? 3 : 2, 0),
            ...column(1, 1),
            ...column(1, 2),
          ]),
        ],
        choices: [],
      };
    }
    case 'count-corner': {
      return {
        input: [
          cube('M', [
            ...column(2, 0, 0),
            ...column(2, 1, 0),
            ...column(review ? 3 : 1, 0, 1),
          ]),
        ],
        choices: [],
      };
    }
    case 'count-rows': {
      return {
        input: [
          cube(
            'M',
            Array.from({ length: review ? 4 : 3 }, (_, x) => [
              ...column(1, x, 0),
              ...column(1, x, 1),
            ]).flat(),
          ),
        ],
        choices: [],
      };
    }
  }
}
export function solidPieceUnits(piece: SolidPiece): number {
  return piece.kind === 'cubes' ? piece.cells.length : piece.height;
}
export function solidPieceLayers(piece: SolidPiece): SolidCell[][] {
  if (piece.kind !== 'cubes') return [];
  return Array.from(
    { length: Math.max(...piece.cells.map((c) => c[2])) + 1 },
    (_, z) => piece.cells.filter((c) => c[2] === z),
  );
}
/** Same orthographic unit geometry for every cube; back cells drawn first, higher cells last. */
export function solidRecomposeCanvas(cells: SolidCell[]) {
  const projected = cells.map(([x, y, z]) => ({
    x: x * 32 + y * 18,
    y: -z * 32 - y * 18,
    depth: y,
    level: z,
  }));
  const maxX = Math.max(...projected.map((p) => p.x + 50));
  const minX = Math.min(...projected.map((p) => p.x));
  const maxY = Math.max(...projected.map((p) => p.y + 32));
  const minY = Math.min(...projected.map((p) => p.y - 18));
  const ox = (240 - maxX + minX) / 2 - minX;
  const oy = (220 - maxY + minY) / 2 - minY;
  return projected
    .toSorted((a, b) => b.depth - a.depth || a.level - b.level || a.x - b.x)
    .map((p) => ({ x: p.x + ox, y: p.y + oy }));
}
export function isSolidRecomposeVisual(
  value: unknown,
): value is SolidRecomposeVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const m = value as Record<string, unknown>;
  return (
    Object.keys(m).length === 3 &&
    m.kind === 'solid-recompose' &&
    (m.variant === 'main' || m.variant === 'review') &&
    typeof m.scene === 'string' &&
    [
      'count-corner',
      'count-rows',
      'count-stair',
      'cube-join',
      'cube-split',
      'cylinder-join',
      'cylinder-split',
      'pair-cubes',
      'pair-cylinders',
    ].includes(m.scene)
  );
}
