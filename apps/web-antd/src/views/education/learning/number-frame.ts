export interface NumberFrameVisual {
  kind: 'number-frame';
  layout: 'cross' | 'square';
  anchor: number;
  known: number;
}
export function isNumberFrameVisual(
  value: unknown,
): value is NumberFrameVisual {
  if (typeof value !== 'object' || value === null || Array.isArray(value))
    return false;
  const p = value as Record<string, unknown>;
  if (
    Object.keys(p).length !== 4 ||
    p.kind !== 'number-frame' ||
    !['cross', 'square'].includes(String(p.layout)) ||
    typeof p.layout !== 'string' ||
    typeof p.anchor !== 'number' ||
    !Number.isInteger(p.anchor) ||
    p.anchor < 0 ||
    p.anchor > 99 ||
    typeof p.known !== 'number' ||
    !Number.isInteger(p.known) ||
    p.known < 0
  )
    return false;
  const column = p.anchor % 10;
  const row = Math.floor(p.anchor / 10);
  return p.layout === 'square'
    ? row < 9 && column < 9 && p.known < 4
    : row > 0 && row < 9 && column > 0 && column < 9 && p.known < 5;
}
/** Anchor is top-left for square or center for cross; coordinates are relative to the frame. */
export function numberFrameCells(visual: NumberFrameVisual) {
  if (!isNumberFrameVisual(visual)) throw new Error('Invalid number frame');
  const offsets =
    visual.layout === 'square'
      ? [
          { x: 0, y: 0, d: 0, position: 'topLeft' },
          { x: 1, y: 0, d: 1, position: 'topRight' },
          { x: 0, y: 1, d: 10, position: 'bottomLeft' },
          { x: 1, y: 1, d: 11, position: 'bottomRight' },
        ]
      : [
          { x: 1, y: 0, d: -10, position: 'top' },
          { x: 0, y: 1, d: -1, position: 'left' },
          { x: 1, y: 1, d: 0, position: 'center' },
          { x: 2, y: 1, d: 1, position: 'right' },
          { x: 1, y: 2, d: 10, position: 'bottom' },
        ];
  let unknown = 0;
  return offsets.map((p, index) => ({
    ...p,
    value: visual.anchor + p.d,
    known: index === visual.known,
    letter:
      index === visual.known ? null : String.fromCodePoint(65 + unknown++),
  }));
}
