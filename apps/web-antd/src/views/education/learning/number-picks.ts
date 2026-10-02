import { required } from './required';
export interface NumberPicksRule {
  kind: 'number-picks';
  fields: number[][];
  distinct: boolean;
}
function feasible(
  fields: number[][],
  distinct: boolean,
  index = 0,
  used: number[] = [],
): boolean {
  return (
    index === fields.length ||
    required(fields[index]).some(
      (value) =>
        (!distinct || !used.includes(value)) &&
        feasible(fields, distinct, index + 1, [...used, value]),
    )
  );
}
export function isNumberPicksRule(value: unknown): value is NumberPicksRule {
  if (typeof value !== 'object' || value === null || Array.isArray(value))
    return false;
  const data = value as Record<string, unknown>;
  if (
    Object.keys(data).length !== 3 ||
    data.kind !== 'number-picks' ||
    typeof data.distinct !== 'boolean' ||
    !Array.isArray(data.fields) ||
    data.fields.length === 0 ||
    data.fields.length > 3
  )
    return false;
  const fields = data.fields;
  if (
    ![...fields].every(
      (field) =>
        Array.isArray(field) &&
        field.length > 0 &&
        field.length <= 100 &&
        [...field].every(
          (n) =>
            typeof n === 'number' &&
            Number.isSafeInteger(n) &&
            n >= 0 &&
            n <= 99,
        ) &&
        new Set(field).size === field.length,
    )
  )
    return false;
  return feasible(fields, data.distinct);
}
export function matchesNumberPicks(rule: NumberPicksRule, answer: unknown) {
  return (
    isNumberPicksRule(rule) &&
    Array.isArray(answer) &&
    answer.length === rule.fields.length &&
    [...answer].every(
      (value, index) =>
        typeof value === 'number' &&
        required(rule.fields[index]).includes(value),
    ) &&
    (!rule.distinct || new Set(answer).size === answer.length)
  );
}
