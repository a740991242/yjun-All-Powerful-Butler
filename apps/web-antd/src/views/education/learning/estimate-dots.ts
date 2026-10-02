export interface EstimateDotsVisual {
  kind: 'estimate-dots';
  variant: 'main' | 'review';
}
export interface EstimateDotsState {
  variant: 'main' | 'review';
  estimate: null | number;
  locked: boolean;
  counted: null | number;
}
function record(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
const variant = (v: unknown) => v === 'main' || v === 'review';
const count = (v: unknown) =>
  v === null ||
  (typeof v === 'number' && Number.isSafeInteger(v) && v >= 0 && v <= 99);
export function isEstimateDotsVisual(v: unknown): v is EstimateDotsVisual {
  return (
    record(v) &&
    Object.keys(v).length === 2 &&
    v.kind === 'estimate-dots' &&
    variant(v.variant)
  );
}
export function isEstimateDotsState(v: unknown): v is EstimateDotsState {
  return (
    record(v) &&
    Object.keys(v).length === 4 &&
    variant(v.variant) &&
    count(v.estimate) &&
    typeof v.locked === 'boolean' &&
    count(v.counted) &&
    (!v.locked || v.estimate !== null) &&
    (v.locked || v.counted === null)
  );
}
export function estimateDots(variant: 'main' | 'review') {
  return Array.from({ length: variant === 'main' ? 63 : 47 }, (_, i) => ({
    x: 22 + (i % 10) * 28 + (i < 10 ? 0 : ((i * 7) % 9) - 4),
    y: 24 + Math.floor(i / 10) * 32 + (i < 10 ? 0 : ((i * 5) % 7) - 3),
    reference: i < 10,
  }));
}
export function initialEstimateDots(
  variant: 'main' | 'review',
): EstimateDotsState {
  return { variant, estimate: null, locked: false, counted: null };
}
