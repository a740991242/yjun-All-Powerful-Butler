"""Verified fiscal-year dividends, separate from provider snapshot yields."""
from decimal import Decimal, ROUND_HALF_UP

def apply_annual_dividend(stock, record, as_of):
    if not record or any(payment['exDate'] > as_of for payment in record['payments']):
        return
    price = stock.get('price')
    if price is None or price <= 0:
        return
    payments = record['payments']
    total = sum((Decimal(str(p['perShare'])) for p in payments), Decimal(0))
    special = sum((Decimal(str(p['perShare'])) for p in payments if p['special']), Decimal(0))
    def percent(value):
        return float((value / Decimal(str(price)) * 100).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP))
    stock.update(
        providerDividendYield=stock.get('dividendYield'),
        dividendYield=percent(total),
        dividendYear=record['year'],
        dividendPerShare=float(total),
        specialDividendPerShare=float(special),
        dividendYieldExSpecial=percent(total-special),
        dividendPayments=payments,
        dividendVerifiedAt=record['verifiedAt'],
    )

