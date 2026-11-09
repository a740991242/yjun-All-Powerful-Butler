"""Incrementally update A-share, ETF, watchlist and Yunnan Baiyao markdown data."""

import argparse
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import date, datetime
import json
import math
from pathlib import Path
import re
import socket
import subprocess
import threading
import time
from urllib.parse import urlencode
from urllib.request import Request, urlopen
from zoneinfo import ZoneInfo


ROOT = Path(__file__).resolve().parents[2]
DEFAULT_SOURCE = ROOT / "../../A_Shares_Datas"
INDEX_CODE = "1.000001"
KLINE_URL = "https://push2his.eastmoney.com/api/qt/stock/kline/get"
SINA_URL = (
    "https://vip.stock.finance.sina.com.cn/quotes_service/api/json_v2.php/"
    "Market_Center.getHQNodeData"
)
HEADERS = {
    "Referer": "https://quote.eastmoney.com/",
    "User-Agent": "Mozilla/5.0",
}


# Some networks stall on GitHub/quote services when IPv6 is preferred.
_getaddrinfo = socket.getaddrinfo


def _ipv4_getaddrinfo(host, port, family=0, type=0, proto=0, flags=0):
    rows = _getaddrinfo(host, port, family, type, proto, flags)
    ipv4 = [row for row in rows if row[0] == socket.AF_INET]
    return ipv4 or rows


socket.getaddrinfo = _ipv4_getaddrinfo


def numeric(value):
    try:
        result = float(value)
        return result if math.isfinite(result) else None
    except (TypeError, ValueError):
        return None


def request_bytes(url, params=None):
    if params:
        url = f"{url}?{urlencode(params)}"
    last_error = None
    for attempt in range(5):
        try:
            with urlopen(Request(url, headers=HEADERS), timeout=25) as response:
                return response.read()
        except Exception as error:  # pragma: no cover - network fallback
            last_error = error
            try:
                return subprocess.check_output(
                    ["curl", "-4", "-fsSL", "--max-time", "25", url],
                    stderr=subprocess.PIPE,
                )
            except subprocess.CalledProcessError:
                pass
            time.sleep(attempt + 1)
    raise last_error


def market(code):
    if code.startswith(("5", "6")):
        return 1
    return 0


def secid(code):
    return f"{market(code)}.{code}"


def fetch_kline(code, start, end):
    payload = json.loads(
        request_bytes(
        KLINE_URL,
        {
            "secid": secid(code),
            "fields1": "f1,f2,f3,f4,f5,f6",
            "fields2": "f51,f52,f53,f54,f55,f56,f57,f58,f59,f60,f61",
            "klt": "101",
            "fqt": "0",
            "beg": start.replace("-", ""),
            "end": end.replace("-", ""),
        },
        )
    )
    rows = (payload.get("data") or {}).get("klines") or []
    parsed = []
    for raw in rows:
        cells = raw.split(",")
        if len(cells) != 11:
            raise ValueError(f"Unexpected kline schema for {code}: {raw}")
        values = [numeric(value) for value in cells[1:]]
        if any(value is None for value in values):
            raise ValueError(f"Invalid kline number for {code}: {raw}")
        parsed.append(
            {
                "date": cells[0],
                "open": values[0],
                "close": values[1],
                "high": values[2],
                "low": values[3],
                "volume": int(values[4]),
                "amount": values[5],
                "amplitude": values[6],
                "pct": values[7],
                "change": values[8],
                "turnover": values[9],
            }
        )
    return parsed


def fetch_index_dates(start, end):
    rows = fetch_kline("000001", start, end)
    return [row["date"] for row in rows if row["date"] > start]


def fetch_sina_page(page):
    rows = json.loads(
        request_bytes(
        SINA_URL,
        {
            "page": page,
            "num": 100,
            "sort": "symbol",
            "asc": 1,
            "node": "hs_a",
        },
        )
    )
    return rows if isinstance(rows, list) else []


