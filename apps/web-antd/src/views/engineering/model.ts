import { CronExpressionParser } from 'cron-parser';
import { diffLines } from 'diff';
import Papa from 'papaparse';
import { format } from 'sql-formatter';

export function bounded(text: string, limit = 100_000) {
  if (text.length > limit) throw new Error('engineering.tooLarge');
  return text;
}
export function parseJson(text: string): unknown {
  return JSON.parse(bounded(text));
}
export function jsonFormat(text: string) {
  return JSON.stringify(parseJson(text), null, 2);
}
export function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}
export function records(text: string) {
  const value = parseJson(text);
  if (
    !Array.isArray(value) ||
    value.length === 0 ||
    !value.every((item) => isRecord(item))
  )
    throw new Error('engineering.recordsOnly');
  return value as Record<string, unknown>[];
}
export function jsonToCsv(text: string) {
  const rows = records(text);
  const fields = [...new Set(rows.flatMap((row) => Object.keys(row)))];
  return Papa.unparse(
    {
      fields,
      data: rows.map((row) =>
        fields.map((key) => {
          const value = row[key];
          return typeof value === 'object' && value !== null
            ? JSON.stringify(value)
            : (value ?? '');
        }),
      ),
    },
    { escapeFormulae: true },
  );
}
export function csvToJson(text: string) {
  const result = Papa.parse<string[]>(bounded(text), {
    skipEmptyLines: 'greedy',
  });
  if (result.errors.length > 0) throw new Error('engineering.csvInvalid');
  const [headers, ...rows] = result.data;
  if (
    !headers?.length ||
    headers.some((x) => !x.trim()) ||
    new Set(headers).size !== headers.length ||
    rows.some((x) => x.length !== headers.length)
  )
    throw new Error('engineering.csvInvalid');
  return JSON.stringify(
    rows.map((row) =>
      Object.fromEntries(headers.map((key, i) => [key, row[i]])),
    ),
    null,
    2,
  );
}
export function inferType(value: unknown, depth = 0): string {
  if (depth > 30) throw new Error('engineering.tooDeep');
  if (value === null) return 'null';
  if (Array.isArray(value))
    return value.length > 0
      ? `Array<${[...new Set(value.map((v) => inferType(v, depth + 1)))].join(' | ')}>`
      : 'unknown[]';
  if (isRecord(value))
    return `{ ${Object.entries(value)
      .map(([k, v]) => `${JSON.stringify(k)}: ${inferType(v, depth + 1)};`)
      .join(' ')} }`;
  return typeof value;
}
export const dialects = [
  'sql',
  'transactsql',
  'mysql',
  'postgresql',
  'sqlite',
] as const;
export type Dialect = (typeof dialects)[number];
export function sqlFormat(text: string, language: Dialect = 'sql') {
  return format(bounded(text), { language, keywordCase: 'upper' });
}
export function listValues(text: string) {
  return [
    ...new Set(
      bounded(text)
        .split(/[\n\r,，\t]+/)
        .map((v) => v.trim())
        .filter(Boolean),
    ),
  ];
}
export function inList(text: string, numeric: boolean) {
  const values = listValues(text);
  if (values.length === 0) throw new Error('engineering.required');
  if (numeric && values.some((v) => !/^-?(?:0|[1-9]\d*)(?:\.\d+)?$/.test(v)))
    throw new Error('engineering.invalidNumber');
  return `IN (${values.map((v) => (numeric ? v : `'${v.replaceAll("'", "''")}'`)).join(', ')})`;
}
function identifier(value: string, dialect: Dialect) {
  if (!/^[\p{L}_][\p{L}\p{N}_]*$/u.test(value))
    throw new Error('engineering.identifier');
  if (dialect === 'mysql') return `\`${value}\``;
  if (dialect === 'transactsql') return `[${value}]`;
  return `"${value}"`;
}
export function inserts(text: string, table: string, dialect: Dialect) {
  const data = records(text);
  const keys = [...new Set(data.flatMap((row) => Object.keys(row)))];
  if (keys.length === 0) throw new Error('engineering.required');
  const target = table
    .split('.')
    .map((s) => identifier(s, dialect))
    .join('.');
  const literal = (value: unknown): string => {
    if (value === null || value === undefined) return 'NULL';
    if (typeof value === 'number') return String(value);
    if (typeof value === 'boolean') {
      if (dialect === 'postgresql') return String(value).toUpperCase();
      return value ? '1' : '0';
    }
    if (typeof value !== 'string') throw new Error('engineering.scalarOnly');
    const escaped =
      dialect === 'mysql' ? value.replaceAll('\\', String.raw`\\`) : value;
    return `${dialect === 'transactsql' ? 'N' : ''}'${escaped.replaceAll("'", "''")}'`;
  };
  return `INSERT INTO ${target} (${keys.map((k) => identifier(k, dialect)).join(', ')}) VALUES\n${data.map((row) => `(${keys.map((k) => literal(row[k])).join(', ')})`).join(',\n')};`;
}
export type DiffRow = {
  left: string;
  right: string;
  kind: 'change' | 'same';
  leftNumber?: number;
  rightNumber?: number;
};
export function compare(
  left: string,
  right: string,
  ignoreSpace: boolean,
): DiffRow[] {
  const normal = (s: string) => bounded(s, 30_000).replaceAll('\r\n', '\n');
  const prepare = (value: string) =>
    ignoreSpace ? normal(value).replaceAll(/[^\S\n]/g, '') : normal(value);
  const originalLeft = normal(left).split('\n');
  const originalRight = normal(right).split('\n');
  const pieces = diffLines(prepare(left), prepare(right), {
    timeout: 500,
  });
  if (!pieces) throw new Error('engineering.tooLarge');
  const rows: DiffRow[] = [];
  let ln = 0;
  let rn = 0;
  const lines = (s: string) => s.replace(/\n$/, '').split('\n');
  let removed: string[] = [];
  let added: string[] = [];
  const flush = () => {
    for (let i = 0; i < Math.max(removed.length, added.length); i++)
      rows.push({
        left: removed[i] ?? '',
        right: added[i] ?? '',
        kind: 'change',
        leftNumber: i < removed.length ? ++ln : undefined,
        rightNumber: i < added.length ? ++rn : undefined,
      });
    removed = [];
    added = [];
  };
  for (const piece of pieces) {
    if (piece.removed) removed.push(...lines(piece.value));
    else if (piece.added) added.push(...lines(piece.value));
    else {
      flush();
      for (const line of lines(piece.value))
        rows.push({
          left: line,
          right: line,
          kind: 'same',
          leftNumber: ++ln,
          rightNumber: ++rn,
        });
    }
  }
  flush();
  return rows.map((row) => ({
    ...row,
    left:
      row.leftNumber === undefined
        ? ''
        : (originalLeft[row.leftNumber - 1] ?? ''),
    right:
      row.rightNumber === undefined
        ? ''
        : (originalRight[row.rightNumber - 1] ?? ''),
  }));
}
export function encode64(text: string) {
  return btoa(
    Array.from(new TextEncoder().encode(bounded(text)), (b) =>
      String.fromCodePoint(b),
    ).join(''),
  );
}
export function decode64(text: string) {
  return new TextDecoder('utf-8', { fatal: true }).decode(
    Uint8Array.from(atob(bounded(text)), (c) => c.codePointAt(0) ?? 0),
  );
}
export function instant(
  text: string,
  unit: 'iso' | 'milliseconds' | 'seconds',
) {
  let value: number;
  if (unit === 'iso') {
    if (!/^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/i.test(text))
      throw new Error('engineering.isoRequired');
    const calendar = text.slice(0, 10);
    if (
      new Date(`${calendar}T00:00:00Z`).toISOString().slice(0, 10) !== calendar
    )
      throw new Error('engineering.invalidDate');
    value = Date.parse(text);
  } else {
    if (!/^-?\d+$/.test(text)) throw new Error('engineering.invalidNumber');
    value = Number(text) * (unit === 'seconds' ? 1000 : 1);
  }
  if (
    !Number.isSafeInteger(value) ||
    !Number.isFinite(new Date(value).getTime())
  )
    throw new Error('engineering.invalidDate');
  return new Date(value);
}
export function cronTimes(expression: string, from: string, tz: string) {
  if (![5, 6].includes(expression.trim().split(/\s+/).length))
    throw new Error('engineering.cronFields');
  const currentDate = instant(from, 'iso');
  const interval = CronExpressionParser.parse(expression, { currentDate, tz });
  return interval.take(10).map((date) => date.toDate().toISOString());
}
