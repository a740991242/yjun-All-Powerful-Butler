import { required } from './required';
export interface HundredFragmentsVisual {
  kind: 'hundred-fragments';
  variant: 'main' | 'review';
}
export function isHundredFragmentsVisual(
  value: unknown,
): value is HundredFragmentsVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const v = value as Record<string, unknown>;
  return (
    Object.keys(v).length === 2 &&
    v.kind === 'hundred-fragments' &&
    (v.variant === 'main' || v.variant === 'review')
  );
}
/** Original chart fragments. A–E mark blanks, not answer hints. */
export function hundredFragments(variant: HundredFragmentsVisual['variant']) {
  const anchors = variant === 'main' ? [38, 64, 20] : [72, 46, 70];
  return anchors.map((anchor, index) => {
    const shapes: [number, number, number][][] = [
      [
        [0, 0, 0],
        [1, 0, 1],
        [0, 1, 10],
        [1, 1, 11],
      ],
      [
        [1, 0, -10],
        [0, 1, -1],
        [1, 1, 0],
        [2, 1, 1],
        [1, 2, 10],
      ],
      [
        [0, 0, -2],
        [1, 0, -1],
        [2, 0, 0],
        [0, 1, 8],
        [1, 1, 9],
        [0, 2, 18],
      ],
    ];
    const cells = required(shapes[index]);
    let blank = 0;
    return {
      index,
      cells: cells.map(([x, y, offset]) => ({
        x,
        y,
        value: required(anchor) + offset,
        label:
          offset === 0 ? String(anchor) : String.fromCodePoint(65 + blank++),
      })),
    };
  });
}
