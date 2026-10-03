export interface BnuFinalColorVisual {
  kind: 'bnu-final-color';
  variant: 'main' | 'review';
}

const main = [
  '1+3',
  '4+2',
  '3+3',
  '5+1',
  '5+4',
  '2+2+6',
  '9+1',
  '4+4+2',
  '2+8',
  '1+9',
  '7+1+2',
  '0+8',
  '2+1',
  '6+4',
  '7+3',
  '5+2',
  '8+2',
  '3+7',
  '4+4',
  '0+10',
  '3+6',
  '10+0',
  '5+5',
  '2+3+5',
  '1+1+8',
  '4+6',
  '0+8',
  '2+7',
  '1+7',
] as const;
const review = [
  '0+9',
  '4+5',
  '3+3+3',
  '1+8',
  '4+6',
  '9+0',
  '2+2+5',
  '0+8',
] as const;

/** Two occurrences of the same expression remain two separate regions. */
export function bnuFinalColorCards(variant: BnuFinalColorVisual['variant']) {
  return (variant === 'main' ? main : review).map((expression, index) => ({
    id: `R${index + 1}`,
    position: index + 1,
    expression,
  }));
}

export function isBnuFinalColorVisual(
  value: unknown,
): value is BnuFinalColorVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const data = value as Record<string, unknown>;
  return (
    Object.keys(data).length === 2 &&
    data.kind === 'bnu-final-color' &&
    (data.variant === 'main' || data.variant === 'review')
  );
}
