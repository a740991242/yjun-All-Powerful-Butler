import type { Answer } from './types';

export interface EqualPairsRule {
  kind: 'equal-pairs';
  values: number[];
}

/** Eight different cards used once, with four equal sums within ten. */
export function isEqualPairsRule(value: unknown): value is EqualPairsRule {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const model = value as Record<string, unknown>;
  if (
    Object.keys(model).length !== 2 ||
    model.kind !== 'equal-pairs' ||
    !Array.isArray(model.values) ||
    model.values.length !== 8
  )
    return false;
  const values = [...model.values];
  if (
    !values.every(
      (n) =>
        typeof n === 'number' && Number.isSafeInteger(n) && n >= 0 && n <= 10,
    ) ||
    new Set(values).size !== 8
  )
    return false;
  const total = values.reduce((sum: number, n: number) => sum + n, 0) / 4;
  return (
    Number.isSafeInteger(total) &&
    total <= 10 &&
    values.every((n) => total !== 2 * n && values.includes(total - n))
  );
}

export function matchesEqualPairs(
  rule: EqualPairsRule,
  answer: Answer | null,
): boolean {
  if (
    !isEqualPairsRule(rule) ||
    !Array.isArray(answer) ||
    answer.length !== 8 ||
    ![...answer].every(
      (n) => typeof n === 'number' && rule.values.includes(n),
    ) ||
    new Set<null | number | string>(answer).size !== 8
  )
    return false;
  const expected = rule.values.reduce((sum, n) => sum + n, 0) / 4;
  for (let pair = 0; pair < 4; pair++) {
    if (Number(answer[pair * 2]) + Number(answer[pair * 2 + 1]) !== expected)
      return false;
  }
  return true;
}
