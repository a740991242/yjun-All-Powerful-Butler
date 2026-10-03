import { describe, expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
} from '../learning/engine';
import { required } from '../learning/required';
import { newReviewQuestions } from '../learning/review';
import { initialLibrary } from '../learning/storage';
import { mathBooks } from './math';
import { lowerFinalApplicationsLesson as lesson } from './math-lower-final-applications';
const book = () => required(mathBooks.find((b) => b.volume === 'lower'));
const q = (n: number) =>
  required(
    lesson.questions.find((q) => q.id === `ml-final-applications-q${n}`),
  );
const pairs = (prices: number[], predicate: (sum: number) => boolean) => {
  const result: string[] = [];
  for (let i = 0; i < prices.length; i++)
    for (let j = i + 1; j < prices.length; j++) {
      const a = required(prices[i]);
      const b = required(prices[j]);
      if (predicate(a + b)) result.push(`${a}+${b}`);
    }
  return result;
};
const boxes = (count: number) => {
  let full = 0;
  let remaining = count;
  while (remaining >= 8) {
    remaining -= 8;
    full++;
  }
  return [full, remaining, full + Number(remaining > 0)];
};
describe('lower final life applications and complete pair enumeration', () => {
  it('independently checks all objective values, threshold equality, chronological quantities and reviews', () => {
    const answers = [
      [32 - 21, 32],
      [36 - 7, 7 + 29, 36 - 29],
      [29 + 18, 29 + 29 + 18],
      [26 + 24, 10, 26 + 24 - 10],
      [29 + 36, 10, 29 + 36 - 10],
      '49元',
      pairs([29, 24, 26, 36, 15], (sum) => sum >= 50),
      boxes(30),
      boxes(32),
      boxes(21),
      boxes(7),
      [22, 24, 26, 45, 40, 35],
      [9 + 6, 20 - 8, 70 - 30],
      pairs([24, 26, 16, 14, 32, 18, 8], (sum) => sum === 42),
      pairs([24, 26, 16, 14, 32, 18, 8], (sum) => sum === 50),
      '29+18',
      [31, 50 - 31, 50],
      ['原总价50元也达标', '原总价100元仍只减10元', '原总价49元不减'],
    ];
    answers.forEach((a, i) => expect(evaluate(q(i + 1).rule, a)).toBe(true));
    expect(required(q(7).choices)).toHaveLength(10);
    expect(required(q(14).choices)).toHaveLength(21);
    expect(required(q(15).choices)).toHaveLength(21);
    for (const count of [30, 32, 21, 7]) {
      const [full, rem, total] = boxes(count);
      expect(required(full) * 8 + required(rem)).toBe(count);
      expect(required(rem)).toBeLessThan(8);
      expect(required(total) * 8).toBeGreaterThanOrEqual(count);
      expect((required(total) - 1) * 8).toBeLessThan(count);
    }
    [
      [27 + 16, 27 + 27 + 16],
      [23 + 27, 10, 23 + 27 - 10],
      boxes(24),
      pairs([21, 19, 28, 12, 7], (sum) => sum === 40),
    ].forEach((a, i) =>
      expect(evaluate(required(lesson.reviewQuestions?.[i]).rule, a)).toBe(
        true,
      ),
    );
  });
  it('rejects keyword subtraction, excluded equality, extra empty container, incomplete or excessive pairs and missing zero', () => {
    expect(evaluate(q(3).rule, [11, 40])).toBe(false);
    expect(evaluate(q(4).rule, [50, 0, 50])).toBe(false);
    expect(evaluate(q(5).rule, [65, 20, 45])).toBe(false);
    expect(evaluate(q(6).rule, '39元')).toBe(false);
    expect(evaluate(q(9).rule, [4, 0, 5])).toBe(false);
    expect(evaluate(q(8).rule, [4, 6, 4])).toBe(false);
    expect(evaluate(q(11).rule, [1, 7, 1])).toBe(false);
    expect(() => evaluate(q(11).rule, [null, 7, 1])).toThrow(
      'educationLearning.answerRequired',
    );
    expect(evaluate(q(14).rule, ['24+18'])).toBe(false);
    expect(evaluate(q(15).rule, ['24+26', '32+18', '26+32'])).toBe(false);
    expect(evaluate(q(16).rule, '29−18')).toBe(false);
    for (const n of [7, 14, 15]) {
      const question = q(n);
      for (const choice of required(question.choices)) {
        expect(evaluate(question.rule, [choice.id])).toBe(false);
      }
      expect(
        evaluate(
          question.rule,
          required(question.choices).map((c) => c.id),
        ),
      ).toBe(false);
    }
  });
  it('preserves old final story and partial zero backups while separating real activity and open reflections', () => {
    const state = initialLibrary('应用核验');
    const oldLesson = required(
      book()
        .units.flatMap((u) => u.lessons)
        .find((l) => l.id === 'ml-review-story'),
    );
    const old = createSession(oldLesson, book().id, state.activeProfileId, {
      seed: 1,
    });
    state.sessions.push(old);
    const before = JSON.stringify(old);
    const s = createSession(lesson, book().id, state.activeProfileId, {
      seed: 2,
    });
    const index = s.questions.findIndex(
      (q) => q.id === 'ml-final-applications-q11',
    );
    required(s.responses[index]).draft = [0, null, 1];
    for (const [i, question] of s.questions.entries()) {
      if (
        question.rule.kind !== 'manual' &&
        question.rule.kind !== 'reflection'
      )
        continue;
      required(s.responses[i]).draft =
        question.rule.kind === 'manual' ? 'confirmed' : '纸卡未做，计划另列。';
      s.responses[i] = submitResponse(question, required(s.responses[i]));
      expect(s.responses[i]?.submissions[0]?.correct).toBeNull();
    }
    expect(statistics(s).accuracy).toBeNull();
    expect(s.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(6);
    expect(
      s.questions.filter((q) => q.rule.kind === 'reflection'),
    ).toHaveLength(2);
    state.sessions.push(s);
    expect(parseBackup(exportBackup(state)).data).toEqual(state);
    expect(JSON.stringify(state.sessions[0])).toBe(before);
  });
  it('registers this exact course and offers four fresh questions after a real relation-specialty mistake', () => {
    expect(
      book()
        .units.flatMap((u) => u.lessons)
        .some((l) => l.id === lesson.id),
    ).toBe(true);
    const pool = required(
      book().specialties?.find((l) => l.id === 'ms-lower-relations'),
    );
    expect(pool.version).toBe(4);
    const s = createSession(pool, book().id, 'child', { seed: 5 });
    const index = s.questions.findIndex(
      (q) => q.id === 'ml-final-applications-q8',
    );
    required(s.responses[index]).draft = [4, 6, 4];
    s.responses[index] = submitResponse(
      required(s.questions[index]),
      required(s.responses[index]),
    );
    const fresh = newReviewQuestions(pool, s, [s]);
    expect(fresh.map((q) => q.id)).toEqual(
      required(lesson.reviewQuestions).map((q) => q.id),
    );
    const r = createSession(pool, book().id, 'child', {
      mode: 'review',
      originalSessionId: s.id,
      questions: fresh,
    });
    expect(newReviewQuestions(pool, s, [s, r])).toEqual([]);
  });
});
