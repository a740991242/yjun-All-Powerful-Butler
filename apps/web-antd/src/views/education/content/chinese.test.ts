import { describe, expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
} from '../learning/engine';
import { characterScopes, upperCharacters } from './characters';
import { chineseBooks } from './chinese';
import { firstPhonics, firstReading } from './chinese-first-packs';
import { textbooks } from './textbooks';

describe('source-scoped original Chinese recognition supplement', () => {
  it('opens the sourced first lesson while retaining other unverified official items as preparing', () => {
    for (const book of chineseBooks) {
      const textbook = textbooks.find((item) => item.id === book.id)!;
      expect(book.units.map((unit) => unit.id)).toEqual(
        textbook.units.map((unit) => unit.id),
      );
      for (const unit of textbook.units) {
        const lessons = book.units.find((item) => item.id === unit.id)!.lessons;
        for (const item of unit.items) {
          const pending = lessons.find(
            (lesson) => lesson.title === item.title,
          )!;
          expect(pending.status).toBe(
            (book.volume === 'upper' &&
              [
                'school-1',
                'school-2',
                'school-3',
                'school-4',
                'u1-1',
                'u1-2',
                'u1-3',
                'u1-4',
                'u1-5',
                'u1-6',
                'u2-1',
                'u2-2',
                'u2-3',
                'u2-4',
                'u2-5',
                'u3-1',
                'u3-2',
                'u3-3',
                'u3-4',
                'u3-5',
                'u3-6',
                'u4-1',
                'u4-2',
                'u4-3',
                'u4-4',
                'u4-5',
                'u4-6',
                'u5-1',
                'u5-2',
                'u5-3',
                'u5-4',
                'u5-5',
                'u6-1',
                'u6-2',
                'u6-3',
                'u6-4',
                'u6-5',
                'u7-1',
                'u7-2',
                'u7-3',
                'u7-4',
                'u8-1',
                'u8-2',
                'u8-3',
                'u8-4',
              ].includes(item.id)) ||
              (book.volume === 'lower' &&
                [
                  'u1-1',
                  'u1-2',
                  'u1-3',
                  'u1-4',
                  'u1-5',
                  'u1-6',
                  'u2-1',
                  'u2-2',
                  'u2-3',
                  'u2-4',
                  'u3-1',
                  'u3-2',
                  'u3-3',
                  'u3-4',
                  'u4-1',
                  'u4-2',
                  'u4-3',
                  'u4-4',
                  'u5-1',
                  'u5-2',
                  'u5-3',
                  'u5-4',
                  'u5-5',
                  'u6-1',
                  'u6-2',
                  'u6-3',
                  'u6-4',
                  'u6-5',
                  'u7-1',
                  'u7-2',
                  'u7-3',
                  'u7-4',
                  'u7-5',
                  'u8-1',
                  'u8-2',
                  'u8-3',
                  'u8-4',
                ].includes(item.id))
              ? 'available'
              : 'preparing',
          );
          expect(pending.page).toBe(item.page);
          if (pending.status === 'preparing')
            expect(pending.questions).toEqual([]);
        }
      }
    }
  });
  it('retains independent phonics and reading supplements after their formal lessons are published', () => {
    const lessons = chineseBooks[0]!.units.flatMap((unit) => unit.lessons);
    for (const lesson of [firstPhonics, firstReading]) {
      expect(lessons).toContain(lesson);
      expect(
        lessons.find((item) => item.title === lesson.textbookTitle)?.status,
      ).toBe('available');
      expect(
        lessons.find((item) => item.title === lesson.textbookTitle)?.id,
      ).not.toBe(lesson.id);
      expect(lesson.questions).toHaveLength(6);
      const ids = [...lesson.questions, ...lesson.reviewQuestions!].map(
        (question) => question.id,
      );
      expect(new Set(ids).size).toBe(ids.length);
      for (const question of [
        ...lesson.questions,
        ...lesson.reviewQuestions!,
      ]) {
        if (question.rule.kind !== 'choice') continue;
        const expected = question.rule.value;
        expect(
          question.choices?.filter((choice) => choice.id === expected),
        ).toHaveLength(1);
        expect(evaluate(question.rule, question.rule.value)).toBe(true);
        for (const choice of question.choices!) {
          if (choice.id !== question.rule.value)
            expect(evaluate(question.rule, choice.id)).toBe(false);
        }
      }
    }
    expect(
      firstPhonics.questions.filter(
        (question) => question.rule.kind === 'manual',
      ),
    ).toHaveLength(1);
    expect(
      firstReading.questions.filter(
        (question) => question.rule.kind === 'manual',
      ),
    ).toHaveLength(2);
    for (const question of [
      ...firstReading.questions,
      ...firstReading.reviewQuestions!,
    ]) {
      expect(question.material).toBe(firstReading.steps[0]!.text);
      if (question.rule.kind === 'choice')
        expect(question.material).toContain(question.rule.value);
    }
  });
  it('keeps original reading text, tone marks and first-attempt/manual evidence in exported snapshots', () => {
    const now = '2026-09-30T01:00:00.000Z';
    for (const lesson of [firstPhonics, firstReading]) {
      const session = createSession(lesson, chineseBooks[0]!.id, 'child', {
        seed: 10,
        now,
      });
      session.phase = 'practice';
      for (const [index, question] of session.questions.entries()) {
        const correct =
          question.rule.kind === 'choice' ? question.rule.value : 'confirmed';
        session.responses[index] = submitResponse(
          question,
          { ...session.responses[index]!, draft: correct },
          now,
        );
      }
      expect(statistics(session).manual).toBe(lesson === firstPhonics ? 1 : 2);
      const restored = parseBackup(
        exportBackup({
          schemaVersion: 1,
          activeProfileId: 'child',
          profiles: [{ id: 'child', nickname: '陪读', createdAt: now }],
          sessions: [session],
        }),
      ).data.sessions[0]!;
      expect(restored).toEqual(session);
      expect(restored.questions).not.toBe(lesson.questions);
    }
    expect(
      evaluate(
        { kind: 'text', accepted: ['ǎ'], normalize: 'pinyin' },
        'a\u030C',
      ),
    ).toBe(true);
    expect(
      evaluate({ kind: 'text', accepted: ['ǎ'], normalize: 'pinyin' }, 'a'),
    ).toBe(false);
  });
  it('uses the verified six-character scope, treats reading and expression as manual, and roundtrips historical evidence', () => {
    const lesson = chineseBooks[0]!.units
      .flatMap((unit) => unit.lessons)
      .find((item) => item.id === 'cu-u1-1-recognition')!;
    expect(lesson.steps[0]?.visual).toEqual({
      kind: 'characters',
      characters: [...upperCharacters['u1-1']!.recognize],
      grid: 'tian',
    });
    expect(upperCharacters['u1-1']!.write).toBe('');
    expect(
      lesson.questions.filter((question) => question.rule.kind === 'manual'),
    ).toHaveLength(2);
    const now = '2026-09-30T00:00:00.000Z';
    const session = createSession(lesson, chineseBooks[0]!.id, 'child', {
      seed: 5,
      now,
    });
    session.phase = 'practice';
    for (const [index, question] of session.questions.entries()) {
      const answer =
        question.rule.kind === 'choice' ? question.rule.value : 'confirmed';
      expect(evaluate(question.rule, answer)).toBe(
        question.rule.kind === 'manual' ? null : true,
      );
      session.responses[index] = submitResponse(
        question,
        { ...session.responses[index]!, draft: answer },
        now,
      );
    }
    expect(statistics(session).manual).toBe(2);
    expect(
      parseBackup(
        exportBackup({
          schemaVersion: 1,
          activeProfileId: 'child',
          profiles: [{ id: 'child', nickname: '读字', createdAt: now }],
          sessions: [session],
        }),
      ).data.sessions[0],
    ).toEqual(session);
  });
});

