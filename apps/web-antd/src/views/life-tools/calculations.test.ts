import { describe, expect, it } from 'vitest';

import {
  calculateIncomeTax,
  calculateMortgage,
  CalculationError,
  DEFAULT_INCOME_TAX,
  DEFAULT_MORTGAGE,
} from './calculations';

describe('房贷计算', () => {
  it.each(['equalInterest', 'equalPrincipal'] as const)(
    '直接本金 %s 不依赖总价或首付',
    (repayType) => {
      const expected = calculateMortgage({ ...DEFAULT_MORTGAGE, repayType });
      const actual = calculateMortgage({
        ...DEFAULT_MORTGAGE,
        repayType,
        amountMode: 'principal',
        principalAmount: 140,
        totalPrice: Number.NaN,
        downPaymentRate: Number.NaN,
      });
      expect(actual.loanAmount).toBe(1_400_000);
      expect(actual.downPayment).toBeNull();
      expect(actual.details).toEqual(expected.details);
      expect(actual.totalPayment).toBe(expected.totalPayment);
    },
  );
  it.each([undefined, Number.NaN, Number.POSITIVE_INFINITY, 0, -1])(
    '拒绝无效直接本金 %s',
    (principalAmount) => {
      expect(() =>
        calculateMortgage({
          ...DEFAULT_MORTGAGE,
          amountMode: 'principal',
          principalAmount,
        }),
      ).toThrow('tools.errors.principal');
    },
  );

  it('默认 200 万房价、30% 首付生成 360 期明细，本金和利息与汇总相符', () => {
    const result = calculateMortgage(DEFAULT_MORTGAGE);
    expect(result.loanAmount).toBe(1_400_000);
    expect(result.downPayment).toBe(600_000);
    expect(result.details).toHaveLength(360);
    expect(result.firstMonthlyPayment).toBeCloseTo(5978.23, 2);
    expect(
      result.details.reduce((sum, row) => sum + row.principal, 0),
    ).toBeCloseTo(result.loanAmount, 5);
    expect(
      result.details.reduce((sum, row) => sum + row.payment, 0),
    ).toBeCloseTo(result.totalPayment, 5);
    expect(result.details.at(-1)?.remainingPrincipal).toBe(0);
  });

  it('等额本金每期本金相同，月供递减且总利息更少', () => {
    const result = calculateMortgage({
      ...DEFAULT_MORTGAGE,
      repayType: 'equalPrincipal',
    });
    expect(result.firstMonthlyPayment).toBeCloseTo(7505.56, 2);
    expect(result.totalInterest).toBeCloseTo(652_808.33, 2);
    expect(result.lastMonthlyPayment).toBeLessThan(result.firstMonthlyPayment);
    for (const row of result.details)
      expect(row.principal).toBeCloseTo(result.loanAmount / 360, 5);
    expect(result.totalInterest).toBeLessThan(
      calculateMortgage(DEFAULT_MORTGAGE).totalInterest,
    );
    expect(result.details.at(-1)?.remainingPrincipal).toBe(0);
  });

  it.each(['equalInterest', 'equalPrincipal'] as const)(
    '零利率 %s 不收利息，支持 40 年明细',
    (repayType) => {
      const result = calculateMortgage({
        ...DEFAULT_MORTGAGE,
        annualRate: 0,
        loanYears: 40,
        repayType,
      });
      expect(result.details).toHaveLength(480);
      expect(result.totalInterest).toBe(0);
      expect(result.totalPayment).toBe(result.loanAmount);
      expect(result.firstMonthlyPayment).toBeCloseTo(
        result.loanAmount / 480,
        6,
      );
    },
  );

  it('接近零的利率也返回有限结果', () => {
    const result = calculateMortgage({
      ...DEFAULT_MORTGAGE,
      annualRate: 1e-12,
    });
    expect(result.firstMonthlyPayment).toBeCloseTo(result.loanAmount / 360, 5);
    expect(result.totalInterest).toBeGreaterThanOrEqual(0);
  });

  it.each([
    { totalPrice: 0 },
    { totalPrice: -1 },
    { totalPrice: Number.NaN },
    { downPaymentRate: 100 },
    { downPaymentRate: -1 },
    { annualRate: -1 },
    { annualRate: Number.POSITIVE_INFINITY },
    { loanYears: 0 },
    { loanYears: 41 },
    { loanYears: 1.5 },
  ])('拒绝无效贷款参数 %j', (invalid) => {
    expect(() =>
      calculateMortgage({ ...DEFAULT_MORTGAGE, ...invalid }),
    ).toThrow(CalculationError);
  });
});

describe('个税累计预扣计算', () => {
  it('保留原 HTML 默认结果：六月个税 90 元，税后工资 8910 元', () => {
    expect(calculateIncomeTax(DEFAULT_INCOME_TAX)).toEqual({
      afterTaxSalary: 8910,
      currentTax: 90,
      month: 6,
      paidTax: 450,
      rate: 0.03,
      taxable: 18_000,
      totalIncome: 60_000,
      totalInsurance: 6000,
      totalTax: 540,
    });
  });

  it('一月没有此前已缴税，低于减除费用不产生负税额', () => {
    const result = calculateIncomeTax({
      ...DEFAULT_INCOME_TAX,
      month: 1,
      salary: 3000,
    });
    expect(result.paidTax).toBe(0);
    expect(result.currentTax).toBe(0);
    expect(result.taxable).toBe(0);
    expect(result.afterTaxSalary).toBe(2000);
  });

  it.each([
    [36_000, 1080, 0.03],
    [144_000, 11_880, 0.1],
    [300_000, 43_080, 0.2],
    [420_000, 73_080, 0.25],
    [660_000, 145_080, 0.3],
    [960_000, 250_080, 0.35],
    [1_200_000, 358_080, 0.45],
  ])(
    '累计应纳税所得额 %i 对应税额 %i',
    (taxable, expectedTax, expectedRate) => {
      const result = calculateIncomeTax({
        insurance: 0,
        month: 12,
        salary: taxable / 12 + 5000,
        special: 0,
        threshold: 5000,
      });
      expect(result.totalTax).toBeCloseTo(expectedTax, 6);
      expect(result.rate).toBe(expectedRate);
    },
  );

  it('跨越税率档位时，当月税额正确，全年各月税额合计等于累计税额', () => {
    const input = { ...DEFAULT_INCOME_TAX, salary: 20_000 };
    const march = calculateIncomeTax({ ...input, month: 3 });
    expect(march.currentTax).toBeCloseTo(600, 6);
    const sum = Array.from(
      { length: 12 },
      (_, index) =>
        calculateIncomeTax({ ...input, month: index + 1 }).currentTax,
    ).reduce((a, b) => a + b, 0);
    expect(sum).toBeCloseTo(
      calculateIncomeTax({ ...input, month: 12 }).totalTax,
      6,
    );
  });

  it.each([
    { salary: -1 },
    { insurance: -1 },
    { special: Number.NaN },
    { threshold: -1 },
    { month: 0 },
    { month: 13 },
  ])('拒绝无效工资参数 %j', (invalid) => {
    expect(() =>
      calculateIncomeTax({ ...DEFAULT_INCOME_TAX, ...invalid }),
    ).toThrow(CalculationError);
  });
});
