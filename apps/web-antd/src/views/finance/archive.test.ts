import { describe, expect, it } from 'vitest';

import {
  PORTFOLIO_ARCHIVE_KEY,
  readArchivedCodes,
  writeArchivedCodes,
} from './archive';

describe('finance archive storage', () => {
  it('deduplicates and filters archived codes', () => {
    const storage = {
      getItem: () =>
        JSON.stringify({
          codes: ['601888', '601888', '600760', '999999'],
        }),
    };
    expect(
      readArchivedCodes(storage, PORTFOLIO_ARCHIVE_KEY, ['601888', '600760']),
    ).toEqual(['601888', '600760']);
  });

  it('writes only currently selectable codes', () => {
    const values = new Map<string, string>();
    const storage = {
      setItem: (key: string, value: string) => values.set(key, value),
    };
    expect(
      writeArchivedCodes(
        storage,
        PORTFOLIO_ARCHIVE_KEY,
        ['601888', '999999'],
        ['601888'],
      ),
    ).toEqual(['601888']);
    const stored = values.get(PORTFOLIO_ARCHIVE_KEY);
    if (!stored) throw new Error('missing archive');
    expect(JSON.parse(stored)).toEqual({
      codes: ['601888'],
    });
  });

  it('rejects malformed archive data', () => {
    expect(() =>
      readArchivedCodes(
        { getItem: () => JSON.stringify({ codes: [1] }) },
        PORTFOLIO_ARCHIVE_KEY,
        ['601888'],
      ),
    ).toThrow('invalid');
  });
});
