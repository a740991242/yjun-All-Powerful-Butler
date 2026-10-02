import type { RegionPairVisual } from './types';

/** Only proper nested rectangles; no area formula or incomparable shapes. */
export function isRegionPairVisual(value: unknown): value is RegionPairVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const model = value as Record<string, unknown>;
  if (
    Object.keys(model).length !== 2 ||
    model.kind !== 'region-pair' ||
    !Array.isArray(model.sizes) ||
    model.sizes.length !== 2
  )
    return false;
  for (const size of model.sizes) {
    if (
      !Array.isArray(size) ||
      size.length !== 2 ||
      !size.every((item) => Number.isInteger(item)) ||
      size[0] < 1 ||
      size[0] > 4 ||
      size[1] < 1 ||
      size[1] > 3
    )
      return false;
  }
  const [[aw, ah], [bw, bh]] = model.sizes as RegionPairVisual['sizes'];
  return (
    (aw !== bw || ah !== bh) &&
    ((aw >= bw && ah >= bh) || (bw >= aw && bh >= ah))
  );
}

export function largerRegion(visual: RegionPairVisual): 'A' | 'B' {
  const [a, b] = visual.sizes;
  return a[0] >= b[0] && a[1] >= b[1] ? 'A' : 'B';
}
