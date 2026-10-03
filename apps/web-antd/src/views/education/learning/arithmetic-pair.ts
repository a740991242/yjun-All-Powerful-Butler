import { required } from './required';

export interface ArithmeticPairRule {
  kind: 'arithmetic-pair';
  minimum: number;
  maximum: number;
  operation: 'add' | 'subtract';
  result: number;
}

export function isArithmeticPairRule(
  value: unknown,
): value is ArithmeticPairRule {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const data = value as Record<string, unknown>;
  if (
    Object.keys(data).length !== 5 ||
    data.kind !== 'arithmetic-pair' ||
    (data.operation !== 'add' && data.operation !== 'subtract') ||
    typeof data.minimum !== 'number' ||
    typeof data.maximum !== 'number' ||
    typeof data.result !== 'number' ||
    !Number.isSafeInteger(data.minimum) ||
    !Number.isSafeInteger(data.maximum) ||
    !Number.isSafeInteger(data.result) ||
    data.minimum < 0 ||
    data.maximum > 99 ||
    data.minimum > data.maximum ||
    data.result < 0
  )
    return false;
  return data.operation === 'add'
    ? data.result >= 2 * data.minimum && data.result <= 2 * data.maximum
    : data.result <= data.maximum - data.minimum;
}

export function matchesArithmeticPair(
  rule: ArithmeticPairRule,
  answer: unknown,
) {
  if (
    !isArithmeticPairRule(rule) ||
    !Array.isArray(answer) ||
    answer.length !== 2
  )
    return false;
  const values = [...answer];
  if (
    !values.every(
      (n): n is number =>
        typeof n === 'number' &&
        Number.isSafeInteger(n) &&
        n >= rule.minimum &&
        n <= rule.maximum,
    )
  )
    return false;
  const a = required(values[0]);
  const b = required(values[1]);
  return (rule.operation === 'add' ? a + b : a - b) === rule.result;
}
