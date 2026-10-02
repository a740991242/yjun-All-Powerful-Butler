import { describe, expect, it } from 'vitest';

import { pinyinTone } from './pinyin-tone';

describe('symbolic pinyin tone directions', () => {
  it('keeps all four tone marks distinct for all six single vowels and accepts canonical combining forms', () => {
    for (const row of ['āáǎà', 'ōóǒò', 'ēéěè', 'īíǐì', 'ūúǔù', 'ǖǘǚǜ']) {
      [...row].forEach((character, index) => {
        expect(pinyinTone(character)?.number).toBe(index + 1);
        expect(pinyinTone(character.normalize('NFD'))).toEqual(
          pinyinTone(character),
        );
      });
    }
    expect(
      new Set([...'āáǎà'].map((character) => pinyinTone(character)?.path)).size,
    ).toBe(4);
  });
  it('finds a single vowel tone before remaining letters, for compounds and complete syllables', () => {
    for (const row of [
      ['āi', 'ái', 'ǎi', 'ài'],
      ['āo', 'áo', 'ǎo', 'ào'],
      ['ōu', 'óu', 'ǒu', 'òu'],
      ['dāi', 'léi', 'hǎo', 'dòu'],
      ['liū', 'liú', 'liǔ', 'liù'],
      ['shuī', 'shuí', 'shuǐ', 'shuì'],
      ['üē', 'üé', 'üě', 'üè'],
    ])
      row.forEach((value, index) => {
        expect(pinyinTone(value)?.number).toBe(index + 1);
        expect(pinyinTone(value.normalize('NFD'))).toEqual(pinyinTone(value));
      });
    for (const value of ['āí', '好hǎo', 'hǎo ma', 'b́', 'ä́', 'ü̈́', '123á', 'ā!'])
      expect(pinyinTone(value)).toBeNull();
  });
  it('does not invent a tone for unmarked vowels, ü or unsupported input', () => {
    for (const character of ['a', 'o', 'e', 'ü', '', '天'])
      expect(pinyinTone(character)).toBeNull();
  });
});