def fetch_stock_universe():
    stocks = {}
    with ThreadPoolExecutor(max_workers=12) as pool:
        futures = {pool.submit(fetch_sina_page, page): page for page in range(1, 80)}
        for future in as_completed(futures):
            for row in future.result():
                code = str(row["code"])
                stocks[code] = str(row["name"])
    if "689009" not in stocks:
        stocks["689009"] = "九号公司-WD"
    if len(stocks) < 5000:
        raise ValueError(f"Incomplete A-share universe: {len(stocks)}")
    return stocks


def latest_daily_file(source):
    candidates = []
    for path in source.glob("*/*/*.md"):
        match = re.fullmatch(r"(\d{4}-\d{2}-\d{2})", path.stem)
        if match:
            candidates.append((match.group(1), path))
    if not candidates:
        raise ValueError("No existing daily market files")
    return max(candidates)


def previous_universe(path):
    stocks = {}
    for line in path.read_text().splitlines():
        cells = [cell.strip() for cell in line.strip("|").split("|")]
        if len(cells) == 10 and re.fullmatch(r"\d{6}", cells[1]):
            stocks[cells[1]] = cells[2]
    return stocks


def fetch_all_klines(codes, start, end, cache_path, workers):
    cache = {}
    if cache_path.exists():
        cache = json.loads(cache_path.read_text())
    missing = sorted(set(codes) - set(cache))
    lock = threading.Lock()

    def work(code):
        return code, fetch_kline(code, start, end)

    with ThreadPoolExecutor(max_workers=workers) as pool:
        futures = {pool.submit(work, code): code for code in missing}
        for index, future in enumerate(as_completed(futures), 1):
            code, rows = future.result()
            with lock:
                cache[code] = rows
                if index % 250 == 0:
                    cache_path.write_text(json.dumps(cache, separators=(",", ":")))
                    print(f"Klines {index}/{len(missing)}", flush=True)
    cache_path.write_text(json.dumps(cache, separators=(",", ":")))
    return cache


def format_signed(value, digits=2):
    return f"{value:+.{digits}f}"


