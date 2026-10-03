import { required } from './required';

export interface CardEquationRule {
  kind: 'card-equation';
  values: number[];
}
export function isCardEquationRule(value: unknown): value is CardEquationRule {
  if (typeof value !== 'object' || value === null || Array.isArray(value))
    return false;
  const model = value as Record<string, unknown>;
  if (
    Object.keys(model).length !== 2 ||
    model.kind !== 'card-equation' ||
    !Array.isArray(model.values) ||
    model.values.length !== 4
  )
    return false;
  const cards = [...model.values];
  if (
    !cards.every(
      (n): n is number =>
        typeof n === 'number' && Number.isSafeInteger(n) && n >= 0 && n <= 99,
    ) ||
    new Set(cards).size !== 4
  )
    return false;
  const total = cards.reduce((sum, n) => sum + n, 0);
  return (
    total <= 200 &&
    cards.some((a, i) => cards.some((b, j) => j > i && 2 * (a + b) === total))
  );
}
export function matchesCardEquation(model: CardEquationRule, answer: unknown) {
  if (
    !isCardEquationRule(model) ||
    !Array.isArray(answer) ||
    answer.length !== 4
  )
    return false;
  const cards = [...answer];
  if (
    !cards.every(
      (n): n is number =>
        typeof n === 'number' &&
        Number.isSafeInteger(n) &&
        model.values.includes(n),
    ) ||
    new Set(cards).size !== 4
  )
    return false;
  return (
    required(cards[0]) + required(cards[1]) - required(cards[2]) ===
    required(cards[3])
  );
}
