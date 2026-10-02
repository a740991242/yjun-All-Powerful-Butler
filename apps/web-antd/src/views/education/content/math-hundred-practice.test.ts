import type { Answer } from '../learning/types';

import { describe, expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
} from '../learning/engine';
import { estimateDots } from '../learning/estimate-dots';
import { required } from '../learning/required';
import { initialLibrary } from '../learning/storage';
import { mathBooks } from './math';
import { hundredPracticeLessons } from './math-hundred-practice';
const find = (index: number, suffix: string) =>
  required(
    required(hundredPracticeLessons[index]).questions.find((q) =>
      q.id.endsWith(`-${suffix}`),
    ),
  );
describe('pep hundred counting, digit meaning and simple calculation', () => {
  it('checks quantity rather than estimate and separates each regrouping step and zero', () => {
    const answers: Answer[] = [
      63,
      [6, 3, 63],
      [3, 0, 30],
      [70, 71, 72],
      [70, 80, 90, 100],
      [9, 10, 10, 0],
      [1, 0, 0, 100],
      6,
      8,
      '这页的顺序编号',
    ];
    answers.forEach((answer, i) =>
      expect(evaluate(find(0, `q${i + 1}`).rule, answer)).toBe(true),
    );
    expect(estimateDots('main')).toHaveLength(63);
    expect(estimateDots('review')).toHaveLength(47);
    expect(evaluate(find(0, 'q1').rule, 60)).toBe(false);
    expect(evaluate(find(0, 'q2').rule, [6, 3, 9])).toBe(false);
    expect(evaluate(find(0, 'q6').rule, [10, 0, 10, 0])).toBe(false);
    expect(() => evaluate(find(0, 'q7').rule, [1, null, 0, 100])).toThrow(
      'educationLearning.answerRequired',
    );
    expect(evaluate(find(0, 'q8').rule, 7)).toBe(false);
    expect(evaluate(find(0, 'q9').rule, 6)).toBe(false);
    const reviewAnswers: Answer[] = [47, [8, 0, 80], [98, 99, 100], [5, 4]];
    required(hundredPracticeLessons[0]?.reviewQuestions).forEach((q, i) =>
      expect(evaluate(q.rule, required(reviewAnswers[i]))).toBe(true),
    );
  });
  it('distinguishes same digits, count and quantity and preserves both zeros in 100', () => {
    const answers: Answer[] = [
      [4, 7, 47],
      [60, 6],
      74,
      20,
      '九十',
      [1, 0, 0],
      [1, 10, 100],
      ['40', '60', '100'],
      ['40', '41', '46'],
      [50, 5],
    ];
    answers.forEach((answer, i) =>
      expect(evaluate(find(1, `q${i + 1}`).rule, answer)).toBe(true),
    );
    expect(evaluate(find(1, 'q2').rule, [6, 6])).toBe(false);
    expect(evaluate(find(1, 'q2').rule, [6, 60])).toBe(false);
    expect(() => evaluate(find(1, 'q6').rule, [1, 0, null])).toThrow(
      'educationLearning.answerRequired',
    );
    expect(evaluate(find(1, 'q8').rule, ['40', '60'])).toBe(false);
    expect(evaluate(find(1, 'q9').rule, ['40', '41', '46', '100'])).toBe(false);
    expect(evaluate(find(1, 'q10').rule, [5, 50])).toBe(false);
    const reviewAnswers: Answer[] = [[70, 7], 60, ['30', '70', '100'], [80, 8]];
    required(hundredPracticeLessons[1]?.reviewQuestions).forEach((q, i) =>
      expect(evaluate(q.rule, required(reviewAnswers[i]))).toBe(true),
    );
  });
  it('counts every legal bead placement, including one-digit results, without confusing bead count with represented value', () => {
    const answers: Answer[] = [
      [6, 60],
      [60, 60],
      [40, 20],
      [47, 47],
      [40, 7],
      [4, 13, 22, 31, 40],
      10,
      [5, 50],
      ['4', '13', '22', '31', '40'],
      [36, 28],
      6,
      ['57−50', '47−40', '7+0'],
    ];
    answers.forEach((answer, i) =>
      expect(evaluate(find(2, `q${i + 1}`).rule, answer)).toBe(true),
    );
    const possibilities = (total: number) =>
      Array.from({ length: total + 1 }, (_, tens) => 10 * tens + total - tens);
    expect(possibilities(4)).toEqual([4, 13, 22, 31, 40]);
    expect(possibilities(9)).toEqual([9, 18, 27, 36, 45, 54, 63, 72, 81, 90]);
    expect(evaluate(find(2, 'q1').rule, [6, 6])).toBe(false);
    expect(evaluate(find(2, 'q3').rule, [40, 0])).toBe(false);
    expect(evaluate(find(2, 'q6').rule, [13, 22, 31, 40, 40])).toBe(false);
    expect(evaluate(find(2, 'q7').rule, 9)).toBe(false);
    expect(evaluate(find(2, 'q9').rule, ['13', '22', '31', '40'])).toBe(false);
    expect(
      evaluate(find(2, 'q9').rule, ['4', '13', '22', '31', '40', '14']),
    ).toBe(false);
    expect(evaluate(find(2, 'q10').rule, [9, 10])).toBe(false);
    expect(evaluate(find(2, 'q11').rule, 46)).toBe(false);
    const reviewAnswers: Answer[] = [
      [8, 80],
      [60, 4],
      [3, 12, 21, 30],
      [41, 19],
    ];
    required(hundredPracticeLessons[2]?.reviewQuestions).forEach((q, i) =>
      expect(evaluate(q.rule, required(reviewAnswers[i]))).toBe(true),
    );
  });
  it('retains the four original lesson versions and snapshots, unscored estimates, zeros and manual/reflection separation through backup', () => {
    const book = required(mathBooks.find((b) => b.volume === 'lower'));
    const lessons = required(book.units.find((u) => u.id === 'u3')).lessons;
    expect(lessons.slice(0, 4).map((l) => l.id)).toEqual([
      'ml-hundred-place',
      'ml-hundred-compare',
      'ml-hundred-sequence',
      'ml-hundred-chart',
    ]);
    expect(lessons.slice(4)).toEqual(hundredPracticeLessons);
    const state = initialLibrary('百以内数核验');
    for (const [i, l] of lessons.slice(0, 4).entries()) {
      const s = createSession(l, book.id, state.activeProfileId);
      expect(s.lessonVersion).toBe(required([2, 1, 1, 1][i]));
      state.sessions.push(s);
    }
    const original = JSON.stringify(state.sessions);
    hundredPracticeLessons.forEach((l, i) => {
      expect(l.questions).toHaveLength(required([18, 17, 21, 13, 19][i]));
      const s = createSession(l, book.id, state.activeProfileId);
      for (const [j, q] of s.questions.entries())
        if (q.rule.kind === 'manual' || q.rule.kind === 'reflection') {
          s.responses[j]!.draft =
            q.rule.kind === 'manual'
              ? 'confirmed'
              : '核验记录：网页与实际活动分开。';
          s.responses[j] = submitResponse(q, required(s.responses[j]));
          expect(s.responses[j]?.submissions[0]?.correct).toBeNull();
        }
      expect(statistics(s).accuracy).toBeNull();
      if (i === 0) {
        const j = s.questions.findIndex((q) => q.id.endsWith('-q1'));
        s.tools = {
          'step-0': {
            estimateDots: {
              variant: 'hundred-main',
              estimate: 0,
              locked: true,
              counted: 63,
            },
          },
        };
        s.responses[j]!.draft = null;
        expect(s.responses[j]?.submissions).toEqual([]);
      }
      state.sessions.push(s);
    });
    expect(parseBackup(exportBackup(state)).data).toEqual(state);
    expect(JSON.stringify(state.sessions.slice(0, 4))).toBe(original);
    const pool = required(
      book.specialties?.find((l) => l.id === 'ms-lower-numbers'),
    );
    expect(pool.version).toBe(2);
    expect(pool.questions).toContainEqual(find(2, 'q6'));
  });
});
