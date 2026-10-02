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
import { compoundVowelPacks } from './chinese-compound-vowels';

const cases = [
  ['u4-1', 'ai ei ui', 45, ['dǎi', 'lèi', 'shuǐ'], ['lái', 'bēi', 'tuì']],
  ['u4-2', 'ao ou iu', 47, ['hǎo', 'dòu', 'liù'], ['māo', 'kǒu', 'qiū']],
  ['u4-3', 'ie üe er', 49, ['xiě', 'xuě', 'ér'], ['tiē', 'lüè', 'ěr']],
] as const;

describe('compound vowels and separate er activities', () => {
  it('keeps supplements independent when inspected formal lessons become available', () => {
    const lessons = chineseBooks[0]!.units.flatMap((unit) => unit.lessons);
    for (const [itemId, title, page, first, review] of cases) {
      const lesson = compoundVowelPacks[itemId]!;
      expect(lessons).toContain(lesson);
      expect(lessons.find((l) => l.id === `cu-${itemId}`)?.status).toBe(
        'available',
      );
      expect(lesson.textbookTitle).toBe(title);
      expect(lesson.page).toBe(page);
      expect(lesson.steps).toHaveLength(5);
      expect(lesson.questions).toHaveLength(12);
      expect(lesson.reviewQuestions).toHaveLength(10);
      expect(lesson.steps[2]!.visual).toMatchObject({ characters: first });
      expect(lesson.steps[3]!.visual).toMatchObject({ characters: review });
      for (const question of [
        ...lesson.questions,
        ...lesson.reviewQuestions!,
      ]) {
        if (question.rule.kind !== 'choice') continue;
        const answer = question.rule.value;
        expect(question.choices!.filter((c) => c.id === answer)).toHaveLength(
          1,
        );
        for (const choice of question.choices!)
          expect(evaluate(question.rule, choice.id)).toBe(choice.id === answer);
      }
    }
    expect(compoundVowelPacks['u4-3']!.steps[0]!.text).toContain('er单独观察');
    expect(compoundVowelPacks['u4-3']!.steps[0]!.text).toContain(
      '与n、l相拼仍保留两点',
    );
  });
  it('shows all thirty-six tone marks including non-terminal vowels and retains ü dots', () => {
    for (const lesson of cases.map(([id]) => compoundVowelPacks[id]!)) {
      const visual = lesson.steps[1]!.visual!;
      if (visual.kind !== 'characters') throw new Error('missing tone forms');
      expect(visual.characters).toHaveLength(12);
      visual.characters.forEach((form, index) => {
        expect(pinyinTone(form)?.number).toBe((index % 4) + 1);
        expect(pinyinTone(form.normalize('NFD'))).toEqual(pinyinTone(form));
      });
      expect(lesson.steps[1]!.text).toContain('\n');
    }
    expect(pinyinTone('xuě')?.number).toBe(3);
    expect(pinyinTone('lüè')?.number).toBe(4);
  });
  it('preserves first failures and manual records, and offers a different question for each failed skill', () => {
    const now = '2026-09-30T00:00:00.000Z';
    for (const lesson of cases.map(([id]) => compoundVowelPacks[id]!)) {
      const session = createSession(lesson, chineseBooks[0]!.id, 'child', {
        seed: 42,
        now,
      });
      for (const [index, question] of session.questions.entries()) {
        if (question.rule.kind === 'choice') {
          const answer = question.rule.value;
          session.responses[index] = submitResponse(
            question,
            {
              ...session.responses[index]!,
              draft: question.choices!.find((c) => c.id !== answer)!.id,
            },
            now,
          );
          session.responses[index] = submitResponse(
            question,
            { ...session.responses[index]!, draft: answer },
            now,
          );
        } else
          session.responses[index] = submitResponse(
            question,
            { ...session.responses[index]!, draft: 'confirmed' },
            now,
          );
      }
      expect(statistics(session).firstCorrect).toBe(0);
      expect(statistics(session).manual).toBe(2);
      const review = newReviewQuestions(lesson, session, [session]);
      expect(review).toHaveLength(10);
      for (const question of review) {
        const original = lesson.questions.find(
          (q) => q.knowledge === question.knowledge,
        )!;
        expect([question.prompt, question.material, question.rule]).not.toEqual(
          [original.prompt, original.material, original.rule],
        );
      }
      expect(
        parseBackup(
          exportBackup({
            schemaVersion: 1,
            activeProfileId: 'child',
            profiles: [{ id: 'child', nickname: '复韵母', createdAt: now }],
            sessions: [session],
          }),
        ).data.sessions[0],
      ).toEqual(session);
    }
  });
});
