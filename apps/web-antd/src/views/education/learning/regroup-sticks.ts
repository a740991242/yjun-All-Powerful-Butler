export interface RegroupSticksVisual {
  kind: 'regroup-sticks';
  operation: 'add' | 'subtract';
  tens: number;
  ones: number;
  amount: number;
  stage: 'original' | 'regroup' | 'result';
}
export function isRegroupSticksVisual(
  value: unknown,
): value is RegroupSticksVisual {
  if (typeof value !== 'object' || value === null || Array.isArray(value))
    return false;
  const v = value as Record<string, unknown>;
  if (
    Object.keys(v).length !== 6 ||
    v.kind !== 'regroup-sticks' ||
    (v.operation !== 'add' && v.operation !== 'subtract') ||
    (v.stage !== 'original' && v.stage !== 'regroup' && v.stage !== 'result')
  )
    return false;
  const integer = (n: unknown, min: number, max: number): n is number =>
    typeof n === 'number' && Number.isInteger(n) && n >= min && n <= max;
  if (
    !integer(v.tens, 1, 9) ||
    !integer(v.ones, 0, 9) ||
    !integer(v.amount, 1, 9)
  )
    return false;
  const start = v.tens * 10 + v.ones;
  return v.operation === 'add'
    ? v.ones + v.amount >= 10 && start + v.amount <= 99
    : v.ones < v.amount;
}
export function regroupStickGroups(visual: RegroupSticksVisual) {
  if (!isRegroupSticksVisual(visual)) throw new Error('Invalid regrouping');
  const { tens, ones, amount, stage, operation } = visual;
  if (stage === 'original') return { bundles: tens, loose: ones };
  if (operation === 'add')
    return stage === 'regroup'
      ? { bundles: tens, loose: ones + amount }
      : { bundles: tens + 1, loose: ones + amount - 10 };
  return stage === 'regroup'
    ? { bundles: tens - 1, loose: ones + 10 }
    : { bundles: tens - 1, loose: ones + 10 - amount };
}