describe('complete formal Chinese directory and recognition coverage', () => {
  it('keeps every formal course separate from supplements and covers every verified new recognition character', () => {
    for (const book of chineseBooks) {
      const textbook = textbooks.find((item) => item.id === book.id)!;
      const scopes = characterScopes(book.volume);
      const prefix = book.volume === 'upper' ? 'cu' : 'cl';
      const lessons = book.units.flatMap((unit) => unit.lessons);
      expect(new Set(lessons.map((lesson) => lesson.id)).size).toBe(
        lessons.length,
      );
      for (const item of textbook.units.flatMap((unit) => unit.items)) {
        const matches = lessons.filter(
          (lesson) => lesson.id === `${prefix}-${item.id}`,
        );
        expect(
          matches,
          `${book.volume}/${item.id}: formal course`,
        ).toHaveLength(1);
        const lesson = matches[0]!;
        expect(lesson.textbookTitle).toBe(item.title);
        expect(lesson.page).toBe(item.page);
        if (item.kind === 'reference') {
          expect(lesson.reference).toBeDefined();
          expect(lesson.questions).toEqual([]);
          continue;
        }
        expect(lesson.status).toBe('available');
        expect(lesson.steps.length).toBeGreaterThan(0);
        expect(lesson.questions.length).toBeGreaterThan(0);
        const recognition = new Set(
          lesson.questions.flatMap((question) =>
            question.rule.kind === 'choice' ? [question.rule.value] : [],
          ),
        );
        for (const character of scopes[item.id]?.recognize ?? '')
          expect(
            recognition.has(character),
            `${book.volume}/${item.id}: ${character}`,
          ).toBe(true);
        if (scopes[item.id]?.write) {
          const writing = lesson.questions.filter(
            (question) =>
              question.rule.kind === 'manual' && question.prompt.includes('写'),
          );
          expect(
            writing.length,
            `${book.volume}/${item.id}: writing task`,
          ).toBeGreaterThan(0);
          const writingInstructions = [
            ...writing.map((question) => question.prompt),
            ...lesson.steps
              .filter((step) => step.text.includes('写'))
              .map((step) => step.text),
          ].join('\n');
          for (const character of scopes[item.id]!.write)
            expect(
              writingInstructions,
              `${book.volume}/${item.id}: write ${character}`,
            ).toContain(character);
        }
      }
    }
  });
});
