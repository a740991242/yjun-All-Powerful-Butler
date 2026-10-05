export interface BnuWholeTenLineVisual {
  kind: 'bnu-whole-ten-line';
  scene: 'add' | 'subtract';
  variant: 'main' | 'review';
}
export function isBnuWholeTenLineVisual(
  value: unknown,
): value is BnuWholeTenLineVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const v = value as Record<string, unknown>;
  return (
    Object.keys(v).length === 3 &&
    Object.keys(v).every((k) => ['kind', 'scene', 'variant'].includes(k)) &&
    v.kind === 'bnu-whole-ten-line' &&
    (v.scene === 'add' || v.scene === 'subtract') &&
    (v.variant === 'main' || v.variant === 'review')
  );
}
/** Original complete ticks and given arrow; values are fixed, never caller-supplied answers. */
export function bnuWholeTenLine(visual: BnuWholeTenLineVisual) {
  if (!isBnuWholeTenLineVisual(visual))
    throw new Error('educationLearning.invalidRecord');
  if (visual.scene === 'add')
    return {
      ticks: [20, 30, 40, 50, 60, 70, 80, 90],
      start: visual.variant === 'main' ? 30 : 20,
      jump: 50,
      end: visual.variant === 'main' ? 80 : 70,
      operation: '+',
    };
  return {
    ticks: [50, 60, 70, 80, 90, 100],
    start: visual.variant === 'main' ? 90 : 100,
    jump: visual.variant === 'main' ? 30 : 40,
    end: 60,
    operation: '−',
  };
}
