import { describe, expect, it } from 'vitest';

import { defaults, evaluate, validateTargets } from './model';
describe('wishlist targets', () => {
  const target = {
    code: '600050',
    price: 4,
    rule: 'atMost' as const,
    near: 3,
    note: '',
  };
  const quote = (price: number, date = '2026-09-16') => ({ price, date });
  it('preserves the 12 user targets and the strict boundary', () => {
    const all = defaults();
    expect(validateTargets(all)).toEqual(all);
    expect(all).toHaveLength(12);
    expect(all.find((t) => t.code === '600900')?.rule).toBe('below');
    expect(all.find((t) => t.code === '510210')?.note).toContain('3750');
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
