import { describe, expect, it } from 'vitest';

import { defaults, evaluate } from './model';
import { heartTier, readWishlist, WISHLIST_KEY } from './storage';

const requestedBanks = () => [
  defaults().find((row) => row.code === '601229'),
  defaults().find((row) => row.code === '002966'),
  defaults().find((row) => row.code === '601728'),
  defaults().find((row) => row.code === '601169'),
];

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
      defaults().find((target) => target.code === '000001'),
      defaults().find((target) => target.code === '000538'),
      defaults().find((target) => target.code === '000651'),
      defaults().find((target) => target.code === '601658'),
      ...requestedBanks(),
    ]);
  });
});

describe('v3 wishlist migration', () => {
  it('applies requested targets once and preserves unrelated edits', () => {
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
    expect(upgraded.targets[0]).toEqual({
      ...edited,
      price: 19.5,
      rule: 'atMost',
    });
    expect(upgraded.targets.map((row) => row.code)).toEqual([
      '600690',
      '601601',
      '000001',
      '000538',
      '000651',
      '601658',
      '601229',
      '002966',
      '601728',
      '601169',
    ]);
    for (const target of upgraded.targets.filter(
      (row) => row.rule === 'atMost',
    )) {
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
  it('applies requested values to an existing target for an added stock', () => {
    const saved = [
      { code: '601601', price: 27, near: 1, rule: 'below', note: 'custom' },
    ];
    expect(
      readWishlist({
        getItem: (key) => (key.endsWith(':v3') ? JSON.stringify(saved) : null),
      }).targets,
    ).toEqual([
      { ...saved[0], price: 28.5, rule: 'atMost' },
      defaults().find((target) => target.code === '000001'),
      defaults().find((target) => target.code === '000538'),
      defaults().find((target) => target.code === '000651'),
      defaults().find((target) => target.code === '600690'),
      defaults().find((target) => target.code === '601658'),
      ...requestedBanks(),
    ]);
  });
});

describe('corrected Ping An Bank target', () => {
  const wrong = {
    code: '601318',
    price: 10.5,
    rule: 'atMost',
    near: 3,
    note: '',
  };
  const migrate = (rows: unknown[]) =>
    readWishlist({
      getItem: (key) => (key.endsWith(':v4') ? JSON.stringify(rows) : null),
    });
  it('corrects the old insurance code and keeps other targets', () => {
    const other = defaults().find((row) => row.code === '601601');
    expect(migrate([wrong, other])).toEqual({
      targets: [
        { ...wrong, code: '000001' },
        other,
        defaults().find((row) => row.code === '000538'),
        defaults().find((row) => row.code === '000651'),
        defaults().find((row) => row.code === '600690'),
        defaults().find((row) => row.code === '601658'),
        ...requestedBanks(),
      ],
      needsSave: true,
    });
  });
  it('preserves edits and prefers an existing bank target without duplicates', () => {
    const edited = { ...wrong, price: 10, note: 'my target' };
    expect(migrate([edited]).targets).toEqual([
      { ...edited, code: '000001', price: 10.5 },
      defaults().find((row) => row.code === '000538'),
      defaults().find((row) => row.code === '000651'),
      defaults().find((row) => row.code === '600690'),
      defaults().find((row) => row.code === '601601'),
      defaults().find((row) => row.code === '601658'),
      ...requestedBanks(),
    ]);
    const bank = { ...wrong, code: '000001', price: 9.5 };
    expect(migrate([wrong, bank]).targets).toEqual([
      { ...bank, price: 10.5 },
      defaults().find((row) => row.code === '000538'),
      defaults().find((row) => row.code === '000651'),
      defaults().find((row) => row.code === '600690'),
      defaults().find((row) => row.code === '601601'),
      defaults().find((row) => row.code === '601658'),
      ...requestedBanks(),
    ]);
  });
  it('respects deleted targets and validates malformed data', () => {
    expect(migrate([]).targets).toEqual([
      defaults().find((row) => row.code === '000538'),
      defaults().find((row) => row.code === '000651'),
      defaults().find((row) => row.code === '600690'),
      defaults().find((row) => row.code === '601601'),
      defaults().find((row) => row.code === '000001'),
      defaults().find((row) => row.code === '601658'),
      ...requestedBanks(),
    ]);
    expect(() => migrate([{ ...wrong, price: 0 }])).toThrow('invalid');
    expect(
      readWishlist({ getItem: (key) => (key === WISHLIST_KEY ? '[]' : null) }),
    ).toEqual({ targets: [], needsSave: false });
  });
});

describe('v5 Yunnan Baiyao migration', () => {
  const postal = () => defaults().find((row) => row.code === '601658');
  const yunnan = () => defaults().find((row) => row.code === '000538');
  const migrate = (rows: unknown[]) =>
    readWishlist({
      getItem: (key) => (key.endsWith(':v5') ? JSON.stringify(rows) : null),
    });
  it('adds new stocks while keeping custom targets and prior removals', () => {
    const edited = {
      code: '600690',
      price: 18,
      rule: 'below',
      near: 1,
      note: 'mine',
    };
    expect(migrate([edited])).toEqual({
      targets: [
        { ...edited, price: 19.5, rule: 'atMost' },
        yunnan(),
        defaults().find((row) => row.code === '000651'),
        defaults().find((row) => row.code === '601601'),
        defaults().find((row) => row.code === '000001'),
        postal(),
        ...requestedBanks(),
      ],
      needsSave: true,
    });
    expect(migrate([]).targets).toEqual([
      yunnan(),
      defaults().find((row) => row.code === '000651'),
      defaults().find((row) => row.code === '600690'),
      defaults().find((row) => row.code === '601601'),
      defaults().find((row) => row.code === '000001'),
      postal(),
      ...requestedBanks(),
    ]);
    expect(
      readWishlist({ getItem: (key) => (key === WISHLIST_KEY ? '[]' : null) }),
    ).toEqual({ targets: [], needsSave: false });
  });
  it('preserves an existing Yunnan Baiyao target without duplicates', () => {
    const edited = { ...yunnan(), price: 45, near: 1, note: 'personal' };
    const upgraded = migrate([edited]);
    expect(upgraded.targets).toEqual([
      edited,
      defaults().find((row) => row.code === '000651'),
      defaults().find((row) => row.code === '600690'),
      defaults().find((row) => row.code === '601601'),
      defaults().find((row) => row.code === '000001'),
      postal(),
      ...requestedBanks(),
    ]);
    expect(
      readWishlist({
        getItem: (key) =>
          key === WISHLIST_KEY ? JSON.stringify(upgraded.targets) : null,
      }),
    ).toEqual({
      targets: [
        edited,
        defaults().find((row) => row.code === '000651'),
        defaults().find((row) => row.code === '600690'),
        defaults().find((row) => row.code === '601601'),
        defaults().find((row) => row.code === '000001'),
        postal(),
        ...requestedBanks(),
      ],
      needsSave: false,
    });
  });
  it('does not replace broken legacy storage with defaults', () => {
    expect(() => migrate([{ ...yunnan(), price: 0 }])).toThrow('invalid');
    expect(() =>
      readWishlist({ getItem: (key) => (key.endsWith(':v5') ? '{' : null) }),
    ).toThrow(SyntaxError);
  });
});

describe('v6 requested target migration', () => {
  const migrate = (rows: unknown[]) =>
    readWishlist({
      getItem: (key) => (key.endsWith(':v6') ? JSON.stringify(rows) : null),
    });
  const postal = () => defaults().find((row) => row.code === '601658');
  const oldGree = {
    code: '000651',
    price: 36,
    rule: 'around' as const,
    near: 3,
    note: '',
  };
  it('writes all requested targets and updates the old Gree default', () => {
    const unrelated = {
      code: '600050',
      price: 18,
      rule: 'below' as const,
      near: 2,
      note: 'personal',
    };
    expect(migrate([unrelated, oldGree])).toEqual({
      targets: [
        unrelated,
        { ...oldGree, price: 36.5, rule: 'atMost' },
        defaults().find((row) => row.code === '600690'),
        defaults().find((row) => row.code === '601601'),
        defaults().find((row) => row.code === '000001'),
        postal(),
        ...requestedBanks(),
      ],
      needsSave: true,
    });
  });
  it('applies requested prices while preserving notes and near ranges', () => {
    const customGree = {
      ...oldGree,
      price: 35,
      rule: 'below' as const,
      near: 2,
      note: 'personal',
    };
    const customPostal = { ...postal(), price: 4.5, note: 'personal' };
    expect(migrate([customGree, customPostal])).toEqual({
      targets: [
        { ...customGree, price: 36.5, rule: 'atMost' },
        { ...customPostal, price: 4.8 },
        defaults().find((row) => row.code === '600690'),
        defaults().find((row) => row.code === '601601'),
        defaults().find((row) => row.code === '000001'),
        ...requestedBanks(),
      ],
      needsSave: true,
    });
  });
});

describe('v7 bank target migration', () => {
  const migrate = (rows: unknown[]) =>
    readWishlist({
      getItem: (key) => (key.endsWith(':v7') ? JSON.stringify(rows) : null),
    });
  const shanghai = () => defaults().find((row) => row.code === '601229');
  const suzhou = () => defaults().find((row) => row.code === '002966');
  it('adds Shanghai and Suzhou banks at their inclusive targets', () => {
    const unrelated = {
      code: '600050',
      price: 3.8,
      rule: 'below' as const,
      near: 2,
      note: 'personal',
    };
    expect(migrate([unrelated])).toEqual({
      targets: [
        unrelated,
        shanghai(),
        suzhou(),
        defaults().find((row) => row.code === '601728'),
        defaults().find((row) => row.code === '601169'),
      ],
      needsSave: true,
    });
  });
  it('updates existing bank targets without losing notes or near ranges', () => {
    const customShanghai = {
      ...shanghai(),
      price: 7.5,
      rule: 'below' as const,
      near: 2,
      note: 'personal',
    };
    const customSuzhou = {
      ...suzhou(),
      price: 6.5,
      rule: 'around' as const,
      near: 4,
      note: 'watch',
    };
    expect(migrate([customShanghai, customSuzhou])).toEqual({
      targets: [
        { ...customShanghai, price: 8, rule: 'atMost' },
        { ...customSuzhou, price: 7, rule: 'atMost' },
        defaults().find((row) => row.code === '601728'),
        defaults().find((row) => row.code === '601169'),
      ],
      needsSave: true,
    });
  });
});

describe('v8 telecom and Beijing bank migration', () => {
  const migrate = (rows: unknown[]) =>
    readWishlist({
      getItem: (key) => (key.endsWith(':v8') ? JSON.stringify(rows) : null),
    });
  const telecom = () => defaults().find((row) => row.code === '601728');
  const beijing = () => defaults().find((row) => row.code === '601169');
  it('adds China Telecom and Beijing Bank at their inclusive targets', () => {
    const unrelated = {
      code: '600050',
      price: 3.8,
      rule: 'below' as const,
      near: 2,
      note: 'personal',
    };
    expect(migrate([unrelated])).toEqual({
      targets: [unrelated, telecom(), beijing()],
      needsSave: true,
    });
  });
  it('updates existing values without losing notes or near ranges', () => {
    const customTelecom = {
      ...telecom(),
      price: 4.8,
      rule: 'below' as const,
      near: 2,
      note: 'personal',
    };
    const customBeijing = {
      ...beijing(),
      price: 4.5,
      rule: 'around' as const,
      near: 4,
      note: 'watch',
    };
    expect(migrate([customTelecom, customBeijing])).toEqual({
      targets: [
        { ...customTelecom, price: 5.2, rule: 'atMost' },
        { ...customBeijing, price: 5, rule: 'atMost' },
      ],
      needsSave: true,
    });
  });
});
