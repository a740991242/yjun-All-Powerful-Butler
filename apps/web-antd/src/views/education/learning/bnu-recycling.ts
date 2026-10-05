export interface BnuRecyclingVisual {
  kind: 'bnu-recycling';
  scene: 'circles' | 'rods';
  variant: 'main' | 'review';
}

export function isBnuRecyclingVisual(
  value: unknown,
): value is BnuRecyclingVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const v = value as Record<string, unknown>;
  return (
    Object.keys(v).length === 3 &&
    v.kind === 'bnu-recycling' &&
    (v.scene === 'circles' || v.scene === 'rods') &&
    (v.variant === 'main' || v.variant === 'review')
  );
}

/** Only given quantities: no result or equation is stored in the visual. */
export function bnuRecyclingConditions(visual: BnuRecyclingVisual) {
  if (!isBnuRecyclingVisual(visual))
    throw new Error('educationLearning.invalidRecord');
  return visual.variant === 'main'
    ? { matched: 13, extra: 3, bundle: 10, loose: 3 }
    : { matched: 17, extra: 2, bundle: 10, loose: 7 };
}
