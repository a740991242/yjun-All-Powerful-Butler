import type { Answer } from '../learning/types';

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
import { borrowPracticeLessons } from './math-borrow-practice';
const find = (index: number, suffix: string) =>
  required(
    required(borrowPracticeLessons[index]).questions.find((q) =>
      q.id.endsWith(`-${suffix}`),
    ),
  );
describe('pep lower borrowing method, relations and complete table', () => {
  it('checks independently derived intermediate values and all three valid methods', () => {
    const answers: Answer[] = [
      [6, 3, 10, 7],
      [10, 6, 1, 7],
      [7, 7],
      [10, 2, 2, 4],
      [6, 6, 7],
      [1, 3, 10, 7],
      [10, 2, 7, 9],
      '不需要',
      [1, 0, 1],
      ['A：17−7=10，再10−1=9', 'B：10−8=2，再7+2=9', 'C：8+9=17，所以17−8=9'],
    ];
    answers.forEach((answer, i) =>
      expect(evaluate(find(0, `q${i + 1}`).rule, answer)).toBe(true),
    );
    expect(evaluate(find(0, 'q1').rule, [10, 6, 1, 7])).toBe(false);
    expect(evaluate(find(0, 'q2').rule, [6, 3, 10, 7])).toBe(false);
    expect(evaluate(find(0, 'q4').rule, [10, 2, 3, 4])).toBe(false);
    expect(evaluate(find(0, 'q5').rule, [6, 6, 0])).toBe(false);
    expect(() => evaluate(find(0, 'q9').rule, [1, null, 1])).toThrow(
      'educationLearning.answerRequired',
    );
    expect(evaluate(find(0, 'q8').rule, '需要')).toBe(false);
    expect(evaluate(find(0, 'q10').rule, ['A：17−7=10，再10−1=9'])).toBe(false);
    const reviews = required(borrowPracticeLessons[0]?.reviewQuestions);
    const reviewAnswers: Answer[] = [
      [4, 4, 10, 6],
      [10, 7, 1, 8],
      [8, 8],
      '不需要',
    ];
    reviews.forEach((q, i) =>
      expect(evaluate(q.rule, required(reviewAnswers[i]))).toBe(true),
    );
    expect(evaluate(required(reviews[0]).rule, [6, 3, 10, 7])).toBe(false);
  });
  it('ignores irrelevant units, distinguishes the original whole and includes self and gaps', () => {
    const answers: Answer[] = [
      6,
      9,
      '整体与部分',
      6,
      9,
      6,
      [7, 10],
      [5, 6, 7],
      8,
      [1, 8],
      8,
      13,
    ];
    answers.forEach((answer, i) =>
      expect(evaluate(find(1, `q${i + 1}`).rule, answer)).toBe(true),
    );
    const wrongCases: [string, Answer][] = [
      ['q1', 3],
      ['q2', 14],
      ['q9', 3],
      ['q10', [1, 9]],
      ['q11', 9],
      ['q12', 1],
      ['q7', [7, 1]],
      ['q8', [5, 6, 9]],
    ];
    for (const [suffix, wrong] of wrongCases)
      expect(evaluate(find(1, suffix).rule, wrong)).toBe(false);
    const reviews = required(borrowPracticeLessons[1]?.reviewQuestions);
    const reviewAnswers: Answer[] = [8, 13, [5, 6, 9], [1, 8]];
    reviews.forEach((q, i) =>
      expect(evaluate(q.rule, required(reviewAnswers[i]))).toBe(true),
    );
    expect(evaluate(required(reviews[2]).rule, [5, 6, 7])).toBe(false);
  });
  it('accepts every valid same-difference option and preserves zero at each step', () => {
    const answers: Answer[] = [
      [1, 9, 8, 9],
      45,
      [1, 5, 9],
      [3, 9],
      '增加1',
      [8, 9, 10],
      ['13−6', '15−8', '16−9'],
      [13, 2],
      ['7−2', '8−3', '12−7', '13−8'],
      [6, 11],
      [7, 0],
      ['原17张送9张剩8张', '同一时刻总17张红9张蓝8张', '红9张蓝8张，合计17张'],
      ['11−3', '12−4', '13−5'],
    ];
    answers.forEach((answer, i) =>
      expect(evaluate(find(2, `q${i + 1}`).rule, answer)).toBe(true),
    );
    expect(evaluate(find(2, 'q2').rule, 36)).toBe(false);
    expect(evaluate(find(2, 'q9').rule, ['7−2', '8−3', '12−7'])).toBe(false);
    expect(
      evaluate(find(2, 'q9').rule, ['7−2', '8−3', '12−7', '13−8', '13−7']),
    ).toBe(false);
    expect(evaluate(find(2, 'q10').rule, [5, 11])).toBe(false);
    expect(() => evaluate(find(2, 'q11').rule, [7, null])).toThrow(
      'educationLearning.answerRequired',
    );
    const reviews = required(borrowPracticeLessons[2]?.reviewQuestions);
    const reviewAnswers: Answer[] = [
      [5, 4, 6],
      ['11−5', '13−7', '15−9'],
      [8, 0],
      ['9−4', '11−6', '6−1', '14−9'],
    ];
    reviews.forEach((q, i) =>
      expect(evaluate(q.rule, required(reviewAnswers[i]))).toBe(true),
    );
    expect(
      evaluate(required(reviews[3]).rule, ['9−4', '14−6', '11−6', '6−1']),
    ).toBe(false);
  });
  it('keeps original v1 snapshots and incomplete drafts intact in strict backups, separate from manual and reflection', () => {
    const book = required(mathBooks.find((b) => b.volume === 'lower'));
    const lessons = required(book.units.find((u) => u.id === 'u2')).lessons;
    expect(lessons.slice(0, 3).map((l) => l.id)).toEqual([
      'ml-borrow-nine',
      'ml-borrow-eight',
      'ml-borrow-small',
    ]);
    expect(lessons.slice(3)).toEqual(borrowPracticeLessons);
    const state = initialLibrary('退位减法核验');
    for (const old of lessons.slice(0, 3)) {
      const s = createSession(old, book.id, state.activeProfileId);
      expect(s.lessonVersion).toBe(1);
      expect(s.questions).toHaveLength(6);
      state.sessions.push(s);
    }
    const original = JSON.stringify(state.sessions);
    borrowPracticeLessons.forEach((l, index) => {
      expect(l.questions).toHaveLength(required([18, 18, 20][index]));
      const s = createSession(l, book.id, state.activeProfileId);
      const qIndex = s.questions.findIndex((q) => q.rule.kind === 'steps');
      s.responses[qIndex]!.draft = [null];
      for (const [i, q] of s.questions.entries())
        if (q.rule.kind === 'manual' || q.rule.kind === 'reflection') {
          s.responses[i]!.draft =
            q.rule.kind === 'manual'
              ? 'confirmed'
              : '自动化验证说明，真实材料未做。';
          s.responses[i] = submitResponse(q, required(s.responses[i]));
          expect(s.responses[i]?.submissions[0]?.correct).toBeNull();
        }
      expect(statistics(s).accuracy).toBeNull();
      expect(statistics(s).reflections).toBe(2);
      state.sessions.push(s);
    });
    expect(parseBackup(exportBackup(state)).data).toEqual(state);
    expect(JSON.stringify(state.sessions.slice(0, 3))).toBe(original);
    for (const [id, version] of [
      ['ms-lower-borrowing', 2],
      ['ms-lower-relations', 4],
    ] as const)
      expect(book.specialties?.find((l) => l.id === id)?.version).toBe(version);
    expect(
      book.specialties?.find((l) => l.id === 'ms-lower-borrowing')?.questions,
    ).toContainEqual(find(2, 'q11'));
    expect(
      book.specialties?.find((l) => l.id === 'ms-lower-relations')?.questions,
    ).toContainEqual(find(1, 'q10'));
  });
  it('selects only unseen relation variants for a real missed relation in the combined specialty', () => {
    const book = required(mathBooks.find((b) => b.volume === 'lower'));
    const pool = required(
      book.specialties?.find((l) => l.id === 'ms-lower-relations'),
    );
    const session = createSession(pool, book.id, 'child');
    session.phase = 'practice';
    const i = session.questions.findIndex(
      (q) => q.id === 'ml-borrow-relations-q10',
    );
    session.responses[i]!.draft = [1, 9];
    session.responses[i] = submitResponse(
      required(session.questions[i]),
      required(session.responses[i]),
    );
    expect(session.responses[i]?.submissions[0]?.correct).toBe(false);
    const fresh = newReviewQuestions(pool, session, [session]);
    expect(fresh.map((q) => q.id)).toEqual([
      'ml-borrow-relations-r1',
      'ml-borrow-relations-r2',
      'ml-borrow-relations-r3',
      'ml-borrow-relations-r4',
    ]);
    const attempt = createSession(pool, book.id, 'child', {
      mode: 'review',
      originalSessionId: session.id,
      questions: fresh,
    });
    expect(newReviewQuestions(pool, session, [session, attempt])).toEqual([]);
  });
});
