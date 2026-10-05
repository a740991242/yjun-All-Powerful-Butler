export interface BnuCalculationReviewVisual {
  kind: 'bnu-calculation-review';
  scene: 'balls' | 'baskets' | 'clothes';
  variant: 'main' | 'review';
}
export function isBnuCalculationReviewVisual(
  value: unknown,
): value is BnuCalculationReviewVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const v = value as Record<string, unknown>;
  return (
    Object.keys(v).length === 3 &&
    v.kind === 'bnu-calculation-review' &&
    (v.scene === 'balls' || v.scene === 'baskets' || v.scene === 'clothes') &&
    (v.variant === 'main' || v.variant === 'review')
  );
}
export function basketExpressions(variant: 'main' | 'review') {
  return variant === 'main'
    ? ['78−10', '52+12', '44+24', '32+36', '57+21', '89−21', '99−31', '98−30']
    : ['76−10', '52+14', '44+23', '32+34', '57+11', '89−23', '99−33', '98−31'];
}
export function ballPrices(variant: 'main' | 'review') {
  return variant === 'main' ? [42, 30, 23, 6] : [41, 32, 24, 8];
}
