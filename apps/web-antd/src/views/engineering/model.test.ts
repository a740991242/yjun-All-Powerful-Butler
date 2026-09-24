import { describe, expect, it } from 'vitest';

import en from '#/locales/langs/en-US/engineering.json';
import zh from '#/locales/langs/zh-CN/engineering.json';

import { mergeEntries, validateEntries } from './entries';
import {
  compare,
  cronTimes,
  csvToJson,
  decode64,
  encode64,
  inferType,
  inList,
  inserts,
  instant,
  jsonFormat,
  jsonToCsv,
  sqlFormat,
} from './model';

describe('engineering transformations', () => {
  it('validates JSON and handles nested type unions', () => {
    expect(jsonFormat('{"a":1}')).toBe('{\n  "a": 1\n}');
    expect(() => jsonFormat('{')).toThrow(SyntaxError);
    expect(inferType([{ a: 1 }, { a: null }])).toBe(
      'Array<{ "a": number; } | { "a": null; }>',
    );
    expect(inferType([])).toBe('unknown[]');
  });
  it('parses quoted CSV with multiline cells without losing zeros', () => {
    expect(JSON.parse(csvToJson('id,note\r\n001,"a,b\nc"'))).toEqual([
      { id: '001', note: 'a,b\nc' },
    ]);
    expect(() => csvToJson('a,a\n1,2')).toThrow('engineering.csvInvalid');
    expect(() => csvToJson('a,b\n1')).toThrow('engineering.csvInvalid');
    expect(jsonToCsv('[{"a":"=SUM(A1)","b":{"x":1}}]')).toContain("'=SUM(A1)");
  });
  it('quotes SQL strings and rejects unsafe numeric values or identifiers', () => {
    expect(inList("O'Brien\nA\nA", false)).toBe("IN ('O''Brien', 'A')");
    expect(() => inList('1,2); DROP', true)).toThrow(
      'engineering.invalidNumber',
    );
    expect(
      inserts(
        '[{"id":1,"name":"O\'Brien"},{"id":2}]',
        'dbo.users',
        'transactsql',
      ),
    ).toContain("(1, N'O''Brien'),\n(2, NULL)");
    expect(() => inserts('[{"x":1}]', 'users;delete', 'sql')).toThrow(
      'engineering.identifier',
    );
    expect(
      sqlFormat("select 'from where' as label from users", 'transactsql'),
    ).toContain("'from where'");
  });
  it('aligns removed and added lines and respects whitespace mode', () => {
    expect(compare('hello world', 'helloworld', true)[0]).toMatchObject({
      left: 'hello world',
      right: 'helloworld',
      kind: 'same',
    });
    const rows = compare('one\ntwo\nthree', 'one\nnew\nthree', false);
    expect(rows[1]).toMatchObject({
      left: 'two',
      right: 'new',
      kind: 'change',
      leftNumber: 2,
      rightNumber: 2,
    });
    expect(compare(' a ', 'a', true).every((row) => row.kind === 'same')).toBe(
      true,
    );
    expect(compare('a', '', false)[0]).toMatchObject({
      left: 'a',
      right: '',
      kind: 'change',
    });
  });
  it('roundtrips UTF-8 Base64 and rejects bad input', () => {
    expect(decode64(encode64('你好 🌍'))).toBe('你好 🌍');
    expect(() => decode64('!')).toThrow(/character/i);
  });
  it('converts epochs and rejects ambiguous or impossible dates', () => {
    expect(instant('0', 'seconds').toISOString()).toBe(
      '1970-01-01T00:00:00.000Z',
    );
    expect(instant('2026-09-24T09:00:00+08:00', 'iso').toISOString()).toBe(
      '2026-09-24T01:00:00.000Z',
    );
    expect(() => instant('2026-09-24T09:00:00', 'iso')).toThrow(
      'engineering.isoRequired',
    );
    expect(() => instant('2026-02-30T09:00:00Z', 'iso')).toThrow(
      'engineering.invalidDate',
    );
  });
  it('calculates strictly future cron dates in the chosen timezone', () => {
    const result = cronTimes(
      '0 9 * * *',
      '2026-09-24T09:00:00+08:00',
      'Asia/Shanghai',
    );
    expect(result).toHaveLength(10);
    expect(result[0]).toBe('2026-09-25T01:00:00.000Z');
    expect(() =>
      cronTimes('0 0 0 1 1 * 2027', '2026-09-24T00:00:00Z', 'UTC'),
    ).toThrow('engineering.cronFields');
    const dst = cronTimes(
      '0 9 * * *',
      '2026-03-07T15:00:00Z',
      'America/New_York',
    );
    expect(dst[0]).toBe('2026-03-08T13:00:00.000Z');
  });
  it('validates imports and merges only newer entries', () => {
    const item = {
      id: '1',
      title: 'test',
      kind: 'snippet' as const,
      tags: ['sql'],
      content: 'select 1',
      updatedAt: '2026-09-24T00:00:00Z',
    };
    expect(validateEntries([item])).toEqual([item]);
    expect(() => validateEntries([item, item])).toThrow(
      'engineering.invalidImport',
    );
    expect(() => validateEntries([{ ...item, content: 1 }])).toThrow(
      'engineering.invalidImport',
    );
    expect(
      mergeEntries(
        [item],
        [{ ...item, content: 'older', updatedAt: '2026-09-23T00:00:00Z' }],
      ),
    ).toEqual([item]);
  });
  it('keeps translated keys aligned', () => {
    expect(Object.keys(en).toSorted()).toEqual(Object.keys(zh).toSorted());
  });
});
