import { fold } from './fold';
import { required } from './required';

export const bnuFoldScenes = [
  'square-mid',
  'square-diagonal',
  'rectangle-mid',
  'triangle-mid',
  'circle-mid',
  'four-triangles',
  'joined-triangle',
  'joined-trapezoid',
  'copy-triangle',
  'copy-slant',
  'copy-mushroom',
  'copy-flag',
  'flower',
  'fish',
] as const;
export interface BnuFoldOneVisual {
  kind: 'bnu-fold-one';
  scene: (typeof bnuFoldScenes)[number];
  variant: 'main' | 'review';
}
export type FoldOnePoint = [number, number];
export interface FoldOnePiece {
  path: string;
  polygon: FoldOnePoint[] | null;
  label: FoldOnePoint;
  curved: boolean;
  arc: null | {
    start: FoldOnePoint;
    end: FoldOnePoint;
    radius: number;
    sweep: 0 | 1;
  };
}
const polygon = (points: FoldOnePoint[]): FoldOnePiece => ({
  path: `${points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x} ${y}`).join(' ')} Z`,
  polygon: points,
  label: [
    fold(points, 0, (sum, p) => sum + p[0]) / points.length,
    fold(points, 0, (sum, p) => sum + p[1]) / points.length,
  ],
  curved: false,
  arc: null,
});
const rectangle = (x: number, y: number, w: number, h: number) =>
  polygon([
    [x, y],
    [x + w, y],
    [x + w, y + h],
    [x, y + h],
  ]);
const semicircle = (
  start: FoldOnePoint,
  end: FoldOnePoint,
  sweep: 0 | 1,
  label?: FoldOnePoint,
): FoldOnePiece => {
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  const radius = Math.hypot(dx, dy) / 2;
  const sign = sweep === 1 ? 1 : -1;
  return {
    path: `M${start[0]} ${start[1]} A${radius} ${radius} 0 0 ${sweep} ${end[0]} ${end[1]} Z`,
    polygon: null,
    curved: true,
    label: label ?? [
      (start[0] + end[0]) / 2 + sign * dy * 0.2,
      (start[1] + end[1]) / 2 - sign * dx * 0.2,
    ],
    arc: { start, end, radius, sweep },
  };
};
const semi = (x: number, y: number, r: number, lower = false): FoldOnePiece =>
  semicircle([x - r, y], [x + r, y], lower ? 0 : 1);
const r = 60 * Math.SQRT2;
/** Fixed original site constructions, not textbook scans or editable geometry. */
const patterns: Record<BnuFoldOneVisual['scene'], FoldOnePiece[]> = {
  'square-mid': [rectangle(100, 60, 160, 80), rectangle(100, 140, 160, 80)],
  'square-diagonal': [
    polygon([
      [100, 60],
      [260, 60],
      [260, 220],
    ]),
    polygon([
      [100, 60],
      [260, 220],
      [100, 220],
    ]),
  ],
  'rectangle-mid': [rectangle(60, 60, 240, 80), rectangle(60, 140, 240, 80)],
  'triangle-mid': [
    polygon([
      [60, 220],
      [180, 60],
      [180, 220],
    ]),
    polygon([
      [180, 60],
      [300, 220],
      [180, 220],
    ]),
  ],
  'circle-mid': [semi(180, 140, 80), semi(180, 140, 80, true)],
  'four-triangles': [
    polygon([
      [120, 80],
      [240, 80],
      [180, 140],
    ]),
    polygon([
      [240, 80],
      [240, 200],
      [180, 140],
    ]),
    polygon([
      [240, 200],
      [120, 200],
      [180, 140],
    ]),
    polygon([
      [120, 200],
      [120, 80],
      [180, 140],
    ]),
  ],
  'joined-triangle': [
    polygon([
      [60, 220],
      [120, 160],
      [180, 220],
    ]),
    polygon([
      [120, 160],
      [180, 100],
      [180, 220],
    ]),
    polygon([
      [180, 100],
      [240, 160],
      [180, 220],
    ]),
    polygon([
      [180, 220],
      [240, 160],
      [300, 220],
    ]),
  ],
  'joined-trapezoid': [
    polygon([
      [40, 200],
      [40 + r, 200 - r],
      [40 + r, 200],
    ]),
    polygon([
      [40 + r, 200 - r],
      [40 + 2 * r, 200 - r],
      [40 + r, 200],
    ]),
    polygon([
      [40 + 2 * r, 200 - r],
      [40 + 2 * r, 200],
      [40 + r, 200],
    ]),
    polygon([
      [40 + 2 * r, 200 - r],
      [40 + 3 * r, 200],
      [40 + 2 * r, 200],
    ]),
  ],
  'copy-triangle': [
    polygon([
      [100, 220],
      [180, 140],
      [180, 220],
    ]),
    polygon([
      [180, 140],
      [260, 220],
      [180, 220],
    ]),
  ],
  'copy-slant': [
    polygon([
      [100, 180],
      [180, 100],
      [180, 180],
    ]),
    polygon([
      [180, 100],
      [260, 100],
      [180, 180],
    ]),
  ],
  'copy-mushroom': [semi(180, 110, 80), rectangle(160, 110, 40, 120)],
  'copy-flag': [
    rectangle(130, 50, 40, 80),
    rectangle(130, 130, 40, 80),
    polygon([
      [170, 50],
      [250, 130],
      [170, 130],
    ]),
  ],
  flower: [
    semicircle([180, 30], [180, 110], 1, [197, 70]),
    semicircle([180, 110], [180, 30], 1, [163, 70]),
    semicircle([170, 120], [100, 80], 1, [131, 118]),
    semicircle([190, 120], [260, 80], 0, [229, 118]),
    rectangle(170, 110, 20, 130),
    polygon([
      [170, 190],
      [120, 150],
      [120, 190],
    ]),
    polygon([
      [190, 190],
      [240, 150],
      [240, 190],
    ]),
  ],
  fish: [
    polygon([
      [150, 140],
      [90, 80],
      [100, 130],
    ]),
    polygon([
      [150, 140],
      [90, 200],
      [100, 150],
    ]),
    rectangle(150, 100, 80, 40),
    rectangle(150, 140, 80, 40),
    semi(270, 100, 40),
    semi(270, 100, 40, true),
    semi(270, 180, 40),
    semi(270, 180, 40, true),
  ],
};

export function isBnuFoldOneVisual(value: unknown): value is BnuFoldOneVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const v = value as Record<string, unknown>;
  return (
    Object.keys(v).length === 3 &&
    v.kind === 'bnu-fold-one' &&
    bnuFoldScenes.some((scene) => scene === v.scene) &&
    (v.variant === 'main' || v.variant === 'review')
  );
}
export function bnuFoldOnePieces(visual: BnuFoldOneVisual): FoldOnePiece[] {
  if (!isBnuFoldOneVisual(visual))
    throw new Error('educationLearning.invalidRecord');
  return patterns[visual.scene].map((piece) => ({
    ...piece,
    label: [...piece.label],
    arc: piece.arc
      ? { ...piece.arc, start: [...piece.arc.start], end: [...piece.arc.end] }
      : null,
    polygon: piece.polygon ? piece.polygon.map(([x, y]) => [x, y]) : null,
  }));
}
export function bnuFoldOneBoundary(visual: BnuFoldOneVisual): FoldOnePoint[] {
  if (!isBnuFoldOneVisual(visual))
    throw new Error('educationLearning.invalidRecord');
  if (visual.scene === 'four-triangles')
    return [
      [120, 80],
      [240, 80],
      [240, 200],
      [120, 200],
    ];
  if (visual.scene === 'joined-triangle')
    return [
      [60, 220],
      [180, 100],
      [300, 220],
    ];
  if (visual.scene === 'joined-trapezoid')
    return [
      [40, 200],
      [40 + r, 200 - r],
      [40 + 2 * r, 200 - r],
      [40 + 3 * r, 200],
    ];
  return [];
}
export function foldOneArea(points: FoldOnePoint[]) {
  let twiceArea = 0;
  for (let index = 0; index < points.length; index++) {
    const [x, y] = required(points[index]);
    const next = required(points[(index + 1) % points.length]);
    twiceArea += x * next[1] - y * next[0];
  }
  return Math.abs(twiceArea) / 2;
}
