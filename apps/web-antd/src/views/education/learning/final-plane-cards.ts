export type FinalPlaneShape =
  | 'circle'
  | 'parallelogram'
  | 'rectangle'
  | 'square'
  | 'triangle';
export interface FinalPlaneCardsVisual {
  kind: 'final-plane-cards';
  variant: 'main' | 'review';
}
const shapes: Record<
  FinalPlaneCardsVisual['variant'],
  readonly FinalPlaneShape[]
> = {
  main: [
    'rectangle',
    'circle',
    'triangle',
    'parallelogram',
    'square',
    'rectangle',
    'circle',
    'triangle',
    'circle',
    'parallelogram',
    'rectangle',
    'circle',
  ],
  review: [
    'circle',
    'triangle',
    'square',
    'rectangle',
    'circle',
    'parallelogram',
    'triangle',
    'circle',
    'rectangle',
    'square',
    'circle',
    'triangle',
    'circle',
  ],
};
export function finalPlaneCards(visual: FinalPlaneCardsVisual) {
  return shapes[visual.variant].map((shape, index) => ({
    shape,
    label: String.fromCodePoint(65 + index),
  }));
}
export function isFinalPlaneCardsVisual(
  value: unknown,
): value is FinalPlaneCardsVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const v = value as Record<string, unknown>;
  return (
    Object.keys(v).length === 2 &&
    v.kind === 'final-plane-cards' &&
    (v.variant === 'main' || v.variant === 'review')
  );
}
