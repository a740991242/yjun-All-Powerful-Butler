import { describe, expect, it } from 'vitest';

import {
  calculateIncomeTax,
  calculateMortgage,
  CalculationError,
  DEFAULT_INCOME_TAX,
  DEFAULT_MORTGAGE,
} from '../views/life-tools/calculations';
import en from './langs/en-US/tools.json';
import zh from './langs/zh-CN/tools.json';

function flatten(value: object, prefix = 'tools'): Record<string, string> {
  return Object.fromEntries(
    Object.entries(value).flatMap(([key, entry]) => {
      const path = `${prefix}.${key}`;
      return typeof entry === 'string'
        ? [[path, entry]]
        : Object.entries(flatten(entry, path));
    }),
  );
}

const english = flatten(en);
const chinese = flatten(zh);

describe('all-in-one butler locales', () => {
  it('provides the same keys and interpolation parameters in both languages', () => {
    expect(Object.keys(english).toSorted()).toEqual(
      Object.keys(chinese).toSorted(),
    );
    for (const [key, value] of Object.entries(english)) {
      expect(value.trim()).not.toBe('');
      expect(chinese[key]?.trim()).not.toBe('');
      expect(value.match(/\{\w+\}/g)?.toSorted() ?? []).toEqual(
        chinese[key]?.match(/\{\w+\}/g)?.toSorted() ?? [],
      );
      expect(value).not.toMatch(/\p{Script=Han}/u);
    }
  });

  it.each([
    () => calculateMortgage({ ...DEFAULT_MORTGAGE, totalPrice: Number.NaN }),
    () => calculateMortgage({ ...DEFAULT_MORTGAGE, downPaymentRate: 100 }),
    () => calculateMortgage({ ...DEFAULT_MORTGAGE, annualRate: -1 }),
    () => calculateMortgage({ ...DEFAULT_MORTGAGE, loanYears: 0 }),
    () =>
      calculateMortgage({ ...DEFAULT_MORTGAGE, totalPrice: Number.MAX_VALUE }),
    ...(['salary', 'insurance', 'special', 'threshold', 'month'] as const).map(
      (field) => () =>
        calculateIncomeTax({ ...DEFAULT_INCOME_TAX, [field]: -1 }),
    ),
    () =>
      calculateIncomeTax({ ...DEFAULT_INCOME_TAX, salary: Number.MAX_VALUE }),
  ])(
    'exposes translatable calculation errors without a UI dependency',
    (calculate) => {
      let caught: unknown;
      try {
        calculate();
      } catch (error) {
        caught = error;
      }
      expect(caught).toBeInstanceOf(CalculationError);
      if (!(caught instanceof CalculationError)) {
        throw new Error('Expected a calculation error');
      }
      expect(english[caught.message]).toBeTruthy();
      expect(chinese[caught.message]).toBeTruthy();
    },
  );
});
