import unittest
from datetime import date, datetime

from refresh_stock_metrics import completed_end, price_range, quote_metrics, symbol


class MetricsTest(unittest.TestCase):
    def test_hong_kong_close_does_not_include_live_candle(self):
        end = date(2026, 9, 17)
        before_close = datetime(2026, 9, 17, 16, 14)
        self.assertEqual(completed_end('HK0700', end, before_close), date(2026, 9, 16))
        self.assertEqual(completed_end('600219', end, before_close), end)
        self.assertEqual(completed_end('HK0700', end, datetime(2026, 9, 17, 16, 15)), end)
        historical = date(2026, 9, 10)
        self.assertEqual(completed_end('HK0700', historical, before_close), historical)

    def test_market_specific_fields_do_not_use_price_limits_or_hk_static_pe(self):
        fields = [''] * 88
        fields[2], fields[3], fields[30] = '600887', '26.39', '20260909133145'
        fields[39], fields[47], fields[48], fields[57], fields[64] = '16.49', '29.18', '23.88', '66306.79', '5.23'
        a = quote_metrics(fields, '600887')
        self.assertEqual((a['pe'], a['dividendYield']), (16.49, 5.23))
        fields[2], fields[39], fields[47], fields[57] = '00700', '15.88', '1.22', '14.58'
        hk = quote_metrics(fields, 'HK0700')
        self.assertEqual((hk['pe'], hk['dividendYield'], hk['currency']), (14.58, 1.22, 'HKD'))
        self.assertEqual(symbol('HK0700'), 'hk00700')

    def test_missing_zero_yield_and_loss_are_distinct(self):
        fields = [''] * 88
        fields[2] = '001330'
        self.assertIsNone(quote_metrics(fields, '001330')['dividendYield'])
        fields[64], fields[39] = '0', '-13.87'
        data = quote_metrics(fields, '001330')
        self.assertEqual(data['dividendYield'], 0)
        self.assertEqual(data['pe'], -13.87)
        fields[39] = 'nan'
        self.assertIsNone(quote_metrics(fields, '001330')['pe'])

    def test_range_uses_intraday_extrema_and_excludes_outside_window(self):
        points = [
            ['2025-09-09', '10', '11', '100', '1'],
            ['2025-09-10', '10', '11', '12', '9'],
            ['2026-09-08', '11', '12', '15', '10'],
            ['2026-09-09', '12', '13', '90', '2'],
        ]
        result = price_range(points, '2025-09-10', '2026-09-08')
        self.assertEqual((result['high52Week'], result['low52Week']), (15, 9))
        self.assertEqual(result['rangeTradingDays'], 2)
        self.assertEqual(result['rangeLastDate'], '2026-09-08')

    def test_bad_or_duplicate_daily_data_cannot_be_published(self):
        bad = [['2026-09-08', '10', '11', '8', '9']]
        with self.assertRaises(ValueError):
            price_range(bad, '2025-09-10', '2026-09-08')
        valid = [['2026-09-08', '10', '11', '12', '9']]
        with self.assertRaises(ValueError):
            price_range(valid * 2, '2025-09-10', '2026-09-08')


if __name__ == '__main__':
    unittest.main()
