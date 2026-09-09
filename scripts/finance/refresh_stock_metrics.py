"""Fetch public watchlist metrics; no holdings, ETF updates, or Git operations."""
import argparse
from concurrent.futures import ThreadPoolExecutor
from datetime import date, datetime, timedelta
import json
import math
from pathlib import Path
import re
import time
from urllib.request import Request, urlopen
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parents[2]
QUOTE_URL = 'https://qt.gtimg.cn/q='
KLINE_URL = 'https://web.ifzq.gtimg.cn/appstock/app/fqkline/get?param='
# Verified against Tencent's own adaptHS/adaptHK implementation, 2026-09-09:
FIELD_SOURCE = 'https://st.gtimg.com/quotes/hs-fund/bundle.13362df9.js'


def numeric(value):
    try:
        result = float(value)
        return result if math.isfinite(result) else None
    except (ValueError, TypeError):
        return None


def symbol(code):
    if re.fullmatch(r'HK\d{4,5}', code):
        return 'hk' + code[2:].zfill(5)
    if re.fullmatch(r'\d{6}', code):
        return ('sh' if code.startswith('6') else 'sz') + code
    raise ValueError(f'Unsupported stock code: {code}')


def quote_metrics(fields, code):
    hk = code.startswith('HK')
    expected = code[2:].zfill(5) if hk else code
    if len(fields) < 78 or fields[2] != expected:
        raise ValueError(f'Unexpected quote schema/code: {code}')
    # HK field 39 is NOT TTM; Tencent explicitly maps field 57 to ttm_ratio.
    pe = numeric(fields[57 if hk else 39])
    dividend = numeric(fields[47 if hk else 64])
    return {
        'pe': pe if pe != 0 else None,
        'dividendYield': dividend if dividend is not None and dividend >= 0 else None,
        'metricsAsOf': fields[30],
        'metricsReferencePrice': numeric(fields[3]),
        'currency': 'HKD' if hk else 'CNY',
    }


def price_range(points, start, end):
    rows = {}
    for point in points:
        if len(point) < 5 or not start <= point[0] <= end:
            continue
        high, low = numeric(point[3]), numeric(point[4])
        if high is None or low is None or not 0 < low <= high:
            raise ValueError(f'Invalid daily high/low: {point}')
        if point[0] in rows:
            raise ValueError(f'Duplicate trading date: {point[0]}')
        rows[point[0]] = (high, low)
    if not rows:
        raise ValueError('No daily prices in the requested 52-week window')
    return {
        'high52Week': max(value[0] for value in rows.values()),
        'low52Week': min(value[1] for value in rows.values()),
        'rangeFirstDate': min(rows),
        'rangeLastDate': max(rows),
        'rangeTradingDays': len(rows),
    }


def request(url):
    for attempt in range(3):
        try:
            req = Request(url, headers={'User-Agent': 'Mozilla/5.0', 'Referer': 'https://gu.qq.com/'})
            return urlopen(req, timeout=20).read()
        except Exception:
            if attempt == 2:
                raise
            time.sleep(attempt + 1)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--as-of', help='52-week range ending date; defaults to the local closing snapshot')
    args = parser.parse_args()
    stocks = json.loads((ROOT / 'apps/web-antd/public/data/finance/stocks.json').read_text())['stocks']
    end = date.fromisoformat(args.as_of or max(s['priceDate'] for s in stocks if s['priceDate']))
    start = end - timedelta(weeks=52) + timedelta(days=1)
    quotes = request(QUOTE_URL + ','.join(symbol(s['code']) for s in stocks)).decode('gbk')
    parsed = {key: value.split('~') for key, value in re.findall(r'v_(\w+)="([^"]*)"', quotes)}

    def fetch(stock):
        code = stock['code']
        ticker = symbol(code)
        metrics = quote_metrics(parsed[ticker], code)
        url = KLINE_URL + f'{ticker},day,{start},{end},400,'
        data = json.loads(request(url))
        if data.get('code') != 0:
            raise ValueError(f'Kline request failed: {code}')
        # Only unadjusted day data is accepted, never qfqday/hfqday fallback.
        points = data['data'][ticker]['day']
        metrics.update(price_range(points, start.isoformat(), end.isoformat()))
        metrics.update(code=code, quoteSource=QUOTE_URL + ticker, rangeSource=url)
        print(f"{code} {stock['name']}: dividend={metrics['dividendYield']} PE={metrics['pe']} high/low={metrics['high52Week']}/{metrics['low52Week']} days={metrics['rangeTradingDays']}", flush=True)
        return metrics

    with ThreadPoolExecutor(max_workers=4) as pool:
        metrics = list(pool.map(fetch, stocks))
    result = {
        'fetchedAt': datetime.now(ZoneInfo('Asia/Shanghai')).isoformat(timespec='seconds'),
        'rangeStart': start.isoformat(), 'rangeEnd': end.isoformat(),
        'fieldSource': FIELD_SOURCE, 'stocks': metrics,
    }
    # All requests must succeed before replacing the durable input snapshot.
    target = ROOT / 'scripts/finance/stock-metrics.json'
    temp = target.with_suffix('.tmp')
    temp.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    temp.replace(target)


if __name__ == '__main__':
    main()
