import type { FoldCutJoinVisual } from './types';

import { fold } from './fold';

export type PaperPoint = [number, number];
export function isFoldCutJoinVisual(
  value: unknown,
): value is FoldCutJoinVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const v = value as Record<string, unknown>;
  return (
    Object.keys(v).length === 4 &&
    v.kind === 'fold-cut-join' &&
    (v.width === 4 || v.width === 6) &&
    (v.cut === 'corner' || v.cut === 'diagonal') &&
    typeof v.stage === 'string' &&
    ['creased', 'cut', 'folded', 'joined'].includes(v.stage)
  );
}
/** Original coordinates in common units. A stays; B moves or folds. */
export function paperPieces(
  v: FoldCutJoinVisual,
): [PaperPoint[], PaperPoint[]] {
  const x = v.cut === 'corner' ? 2 : v.width;
  return [
    v.cut === 'corner'
      ? [
          [0, 0],
          [v.width, 0],
          [v.width, 2],
          [2, 2],
        ]
      : [
          [0, 0],
          [v.width, 0],
          [v.width, 2],
        ],
    [
      [0, 0],
      [x, 2],
      [0, 2],
    ],
  ];
}
export function foldReflection(
  [x, y]: PaperPoint,
  v: FoldCutJoinVisual,
): PaperPoint {
  const dx = v.cut === 'corner' ? 2 : v.width;
  const projection = (x * dx + y * 2) / (dx * dx + 4);
  return [2 * projection * dx - x, 4 * projection - y];
}
export function shownPaperPieces(
  v: FoldCutJoinVisual,
): [PaperPoint[], PaperPoint[]] {
  const [a, b] = paperPieces(v);
  return [
    a,
    b.map((point): PaperPoint =>
      (() => {
        if (v.stage === 'folded') return foldReflection(point, v);
        return (() => {
          if (v.stage === 'cut') return [point[0], point[1] + 0.8];
          return v.stage === 'joined'
            ? [point[0] + v.width, point[1]]
            : [...point];
        })();
      })(),
    ),
  ];
}
export function joinedPaperOutline(v: FoldCutJoinVisual): PaperPoint[] {
  const x = v.cut === 'corner' ? 2 : v.width;
  return [
    [0, 0],
    [v.width, 0],
    [v.width + x, 2],
    [x, 2],
  ];
}
export function paperCentroid(points: PaperPoint[]): PaperPoint {
  // These supported polygons are convex; the vertex mean stays inside.
  return [
    fold(points, 0, (n, p) => n + p[0]) / points.length,
    fold(points, 0, (n, p) => n + p[1]) / points.length,
  ];
}
export function paperSvgPoints(points: PaperPoint[]): string {
  return points.map(([x, y]) => `${40 + x * 40},${100 + y * 40}`).join(' ');
}
