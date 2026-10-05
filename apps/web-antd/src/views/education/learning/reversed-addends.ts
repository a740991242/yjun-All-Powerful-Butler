export interface ReversedAddendsRule {
  kind: 'reversed-addends';
  result: number;
  count: number;
}
/** Two-digit operands stay two-digit after reversing; 04 is excluded. */
export function reversedAddendPairs(result: number): [number, number][] {
  const pairs: [number, number][] = [];
  for (let a = 10; a <= 99; a++) {
    const b = (a % 10) * 10 + Math.floor(a / 10);
    if (b >= 10 && a + b === result) pairs.push([a, b]);
  }
  return pairs;
}
export function isReversedAddendsRule(
  value: unknown,
): value is ReversedAddendsRule {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const v = value as Record<string, unknown>;
  return (
    Object.keys(v).length === 3 &&
    v.kind === 'reversed-addends' &&
    typeof v.result === 'number' &&
    Number.isSafeInteger(v.result) &&
    v.result >= 22 &&
    v.result <= 99 &&
    typeof v.count === 'number' &&
    Number.isSafeInteger(v.count) &&
    v.count >= 1 &&
    v.count <= 3 &&
    v.result % 11 === 0 &&
    v.count <= v.result / 11 - 1
  );
}
export function matchesReversedAddends(
  rule: ReversedAddendsRule,
  answer: unknown,
): boolean {
  if (
    !isReversedAddendsRule(rule) ||
    !Array.isArray(answer) ||
    answer.length !== rule.count * 2
  )
    return false;
  const values = [...answer];
  if (
    !values.every(
      (n): n is number =>
        typeof n === 'number' && Number.isSafeInteger(n) && n >= 10 && n <= 99,
    )
  )
    return false;
  const written = new Set<string>();
  for (let i = 0; i < values.length; i += 2) {
    const a = values[i];
    const b = values[i + 1];
    if (
      a === undefined ||
      b === undefined ||
      a + b !== rule.result ||
      b !== (a % 10) * 10 + Math.floor(a / 10)
    )
      return false;
    written.add(`${a}+${b}`);
  }
  // The source asks for three written equations, not three different unordered pairs.
  return written.size === rule.count;
}
