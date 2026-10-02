import { fold } from './fold';
import { required } from './required';
export interface CrossBalanceModel {
  kind: 'cross-balance';
  values: number[];
}
export function isCrossBalanceModel(
  value: unknown,
): value is CrossBalanceModel {
  if (typeof value !== 'object' || value === null || Array.isArray(value))
    return false;
  const model = value as Record<string, unknown>;
  if (
    Object.keys(model).length !== 2 ||
    model.kind !== 'cross-balance' ||
    !Array.isArray(model.values) ||
    model.values.length !== 5
  )
    return false;
  const values = [...model.values];
  if (
    !values.every(
      (n): n is number =>
        typeof n === 'number' && Number.isInteger(n) && n >= 0 && n <= 20,
    ) ||
    new Set(values).size !== 5
  )
    return false;
  // Remove the shared centre; the two disjoint opposite pairs must have equal sums.
  return values.some((_, center) => {
    const outer = values.filter((_, i) => i !== center);
    const total = fold(outer, 0, (sum, n) => sum + n);
    return outer.some((a, i) =>
      outer.some((b, j) => j > i && (a + b) * 2 === total),
    );
  });
}
export function matchesCrossBalance(
  model: CrossBalanceModel,
  answer: unknown,
): boolean {
  if (
    !isCrossBalanceModel(model) ||
    !Array.isArray(answer) ||
    answer.length !== 5
  )
    return false;
  const values = [...answer];
  if (
    !values.every(
      (n): n is number => typeof n === 'number' && Number.isSafeInteger(n),
    ) ||
    new Set(values).size !== 5 ||
    !values.every((n) => model.values.includes(n))
  )
    return false;
  // A top, B left, C centre, D right, E bottom. Centre is one card shared by both lines.
  return (
    required(values[0]) + required(values[4]) ===
    required(values[1]) + required(values[3])
  );
}
