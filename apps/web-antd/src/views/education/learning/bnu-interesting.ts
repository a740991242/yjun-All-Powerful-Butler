export interface BnuInterestingVisual {
  kind: 'bnu-interesting';
  scene: 'addition' | 'eleven' | 'subtraction';
  variant: 'main' | 'review';
}
export function isBnuInterestingVisual(
  value: unknown,
): value is BnuInterestingVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const v = value as Record<string, unknown>;
  return (
    Object.keys(v).length === 3 &&
    v.kind === 'bnu-interesting' &&
    (v.scene === 'addition' ||
      v.scene === 'subtraction' ||
      v.scene === 'eleven') &&
    (v.variant === 'main' || v.variant === 'review')
  );
}
/** Known source numbers and empty positions, not a hidden answer key. New review operands are explicit. */
export function bnuInterestingRows(
  visual: BnuInterestingVisual,
): [null | number, null | number, null | number][] {
  if (!isBnuInterestingVisual(visual))
    throw new Error('educationLearning.invalidRecord');
  if (visual.scene === 'eleven')
    return visual.variant === 'main'
      ? [
          [1, null, 12],
          [12, null, 23],
          [23, null, 34],
          [34, null, 45],
          [45, null, 56],
          [56, null, 67],
          [67, null, 78],
          [78, null, 89],
        ]
      : Array.from({ length: 8 }, (_, i) => [2 + i * 10, null, 24 + i * 10]);
  if (visual.variant === 'review')
    return Array.from({ length: 8 }, (_, i) =>
      visual.scene === 'addition'
        ? [18 - i, 81 - i * 10, null]
        : [99 - i * 11, 81 - i * 10, null],
    );
  return visual.scene === 'addition'
    ? [
        [11, 11, null],
        [12, 21, null],
        [13, 31, null],
        [14, null, null],
        [null, null, null],
        [null, null, null],
        [null, null, null],
        [null, null, null],
      ]
    : [
        [22, 11, null],
        [33, 21, null],
        [44, 31, null],
        [55, null, null],
        [null, null, null],
        [null, null, null],
        [null, null, null],
        [null, null, null],
      ];
}
