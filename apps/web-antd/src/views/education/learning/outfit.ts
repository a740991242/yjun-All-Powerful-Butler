export interface OutfitRule {
  kind: 'outfit';
  variant: 'main' | 'review';
}
export function isOutfitRule(value: unknown): value is OutfitRule {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const v = value as Record<string, unknown>;
  return (
    Object.keys(v).length === 2 &&
    v.kind === 'outfit' &&
    (v.variant === 'main' || v.variant === 'review')
  );
}
/** Source prices or explicitly changed site prices; no selected outfit or result. */
export function outfitConditions(variant: 'main' | 'review') {
  return variant === 'main'
    ? { budget: 100, prices: [46, 52, 34, 53, 41] }
    : { budget: 70, prices: [31, 42, 24, 45, 33] };
}
export function matchesOutfit(rule: OutfitRule, answer: unknown) {
  if (!isOutfitRule(rule) || !Array.isArray(answer) || answer.length !== 2)
    return false;
  const [upper, trousers] = [...answer];
  if (
    typeof upper !== 'number' ||
    typeof trousers !== 'number' ||
    !Number.isSafeInteger(upper) ||
    !Number.isSafeInteger(trousers) ||
    upper < 1 ||
    upper > 3 ||
    trousers < 4 ||
    trousers > 5
  )
    return false;
  const given = outfitConditions(rule.variant);
  const a = given.prices[upper - 1];
  const b = given.prices[trousers - 1];
  return a !== undefined && b !== undefined && a + b <= given.budget;
}
