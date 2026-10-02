import { describe, expect, it } from 'vitest';

import {
  characterRows,
  filterCharacters,
  referenceKind,
  referencePages,
} from './character-reference';
import { lowerCharacters, upperCharacters } from './characters';

describe('official character reference query', () => {
  it('maps every verified scope to its actual printed course, keeping unknown writing separate from no new writing', () => {
    for (const volume of ['upper', 'lower'] as const) {
      const rows = characterRows(volume);
      const scopes = volume === 'upper' ? upperCharacters : lowerCharacters;
      expect(rows.length).toBe(Object.keys(scopes).length);
      for (const row of rows) {
        expect(row.recognize).toBe(scopes[row.id]?.recognize);
        expect(row.writeVerified).toBe(scopes[row.id]?.writeVerified);
        expect(row.page).toBeGreaterThan(0);
        expect(row.title).not.toBe('');
      }
    }
    expect(
      characterRows('upper').find((row) => row.id === 'u1-1'),
    ).toMatchObject({
      title: '天地人',
      page: 8,
      write: '',
      writeVerified: true,
    });
    expect(
      characterRows('lower').find((row) => row.id === 'u1-1'),
    ).toMatchObject({ write: '春冬吹花飞入', writeVerified: true });
    expect(
      characterRows('lower').find((row) => row.id === 'u1-5'),
    ).toMatchObject({ write: '文卡片合', writeVerified: true });
  });
  it('searches by character, contextual additional reading or course, and combines filters without changing source data', () => {
    const rows = characterRows('upper');
    const before = structuredClone(rows);
    expect(
      filterCharacters(rows, 'recognize', '天地人').map((row) => row.id),
    ).toEqual(['u1-1']);
    expect(filterCharacters(rows, 'recognize', ' 数 ', 'u8-3')).toHaveLength(1);
    expect(
      filterCharacters(rows, 'write', '一').some((row) => row.id === 'u1-2'),
    ).toBe(true);
    expect(filterCharacters(rows, 'write', '天', 'u1-1')).toHaveLength(1); // course-name search, no invented writing characters
    expect(filterCharacters(rows, 'recognize', '不存在的词')).toEqual([]);
    expect(rows).toEqual(before);
    expect(
      ['识字表', '写字表', '笔画名称表', '常用偏旁名称表'].map((item) =>
        referenceKind(item),
      ),
    ).toEqual(['recognize', 'write', 'strokes', 'radicals']);
    expect(referenceKind('未定义')).toBeUndefined();
    expect(referencePages('lower', 'write')).toEqual([
      3, 5, 7, 9, 10, 17, 19, 21, 22, 117, 118, 119,
    ]);
    expect(referencePages('upper', 'strokes')).toEqual([109]);
    expect(referencePages('lower', 'strokes')).toEqual([]);
  });
});
