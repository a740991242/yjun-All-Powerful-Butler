import { describe, expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
} from '../learning/engine';
import { pinyinTone } from '../learning/pinyin-tone';
import { newReviewQuestions } from '../learning/review';
import { chineseBooks } from './chinese';
import { iuuPhonics } from './chinese-iuu';
import { pinyinToneStandard } from './chinese-source-audit';

describe('i u ü visual tone and paper activities', () => {
  it('links the actual 2024 item and preserves whole-lesson pending and separate evidence scope', () => {
    const lessons = chineseBooks[0]!.units.flatMap((unit) => unit.lessons);
    expect(lessons).toContain(iuuPhonics);
    expect(lessons.find((lesson) => lesson.id === 'cu-u2-2')!.status).toBe(
      'available',
    );
    expect(iuuPhonics.page).toBe(22);
    expect(iuuPhonics.steps).toHaveLength(4);
    expect(iuuPhonics.goal).not.toContain('y w');
    expect(pinyinToneStandard.section).toBe('6.5.1');
    expect(iuuPhonics.parentTip).toContain('不增加汉字');
    const ids = [...iuuPhonics.questions, ...iuuPhonics.reviewQuestions!].map(
      (question) => question.id,
    );
    expect(new Set(ids).size).toBe(18);
    for (const question of [
      ...iuuPhonics.questions,
      ...iuuPhonics.reviewQuestions!,
    ]) {
      if (question.rule.kind !== 'choice') continue;
      const expected = question.rule.value;
      expect(
        question.choices!.filter((choice) => choice.id === expected),
      ).toHaveLength(1);
      expect(evaluate(question.rule, expected)).toBe(true);
      for (const choice of question.choices!)
        if (choice.id !== expected)
          expect(evaluate(question.rule, choice.id)).toBe(false);
    }
  });
  it('distinguishes ü diaeresis from tone marks across NFC/NFD and does not accept u for ü', () => {
    for (const row of ['īíǐì', 'ūúǔù', 'ǖǘǚǜ'])
      [...row].forEach((letter, index) => {
        expect(pinyinTone(letter)?.number).toBe(index + 1);
        expect(pinyinTone(letter.normalize('NFD'))).toEqual(pinyinTone(letter));
        expect(
          evaluate(
            { kind: 'text', accepted: [letter], normalize: 'pinyin' },
            letter.normalize('NFD'),
          ),
        ).toBe(true);
      });
    expect(
      evaluate({ kind: 'text', accepted: ['ǜ'], normalize: 'pinyin' }, 'ù'),
    ).toBe(false);
    expect(
      evaluate({ kind: 'text', accepted: ['ǜ'], normalize: 'pinyin' }, 'ü'),
    ).toBe(false);
    expect(pinyinTone('ü')).toBeNull();
  });
  it('keeps read/write manual and first error evidence while offering new same-skill review tasks', () => {
    const now = '2026-09-30T00:00:00.000Z';
    const session = createSession(iuuPhonics, chineseBooks[0]!.id, 'child', {
      seed: 42,
      now,
    });
    for (const [index, question] of session.questions.entries()) {
      if (question.rule.kind === 'choice') {
        const expected = question.rule.value;
        session.responses[index] = submitResponse(
          question,
          {
            ...session.responses[index]!,
            draft: question.choices!.find((choice) => choice.id !== expected)!
              .id,
          },
          now,
        );
        session.responses[index] = submitResponse(
          question,
          { ...session.responses[index]!, draft: expected },
          now,
        );
      } else
        session.responses[index] = submitResponse(
          question,
          { ...session.responses[index]!, draft: 'confirmed' },
          now,
        );
    }
    expect(statistics(session).manual).toBe(2);
    expect(statistics(session).firstCorrect).toBe(0);
    expect(newReviewQuestions(iuuPhonics, session, [session])).toHaveLength(8);
    expect(
      parseBackup(
        exportBackup({
          schemaVersion: 1,
          activeProfileId: 'child',
          profiles: [{ id: 'child', nickname: '拼音', createdAt: now }],
          sessions: [session],
        }),
      ).data.sessions[0],
    ).toEqual(session);
  });
});