def render_daily(date_text, records, universe, collected_at):
    count = len(records)
    up = sum(1 for row in records if row["pct"] > 0)
    down = sum(1 for row in records if row["pct"] < 0)
    flat = count - up - down
    amount = sum(row["amount"] for row in records)
    missing = sorted(set(universe) - {row["code"] for row in records})
    ranked = sorted(records, key=lambda row: row["pct"], reverse=True)
    year, month, day = (int(part) for part in date_text.split("-"))
    lines = [
        f"# 📊 A股全市场行情数据 — {year}年{month}月{day}日",
        "",
        (
            f"> 数据来源：新浪沪深北 A 股清单及九号公司 CDR 补充、"
            f"东方财富不复权日 K。共 {len(universe):,} 个标的，"
            f"{count:,} 个有有效当日成交行情。"
        ),
        f"> 采集时间：{collected_at}；日线交易日：{date_text}。",
        "",
        "---",
        "## 📈 市场概览",
        "| 指标 | 数值 |",
        "|------|------|",
        f"| 股票总数（有效当日成交行情） | {count} |",
        f"| 📈 上涨 | {up} 只 ({up / count * 100:.1f}%) |",
        f"| 📉 下跌 | {down} 只 ({down / count * 100:.1f}%) |",
        f"| ➖ 平盘 | {flat} 只 ({flat / count * 100:.1f}%) |",
        f"| 💰 总成交额 | {amount / 1e8:,.2f} 亿 |",
        "",
        "---",
        "## 🔥 涨幅 TOP 10",
        "| # | 代码 | 名称 | 收盘 | 涨跌幅 | 成交额(亿) | 换手率 |",
        "|---|---|---|---|---|---|---|",
    ]
    for index, row in enumerate(ranked[:10], 1):
        lines.append(
            f"| {index} | {row['code']} | {row['name']} | {row['close']:.2f} | "
            f"**{format_signed(row['pct'])}%** | {row['amount'] / 1e8:.2f} | "
            f"{row['turnover']:.2f} |"
        )
    lines.extend(
        [
            "",
            "---",
            "## ❄️ 跌幅 TOP 10",
            "| # | 代码 | 名称 | 收盘 | 涨跌幅 | 成交额(亿) | 换手率 |",
            "|---|---|---|---|---|---|---|",
        ]
    )
    for index, row in enumerate(reversed(ranked[-10:]), 1):
        lines.append(
            f"| {index} | {row['code']} | {row['name']} | {row['close']:.2f} | "
            f"**{format_signed(row['pct'])}%** | {row['amount'] / 1e8:.2f} | "
            f"{row['turnover']:.2f} |"
        )
    lines.extend(
        [
            "",
            "---",
            "## 💰 成交额 TOP 10",
            "| # | 代码 | 名称 | 收盘 | 涨跌幅 | 成交额(亿) |",
            "|---|---|---|---|---|",
        ]
    )
    for index, row in enumerate(
        sorted(records, key=lambda item: item["amount"], reverse=True)[:10], 1
    ):
        lines.append(
            f"| {index} | {row['code']} | {row['name']} | {row['close']:.2f} | "
            f"{format_signed(row['pct'])}% | {row['amount'] / 1e8:.2f} |"
        )
    lines.extend(
        [
            "",
            "---",
            f"## 📋 全部 {count:,} 只股票行情（按涨跌幅降序）",
            (
                "| # | 代码 | 名称 | 开盘 | 收盘 | 最高 | 最低 | 涨跌幅 | "
                "成交额(亿) | 换手率% |"
            ),
            "|---|---|---|---|---|---|---|---|---|---|",
        ]
    )
    for index, row in enumerate(ranked, 1):
        lines.append(
            f"| {index} | {row['code']} | {row['name']} | {row['open']:.2f} | "
            f"{row['close']:.2f} | {row['high']:.2f} | {row['low']:.2f} | "
            f"{format_signed(row['pct'])}% | {row['amount'] / 1e8:.2f} | "
            f"{row['turnover']:.2f} |"
        )
    lines.extend(
        [
            "",
            "## 缺失、停牌或无成交标的",
            "",
            "| 代码 | 名称 | 说明 |",
            "|---|---|---|",
        ]
    )
    for code in missing:
        lines.append(f"| {code} | {universe[code]} | 无有效当日成交，不填充旧价 |")
    lines.extend(
        [
            "",
            "## 数据来源",
            f"- {KLINE_URL}（复权口径 fqt=0）",
            f"- {SINA_URL}（node=hs_a）",
        ]
    )
    return "\n".join(lines) + "\n"


def write_daily_files(source, trading_dates, klines, universe, collected_at):
    by_date = defaultdict(list)
    for code, rows in klines.items():
        for row in rows:
            if row["date"] not in trading_dates or row["close"] <= 0:
                continue
            enriched = dict(row)
            enriched.update(code=code, name=universe.get(code, code))
            by_date[row["date"]].append(enriched)
    for date_text in trading_dates:
        records = by_date[date_text]
        if len(records) < 5000:
            raise ValueError(f"Incomplete market records for {date_text}: {len(records)}")
        codes_seen = [row["code"] for row in records]
        if len(codes_seen) != len(set(codes_seen)):
            raise ValueError(f"Duplicate stock codes for {date_text}")
        year, month, _ = date_text.split("-")
        directory = source / year / f"{year}年{month}月"
        directory.mkdir(parents=True, exist_ok=True)
        (directory / f"{date_text}.md").write_text(
            render_daily(date_text, records, universe, collected_at)
        )


def parse_etf_rows(text):
    rows = {}
    for line in text.splitlines():
        cells = [cell.strip() for cell in line.strip("|").split("|")]
        if len(cells) == 11 and re.fullmatch(r"\d{4}-\d{2}-\d{2}", cells[0]):
            rows[cells[0]] = cells
    if not rows:
        raise ValueError("No ETF daily rows")
    return rows


