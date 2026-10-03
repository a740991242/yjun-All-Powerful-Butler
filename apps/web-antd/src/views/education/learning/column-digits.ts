import { required } from './required';

export type ColumnDigits = [null | number, null | number];
export interface ColumnDigitsRule {
  kind: 'column-digits';
  operator: '+' | '-';
  left: ColumnDigits;
  right: ColumnDigits;
  result: ColumnDigits;
}
export function columnDigitBlankCount(model: ColumnDigitsRule) {
  return [...model.left, ...model.right, ...model.result].filter(
    (n) => n === null,
  ).length;
}
function matches(model: ColumnDigitsRule, values: number[]) {
  let index = 0;
  const digits = [...model.left, ...model.right, ...model.result].map((n) =>
    n === null ? required(values[index++]) : n,
  );
  if (!digits.every((n) => Number.isSafeInteger(n) && n >= 0 && n <= 9))
    return false;
  if (digits[0] === 0 || digits[2] === 0) return false;
  const left = required(digits[0]) * 10 + required(digits[1]);
  const right = required(digits[2]) * 10 + required(digits[3]);
  const result = required(digits[4]) * 10 + required(digits[5]);
  return model.operator === '+'
    ? left + right === result
    : left - right === result;
}
function feasible(
  model: ColumnDigitsRule,
  count: number,
  values: number[] = [],
): boolean {
  if (values.length === count) return matches(model, values);
  for (let digit = 0; digit <= 9; digit++) {
    if (feasible(model, count, [...values, digit])) return true;
  }
  return false;
}
export function isColumnDigitsRule(value: unknown): value is ColumnDigitsRule {
  if (typeof value !== 'object' || value === null || Array.isArray(value))
    return false;
  const data = value as Record<string, unknown>;
  if (
    Object.keys(data).length !== 5 ||
    data.kind !== 'column-digits' ||
    (data.operator !== '+' && data.operator !== '-')
  )
    return false;
  if (!isDigits(data.left) || !isDigits(data.right) || !isDigits(data.result))
    return false;
  // The bounded model has two two-digit operands and a result from 0 to 99.
  const model: ColumnDigitsRule = {
    kind: 'column-digits',
    operator: data.operator,
    left: data.left,
    right: data.right,
    result: data.result,
  };
  const count = columnDigitBlankCount(model);
  return count >= 1 && count <= 3 && feasible(model, count);
}
function isDigits(value: unknown): value is ColumnDigits {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    [...value].every(
      (n) =>
        n === null ||
        (typeof n === 'number' && Number.isSafeInteger(n) && n >= 0 && n <= 9),
    )
  );
}
export function matchesColumnDigits(model: ColumnDigitsRule, answer: unknown) {
  return (
    isColumnDigitsRule(model) &&
    Array.isArray(answer) &&
    answer.length === columnDigitBlankCount(model) &&
    [...answer].every(
      (n) => typeof n === 'number' && Number.isSafeInteger(n),
    ) &&
    matches(model, answer)
  );
}
