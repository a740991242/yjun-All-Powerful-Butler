export class CalculationError extends Error {}

export type LoanType = 'commercial' | 'fund';
export type RepaymentType = 'equalInterest' | 'equalPrincipal';

export interface MortgageInput {
  annualRate: number;
  downPaymentRate: number;
  loanType: LoanType;
  loanYears: number;
  repayType: RepaymentType;
  totalPrice: number;
}

export interface RepaymentDetail {
  interest: number;
  payment: number;
  period: number;
  principal: number;
  remainingPrincipal: number;
}

export interface MortgageResult {
  details: RepaymentDetail[];
  downPayment: number;
  firstMonthlyPayment: number;
  lastMonthlyPayment: number;
  loanAmount: number;
  months: number;
  repayType: RepaymentType;
  totalInterest: number;
  totalPayment: number;
}

// 沿用原 HTML 的示例利率，用户可按贷款合同修改。
export const DEFAULT_RATES: Record<LoanType, number> = {
  commercial: 3.1,
  fund: 2.6,
};

export const DEFAULT_MORTGAGE: MortgageInput = {
  annualRate: DEFAULT_RATES.commercial,
  downPaymentRate: 30,
  loanType: 'commercial',
  loanYears: 30,
  repayType: 'equalInterest',
  totalPrice: 200,
};

const moneyFormatter = new Intl.NumberFormat('zh-CN', {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

export function formatMoney(value: number) {
  return moneyFormatter.format(value);
}

export function calculateMortgage(input: MortgageInput): MortgageResult {
  const { annualRate, downPaymentRate, loanYears, repayType, totalPrice } =
    input;
  if (!Number.isFinite(totalPrice) || totalPrice <= 0) {
    throw new CalculationError('tools.errors.price');
  }
  if (
    !Number.isFinite(downPaymentRate) ||
    downPaymentRate < 0 ||
    downPaymentRate >= 100
  ) {
    throw new CalculationError('tools.errors.downRate');
  }
  if (!Number.isFinite(annualRate) || annualRate < 0) {
    throw new CalculationError('tools.errors.rate');
  }
  if (!Number.isInteger(loanYears) || loanYears < 1 || loanYears > 40) {
    throw new CalculationError('tools.errors.years');
  }

  const downPayment = totalPrice * 10_000 * (downPaymentRate / 100);
  const loanAmount = totalPrice * 10_000 - downPayment;
  const months = loanYears * 12;
  const monthlyRate = annualRate / 100 / 12;
  const monthlyPrincipal = loanAmount / months;
  // 与原等额本息公式等价，expm1 避免接近零利率时的精度损失。
  const fixedPayment =
    monthlyRate === 0
      ? monthlyPrincipal
      : (loanAmount * monthlyRate) /
        -Math.expm1(-months * Math.log1p(monthlyRate));
  const details: RepaymentDetail[] = [];
  let remainingPrincipal = loanAmount;
  let totalInterest = 0;

  for (let period = 1; period <= months; period++) {
    const interest = remainingPrincipal * monthlyRate;
    const principal =
      period === months
        ? remainingPrincipal
        : Math.min(
            remainingPrincipal,
            repayType === 'equalInterest'
              ? fixedPayment - interest
              : monthlyPrincipal,
          );
    const payment = principal + interest;
    remainingPrincipal = Math.max(0, remainingPrincipal - principal);
    totalInterest += interest;
    details.push({ interest, payment, period, principal, remainingPrincipal });
  }

  const totalPayment = loanAmount + totalInterest;
  if (!Number.isFinite(totalPayment)) {
    throw new CalculationError('tools.errors.loanOverflow');
  }
  const firstPayment = details.at(0);
  const lastPayment = details.at(-1);
  if (!firstPayment || !lastPayment) {
    throw new CalculationError('tools.common.unknownError');
  }
  return {
    details,
    downPayment,
    firstMonthlyPayment: firstPayment.payment,
    lastMonthlyPayment: lastPayment.payment,
    loanAmount,
    months,
    repayType,
    totalInterest,
    totalPayment,
  };
}

export interface IncomeTaxInput {
  insurance: number;
  month: number;
  salary: number;
  special: number;
  threshold: number;
}

export const DEFAULT_INCOME_TAX: IncomeTaxInput = {
  insurance: 1000,
  month: 6,
  salary: 10_000,
  special: 1000,
  threshold: 5000,
};

// 保留原 HTML 的累计预扣税率表及每月收入、扣除固定的计算口径。
export const TAX_BRACKETS = [
  { limit: 36_000, quick: 0, rate: 0.03 },
  { limit: 144_000, quick: 2520, rate: 0.1 },
  { limit: 300_000, quick: 16_920, rate: 0.2 },
  { limit: 420_000, quick: 31_920, rate: 0.25 },
  { limit: 660_000, quick: 52_920, rate: 0.3 },
  { limit: 960_000, quick: 85_920, rate: 0.35 },
  { limit: Number.POSITIVE_INFINITY, quick: 181_920, rate: 0.45 },
];

function cumulativeTax(taxable: number) {
  const bracket = TAX_BRACKETS.find((item) => taxable <= item.limit);
  if (!bracket) {
    throw new CalculationError('tools.errors.taxOverflow');
  }
  return {
    rate: bracket.rate,
    tax: Math.max(0, taxable * bracket.rate - bracket.quick),
  };
}

export function calculateIncomeTax(input: IncomeTaxInput) {
  const { insurance, month, salary, special, threshold } = input;
  for (const [label, value] of [
    ['tools.errors.salary', salary],
    ['tools.errors.special', special],
    ['tools.errors.insurance', insurance],
    ['tools.errors.threshold', threshold],
  ] as const) {
    if (!Number.isFinite(value) || value < 0) {
      throw new CalculationError(label);
    }
  }
  if (!Number.isInteger(month) || month < 1 || month > 12) {
    throw new CalculationError('tools.errors.month');
  }
  const monthlyTaxable = Math.max(0, salary - insurance - special - threshold);
  const taxable = monthlyTaxable * month;
  if (!Number.isFinite(salary * month)) {
    throw new CalculationError('tools.errors.taxOverflow');
  }
  const { rate, tax: totalTax } = cumulativeTax(taxable);
  const { tax: paidTax } = cumulativeTax(monthlyTaxable * (month - 1));
  const currentTax = totalTax - paidTax;

  return {
    afterTaxSalary: salary - insurance - currentTax,
    currentTax,
    month,
    paidTax,
    rate,
    taxable,
    totalIncome: salary * month,
    totalInsurance: insurance * month,
    totalTax,
  };
}
