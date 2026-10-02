export type JugView =
  | 'handle-only'
  | 'spout-left'
  | 'spout-only'
  | 'spout-right';
export interface ViewpointJugVisual {
  kind: 'viewpoint-jug';
  variant: 'main' | 'review';
}
export function isViewpointJugVisual(
  value: unknown,
): value is ViewpointJugVisual {
  if (typeof value !== 'object' || value === null || Array.isArray(value))
    return false;
  const model = value as Record<string, unknown>;
  return (
    Object.keys(model).length === 2 &&
    model.kind === 'viewpoint-jug' &&
    (model.variant === 'main' || model.variant === 'review')
  );
}
/** Clockwise positions in the top-down plan: north, east, south, west.
 * A viewer's photograph-right points one position counterclockwise from their location.
 * Spout and handle are opposite; the far attachment is hidden in the two axial views.
 */
export function jugView(observer: number, spout: number): JugView {
  if (
    !Number.isInteger(observer) ||
    !Number.isInteger(spout) ||
    observer < 0 ||
    observer > 3 ||
    spout < 0 ||
    spout > 3
  )
    throw new RangeError('Four fixed cardinal positions only');
  if (observer === spout) return 'spout-only';
  if ((observer + 2) % 4 === spout) return 'handle-only';
  return (observer + 1) % 4 === spout ? 'spout-left' : 'spout-right';
}
export function jugScene(variant: ViewpointJugVisual['variant']): {
  spout: number;
  views: JugView[];
  candidates: JugView[];
} {
  const spout = variant === 'main' ? 3 : 0;
  return {
    spout,
    views: [0, 1, 2, 3].map((observer) => jugView(observer, spout)),
    candidates:
      variant === 'main'
        ? ['spout-only', 'spout-left', 'handle-only', 'spout-right']
        : ['handle-only', 'spout-right', 'spout-only', 'spout-left'],
  };
}
