import { describe, expect, it } from 'vitest';

import {
  defaults,
  evaluate,
  upgradeLegacyTargets,
  upgradeV2Targets,
  validateTargets,
} from './model';
describe('wishlist targets', () => {
  const target = {
    code: '600050',
    price: 4,
    rule: 'atMost' as const,
    near: 3,
    note: '',
  };
  const quote = (price: number, date = '2026-09-16') => ({ price, date });
  it('preserves the 14 user targets and the strict boundary', () => {
    const all = defaults();
    expect(validateTargets(all)).toEqual(all);
    expect(all).toHaveLength(14);
    expect(all.find((t) => t.code === '600900')?.rule).toBe('below');
    expect(all.find((t) => t.code === '510210')?.note).toContain('3750');
  });
  it('includes Semir at five yuan, but not above five', () => {
    const semir = defaults().find((row) => row.code === '002563');
    expect(semir).toMatchObject({ price: 5, rule: 'atMost' });
    if (!semir) throw new Error('Missing Semir target');
    expect(evaluate(semir, quote(5), '2026-09-16').status).toBe('reached');
    expect(evaluate(semir, quote(4.99), '2026-09-16').status).toBe('reached');
    expect(evaluate(semir, quote(5.01), '2026-09-16').status).toBe('near');
  });
  it('migrates only the new target without restoring removed targets or changing edits', () => {
    const saved = [{ ...target, price: 3.8, note: 'personal' }];
    const upgraded = upgradeLegacyTargets(saved);
    expect(upgraded).toHaveLength(2);
    expect(upgraded[0]).toEqual(saved[0]);
    expect(upgraded[1]?.code).toBe('002563');
    expect(upgradeLegacyTargets(upgraded)).toEqual(upgraded);
    expect(
      validateTargets(upgraded.filter((row) => row.code !== '002563')),
    ).toEqual(saved);
    expect(() => upgradeLegacyTargets([{ code: 'bad' }])).toThrow('invalid');
  });
  it('adds Haier at 19.50 inclusive and preserves personal edits during migration', () => {
    const haier = defaults().find((row) => row.code === '600690');
    expect(haier).toMatchObject({ price: 19.5, rule: 'atMost' });
    if (!haier) throw new Error('Missing Haier target');
    expect(evaluate(haier, quote(19.49), '2026-09-16').status).toBe('reached');
    expect(evaluate(haier, quote(19.5), '2026-09-16').status).toBe('reached');
    expect(evaluate(haier, quote(19.51), '2026-09-16').status).toBe('near');
    const saved = [{ ...target, price: 3.8, note: 'personal' }];
    const upgraded = upgradeV2Targets(saved);
    expect(upgraded).toEqual([...saved, haier]);
    expect(upgradeV2Targets(upgraded)).toEqual(upgraded);
    const edited = [{ ...haier, price: 18, note: 'edited' }];
    expect(upgradeV2Targets(edited)).toEqual(edited);
    expect(
      validateTargets(upgraded.filter((row) => row.code !== '600690')),
    ).toEqual(saved);
    expect(
      upgradeV2Targets(upgradeLegacyTargets(saved)).map((row) => row.code),
    ).toEqual(['600050', '002563', '600690']);
    expect(() => upgradeV2Targets([{ code: 'bad' }])).toThrow('invalid');
  });
  it('distinguishes inclusive, strict and reference targets', () => {
    expect(evaluate(target, quote(4), '2026-09-16').status).toBe('reached');
    expect(
      evaluate({ ...target, rule: 'below' }, quote(4), '2026-09-16').status,
    ).toBe('near');
    expect(
      evaluate({ ...target, rule: 'around' }, quote(4.1), '2026-09-16').status,
    ).toBe('near');
    expect(evaluate(target, quote(4.12), '2026-09-16').status).toBe('near');
    expect(evaluate(target, quote(4.121), '2026-09-16').status).toBe('waiting');
  });
  it('uses the current price as denominator for required decline', () => {
    expect(evaluate(target, quote(5), '2026-09-16').gap).toBeCloseTo(20);
    expect(evaluate(target, quote(3), '2026-09-16').below).toBeCloseTo(25);
  });
  it('does not trigger with missing, invalid, future or stale quotes', () => {
    for (const price of [0, -1, Number.NaN, Infinity])
      expect(evaluate(target, quote(price), '2026-09-16').status).toBe(
        'missing',
      );
    expect(evaluate(target, undefined, '2026-09-16').status).toBe('missing');
    expect(evaluate(target, quote(3, '2026-02-30'), '2026-09-16').status).toBe(
      'missing',
    );
    expect(evaluate(target, quote(3, '2026-09-17'), '2026-09-16').status).toBe(
      'stale',
    );
    expect(evaluate(target, quote(3, '2026-09-11'), '2026-09-16').status).toBe(
      'stale',
    );
    expect(evaluate(target, quote(3, '2026-09-12'), '2026-09-16').status).toBe(
      'reached',
    );
  });
  it('rejects malformed imports and never mutates input', () => {
    for (const bad of [
      null,
      {},
      [target, target],
      [{ ...target, code: '999999' }],
      [{ ...target, price: 0 }],
      [{ ...target, price: null }],
      [{ ...target, near: -1 }],
      [{ ...target, near: 101 }],
      [{ ...target, rule: 'buy' }],
      [{ ...target, note: 'x'.repeat(501) }],
    ])
      expect(() => validateTargets(bad)).toThrow('invalid');
    expect(validateTargets([])).toEqual([]);
    const source = [{ ...target, quantity: 100 }];
    expect(validateTargets(source)).toEqual([target]);
    expect(source[0]?.quantity).toBe(100);
  });
});
