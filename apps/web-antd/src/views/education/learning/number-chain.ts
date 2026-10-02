import { required } from './required';

/** Fixed numbers and blank positions in one strict, coupled comparison. */
export interface NumberChainRule {
  kind: 'number-chain';
  minimum: number;
  maximum: number;
  direction: 'ascending' | 'descending';
  values: (null | number)[];
}

export function numberChainBlankCount(rule: NumberChainRule) {
  return rule.values.filter((n) => n === null).length;
}

export function isNumberChainRule(value: unknown): value is NumberChainRule {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const data = value as Record<string, unknown>;
  if (
    Object.keys(data).length !== 5 ||
    data.kind !== 'number-chain' ||
    typeof data.minimum !== 'number' ||
    typeof data.maximum !== 'number' ||
    !Number.isSafeInteger(data.minimum) ||
    !Number.isSafeInteger(data.maximum) ||
    data.minimum < 0 ||
    data.maximum > 99 ||
    data.minimum >= data.maximum ||
    (data.direction !== 'ascending' && data.direction !== 'descending') ||
    !Array.isArray(data.values) ||
    data.values.length < 2 ||
    data.values.length > 3
  )
    return false;
  const minimum = data.minimum;
  const maximum = data.maximum;
  const direction = data.direction;
  const slots = [...data.values];
  if (
    !slots.every(
      (n): n is null | number =>
        n === null ||
        (typeof n === 'number' &&
          Number.isSafeInteger(n) &&
          n >= minimum &&
          n <= maximum),
    ) ||
    !slots.includes(null) ||
    slots.every((n) => n === null)
  )
    return false;
  // Reflect a descending chain into ascending order. Every blank needs an
  // integer interval, including blanks before and after fixed positions.
  const fixed = slots.flatMap((n, index) =>
    n === null
      ? []
      : [
          {
            index,
            value: direction === 'ascending' ? n : minimum + maximum - n,
          },
        ],
  );
  return fixed.every((point, i) => {
    if (
      point.value < minimum + point.index ||
      point.value > maximum - (slots.length - point.index - 1)
    )
      return false;
    if (i === 0) return true;
    const previous = required(fixed[i - 1]);
    return point.value - previous.value >= point.index - previous.index;
  });
}

export function matchesNumberChain(rule: NumberChainRule, answer: unknown) {
  if (
    !isNumberChainRule(rule) ||
    !Array.isArray(answer) ||
    answer.length !== numberChainBlankCount(rule)
  )
    return false;
  const input = [...answer];
  if (
    !input.every(
      (n): n is number =>
        typeof n === 'number' &&
        Number.isSafeInteger(n) &&
        n >= rule.minimum &&
        n <= rule.maximum,
    )
  )
    return false;
  let blank = 0;
  const complete = rule.values.map((n) =>
    n === null ? required(input[blank++]) : n,
  );
  return complete.every((n, index) => {
    if (index === 0) return true;
    const previous = required(complete[index - 1]);
    return rule.direction === 'ascending' ? previous < n : previous > n;
  });
}
