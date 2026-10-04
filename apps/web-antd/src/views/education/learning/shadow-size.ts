export interface ShadowSizeVisual {
  kind: 'shadow-size';
  variant: 'main' | 'review';
}
export function isShadowSizeVisual(value: unknown): value is ShadowSizeVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  return (
    Object.keys(value).length === 2 &&
    'kind' in value &&
    value.kind === 'shadow-size' &&
    'variant' in value &&
    (value.variant === 'main' || value.variant === 'review')
  );
}
/** Fixed point source and screen, identical opaque strip moved along the same axis.
 * Coordinates are diagram units, not measured centimetres or a child-facing formula.
 */
export function shadowScenes(model: ShadowSizeVisual) {
  const positions = model.variant === 'main' ? [100, 200] : [200, 100];
  return positions.map((x, i) => ({
    label: i === 0 ? 'A' : 'B',
    lampX: 24,
    screenX: 296,
    objectX: x,
    centerY: 85,
    objectHalf: 10,
    shadowHalf: (10 * (296 - 24)) / (x - 24),
  }));
}
