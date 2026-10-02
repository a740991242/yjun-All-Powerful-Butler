import { describe, expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { createSession, statistics, submitResponse } from '../learning/engine';
import { newReviewQuestions } from '../learning/review';
import { chineseBooks } from './chinese';
import { consonantPacks } from './chinese-consonants';

const authored = {
  'u3-2': {
    page: 34,
    initials: ['j', 'q', 'x'],
    first: ['jī', 'qī', 'xī'],
    review: ['jí', 'qǐ', 'xì'],
  },
  'u3-3': {
    page: 36,
    initials: ['z', 'c', 's'],
    first: ['zǔ', 'cā', 'sè'],
    review: ['zé', 'cù', 'sǎ'],
  },
  'u3-4': {
    page: 38,
    initials: ['zh', 'ch', 'sh', 'r'],
    first: ['zhè', 'chá', 'shū', 'rè'],
    review: ['zhǔ', 'chē', 'shé', 'rú'],
  },

  'u2-3': {
    page: 24,
    initials: ['b', 'p', 'm', 'f'],
    first: ['bā', 'pō', 'mǐ', 'fǔ'],
    review: ['bǐ', 'pà', 'mǔ', 'fā'],
  },
  'u2-4': {
    page: 26,
    initials: ['d', 't', 'n', 'l'],
    first: ['dǎ', 'tè', 'nǐ', 'lù'],
    review: ['dì', 'tǔ', 'nà', 'lí'],
  },
  'u3-1': {
    page: 32,
    initials: ['g', 'k', 'h'],
    first: ['gē', 'kǔ', 'hǎ'],
    review: ['gǔ', 'kè', 'hé'],
  },
};
describe('initial consonant shape and two-part spelling activities', () => {
  it('covers 21 initial consonants as units and explicitly separates jqx spelling from the underlying ü vowel', () => {
    const initials = Object.values(authored).flatMap((pack) => pack.initials);
    expect(new Set(initials).size).toBe(21);
    expect(initials).toContain('zh');
    expect(initials).not.toContain('y');
    expect(initials).not.toContain('w');
    const lesson = consonantPacks['u3-2']!;
    const answers = lesson.questions
      .filter((question) => question.id.includes('q-umlaut'))
      .map((question) =>
        question.rule.kind === 'choice' ? question.rule.value : null,
      );
    expect(answers).toEqual(['jū', 'ü']);
    const review = lesson
      .reviewQuestions!.filter((question) => question.id.includes('r-umlaut'))
      .map((question) =>
        question.rule.kind === 'choice' ? question.rule.value : null,
      );
    expect(review).toEqual(['xù', 'ü']);
    expect(lesson.steps[2]!.text).toContain('不能因此读成单韵母u');
    expect(consonantPacks['u3-3']!.steps[0]!.text).toContain(
      '整体认读另作活动',
    );
    expect(consonantPacks['u3-4']!.steps[0]!.text).toContain('不能拆成');
  });

  it('uses the actual revised directory and curated valid syllables, with new same-skill materials', () => {
    const lessons = chineseBooks[0]!.units.flatMap((unit) => unit.lessons);
    let main = 0;
    let review = 0;
    for (const [itemId, expected] of Object.entries(authored)) {
      const lesson = consonantPacks[itemId]!;
      expect(lessons).toContain(lesson);
      expect(
        lessons.find((lesson) => lesson.id === `cu-${itemId}`)?.status,
      ).toBe('available');
      expect(lesson.page).toBe(expected.page);
      const answers = (questions: typeof lesson.questions, part: string) =>
        questions
          .filter((question) => new RegExp(`${part}\\d+$`).test(question.id))
          .map((question) =>
            question.rule.kind === 'choice' ? question.rule.value : null,
          );
      expect(answers(lesson.questions, '-shape-')).toEqual(expected.initials);
      expect(answers(lesson.questions, '-blend-')).toEqual(expected.first);
      expect(answers(lesson.reviewQuestions!, '-blend-')).toEqual(
        expected.review,
      );
      for (const question of [
        ...lesson.questions,
        ...lesson.reviewQuestions!,
      ]) {
        if (question.rule.kind !== 'choice') continue;
        const answer = question.rule.value;
        expect(
          question.choices!.filter((choice) => choice.id === answer),
        ).toHaveLength(1);
        if (/-[qr]-blend-\d+$/.test(question.id))
          expect(question.material?.replaceAll(' + ', '')).toBe(answer);
      }
      const ids = [...lesson.questions, ...lesson.reviewQuestions!].map(
        (question) => question.id,
      );
      expect(new Set(ids).size).toBe(ids.length);
      main += lesson.questions.length;
      review += lesson.reviewQuestions!.length;
    }
    expect(main).toBe(56);
    expect(review).toBe(44);
  });
  it('preserves first errors and two manual activities through snapshots and per-initial reviews', () => {
    const now = '2026-09-30T00:00:00.000Z';
    for (const lesson of Object.values(consonantPacks)) {
      const session = createSession(lesson, chineseBooks[0]!.id, 'child', {
        seed: 42,
        now,
      });
      let missed: string | undefined;
      for (const [index, question] of session.questions.entries()) {
        const expected =
          question.rule.kind === 'choice' ? question.rule.value : 'confirmed';
        if (!missed && question.rule.kind === 'choice') {
          missed = question.knowledge;
          session.responses[index] = submitResponse(
            question,
            {
              ...session.responses[index]!,
              draft: question.choices!.find((choice) => choice.id !== expected)!
                .id,
            },
            now,
          );
        }
        session.responses[index] = submitResponse(
          question,
          { ...session.responses[index]!, draft: expected },
          now,
        );
      }
      expect(statistics(session).manual).toBe(2);
      const reviews = newReviewQuestions(lesson, session, [session]);
      expect(reviews).toHaveLength(1);
      expect(reviews[0]!.knowledge).toBe(missed);
      expect(
        parseBackup(
          exportBackup({
            schemaVersion: 1,
            activeProfileId: 'child',
            profiles: [{ id: 'child', nickname: '声母', createdAt: now }],
            sessions: [session],
          }),
        ).data.sessions[0],
      ).toEqual(session);
    }
  });
});
