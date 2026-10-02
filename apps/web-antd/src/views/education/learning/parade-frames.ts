export interface ParadeFramesVisual {
  kind: 'parade-frames';
  variant: 'main' | 'review';
}
/** Original side-view photographs of one decorated float, with a fixed spectator P. */
export function paradeFrames(variant: ParadeFramesVisual['variant']) {
  const review = variant === 'review';
  return {
    direction: review ? ('left' as const) : ('right' as const),
    observer: 150,
    positions: review ? [60, 150, 240] : [150, 60, 240],
  };
}
export function isParadeFramesVisual(
  value: unknown,
): value is ParadeFramesVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const m = value as Record<string, unknown>;
  return (
    Object.keys(m).length === 2 &&
    m.kind === 'parade-frames' &&
    (m.variant === 'main' || m.variant === 'review')
  );
}
