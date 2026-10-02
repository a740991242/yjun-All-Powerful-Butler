import { required } from './required';

export type CubeCell = [number, number];
export interface CubePairVisual {
  kind: 'cube-pair';
  variant: 'main' | 'review';
  display: 'candidates' | 'join-ae' | 'join-bf' | 'join-cd';
}
export function cubePairData(variant: CubePairVisual['variant']) {
  const target: CubeCell[] =
    variant === 'main'
      ? [
          [0, 0],
          [1, 0],
          [2, 0],
          [0, 1],
          [1, 1],
          [2, 1],
        ]
      : [
          [0, 0],
          [1, 0],
          [2, 0],
          [1, 1],
          [2, 1],
          [2, 2],
        ];
  const groups: { id: string; cells: CubeCell[] }[] = [
    {
      id: 'A',
      cells:
        variant === 'main'
          ? [
              [0, 0],
              [1, 0],
              [0, 1],
            ]
          : [
              [0, 0],
              [1, 0],
              [2, 0],
            ],
    },
    {
      id: 'B',
      cells:
        variant === 'main'
          ? [
              [0, 0],
              [1, 0],
              [2, 0],
              [0, 1],
              [1, 1],
            ]
          : [
              [1, 0],
              [2, 0],
              [1, 1],
              [2, 1],
              [2, 2],
            ],
    },
    {
      id: 'C',
      cells: [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ],
    },
    {
      id: 'D',
      cells: [
        [0, 0],
        [1, 0],
      ],
    },
    {
      id: 'E',
      cells: [
        [0, 0],
        [1, 0],
        [1, 1],
      ],
    },
    { id: 'F', cells: [[0, 0]] },
  ];
  return { target, groups };
}
function orientations(cells: CubeCell[]): CubeCell[][] {
  return Array.from({ length: 4 }, (_, turn) => {
    const rotated = cells.map(([x, y]): CubeCell => {
      switch (turn) {
        case 1: {
          return [-y, x];
        }
        case 2: {
          return [-x, -y];
        }
        case 3: {
          return [y, -x];
        }
        default: {
          return [x, y];
        }
      }
    });
    const minX = Math.min(...rotated.map((p) => p[0]));
    const minY = Math.min(...rotated.map((p) => p[1]));
    return rotated.map(([x, y]): CubeCell => [x - minX, y - minY]);
  });
}
const key = ([x, y]: CubeCell) => `${x},${y}`;
/** Exact one-layer, whole-group quarter-turn/translation fit; no reflection or disassembly. */
export function cubePairJoin(
  variant: CubePairVisual['variant'],
  first: string,
  second: string,
): CubeCell[][] | null {
  if (first === second) return null;
  const { target, groups } = cubePairData(variant);
  const a = required(groups.find((g) => g.id === first)).cells;
  const b = required(groups.find((g) => g.id === second)).cells;
  if (a.length + b.length !== target.length) return null;
  const targetKeys = new Set(target.map((cell) => key(cell)));
  const maxX = Math.max(...target.map((p) => p[0]));
  const maxY = Math.max(...target.map((p) => p[1]));
  const placements = (cells: CubeCell[]) =>
    orientations(cells).flatMap((shape) =>
      Array.from({ length: maxX + 1 }, (_, x) =>
        Array.from({ length: maxY + 1 }, (_, y) =>
          shape.map(([sx, sy]): CubeCell => [sx + x, sy + y]),
        ),
      )
        .flat()
        .filter((placed) => placed.every((cell) => targetKeys.has(key(cell)))),
    );
  for (const pa of placements(a)) {
    const occupied = new Set(pa.map((cell) => key(cell)));
    for (const pb of placements(b))
      if (pb.every((cell) => !occupied.has(key(cell)))) return [pa, pb];
  }
  return null;
}
export function cubePairOptions(variant: CubePairVisual['variant']) {
  const { groups } = cubePairData(variant);
  return groups.flatMap((first, index) =>
    groups.slice(index + 1).map((second) => ({
      id: `${first.id}${second.id}`,
      first: first.id,
      second: second.id,
      valid: cubePairJoin(variant, first.id, second.id) !== null,
    })),
  );
}
export function isCubePairVisual(value: unknown): value is CubePairVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const m = value as Record<string, unknown>;
  if (
    Object.keys(m).length !== 3 ||
    m.kind !== 'cube-pair' ||
    (m.variant !== 'main' && m.variant !== 'review')
  )
    return false;
  if (m.display === 'candidates') return true;
  if (m.display === 'join-ae')
    return cubePairJoin(m.variant, 'A', 'E') !== null;
  if (m.display === 'join-bf')
    return cubePairJoin(m.variant, 'B', 'F') !== null;
  if (m.display === 'join-cd')
    return cubePairJoin(m.variant, 'C', 'D') !== null;
  return false;
}
/** Front squares identify unit blocks; projecting right/top faces never adds blocks. */
export function cubePairCanvas(groups: CubeCell[][]) {
  const cells = groups.flat();
  const maxX = Math.max(...cells.map((p) => p[0]));
  const minX = Math.min(...cells.map((p) => p[0]));
  const maxY = Math.max(...cells.map((p) => p[1]));
  const minY = Math.min(...cells.map((p) => p[1]));
  const depth = 9;
  const unit = 40;
  const offsetX = (240 - ((maxX - minX + 1) * unit + depth)) / 2 - minX * unit;
  const offsetY = (200 - ((maxY - minY + 1) * unit + depth)) / 2 + depth;
  return groups
    .flatMap((group, index) =>
      group.map(([x, y]) => ({
        x: offsetX + x * unit,
        y: offsetY + (maxY - y) * unit,
        group: index,
      })),
    )
    .toSorted((a, b) => b.y - a.y || a.x - b.x);
}
