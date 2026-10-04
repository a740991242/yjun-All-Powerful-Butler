/** All integer answers in a stated, inclusive website interval are accepted. */
export interface NumberIntervalRule {
  kind: 'number-interval';
  minimum: number;
  maximum: number;
}
export function isNumberIntervalRule(
  value: unknown,
): value is NumberIntervalRule {
  if (typeof value !== 'object' || value === null || Array.isArray(value))
    return false;
  const data = value as Record<string, unknown>;
  return (
    Object.keys(data).length === 3 &&
    Object.keys(data).every((key) =>
      ['kind', 'maximum', 'minimum'].includes(key),
    ) &&
    data.kind === 'number-interval' &&
    typeof data.minimum === 'number' &&
    typeof data.maximum === 'number' &&
    Number.isSafeInteger(data.minimum) &&
    Number.isSafeInteger(data.maximum) &&
    data.minimum >= 0 &&
    data.maximum <= 100 &&
    data.minimum <= data.maximum
  );
}
export function matchesNumberInterval(
  rule: NumberIntervalRule,
  answer: unknown,
) {
  return (
    isNumberIntervalRule(rule) &&
    typeof answer === 'number' &&
    Number.isSafeInteger(answer) &&
    answer >= rule.minimum &&
    answer <= rule.maximum
  );
}
