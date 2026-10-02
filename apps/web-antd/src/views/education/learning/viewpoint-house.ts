export type HouseFace = 'blank' | 'circle' | 'door' | 'windows';
export interface ViewpointHouseVisual {
  kind: 'viewpoint-house';
  variant: 'main' | 'review';
}
export function isViewpointHouseVisual(
  value: unknown,
): value is ViewpointHouseVisual {
  if (typeof value !== 'object' || value === null || Array.isArray(value))
    return false;
  const model = value as Record<string, unknown>;
  return (
    Object.keys(model).length === 2 &&
    model.kind === 'viewpoint-house' &&
    (model.variant === 'main' || model.variant === 'review')
  );
}
/** The review rotates the same opaque model clockwise; candidates are independently reordered. */
export function houseScene(variant: ViewpointHouseVisual['variant']): {
  faces: HouseFace[];
  candidates: HouseFace[];
} {
  return variant === 'main'
    ? {
        faces: ['windows', 'circle', 'door', 'blank'],
        candidates: ['circle', 'door', 'blank', 'windows'],
      }
    : {
        faces: ['blank', 'windows', 'circle', 'door'],
        candidates: ['blank', 'circle', 'door', 'windows'],
      };
}
