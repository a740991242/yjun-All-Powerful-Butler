import { describe, expect, it } from 'vitest';

import {
  exchangePlaceValue,
  isPlaceValueState,
  placeValue,
} from './place-value';

describe('quantity-preserving place-value exchanges', () => {
  it('covers every valid representation from 0 to 100 and preserves quantity for all actions', () => {
    for (let value = 0; value <= 100; value++) {
      const canonical = placeValue(value);
      expect(
        canonical.hundreds * 100 + canonical.tens * 10 + canonical.ones,
      ).toBe(value);
      expect(canonical.ones).toBeLessThan(10);
      expect(canonical.tens).toBeLessThan(10);
      for (let hundreds = 0; hundreds <= 1; hundreds++) {
        for (let tens = 0; tens <= 10; tens++) {
          const state = { value, hundreds, tens };
          if (hundreds * 100 + tens * 10 > value) {
            expect(isPlaceValueState(state)).toBe(false);
            continue;
          }
          expect(isPlaceValueState(state)).toBe(true);
          const before = structuredClone(state);
          for (const action of [
            'bundle-ten',
            'split-ten',
            'bundle-hundred',
            'split-hundred',
          ] as const) {
            const exchanged = exchangePlaceValue(value, state, action);
            expect(isPlaceValueState(exchanged)).toBe(true);
            const result = placeValue(value, exchanged);
            expect(result.hundreds * 100 + result.tens * 10 + result.ones).toBe(
              value,
            );
            const enabled = {
              'bundle-ten': placeValue(value, state).canBundleTen,
              'split-ten': tens > 0,
              'bundle-hundred': tens === 10,
              'split-hundred': hundreds > 0,
            }[action];
            if (!enabled) expect(exchanged).toEqual(state);
          }
          expect(state).toEqual(before);
        }
      }
    }
  });
  it('exchanges a hundred for ten tens and reverses splitting without losing original ones', () => {
    const hundred = exchangePlaceValue(100, undefined, 'split-hundred');
    expect(hundred).toEqual({ value: 100, hundreds: 0, tens: 10 });
    expect(exchangePlaceValue(100, hundred, 'bundle-hundred')).toEqual({
      value: 100,
      hundreds: 1,
      tens: 0,
    });
    const split = exchangePlaceValue(23, undefined, 'split-ten');
    expect(placeValue(23, split)).toMatchObject({
      hundreds: 0,
      tens: 1,
      ones: 13,
    });
    expect(exchangePlaceValue(23, split, 'bundle-ten')).toEqual({
      value: 23,
      hundreds: 0,
      tens: 2,
    });
  });
  it('rejects malformed bounded state and does not reuse a grouping for another quantity', () => {
    for (const invalid of [
      null,
      [],
      {},
      { value: 23, hundreds: 0, tens: 3 },
      { value: 100, hundreds: 1, tens: 1 },
      { value: 101, hundreds: 1, tens: 0 },
      { value: 20, hundreds: 0, tens: -1 },
      { value: 20, hundreds: 0, tens: 1.5 },
      { value: 20, hundreds: 0, tens: 2, ones: 0 },
    ])
      expect(isPlaceValueState(invalid)).toBe(false);
    expect(placeValue(12, { value: 23, hundreds: 0, tens: 1 })).toMatchObject({
      value: 12,
      tens: 1,
      ones: 2,
    });
    for (const invalid of [Number.NaN, Infinity, -1, 101, 1.5])
      expect(() => placeValue(invalid)).toThrow(
        'educationLearning.invalidRecord',
      );
  });
});
