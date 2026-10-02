import type { AssemblyCandidatesVisual } from './types';

import { fold } from './fold';
import { required } from './required';
import { overlaps } from './shape-join';
export type Outline = [number, number][];
const epsilon = 1e-8;
const rectangle: Outline = [
  [0, 0],
  [1, 0],
  [1, 2],
  [0, 2],
];
const square: Outline = [
  [0, 0],
  [1, 0],
  [1, 1],
  [0, 1],
];
const triangle: Outline = [
  [0, 0],
  [1, 0],
  [0, 1],
];
const slant: Outline = [
  [1, 0],
  [2, 0],
  [1, 1],
  [0, 1],
];
const layouts = {
  'rect-triangle': {
    pieces: [
      rectangle,
      [
        [0, 0],
        [1, 0],
        [0, 2],
      ] as Outline,
    ],
    targets: [
      [
        [0, 0],
        [2, 0],
        [1, 2],
        [0, 2],
      ],
      [
        [0, 0],
        [3, 0],
        [0, 2],
      ],
      [
        [0, 0],
        [2, 0],
        [0, 2],
      ],
    ] as Outline[],
  },
  'square-slant': {
    pieces: [square, slant],
    targets: [
      [
        [1, 0],
        [2, 0],
        [2, 1],
        [1, 2],
        [0, 2],
        [1, 1],
      ],
      [
        [0, 0],
        [2, 0],
        [0, 2],
      ],
      [
        [0, 0],
        [1, 0],
        [2, 1],
        [1, 2],
        [0, 2],
      ],
    ] as Outline[],
  },
  'squares-triangle': {
    pieces: [square, square, triangle],
    targets: [
      [
        [0, 0],
        [1, 0],
        [1, 1],
        [2, 2],
        [0, 2],
      ],
      [
        [0, 0],
        [3, 0],
        [2, 1],
        [0, 1],
      ],
      [
        [0, 0],
        [5, 0],
        [0, 1],
      ],
    ] as Outline[],
  },
  'four-squares': {
    pieces: [square, square, square, square],
    targets: [
      [
        [0, 0],
        [1, 0],
        [1, 2],
        [2, 2],
        [2, 3],
        [0, 3],
      ],
      [
        [0, 0],
        [2, 0],
        [2, 1],
        [3, 1],
        [3, 2],
        [1, 2],
        [1, 1],
        [0, 1],
      ],
      [
        [0, 0],
        [4, 0],
        [0, 2],
      ],
    ] as Outline[],
  },
};
export function isAssemblyCandidatesVisual(
  value: unknown,
): value is AssemblyCandidatesVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const model = value as Record<string, unknown>;
  return (
    Object.keys(model).length === 3 &&
    model.kind === 'assembly-candidates' &&
    typeof model.layout === 'string' &&
    Object.hasOwn(layouts, model.layout) &&
    (model.variant === 'main' || model.variant === 'review')
  );
}
export function rotateOutline(points: Outline, turn: number): Outline {
  const rotated = points.map(([x, y]): [number, number] =>
    (() => {
      if (turn === 0) return [x, y];
      return (() => {
        if (turn === 1) return [-y, x];
        return turn === 2 ? [-x, -y] : [y, -x];
      })();
    })(),
  );
  const minX = Math.min(...rotated.map((p) => p[0]));
  const minY = Math.min(...rotated.map((p) => p[1]));
  return rotated.map(([x, y]) => [x - minX, y - minY]);
}
export function assemblyFigures(model: AssemblyCandidatesVisual): {
  pieces: Outline[];
  targets: Outline[];
} {
  const data = structuredClone(layouts[model.layout]);
  return model.variant === 'main'
    ? data
    : {
        pieces: data.pieces.map((p) => rotateOutline(p, 1)),
        targets: [
          required(data.targets[2]),
          required(data.targets[0]),
          required(data.targets[1]),
        ].map((p) => rotateOutline(p, 1)),
      };
}
const cross = (a: [number, number], b: [number, number], c: [number, number]) =>
  (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
export function outlineArea(points: Outline): number {
  return (
    Math.abs(
      fold(points, 0, (sum, p, i) => {
        const q = required(points[(i + 1) % points.length]);
        return sum + p[0] * q[1] - p[1] * q[0];
      }),
    ) / 2
  );
}
/** Ear clipping partitions a simple counter-clockwise target, including its concave corners. */
function triangles(outline: Outline): Outline[] {
  const points = structuredClone(outline);
  const result: Outline[] = [];
  while (points.length > 3) {
    let found = false;
    for (let i = 0; i < points.length; i++) {
      const a = required(points[(i + points.length - 1) % points.length]);
      const b = required(points[i]);
      const c = required(points[(i + 1) % points.length]);
      if (cross(a, b, c) <= epsilon) continue;
      const blocked = points.some(
        (p, j) =>
          j !== i &&
          j !== (i + 1) % points.length &&
          j !== (i + points.length - 1) % points.length &&
          cross(a, b, p) >= -epsilon &&
          cross(b, c, p) >= -epsilon &&
          cross(c, a, p) >= -epsilon,
      );
      if (blocked) continue;
      result.push([a, b, c]);
      points.splice(i, 1);
      found = true;
      break;
    }
    if (!found) throw new Error('educationLearning.invalidRecord');
  }
  result.push(points);
  return result;
}
/** Clip a convex material piece against each triangle of the target. */
function intersectionArea(piece: Outline, clip: Outline): number {
  let output = piece;
  for (let i = 0; i < clip.length; i++) {
    const a = required(clip[i]);
    const b = required(clip[(i + 1) % clip.length]);
    const input = output;
    output = [];
    if (input.length === 0) break;
    for (let j = 0; j < input.length; j++) {
      const e = required(input[(j + 1) % input.length]);
      const de = cross(a, b, e);
      const s = required(input[j]);
      const ds = cross(a, b, s);
      if (ds >= -epsilon !== de >= -epsilon) {
        const t = ds / (ds - de);
        output.push([s[0] + t * (e[0] - s[0]), s[1] + t * (e[1] - s[1])]);
      }
      if (de >= -epsilon) output.push(e);
    }
  }
  return output.length < 3 ? 0 : outlineArea(output);
}
/** Integer translations and quarter turns only, no reflection/stretching/cutting. */
export function assemblySolution(
  pieces: Outline[],
  target: Outline,
): null | Outline[] {
  if (
    Math.abs(
      fold(pieces, 0, (sum, p) => sum + outlineArea(p)) - outlineArea(target),
    ) > epsilon
  )
    return null;
  const h = Math.max(...target.map((p) => p[1]));
  const parts = triangles(target);
  const w = Math.max(...target.map((p) => p[0]));
  const placements = pieces.map((piece) => {
    const unique = new Map<string, Outline>();
    for (let turn = 0; turn < 4; turn++) {
      const rotated = rotateOutline(piece, turn);
      const pw = Math.max(...rotated.map((p) => p[0]));
      const ph = Math.max(...rotated.map((p) => p[1]));
      for (let x = 0; x <= w - pw; x++)
        for (let y = 0; y <= h - ph; y++) {
          const placed = rotated.map(([px, py]): [number, number] => [
            px + x,
            py + y,
          ]);
          if (
            Math.abs(
              fold(parts, 0, (sum, p) => sum + intersectionArea(placed, p)) -
                outlineArea(piece),
            ) < epsilon
          ) {
            const key = placed
              .toSorted((a, b) => a[0] - b[0] || a[1] - b[1])
              .map((p) => p.join(','))
              .join(';');
            unique.set(key, placed);
          }
        }
    }
    return [...unique.values()];
  });
  const chosen: Outline[] = [];
  const order = pieces
    .map((_, i) => i)
    .toSorted(
      (a, b) => required(placements[a]).length - required(placements[b]).length,
    );
  function search(depth: number): boolean {
    if (depth === pieces.length) return true;
    for (const placed of required(placements[required(order[depth])])) {
      if (
        chosen.some((old) =>
          overlaps(
            old.map(([x, y]) => ({ x, y })),
            placed.map(([x, y]) => ({ x, y })),
          ),
        )
      )
        continue;
      chosen.push(placed);
      if (search(depth + 1)) return true;
      chosen.pop();
    }
    return false;
  }
  return search(0) ? chosen : null;
}
export function fittingCandidates(model: AssemblyCandidatesVisual): string[] {
  const { pieces, targets } = assemblyFigures(model);
  return targets.flatMap((target, i) =>
    assemblySolution(pieces, target) ? [String.fromCodePoint(65 + i)] : [],
  );
}
