import { required } from './required';
export interface TeenArithmeticGridVisual {
  kind: 'teen-arithmetic-grid';
  display: 'join' | 'tables' | 'take' | 'ten';
  variant: 'main' | 'review';
}
export function isTeenArithmeticGridVisual(
  value: unknown,
): value is TeenArithmeticGridVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const m = value as Record<string, unknown>;
  return (
    Object.keys(m).length === 3 &&
    m.kind === 'teen-arithmetic-grid' &&
    typeof m.display === 'string' &&
    ['join', 'tables', 'take', 'ten'].includes(m.display) &&
    typeof m.variant === 'string' &&
    ['main', 'review'].includes(m.variant)
  );
}
export function teenArithmeticRows(
  variant: TeenArithmeticGridVisual['variant'],
) {
  const add = variant === 'main' ? [1, 3, 5, 7] : [2, 4, 6, 8];
  const sub = variant === 'main' ? [2, 4, 6, 8] : [1, 3, 5, 7];
  return add.map((b, i) => ({
    add: [10, b] as const,
    subtract: [variant === 'main' ? 18 : 19, required(sub[i])] as const,
  }));
}
export function teenArithmeticRodState(model: TeenArithmeticGridVisual) {
  const review = model.variant === 'review';
  if (model.display === 'join')
    return {
      start: review ? 13 : 14,
      operand: review ? 5 : 3,
      operation: '+' as const,
    };
  if (model.display === 'take')
    return {
      start: review ? 18 : 16,
      operand: review ? 6 : 4,
      operation: '−' as const,
    };
  return { start: review ? 17 : 19, operand: 10, operation: '−' as const };
}
