export type EstimateDotsVariant =
  | 'hundred-main'
  | 'hundred-review'
  | 'main'
  | 'review';
export interface EstimateDotsVisual {
  kind: 'estimate-dots';
  variant: EstimateDotsVariant;
}
export interface EstimateDotsState {
  variant: EstimateDotsVariant;
  estimate: null | number;
  locked: boolean;
  counted: null | number;
}
function record(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
const variant = (v: unknown): v is EstimateDotsVariant =>
  v === 'main' ||
  v === 'review' ||
  v === 'hundred-main' ||
  v === 'hundred-review';
export function estimateDotsMaximum(v: EstimateDotsVariant) {
  return v.startsWith('hundred-') ? 100 : 99;
}
const count = (v: unknown, maximum: number) =>
  v === null ||
  (typeof v === 'number' && Number.isSafeInteger(v) && v >= 0 && v <= maximum);
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
    count(v.estimate, estimateDotsMaximum(v.variant)) &&
    typeof v.locked === 'boolean' &&
    count(v.counted, estimateDotsMaximum(v.variant)) &&
    (!v.locked || v.estimate !== null) &&
    (v.locked || v.counted === null)
  );
}
export function estimateDots(variant: EstimateDotsVariant) {
  return Array.from(
    { length: variant === 'main' || variant === 'hundred-main' ? 63 : 47 },
    (_, i) => ({
      x: 22 + (i % 10) * 28 + (i < 10 ? 0 : ((i * 7) % 9) - 4),
      y: 24 + Math.floor(i / 10) * 32 + (i < 10 ? 0 : ((i * 5) % 7) - 3),
      reference: i < 10,
    }),
  );
}
export function initialEstimateDots(
  variant: EstimateDotsVariant,
): EstimateDotsState {
  return { variant, estimate: null, locked: false, counted: null };
}
