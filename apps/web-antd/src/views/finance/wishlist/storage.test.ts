import { describe, expect, it } from 'vitest';

import { defaults, evaluate } from './model';
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
      defaults().find((target) => target.code === '601601'),
      defaults().find((target) => target.code === '601318'),
    ]);
  });
});

describe('v4 wishlist migration', () => {
  it('adds inclusive targets once without changing edits or restoring other removals', () => {
    const edited = {
      code: '600690',
      price: 18,
      near: 2,
      rule: 'below' as const,
      note: 'mine',
    };
    const upgraded = readWishlist({
      getItem: (key) => (key.endsWith(':v3') ? JSON.stringify([edited]) : null),
    });
    expect(upgraded.needsSave).toBe(true);
    expect(upgraded.targets[0]).toEqual(edited);
    expect(upgraded.targets.map((row) => row.code)).toEqual([
      '600690',
      '601601',
      '601318',
    ]);
    for (const target of upgraded.targets.slice(1)) {
      expect(target.rule).toBe('atMost');
      expect(
        evaluate(
          target,
          { price: target.price, date: '2026-09-29' },
          '2026-09-29',
        ).status,
      ).toBe('reached');
      expect(
        evaluate(
          target,
          { price: target.price + 0.01, date: '2026-09-29' },
          '2026-09-29',
        ).status,
      ).not.toBe('reached');
    }
    const current = readWishlist({
      getItem: (key) =>
        key === WISHLIST_KEY ? JSON.stringify([edited]) : null,
    });
    expect(current).toEqual({ targets: [edited], needsSave: false });
  });
  it('preserves an existing target for an added stock', () => {
    const saved = [
      { code: '601601', price: 27, near: 1, rule: 'below', note: 'custom' },
    ];
    expect(
      readWishlist({
        getItem: (key) => (key.endsWith(':v3') ? JSON.stringify(saved) : null),
      }).targets,
    ).toEqual([
      ...saved,
      defaults().find((target) => target.code === '601318'),
    ]);
  });
});