def render_etf_row(row):
    return (
        f"| {row['date']} | {row['open']:.3f} | {row['close']:.3f} | "
        f"{row['high']:.3f} | {row['low']:.3f} | "
        f"{format_signed(row['pct'])}% | {row['change']:+.3f} | "
        f"{format_signed(row['amplitude'])}% | {row['volume']} | "
        f"{row['amount'] / 1e8:.2f} | {format_signed(row['turnover'])}% |"
    )


def update_etfs(source, trading_dates, collected_at):
    summaries = []
    for path in sorted((source / "ETF").glob("*-日线历史数据.md")):
        code, name, _ = path.stem.split("-", 2)
        text = path.read_text()
        rows = parse_etf_rows(text)
        last_date = max(rows)
        new_rows = [
            row
            for row in fetch_kline(code, last_date, trading_dates[-1])
            if row["date"] in trading_dates and row["date"] not in rows
        ]
        if new_rows:
            path.write_text(text.rstrip() + "\n" + "\n".join(map(render_etf_row, new_rows)) + "\n")
            text = path.read_text()
            rows = parse_etf_rows(text)
        latest_date = max(rows)
        latest = rows[latest_date]
        count = len(rows)
        text = re.sub(
            r"> 更新范围：.*",
            (
                f"> 更新范围：{min(rows)} 至 {latest_date} | "
                "数据来源：东方财富日 K，接口不可用时腾讯证券备用行情 | "
                f"复权口径：不复权 | 生成时间：{collected_at}"
            ),
            text,
            count=1,
        )
        summary = (
            f"| {code} | {name} | {min(rows)} | {latest_date} | {count} | "
            f"{float(latest[2]):.3f} | {latest[5]} | [[{path.name}]] |"
        )
        text = re.sub(rf"^\| {re.escape(code)} \| .*$", summary, text, count=1, flags=re.M)
        if new_rows:
            note = (
                f"> {min(row['date'] for row in new_rows)}"
                f"{'—' + max(row['date'] for row in new_rows) if len(new_rows) > 1 else ''}："
                "东方财富不复权日 K。"
            )
            text = text.replace("## 数据\n\n", f"## 数据\n\n{note}\n\n", 1)
        path.write_text(text)
        summaries.append((code, name, min(rows), latest_date, count, latest))
    return summaries


def render_etf_index(summaries, collected_at):
    lines = [
        "# ETF 日线数据索引",
        "",
        (
            f"> 更新日期：{summaries[0][3]}；采集时间：{collected_at}。"
            "东方财富不复权日 K 优先，接口断连时用腾讯不复权日 K 与当日收盘快照。"
        ),
        "",
        "- 只追加实际交易日，不新增分钟数据；价格不复权，成交量为手，成交额为亿元。",
        "- 历史与缺失标记保留原样。",
        "",
        (
            "| 代码 | 名称 | 起始日期 | 最新日期 | 交易日数 | 最新收盘 | "
            "最新涨跌幅 | 日线文件 |"
        ),
        "|---|---|---:|---:|---:|---:|---:|---|",
    ]
    for code, name, start, end, count, latest in summaries:
        lines.append(
            f"| {code} | {name} | {start} | {end} | {count} | "
            f"{float(latest[2]):.3f} | {latest[5]} | "
            f"[[{code}-{name}-日线历史数据.md]] |"
        )
    return "\n".join(lines) + "\n"


def parse_watchlist(text):
    rows = []
    for index, line in enumerate(text.splitlines()):
        cells = [cell.strip() for cell in line.strip("|").split("|")]
        if len(cells) == 13 and re.fullmatch(r"\d{6}", cells[1]):
            rows.append((index, cells))
    return rows


def extract_extreme(cell):
    match = re.match(r"([\d.]+)（(\d{4}-\d{2}-\d{2})([^）]*)）", cell)
    if not match:
        return None, None, ""
    return float(match.group(1)), match.group(2), match.group(3)


