import type { PlanePatch, PlaneShape, ShapeCollageVisual } from './types';
export interface CollagePiece {
  patch: PlanePatch;
  x: number;
  y: number;
}
const piece = (
  shape: PlaneShape,
  x: number,
  y: number,
  width: number,
  height = width,
): CollagePiece => ({ patch: { shape, width, height }, x, y });
const patterns: Record<ShapeCollageVisual['layout'], CollagePiece[]> = {
  rocket: [
    piece('triangle', 7, 2, 4, 2),
    piece('rectangle', 7, 5, 2, 4),
    piece('square', 5, 6, 2),
    piece('square', 9, 6, 2),
    piece('circle', 6.5, 8, 1),
    piece('circle', 7.5, 8, 1),
  ],
  garden: [
    piece('circle', 4, 2, 2),
    piece('circle', 9, 2, 2),
    piece('rectangle', 4, 5, 1, 4),
    piece('rectangle', 9, 5, 1, 4),
    piece('triangle', 2.5, 4.5, 2, 1),
    piece('triangle', 10.5, 4.5, 2, 1),
    piece('square', 4, 8, 2),
    piece('square', 9, 8, 2),
  ],
  robot: [
    piece('square', 7, 2, 2),
    piece('rectangle', 7, 4, 4, 2),
    piece('rectangle', 4.5, 4, 1, 2),
    piece('rectangle', 9.5, 4, 1, 2),
    piece('circle', 3, 4, 1),
    piece('circle', 11, 4, 1),
    piece('triangle', 6, 6.5, 2, 2),
    piece('triangle', 8, 6.5, 2, 2),
  ],
  wagon: [
    piece('rectangle', 7, 5, 4, 2),
    piece('square', 4, 3, 2),
    piece('triangle', 8, 3, 2),
    piece('triangle', 6, 3, 2),
    piece('circle', 4, 7, 2),
    piece('circle', 10, 7, 2),
  ],
};
const extras: Record<ShapeCollageVisual['layout'], CollagePiece[]> = {
  rocket: [piece('triangle', 3, 2, 2), piece('circle', 8.5, 8, 1)],
  garden: [piece('square', 6.5, 8, 2)],
  robot: [piece('circle', 7, 8.5, 1)],
  wagon: [piece('rectangle', 11, 3, 2, 1)],
};
export const collageLayouts: ShapeCollageVisual['layout'][] = [
  'rocket',
  'garden',
  'robot',
  'wagon',
];
export function collagePieces(visual: ShapeCollageVisual): CollagePiece[] {
  const original = patterns[visual.layout].map((p) => {
    if (visual.variant !== 'review') return p;
    if (visual.layout === 'rocket' && p.patch.shape === 'rectangle')
      return { ...p, patch: { ...p.patch, shape: 'triangle' as const } };
    if (visual.layout === 'garden' && p.patch.shape === 'square')
      return {
        ...p,
        patch: { shape: 'rectangle' as const, width: 2, height: 1 },
      };
    if (visual.layout === 'robot' && p.patch.shape === 'triangle')
      return { ...p, patch: { ...p.patch, shape: 'square' as const } };
    if (visual.layout === 'wagon' && p.patch.shape === 'circle')
      return { ...p, patch: { ...p.patch, shape: 'triangle' as const } };
    return p;
  });
  return [
    ...original,
    ...(visual.variant === 'review' ? extras[visual.layout] : []),
  ].map((p) => ({
    ...p,
    patch: { ...p.patch },
    x: p.x + (visual.variant === 'review' ? -0.5 : 0),
  }));
}
export function collageCounts(
  visual: ShapeCollageVisual,
): Record<PlaneShape, number> {
  const result = { rectangle: 0, square: 0, triangle: 0, circle: 0 };
  for (const p of collagePieces(visual)) result[p.patch.shape]++;
  return result;
}
export function isShapeCollageVisual(
  value: unknown,
): value is ShapeCollageVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const v = value as Record<string, unknown>;
  return (
    Object.keys(v).length === 3 &&
    v.kind === 'shape-collage' &&
    collageLayouts.some((layout) => layout === v.layout) &&
    (v.variant === 'main' || v.variant === 'review')
  );
}
