import { required } from './required';

export const bnuFinalGeometryScenes = [
  'diagonal',
  'parallel',
  'square-part',
  'dots',
  'robot',
  'train',
] as const;
export interface BnuFinalGeometryVisual {
  kind: 'bnu-final-geometry';
  scene: (typeof bnuFinalGeometryScenes)[number];
  variant: 'main' | 'review';
}
export type FinalGeometryPoint = [number, number];
export interface FinalGeometryPart {
  id: string;
  shape: 'circle' | 'rectangle' | 'square' | 'triangle';
  points: FinalGeometryPoint[];
  circle?: { x: number; y: number; r: number };
}
export function isBnuFinalGeometryVisual(
  value: unknown,
): value is BnuFinalGeometryVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const v = value as Record<string, unknown>;
  return (
    Object.keys(v).length === 3 &&
    Object.keys(v).every((k) => ['kind', 'scene', 'variant'].includes(k)) &&
    v.kind === 'bnu-final-geometry' &&
    bnuFinalGeometryScenes.some((s) => s === v.scene) &&
    (v.variant === 'main' || v.variant === 'review')
  );
}
const rectangle = (
  x: number,
  y: number,
  w: number,
  h: number,
): FinalGeometryPoint[] => [
  [x, y],
  [x + w, y],
  [x + w, y + h],
  [x, y + h],
];
/** Site constructions with explicit part boundaries, not unverified original collage answers. */
export function bnuFinalGeometryParts(
  v: BnuFinalGeometryVisual,
): FinalGeometryPart[] {
  if (!isBnuFinalGeometryVisual(v))
    throw new Error('educationLearning.invalidRecord');
  const parts: Omit<FinalGeometryPart, 'id'>[] = [];
  const rect = (x: number, y: number, w: number, h: number) =>
    parts.push({
      shape: w === h ? 'square' : 'rectangle',
      points: rectangle(x, y, w, h),
    });
  const tri = (points: FinalGeometryPoint[]) =>
    parts.push({ shape: 'triangle', points });
  const circle = (x: number, y: number, r: number) =>
    parts.push({ shape: 'circle', points: [], circle: { x, y, r } });
  switch (v.scene) {
    case 'diagonal': {
      tri([
        [52, 92],
        [292, 92],
        [292, 252],
      ]);
      tri([
        [52, 92],
        [292, 252],
        [52, 252],
      ]);
      break;
    }
    case 'parallel': {
      rect(52, 92, 240, 80);
      rect(52, 172, 240, 80);
      break;
    }
    case 'square-part': {
      rect(52, 92, 160, 160);
      rect(212, 92, 80, 160);
      break;
    }
    case 'robot': {
      // Fifteen rectangles, two squares, two triangles and six circles. Antennas are removed in review.
      if (v.variant === 'main') {
        rect(130, 38, 6, 24);
        rect(208, 38, 6, 24);
        circle(133, 28, 10);
        circle(211, 28, 10);
      }
      rect(123, 62, 98, 98);
      rect(108, 88, 12, 28);
      rect(224, 88, 12, 28);
      rect(152, 164, 40, 12);
      rect(120, 180, 104, 104);
      rect(92, 184, 20, 56);
      rect(232, 184, 20, 56);
      rect(92, 244, 20, 28);
      rect(232, 244, 20, 28);
      rect(122, 288, 46, 28);
      rect(176, 288, 46, 28);
      rect(134, 320, 20, 34);
      rect(188, 320, 20, 34);
      rect(126, 358, 36, 10);
      rect(180, 358, 36, 10);
      tri([
        [160, 126],
        [184, 126],
        [172, 110],
      ]);
      tri([
        [150, 202],
        [194, 202],
        [172, 248],
      ]);
      circle(148, 94, 10);
      circle(196, 94, 10);
      circle(102, 284, 8);
      circle(242, 284, 8);
      break;
    }
    case 'train': {
      rect(28, 170, 48, 64);
      rect(80, 126, 108, 108);
      rect(104, 146, 52, 28);
      rect(192, 170, 58, 64);
      rect(254, 174, 24, 52);
      rect(220, 128, 16, 38);
      if (v.variant === 'main')
        tri([
          [282, 204],
          [310, 234],
          [282, 234],
        ]);
      for (const x of [56, 96, 218, 258]) circle(x, 254, 18);
      break;
    }
    case 'dots': {
      break;
    }
  }
  return parts.map((p, i) => {
    const reviewFold =
      v.variant === 'review' &&
      ['diagonal', 'parallel', 'square-part'].includes(v.scene);
    return {
      ...p,
      id: String.fromCodePoint(65 + i),
      points: p.points.map(([x, y]) => (reviewFold ? [344 - y, x] : [x, y])),
      ...(p.circle ? { circle: { ...p.circle } } : {}),
    };
  });
}
export function bnuFinalGeometryDots(
  v: BnuFinalGeometryVisual,
): FinalGeometryPoint[] {
  if (!isBnuFinalGeometryVisual(v))
    throw new Error('educationLearning.invalidRecord');
  if (v.scene !== 'dots') return [];
  const columns = v.variant === 'main' ? 11 : 9;
  const rows = v.variant === 'main' ? 6 : 5;
  return Array.from({ length: columns * rows }, (_, i) => [
    32 + (i % columns) * 24,
    40 + Math.floor(i / columns) * 24,
  ]);
}
export function finalGeometryLabel(p: FinalGeometryPart): FinalGeometryPoint {
  if (p.circle) return [p.circle.x, p.circle.y];
  return [
    p.points.reduce((s, q) => s + q[0], 0) / p.points.length,
    p.points.reduce((s, q) => s + q[1], 0) / p.points.length,
  ];
}
export function finalGeometryCounts(v: BnuFinalGeometryVisual) {
  const parts = bnuFinalGeometryParts(v);
  return ['rectangle', 'square', 'triangle', 'circle'].map(
    (shape) => parts.filter((p) => p.shape === shape).length,
  );
}
export function finalGeometryArea(p: FinalGeometryPart) {
  if (p.circle) return Math.PI * p.circle.r * p.circle.r;
  let twiceArea = 0;
  for (let i = 0; i < p.points.length; i++) {
    const [x, y] = required(p.points[i]);
    const next = required(p.points[(i + 1) % p.points.length]);
    twiceArea += x * next[1] - y * next[0];
  }
  return Math.abs(twiceArea) / 2;
}

/** Frame only the complete drawn content; original coordinates and one common scale remain unchanged. */
export function bnuFinalGeometryFrame(v: BnuFinalGeometryVisual) {
  const points = bnuFinalGeometryParts(v).flatMap((p) =>
    p.circle
      ? [
          [p.circle.x - p.circle.r, p.circle.y - p.circle.r],
          [p.circle.x + p.circle.r, p.circle.y + p.circle.r],
        ]
      : p.points,
  );
  for (const [x, y] of bnuFinalGeometryDots(v))
    points.push([x - 3, y - 3], [x + 3, y + 3]);
  const left = Math.min(...points.map((p) => required(p[0])));
  const right = Math.max(...points.map((p) => required(p[0])));
  const top = Math.min(...points.map((p) => required(p[1])));
  const bottom = Math.max(...points.map((p) => required(p[1])));
  return {
    x: left - 12,
    y: top - 12,
    width: right - left + 24,
    height: bottom - top + 24,
  };
}