def update_watchlist(
    source, metrics, klines, trading_dates, collected_at, end, yunnan_count
):
    path = source / "自选持仓股分析看板.md"
    text = path.read_text()
    metric_by_code = {row["code"]: row for row in metrics["stocks"]}
    highs = {}
    lows = {}
    closes = {}
    for code, rows in klines.items():
        valid = [row for row in rows if row["date"] in trading_dates]
        if not valid:
            continue
        high = max(valid, key=lambda row: row["high"])
        low = min(valid, key=lambda row: row["low"])
        highs[code] = (high["high"], high["date"])
        lows[code] = (low["low"], low["date"])
        closes[code] = max(valid, key=lambda row: row["date"])
    updated_lines = text.splitlines()
    for index, cells in parse_watchlist(text):
        code = cells[1]
        metric = metric_by_code.get(code)
        close = closes.get(code)
        if metric is None or close is None:
            continue
        cells[2] = f"{end} 收盘"
        cells[3] = f"{close['close']:.2f}"
        cells[4] = f"{metric['dividendYield']:.2f}%"
        cells[5] = f"{metric['pe']:.2f}"
        cells[6] = f"{metric['high52Week']:.2f}"
        cells[7] = f"{metric['low52Week']:.2f}"
        high_value, high_date, high_note = extract_extreme(cells[8])
        if high_value is None:
            high_value = float(metric["high52Week"])
            high_date = end
            high_note = "待复核"
        if highs[code][0] > high_value:
            high_value, high_date, high_note = highs[code][0], highs[code][1], ""
        cells[8] = f"{high_value:.2f}（{high_date}{high_note}）"
        low_value, low_date, low_note = extract_extreme(cells[9])
        if low_value is None:
            low_value = float(metric["low52Week"])
            low_date = end
            low_note = "待复核"
        if lows[code][0] < low_value:
            low_value, low_date, low_note = lows[code][0], lows[code][1], ""
        cells[9] = f"{low_value:.2f}（{low_date}{low_note}）"
        if cells[10] and cells[11]:
            quantity = float(cells[10])
            cost = float(cells[11])
            cells[12] = f"{(close['close'] - cost) / cost * 100:+.3f}%"
        updated_lines[index] = "| " + " | ".join(cells) + " |"
    text = "\n".join(updated_lines) + "\n"
    text = re.sub(
        r"> 更新时间：.*",
        f"> 更新时间：{collected_at}",
        text,
        count=1,
    )
    text = re.sub(
        r"> 最新价格：.*",
        f"> 最新价格：腾讯证券收盘快照（{end} 收盘）。",
        text,
        count=1,
    )
    text = re.sub(
        r"\| 本地全市场日线文件 \| .*? \|",
        f"| 本地全市场日线文件 | {end} 收盘 |",
        text,
        count=1,
    )
    text = re.sub(
        r"\| 腾讯证券行情/不复权日 K 接口 \| .*? \|",
        f"| 腾讯证券行情/不复权日 K 接口 | {metrics['fetchedAt']} |",
        text,
        count=1,
    )
    text = re.sub(
        r"\| Butler 金融赚米自选股快照 \| .*? \|",
        f"| Butler 金融赚米自选股快照 | {collected_at} |",
        text,
        count=1,
    )
    text = re.sub(
        r"\| 腾讯证券股息率字段 \| .*? \|",
        f"| 腾讯证券股息率字段 | {metrics['fetchedAt']} |",
        text,
        count=1,
    )
    nanhai_price = closes["600219"]["close"]
    nanhai_yield = 0.4344 / nanhai_price * 100
    nanhai_ex_special = 0.176 / nanhai_price * 100
    text = re.sub(
        r"- 南山铝业（600219）：.*",
        (
            "- 南山铝业（600219）：2025年度每股税前分红0.4344元"
            "（中期0.04元、特别分红0.2584元、年度0.136元）；"
            f"按本次收盘价{nanhai_price:.2f}元计算为{nanhai_yield:.2f}%，"
            f"剔除特别分红为{nanhai_ex_special:.2f}%。历史分红不代表未来承诺。"
            "依据2025半年度、临时及2025年度权益分派实施公告；"
            "Butler快照保留逐笔金额、除息日和公告链接。"
        ),
        text,
        count=1,
    )
    yunnan_price = closes["000538"]["close"]
    yunnan_yield = 2.602 / yunnan_price * 100
    yunnan_ex_special = 1.583 / yunnan_price * 100
    text = re.sub(
        r"- 云南白药（000538）：.*",
        (
            "- 云南白药（000538）：已正式加入自选看板，心动目标保持股价低于47元；"
            "未设置持仓数量、成本或交易记录。历史极值依据上市以来不复权日 K 档案"
            f"（东方财富历史；1993-12-15至{end}，共{yunnan_count}条），"
            "详见 [[000538-云南白药-不复权日线历史数据.md]]。"
            "2025年度每股税前分红2.602元（特别1.019元、年度1.583元），"
            f"按{yunnan_price:.2f}元收盘价为{yunnan_yield:.2f}%，"
            f"剔除特别分红为{yunnan_ex_special:.2f}%；"
            f"腾讯行情口径为{metric_by_code['000538']['dividendYield']:.2f}%，"
            "保留独立口径。2026年特别分红1.038元不计入2025年度总额，"
            "已另列金融日历。"
        ),
        text,
        count=1,
    )
    path.write_text(text)


