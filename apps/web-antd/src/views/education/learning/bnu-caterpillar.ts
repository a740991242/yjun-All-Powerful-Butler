export type BnuCaterpillarVisual = { kind: 'bnu-caterpillar' };
export function isBnuCaterpillarVisual(
  value: unknown,
): value is BnuCaterpillarVisual {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.keys(value).length === 1 &&
    'kind' in value &&
    value.kind === 'bnu-caterpillar'
  );
}
export function caterpillarTurn(current: number, card: number) {
  if (
    !Number.isSafeInteger(current) ||
    current < 0 ||
    current > 17 ||
    !Number.isSafeInteger(card) ||
    card < 1 ||
    card > 8
  )
    throw new Error('educationLearning.invalidRecord');
  if (current === 10) return null;
  const action = current > 10 ? ('take' as const) : ('add' as const);
  return {
    action,
    before: current,
    card,
    after: action === 'add' ? current + card : current - card,
  };
}
