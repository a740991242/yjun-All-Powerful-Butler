import unittest
from unittest.mock import patch

import update_daily_market_data as market


class DailyMarketDataTest(unittest.TestCase):
    def test_ths_rows_include_price_amount_and_turnover(self):
        body = (
            'quotebridge({"data":"'
            "20261110,10.00,10.50,9.90,10.20,1000,1020000.00,1.20,,,0;"
            "20261111,10.30,10.80,10.10,10.60,2000,2100000.00,2.40,,,0"
            '","today":"20261111"})'
        ).encode()
        with patch.object(market, "request_bytes", return_value=body):
            rows = market.fetch_ths_kline("600000", "2026-11-10", "2026-11-11")
        self.assertEqual(len(rows), 1)
        self.assertEqual(rows[0]["date"], "2026-11-11")
        self.assertEqual(rows[0]["close"], 10.6)
        self.assertEqual(rows[0]["amount"], 2100000)
        self.assertEqual(rows[0]["turnover"], 2.4)
        self.assertAlmostEqual(rows[0]["pct"], 3.921568627, places=6)

    def test_sina_snapshot_overlays_latest_date_without_duplicates(self):
        klines = {
            "600000": [
                {"date": "2026-11-10", "close": 10},
                {"date": "2026-11-11", "close": 10.2},
            ]
        }
        source = {
            "600000": {
                "open": "10.3",
                "trade": "10.6",
                "high": "10.8",
                "low": "10.1",
                "settlement": "10.2",
                "volume": "2000",
                "amount": "2100000",
                "turnoverratio": "2.4",
                "changepercent": "3.92",
                "pricechange": "0.4",
            }
        }
        market.merge_sina_snapshot(klines, source, "2026-11-11")
        self.assertEqual([row["date"] for row in klines["600000"]], [
            "2026-11-10",
            "2026-11-11",
        ])
        self.assertEqual(klines["600000"][-1]["close"], 10.6)

    def test_ths_suspended_row_is_not_published_as_a_trade(self):
        body = (
            'quotebridge({"data":"'
            "20261110,10.00,10.50,9.90,10.20,1000,1020000.00,1.20,,,0;"
            "20261111,,,,10.20,0,,0.000,,,0"
            '","today":"20261111"})'
        ).encode()
        with patch.object(market, "request_bytes", return_value=body):
            rows = market.fetch_ths_kline("600000", "2026-11-10", "2026-11-11")
        self.assertEqual(rows, [])

    def test_incomplete_sina_snapshot_is_rejected(self):
        self.assertIsNone(market.sina_snapshot_row({"trade": "10"}, "2026-11-11"))


if __name__ == "__main__":
    unittest.main()