def parse_yunnan_rows(text):
    rows = {}
    for line in text.splitlines():
        cells = [cell.strip() for cell in line.strip("|").split("|")]
        if len(cells) == 11 and re.fullmatch(r"\d{4}-\d{2}-\d{2}", cells[0]):
            rows[cells[0]] = cells
    return rows


def update_yunnan(source, metrics, trading_dates, collected_at, end):
    path = source / "000538-云南白药-不复权日线历史数据.md"
    text = path.read_text()
    rows = parse_yunnan_rows(text)
    last_date = max(rows)
    new_rows = [
        row
        for row in fetch_kline("000538", last_date, end)
        if row["date"] in trading_dates and row["date"] not in rows
    ]
    if new_rows:
        text = text.rstrip() + "\n" + "\n".join(
            (
                f"| {row['date']} | {row['open']:.2f} | {row['close']:.2f} | "
                f"{row['high']:.2f} | {row['low']:.2f} | "
                f"{format_signed(row['pct'])}% | {row['change']:+.2f} | "
                f"{format_signed(row['amplitude'])}% | {row['volume']} | "
                f"{row['amount']:.2f} | {format_signed(row['turnover'])}% |"
            )
            for row in new_rows
        ) + "\n"
        rows = parse_yunnan_rows(text)
    metric = next(row for row in metrics["stocks"] if row["code"] == "000538")
    latest = rows[max(rows)]
    price = float(latest[2])
    annual_yield = 2.602 / price * 100
    annual_ex_special = 1.583 / price * 100
    text = re.sub(
        r"> 采集时间：.*",
        f"> 采集时间：{collected_at}；行情截至 {end}。上市以来保留 {len(rows)} 条不复权日线，不填充停牌日。",
        text,
        count=1,
    )
    replacements = {
        r"\| 收盘价 \| .*? \|": f"| 收盘价 | {price:.2f}元（{end}） |",
        r"\| TTM 市盈率 \| .*? \|": f"| TTM 市盈率 | {metric['pe']:.2f} |",
        r"\| 腾讯行情股息率 \| .*? \|": f"| 腾讯行情股息率 | {metric['dividendYield']:.2f}% |",
        r"\| 2025年度已实施分红股息率 \| .*? \|": (
            f"| 2025年度已实施分红股息率 | {annual_yield:.2f}%（每股税前2.602元） |"
        ),
        r"\| 剔除2025特别分红股息率 \| .*? \|": (
            f"| 剔除2025特别分红股息率 | {annual_ex_special:.2f}% |"
        ),
        r"\| 52周最高／最低 \| .*? \|": (
            f"| 52周最高／最低 | {metric['high52Week']:.2f}元／{metric['low52Week']:.2f}元 |"
        ),
        r"\| 52周区间与实际覆盖 \| .*? \|": (
            f"| 52周区间与实际覆盖 | {metric['rangeFirstDate']}—{metric['rangeLastDate']}，"
            f"{metric['rangeTradingDays']}个交易日 |"
        ),
        r"\| 历史日线覆盖 \| .*? \|": (
            f"| 历史日线覆盖 | {min(rows)}—{end}，{len(rows)}条 |"
        ),
        r"&end=\d{8}&lmt=100000": f"&end={end.replace('-', '')}&lmt=100000",
        r"day,2025-\d{2}-\d{2},2026-\d{2}-\d{2},400,": (
            f"day,{metric['rangeFirstDate']},{end},400,"
        ),
    }
    for pattern, replacement in replacements.items():
        text = re.sub(pattern, replacement, text, count=1)
    text = re.sub(
        r"2025年度包含.*",
        (
            "2025年度包含2025年特别分红及2026年支付的2025年度分红。"
            "2026年特别分红属于2026年，不混入2025年度股息率。"
            f"腾讯行情{metric['dividendYield']:.2f}%与已核验2025年度"
            f"{annual_yield:.2f}%属于不同时间口径，均保留说明。"
        ),
        text,
        count=1,
    )
    if new_rows:
        note = (
            f"> {min(row['date'] for row in new_rows)}"
            f"{'—' + max(row['date'] for row in new_rows) if len(new_rows) > 1 else ''}"
            "日线追加来源：东方财富不复权日 K。"
        )
        text = text.replace("## 日线明细\n\n", f"## 日线明细\n\n{note}\n\n", 1)
    path.write_text(text)
    return len(rows)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, default=DEFAULT_SOURCE)
    parser.add_argument("--start", help="Existing closing date to update from")
    parser.add_argument("--end", default=date.today().isoformat())
    parser.add_argument("--workers", type=int, default=40)
    args = parser.parse_args()
    source = args.source.resolve()
    if args.start:
        last_date = args.start
        matches = list(source.glob(f"*/*/{last_date}.md"))
        if not matches:
            raise ValueError(f"Missing daily file for --start {last_date}")
        last_path = matches[0]
    else:
        last_date, last_path = latest_daily_file(source)
    trading_dates = fetch_index_dates(last_date, args.end)
    if not trading_dates:
        print("No new trading dates.")
        return
    current = fetch_stock_universe()
    previous = previous_universe(last_path)
    universe = {**previous, **current}
    cache_path = source / "tmp" / f"kline-{last_date}-{args.end}.json"
    cache_path.parent.mkdir(parents=True, exist_ok=True)
    collected_at = datetime.now(ZoneInfo("Asia/Shanghai")).strftime("%Y-%m-%d %H:%M CST")
    print(
        f"Updating {len(trading_dates)} trading days {trading_dates[0]}..{trading_dates[-1]} "
        f"for {len(universe)} stocks",
        flush=True,
    )
    klines = fetch_all_klines(
        universe, last_date, args.end, cache_path, args.workers
    )
    write_daily_files(source, trading_dates, klines, universe, collected_at)
    summaries = update_etfs(source, trading_dates, collected_at)
    (source / "ETF" / "README.md").write_text(render_etf_index(summaries, collected_at))
    (source / "ETF" / "ETF每日行情数据.md").write_text(
        render_etf_index(summaries, collected_at)
    )
    metrics = json.loads((ROOT / "scripts/finance/stock-metrics.json").read_text())
    if metrics["rangeEnd"] != args.end:
        raise ValueError("Run refresh_stock_metrics.py with the same --as-of date first")
    watchlist_codes = {
        cells[1] for _, cells in parse_watchlist(
            (source / "自选持仓股分析看板.md").read_text()
        )
    }
    yunnan_count = update_yunnan(
        source, metrics, trading_dates, collected_at, args.end
    )
    update_watchlist(
        source,
        metrics,
        {code: klines[code] for code in watchlist_codes},
        trading_dates,
        collected_at,
        args.end,
        yunnan_count,
    )
    print(
        f"Updated {len(trading_dates)} market files, {len(summaries)} ETFs, "
        "watchlist and Yunnan Baiyao."
    )


if __name__ == "__main__":
    main()
