export interface BnuAroundNumbersVisual {
  kind: 'bnu-around-numbers';
  scene: 'circles' | 'triangles';
  variant: 'main' | 'review';
}
export function isBnuAroundNumbersVisual(
  value: unknown,
): value is BnuAroundNumbersVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const data = value as Record<string, unknown>;
  return (
    Object.keys(data).length === 3 &&
    data.kind === 'bnu-around-numbers' &&
    (data.scene === 'circles' || data.scene === 'triangles') &&
    (data.variant === 'main' || data.variant === 'review')
  );
}
export function aroundNumberMarkers(visual: BnuAroundNumbersVisual) {
  if (visual.scene === 'circles') {
    const total = visual.variant === 'main' ? 62 : 43;
    return Array.from({ length: total }, (_, index) => ({
      index,
      shape: 'circle' as const,
      x: 30 + (index % 10) * 40,
      y: 30 + Math.floor(index / 10) * 38,
      size: 10,
    }));
  }
  const large = visual.variant === 'main' ? 7 : 6;
  const small = visual.variant === 'main' ? 5 : 8;
  return [
    ...Array.from({ length: large }, (_, index) => ({
      index,
      shape: 'triangle' as const,
      x: 35 + index * 55,
      y: 45,
      size: 18,
    })),
    ...Array.from({ length: small }, (_, index) => ({
      index: large + index,
      shape: 'triangle' as const,
      x: 35 + index * 45,
      y: 112,
      size: 9,
    })),
  ];
}
