export interface BnuTwoJumpLineVisual {
  kind: 'bnu-two-jump-line';
  scene: 'add' | 'subtract';
  variant: 'main' | 'review';
}
export function isBnuTwoJumpLineVisual(
  value: unknown,
): value is BnuTwoJumpLineVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const v = value as Record<string, unknown>;
  return (
    Object.keys(v).length === 3 &&
    Object.keys(v).every((k) => ['kind', 'scene', 'variant'].includes(k)) &&
    v.kind === 'bnu-two-jump-line' &&
    (v.scene === 'add' || v.scene === 'subtract') &&
    (v.variant === 'main' || v.variant === 'review')
  );
}
/** Fixed given arrows; final points are drawn between labelled ticks, not printed as extra answers. */
export function bnuTwoJumpLine(visual: BnuTwoJumpLineVisual) {
  if (!isBnuTwoJumpLineVisual(visual))
    throw new Error('educationLearning.invalidRecord');
  if (visual.scene === 'add') {
    const start = visual.variant === 'main' ? 37 : 47;
    const jump = visual.variant === 'main' ? 30 : 20;
    const ones = visual.variant === 'main' ? 2 : 4;
    return {
      ticks: [37, 47, 57, 67, 77, 87],
      operation: '+',
      segments: [
        { from: start, to: 67, jump },
        { from: 67, to: 67 + ones, jump: ones },
      ],
      finalRange: [67, 77],
    };
  }
  const middle = visual.variant === 'main' ? 36 : 46;
  const jump = visual.variant === 'main' ? 40 : 30;
  const ones = visual.variant === 'main' ? 3 : 2;
  return {
    ticks: [26, 36, 46, 56, 66, 76],
    operation: '−',
    segments: [
      { from: 76, to: middle, jump },
      { from: middle, to: middle - ones, jump: ones },
    ],
    finalRange: [middle - 10, middle],
  };
}
