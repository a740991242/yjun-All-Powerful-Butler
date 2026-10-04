import { expect, it } from 'vitest';

import { evaluate } from '../learning/engine';
import { characterRows, filterCharacters } from './character-reference';
import { chineseBooks } from './chinese';

it('independently checks contextual pronunciations instead of generalizing one reading to every use', () => {
  const cases = [
    ['cu-u5-4', 'sound-familiar', 'de', 'zhe'],
    ['cu-u8-2', 'sound', 'zháo', 'zhī'],
    ['cu-u8-3', 'familiar-sounds', 'shǔ', 'zhǎng'],
    ['cl-u3-2', 'familiar-reading', 'zhǐ', 'zhī'],
    ['cl-u3-3', 'music-reading', 'yuè', 'lè'],
    ['cl-u3-3', 'need-reading', 'děi', 'dé'],
    ['cl-u4-3', 'reading', 'liǎo', 'le'],
    ['cl-u6-4', 'reading', 'kòng', 'mēn'],
    ['cl-u7-2', 'reading', 'bēi', 'bèi'],
    ['cl-u7-3', 'reading', 'yā', 'ya'],
    ['cl-u7-4', 'reading', 'jiē', 'jié'],
    ['cl-u8-3', 'reading', 'na', 'nǎ'],
  ] as const;
  const lessons = chineseBooks.flatMap((book) =>
    book.units.flatMap((unit) => unit.lessons),
  );
  let inspected = 0;
  for (const [id, skill, mainAnswer, reviewAnswer] of cases) {
    const lesson = lessons.find((item) => item.id === id)!;
    expect(lesson).toBeDefined();
    const knowledge = `${id}-${skill}`;
    const main = lesson.questions.filter((q) => q.knowledge === knowledge);
    const review = lesson.reviewQuestions!.filter(
      (q) => q.knowledge === knowledge,
    );
    expect(main).toHaveLength(1);
    expect(review).toHaveLength(1);
    expect(main[0]!.prompt).not.toBe(review[0]!.prompt);
    for (const [q, answer, other] of [
      [main[0]!, mainAnswer, reviewAnswer],
      [review[0]!, reviewAnswer, mainAnswer],
    ] as const) {
      expect(q.rule).toEqual({ kind: 'choice', value: answer });
      expect(q.choices!.some((c) => c.id === answer)).toBe(true);
      expect(evaluate(q.rule, other)).toBe(false);
      for (const choice of q.choices!)
        expect(evaluate(q.rule, choice.id)).toBe(choice.id === answer);
      inspected++;
    }
  }
  expect(inspected).toBe(24);
});

it('keeps all thirteen contextual familiar characters separate from new recognition while retaining writing scope', () => {
  const expected = {
    upper: [
      ['u5-4', '地'],
      ['u8-2', '着'],
      ['u8-3', '数长'],
    ],
    lower: [
      ['u3-2', '只'],
      ['u3-3', '乐得'],
      ['u4-3', '了'],
      ['u6-4', '空'],
      ['u7-2', '背'],
      ['u7-3', '呀'],
      ['u7-4', '结'],
      ['u8-3', '哪'],
    ],
  };
  let inspected = 0;
  for (const volume of ['upper', 'lower'] as const) {
    const rows = characterRows(volume);
    expect(
      rows
        .filter((row) => row.additionalReadings)
        .map((row) => [row.id, row.additionalReadings]),
    ).toEqual(expected[volume]);
    for (const [id, characters] of expected[volume]) {
      const row = rows.find((item) => item.id === id)!;
      for (const character of characters!) {
        expect(row.recognize).not.toContain(character);
        expect(filterCharacters(rows, 'recognize', character, id)).toEqual([
          row,
        ]);
        inspected++;
      }
    }
  }
  expect(characterRows('lower').find((row) => row.id === 'u3-3')!.write).toBe(
    '快当画乐书毛',
  );
  expect(inspected).toBe(13);
});
