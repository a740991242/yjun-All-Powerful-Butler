import { describe, expect, it } from 'vitest';

import { isRegionPairVisual, largerRegion } from './region-pair';

describe('same-grid nested enclosure model', () => {
  it('compares containment in both directions, including one shared dimension', () => {
    for (let aw = 1; aw <= 4; aw++) {
      for (let ah = 1; ah <= 3; ah++) {
        for (let bw = 1; bw <= 4; bw++) {
          for (let bh = 1; bh <= 3; bh++) {
            const value = {
              kind: 'region-pair',
              sizes: [
                [aw, ah],
                [bw, bh],
              ],
            };
            const properContainment =
              (aw !== bw || ah !== bh) &&
              ((aw >= bw && ah >= bh) || (bw >= aw && bh >= ah));
            expect(isRegionPairVisual(value)).toBe(properContainment);
            if (isRegionPairVisual(value)) {
              const larger = largerRegion(value);
              const outer = value.sizes[larger === 'A' ? 0 : 1];
              const inner = value.sizes[larger === 'A' ? 1 : 0];
              expect(outer[0] >= inner[0] && outer[1] >= inner[1]).toBe(true);
              expect(outer[0] * outer[1]).toBeGreaterThan(inner[0] * inner[1]);
            }
          }
        }
      }
    }
  });
  it('rejects malformed geometry, incomparable shapes and injected answers', () => {
    for (const sizes of [
      [],
      [[2, 2]],
      [
        [2, 2],
        [2, 2],
      ],
      [
        [4, 1],
        [2, 3],
      ],
      [
        [0, 1],
        [2, 2],
      ],
      [
        [5, 1],
        [2, 2],
      ],
      [
        [2, 4],
        [1, 1],
      ],
      [
        [1.5, 1],
        [2, 2],
      ],
      [
        [1, 1, 1],
        [2, 2],
      ],
      [
        [Number.NaN, 1],
        [2, 2],
      ],
      [
        [1, Infinity],
        [2, 2],
      ],
    ])
      expect(isRegionPairVisual({ kind: 'region-pair', sizes })).toBe(false);
    const valid = {
      kind: 'region-pair',
      sizes: [
        [1, 1],
        [2, 2],
      ],
    };
    expect(isRegionPairVisual({ ...valid, answer: 'B' })).toBe(false);
    expect(isRegionPairVisual({ ...valid, origin: [0, 0] })).toBe(false);
    expect(isRegionPairVisual(null)).toBe(false);
  });
});
