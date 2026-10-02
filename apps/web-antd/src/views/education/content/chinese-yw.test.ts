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
import { ywLesson } from './chinese-yw';

describe('separate y w and whole-syllable activities', () => {
  it('retains the actual revised item and distinguishes letters, whole syllables and underlying ü', () => {
    const lessons = chineseBooks[0]!.units.flatMap((unit) => unit.lessons);
    expect(lessons).toContain(ywLesson);
    expect(lessons.find((lesson) => lesson.id === 'cu-u3-5')?.status).toBe(
      'available',
    );
    expect(ywLesson.page).toBe(40);
    expect(ywLesson.steps).toHaveLength(5);
    const answers = ywLesson.questions
      .filter((question) => question.rule.kind === 'choice')
      .map((question) =>
        question.rule.kind === 'choice' ? question.rule.value : '',
      );
    expect(answers).toEqual([
      'y',
      'w',
      'yi',
      'wu',
      'yu',
      'yí',
      'wǔ',
      'yù',
      'yu',
      'ü',
      'yā',
      'wō',
    ]);
    expect(ywLesson.steps[1]!.text).toContain('不套用声母与韵母分别读再相拼');
    expect(ywLesson.steps[2]!.text).toContain('这里对应的是ü，不是u');
    for (const question of [
      ...ywLesson.questions,
      ...ywLesson.reviewQuestions!,
    ]) {
      if (question.rule.kind !== 'choice') continue;
      const expected = question.rule.value;
      expect(
        question.choices!.filter((choice) => choice.id === expected),
      ).toHaveLength(1);
      for (const choice of question.choices!)
        expect(evaluate(question.rule, choice.id)).toBe(choice.id === expected);
    }
  });
  it('renders all twelve whole-syllable tones consistently while retaining canonical marks', () => {
    for (const row of [
      ['yī', 'yí', 'yǐ', 'yì'],
      ['wū', 'wú', 'wǔ', 'wù'],
      ['yū', 'yú', 'yǔ', 'yù'],
    ])
      row.forEach((syllable, index) => {
        expect(pinyinTone(syllable)?.number).toBe(index + 1);
        expect(pinyinTone(syllable.normalize('NFD'))).toEqual(
          pinyinTone(syllable),
        );
      });
    expect(pinyinTone('yu')).toBeNull();
  });
  it('keeps first evidence and two manual activities separate through backup and same-skill new review', () => {
    const now = '2026-09-30T00:00:00.000Z';
    const session = createSession(ywLesson, chineseBooks[0]!.id, 'child', {
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
    expect(newReviewQuestions(ywLesson, session, [session])).toHaveLength(12);
    expect(
      parseBackup(
        exportBackup({
          schemaVersion: 1,
          activeProfileId: 'child',
          profiles: [{ id: 'child', nickname: '整体音节', createdAt: now }],
          sessions: [session],
        }),
      ).data.sessions[0],
    ).toEqual(session);
  });
});
