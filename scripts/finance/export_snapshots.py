"""Export public market snapshots only. Never export holdings or trade records."""
import argparse
import json
import math
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--stocks-only', action='store_true', help='Leave ETF snapshots unchanged')
parser.add_argument('--source', type=Path, default=ROOT / '../../A_Shares_Datas')
args = parser.parse_args()
out = ROOT / 'apps/web-antd/public/data/finance'
out.mkdir(parents=True, exist_ok=True)

def write(name, value):
    (out / name).write_text(json.dumps(value, ensure_ascii=False, separators=(',', ':')) + '\n')

def number(value):
    try:
        n = float(value.rstrip('%'))
        return n if math.isfinite(n) else None
    except ValueError:
        return None

text = (args.source / '自选持仓股分析看板.md').read_text()
stocks = []
for line in text.splitlines():
    cells = [c.strip() for c in line.strip('|').split('|')]
    if len(cells) == 13 and re.fullmatch(r'\d{6}', cells[1]):
        assert number(cells[3]) and number(cells[3]) > 0
        stocks.append(dict(name=cells[0], code=cells[1], priceDate=cells[2][:10], price=number(cells[3]), dividendYield=number(cells[4]), pe=number(cells[5]), high52Week=number(cells[6]), low52Week=number(cells[7])))
assert stocks and len({s['code'] for s in stocks}) == len(stocks)
updated = re.search(r'更新时间：([^\n]+)', text).group(1).strip()
# Screenshot watchlist supplements are durable inputs, so later exports preserve them.
supplement = json.loads((ROOT / 'scripts/finance/watchlist-supplement.json').read_text())
price_date = max(stock['priceDate'] for stock in stocks)
year, month, _ = price_date.split('-')
daily_path = args.source / year / f'{year}年{month}月' / f'{price_date}.md'
closes = {}
for line in daily_path.read_text().splitlines():
    cells = [c.strip() for c in line.strip('|').split('|')]
    if len(cells) == 10 and re.fullmatch(r'\d{6}', cells[1]):
        close = number(cells[4])
        if close is not None and close > 0:
            closes[cells[1]] = close
existing = {stock['code'] for stock in stocks}
for item in supplement:
    if item['code'] in existing:
        continue
    close = closes.get(item['code'])
    stocks.append(dict(code=item['code'], name=item['name'], price=close,
                       priceDate=price_date if close is not None else None,
                       dividendYield=None, pe=None, high52Week=None, low52Week=None))
    existing.add(item['code'])
metrics = json.loads((ROOT / 'scripts/finance/stock-metrics.json').read_text())
by_code = {item['code']: item for item in metrics['stocks']}
assert metrics['rangeEnd'] == price_date, 'Refresh metrics for the new closing snapshot before exporting'
for stock in stocks:
    assert stock['code'] in by_code, f"Refresh metrics for {stock['code']}"
    stock.update(by_code[stock['code']])
write('stocks.json', dict(updatedAt=metrics['fetchedAt'], rangeStart=metrics['rangeStart'],
                          rangeEnd=metrics['rangeEnd'], stocks=stocks))
if args.stocks_only:
    print(f'Exported {len(stocks)} stocks; ETF snapshots unchanged.')
    raise SystemExit(0)
funds = []
for file in sorted((args.source / 'ETF').glob('*-日线历史数据.md')):
    code, name, _ = file.stem.split('-', 2)
    points = []
    for line in file.read_text().splitlines():
        cells = [c.strip() for c in line.strip('|').split('|')]
        if len(cells) >= 5 and re.fullmatch(r'\d{4}-\d{2}-\d{2}', cells[0]):
            close = number(cells[2])
            if close is not None and close > 0:
                points.append(dict(date=cells[0], close=close))
    points.sort(key=lambda p: p['date'])
    assert points and len({p['date'] for p in points}) == len(points), file
    write(f'{code}.json', points)
    funds.append(dict(code=code, name=name, start=points[0]['date'], end=points[-1]['date'], count=len(points)))
assert funds
write('etfs.json', dict(funds=funds))
print(f'Exported {len(stocks)} public stock snapshots and {len(funds)} ETF histories; no holdings exported.')
