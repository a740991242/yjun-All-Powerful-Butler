export interface BnuComicVisual {
  kind: 'bnu-comic';
  scene: 'ducks' | 'milk';
  variant: 'main' | 'review';
}
export function isBnuComicVisual(value: unknown): value is BnuComicVisual {
  if (typeof value !== 'object' || value === null || Array.isArray(value))
    return false;
  const v = value as Record<string, unknown>;
  return (
    Object.keys(v).length === 3 &&
    v.kind === 'bnu-comic' &&
    (v.scene === 'milk' || v.scene === 'ducks') &&
    (v.variant === 'main' || v.variant === 'review')
  );
}
/** Only given conditions. Answers never enter diagram or accessible descriptions. */
export function bnuComicFacts(variant: BnuComicVisual['variant']) {
  return variant === 'main'
    ? { price: 13, tendered: 20, start: 6, arrive: 8, leave: 5 }
    : { price: 16, tendered: 20, start: 7, arrive: 6, leave: 4 };
}
export function bnuComicDuckCounts(variant: BnuComicVisual['variant']) {
  const facts = bnuComicFacts(variant);
  // Each frame depicts its event, not three independent censuses to add again.
  return [facts.start, facts.arrive, facts.leave, 0];
}
