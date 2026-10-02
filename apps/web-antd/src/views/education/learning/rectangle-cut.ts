import type { RectangleCutVisual } from './types';
export function isRectangleCutVisual(
  value: unknown,
): value is RectangleCutVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const model = value as Record<string, unknown>;
  return (
    Object.keys(model).length === 3 &&
    model.kind === 'rectangle-cut' &&
    (model.width === 4 || model.width === 6) &&
    typeof model.cut === 'string' &&
    ['diagonal', 'horizontal', 'vertical'].includes(model.cut)
  );
}
/** The outlines follow the supplied cut; no derived category is rendered. */
export function rectangleCutPieces(
  model: RectangleCutVisual,
): [string, string] {
  const w = model.width * 40;
  if (model.cut === 'vertical')
    return [
      `0,0 ${w / 2},0 ${w / 2},80 0,80`,
      `${w / 2},0 ${w},0 ${w},80 ${w / 2},80`,
    ];
  if (model.cut === 'horizontal')
    return [`0,0 ${w},0 ${w},40 0,40`, `0,40 ${w},40 ${w},80 0,80`];
  return [`0,0 ${w},0 ${w},80`, `0,0 ${w},80 0,80`];
}
export function rectangleCutLabels(
  model: RectangleCutVisual,
): [number, number][] {
  const w = model.width * 40;
  return (() => {
    if (model.cut === 'vertical')
      return [
        [w / 4, 40],
        [(3 * w) / 4, 40],
      ];
    return model.cut === 'horizontal'
      ? [
          [w / 2, 20],
          [w / 2, 60],
        ]
      : [
          [(2 * w) / 3, 25],
          [w / 3, 55],
        ];
  })();
}
