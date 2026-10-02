export type OcclusionView = 'front' | 'hidden' | 'left' | 'right';
export interface OcclusionViewsVisual {
  kind: 'occlusion-views';
  variant: 'main' | 'review';
}
export function isOcclusionViewsVisual(
  value: unknown,
): value is OcclusionViewsVisual {
  if (typeof value !== 'object' || value === null || Array.isArray(value))
    return false;
  const m = value as Record<string, unknown>;
  return (
    Object.keys(m).length === 2 &&
    m.kind === 'occlusion-views' &&
    (m.variant === 'main' || m.variant === 'review')
  );
}
/** Known arrangement of an opaque unmarked box and a smaller cup; not a transparent top-view photograph. */
export function occlusionScene(variant: OcclusionViewsVisual['variant']): {
  cupSide: 'bottom' | 'top';
  views: OcclusionView[];
  candidates: OcclusionView[];
} {
  return variant === 'main'
    ? {
        cupSide: 'bottom',
        views: ['hidden', 'left', 'front', 'right'],
        candidates: ['right', 'hidden', 'front', 'left'],
      }
    : {
        cupSide: 'top',
        views: ['front', 'right', 'hidden', 'left'],
        candidates: ['hidden', 'left', 'right', 'front'],
      };
}
