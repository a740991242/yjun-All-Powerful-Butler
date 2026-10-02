import { describe, expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
} from '../learning/engine';
import { newReviewQuestions } from '../learning/review';
import { chineseBooks } from './chinese';
import { chineseTransitions } from './chinese-transitions';

const expected = [
  ['b', 'q', 'ǎi', 'uì', 'ün', 'ing'],
  ['天', '日', '月', '水', '火', '人'],
  ['小禾', '教室', '早上', '不让书沾湿', '先擦干桌子，再放书', '书包'],
];
describe('chinese upper-to-lower bridges', () => {
  it('opens three optional original groups in both volumes without inserting textbook units or resetting records', () => {
    expect(chineseTransitions.map((l) => l.id)).toEqual([
      'ct-phonics',
      'ct-words',
      'ct-reading',
    ]);
    for (const book of chineseBooks) {
      expect(book.transitions).toEqual(chineseTransitions);
      expect(
        book.units
          .flatMap((u) => u.lessons)
          .some((l) => l.id.startsWith('ct-')),
      ).toBe(false);
    }
    for (const [index, lesson] of chineseTransitions.entries()) {
      expect(lesson.questions).toHaveLength(7);
      expect(lesson.reviewQuestions).toHaveLength(6);
      expect(lesson.steps).toHaveLength(3);
      expect(
        lesson.questions
          .slice(0, 6)
          .map((q) => (q.rule.kind === 'choice' ? q.rule.value : '')),
      ).toEqual(expected[index]);
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
  });
  it('keeps complete original reading material with each task, and uses different contexts for same-skill review', () => {
    const reading = chineseTransitions[2]!;
    for (const question of reading.questions) {
      expect(question.material).toContain('小禾');
      expect(question.material).toContain('为了不让书沾湿');
      expect(question.material).toContain('先用布擦干桌子，再把书放到桌上');
    }
    for (const question of reading.reviewQuestions!)
      expect(question.material).toContain('小宁');
    for (const lesson of chineseTransitions)
      for (const question of lesson.reviewQuestions!) {
        const original = lesson.questions.find(
          (q) => q.knowledge === question.knowledge,
        )!;
        expect(original).toBeDefined();
        expect([question.prompt, question.material, question.rule]).not.toEqual(
          [original.prompt, original.material, original.rule],
        );
      }
  });
  it('retains first failure, optional human confirmation and all source material through backup and same-skill new review', () => {
    const now = '2026-09-30T00:00:00.000Z';
    for (const book of chineseBooks)
      for (const lesson of chineseTransitions) {
        const session = createSession(lesson, book.id, 'child', {
          mode: 'transition',
          seed: 12,
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
        expect(statistics(session).manual).toBe(1);
        expect(statistics(session).firstCorrect).toBe(0);
        expect(newReviewQuestions(lesson, session, [session])).toHaveLength(6);
        expect(
          parseBackup(
            exportBackup({
              schemaVersion: 1,
              activeProfileId: 'child',
              profiles: [{ id: 'child', nickname: '衔接', createdAt: now }],
              sessions: [session],
            }),
          ).data.sessions[0],
        ).toEqual(session);
      }
  });
});
