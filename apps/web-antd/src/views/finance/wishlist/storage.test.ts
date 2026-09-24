import { describe, expect, it } from 'vitest';

import { defaults } from './model';
import { heartTier, readWishlist, WISHLIST_KEY } from './storage';

describe('wishlist hearts', () => {
  it.each([
    [0, 0],
    [2, 0],
    [2.001, 1],
    [5, 1],
    [5.001, 2],
    [10, 2],
    [10.001, 3],
    [15, 3],
    [15.001, 4],
    [20, 4],
    [20.001, 5],
    [30, 5],
    [30.001, 6],
    [100, 6],
    [null, null],
    [Number.NaN, null],
    [Number.POSITIVE_INFINITY, null],
    [-1, null],
  ])('maps %s to tier %s', (gap, tier) => {
    expect(heartTier(gap)).toBe(tier);
  });
  it('uses saved custom targets and respects removed entries', () => {
    const target = {
      code: '510210',
      rule: 'around' as const,
      near: 3,
      note: '',
      price: 1.23,
    };
    const store = {
      getItem: (key: string) =>
        key === WISHLIST_KEY ? JSON.stringify([target]) : null,
    };
    expect(readWishlist(store)).toEqual({
      targets: [target],
      needsSave: false,
    });
    expect(readWishlist({ getItem: () => '[]' }).targets).toEqual([]);
  });
  it('does not disguise invalid storage as default targets', () => {
    expect(() => readWishlist({ getItem: () => '{' })).toThrow(SyntaxError);
    expect(() => readWishlist({ getItem: () => '[{}]' })).toThrow('invalid');
  });
  it('shares the initial defaults and previous-version migration', () => {
    expect(readWishlist({ getItem: () => null }).targets).toEqual(defaults());
    const saved = [
      { code: '510210', rule: 'around' as const, near: 3, note: '', price: 2 },
    ];
    const result = readWishlist({
      getItem: (key: string) =>
        key.endsWith(':v2') ? JSON.stringify(saved) : null,
    });
    expect(result.needsSave).toBe(true);
    expect(result.targets).toEqual([
      ...saved,
      defaults().find((target) => target.code === '600690'),
    ]);
  });
});
