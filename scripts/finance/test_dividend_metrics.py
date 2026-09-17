import unittest
from dividend_metrics import apply_annual_dividend
class DividendTest(unittest.TestCase):
    def setUp(self):
        self.record = {'year':2025, 'verifiedAt':'2026-09-17', 'payments':[
            {'perShare':0.04,'special':False,'exDate':'2025-09-25'},
            {'perShare':0.2584,'special':True,'exDate':'2025-12-12'},
            {'perShare':0.136,'special':False,'exDate':'2026-05-20'}]}
    def test_reconciles_published_annual_and_regular_dividends(self):
        stock={'price':4.72,'dividendYield':9.21}
        apply_annual_dividend(stock,self.record,'2026-09-17')
        self.assertEqual(stock['dividendYield'],9.20)
        self.assertEqual(stock['dividendYieldExSpecial'],3.73)
        self.assertEqual(stock['providerDividendYield'],9.21)
        self.assertEqual(stock['dividendPerShare'],0.4344)
    def test_uses_new_close_not_old_reference_price(self):
        stock={'price':4.66,'dividendYield':9.33}
        apply_annual_dividend(stock,self.record,'2026-09-17')
        self.assertEqual(stock['dividendYield'],9.32)
        self.assertEqual(stock['dividendYieldExSpecial'],3.78)
    def test_never_treats_future_payments_as_implemented(self):
        stock={'price':4.72,'dividendYield':9.21}
        apply_annual_dividend(stock,self.record,'2026-05-19')
        self.assertEqual(stock,{'price':4.72,'dividendYield':9.21})
    def test_missing_prices_and_unverified_stocks_are_unchanged(self):
        for price in (None,0):
            stock={'price':price}
            apply_annual_dividend(stock,self.record,'2026-09-17')
            self.assertEqual(stock,{'price':price})
        stock={'price':4.72}
        apply_annual_dividend(stock,None,'2026-09-17')
        self.assertEqual(stock,{'price':4.72})

