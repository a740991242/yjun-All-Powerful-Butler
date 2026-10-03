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
import {
  zeroNumberPosition,
  zeroNumberRows,
} from '../learning/zero-number-chart';
import { mathBooks } from './math';
import { lowerFinalNumbersLesson as lesson } from './math-lower-final-numbers';
const book = () => required(mathBooks.find((b) => b.volume === 'lower'));
const q = (n: number) =>
  required(lesson.questions.find((q) => q.id === `ml-final-numbers-q${n}`));
describe('lower final zero-origin table and actual organization', () => {
  it('checks all eighteen objective tasks and four changed reviews against arithmetic and full table positions', () => {
    const answers = [
      [56, 5, 6],
      [24, 33, 34],
      [36, 45, 47, 56],
      [71, 72, 80, 81, 82],
      [0, 99, 100],
      [100, 1, 0, 0],
      [5, 15, 59, 95, 50],
      ['5', '15', '50', '59', '95'],
      [43, 45, 46],
      [81, 79, 78],
      [6, 7],
      [79, 81],
      '没有同一行右邻格',
      [20, 40],
      [70, 16],
      [0, 8],
      28,
      ['0～99表共有100格', '1～100表共有100格', '改变起点会改变数的行列位置'],
    ];
    answers.forEach((a, i) => expect(evaluate(q(i + 1).rule, a)).toBe(true));
    [
      [73, 7, 3],
      [48, 57, 59, 68],
      [19, 59],
      [100, 0, 99, 0],
    ].forEach((a, i) =>
      expect(evaluate(required(lesson.reviewQuestions?.[i]).rule, a)).toBe(
        true,
      ),
    );
    const rows = zeroNumberRows();
    expect(rows).toHaveLength(10);
    const cells = rows.flatMap((r, i) =>
      Array.from({ length: 10 }, (_, j) => {
        const n = required(
          Object.entries(r).find(([key]) => key === `c${j}`),
        )[1];
        expect(n).toBe(i * 10 + j);
        return n;
      }),
    );
    expect(new Set(cells).size).toBe(100);
    expect(cells[0]).toBe(0);
    expect(cells.at(-1)).toBe(99);
    for (const [row, right, task] of [
      [6, 4, q(1)],
      [8, 7, required(lesson.reviewQuestions?.[0])],
    ] as const) {
      const n = (row - 1) * 10 + (10 - right);
      expect(evaluate(task.rule, [n, Math.floor(n / 10), n % 10])).toBe(true);
      expect(zeroNumberPosition(n).row).toBe(row);
    }
    expect(evaluate(q(2).rule, [23 + 1, 23 + 10, 23 + 11])).toBe(true);
    expect(evaluate(q(3).rule, [46 - 10, 46 - 1, 46 + 1, 46 + 10])).toBe(true);
    expect(
      evaluate(q(4).rule, [62 + 9, 62 + 10, 62 + 18, 62 + 19, 62 + 20]),
    ).toBe(true);
    expect(evaluate(q(15).rule, [27 + 43, 43 - 27])).toBe(true);
    expect(evaluate(q(17).rule, 58 - 30)).toBe(true);
  });
  it('accepts all hundred row or column selections and keeps missing zero, grid counts and direction errors distinct', () => {
    for (const [question, first, last] of [
      [
        q(14),
        Array.from({ length: 10 }, (_, i) => 20 + i),
        Array.from({ length: 10 }, (_, i) => 40 + i),
      ],
      [
        q(16),
        Array.from({ length: 10 }, (_, i) => i * 10),
        Array.from({ length: 10 }, (_, i) => i * 10 + 8),
      ],
      [
        required(lesson.reviewQuestions?.[2]),
        Array.from({ length: 10 }, (_, i) => 10 + i),
        Array.from({ length: 10 }, (_, i) => 50 + i),
      ],
    ] as const) {
      for (const a of first)
        for (const b of last)
          expect(evaluate(question.rule, [a, b])).toBe(true);
      for (let a = 0; a <= 99; a++)
        expect(evaluate(question.rule, [a, required(last[0])])).toBe(
          first.includes(a),
        );
      for (let b = 0; b <= 99; b++)
        expect(evaluate(question.rule, [required(first[0]), b])).toBe(
          last.includes(b),
        );
      expect(() => evaluate(question.rule, [null, required(last[0])])).toThrow(
        'educationLearning.answerRequired',
      );
    }
    expect(evaluate(q(1).rule, [53, 5, 3])).toBe(false);
    expect(evaluate(q(5).rule, [1, 100, 100])).toBe(false);
    expect(evaluate(q(5).rule, [0, 99, 99])).toBe(false);
    expect(evaluate(q(6).rule, [100, 1, 1, 0])).toBe(false);
    expect(() => evaluate(q(6).rule, [100, 1, null, 0])).toThrow(
      'educationLearning.answerRequired',
    );
    expect(evaluate(q(8).rule, ['5', '15', '59', '50', '95'])).toBe(false);
    expect(evaluate(q(13).rule, '有，10就是同一行右邻')).toBe(false);
    expect(evaluate(q(15).rule, [70, -16])).toBe(false);
    expect(evaluate(q(18).rule, ['0～99表共有100格'])).toBe(false);
  });
  it('retains old final snapshots, partial zero selection and unscored actual paper and reflection records', () => {
    const state = initialLibrary('期末数表核验');
    const oldLesson = required(
      book()
        .units.flatMap((u) => u.lessons)
        .find((l) => l.id === 'ml-review'),
    );
    const old = createSession(oldLesson, book().id, state.activeProfileId, {
      seed: 1,
    });
    state.sessions.push(old);
    const before = JSON.stringify(old);
    const s = createSession(lesson, book().id, state.activeProfileId, {
      seed: 2,
    });
    const index = s.questions.findIndex((q) => q.id === 'ml-final-numbers-q16');
    required(s.responses[index]).draft = [0, null];
    for (const [i, question] of s.questions.entries()) {
      if (
        question.rule.kind !== 'manual' &&
        question.rule.kind !== 'reflection'
      )
        continue;
      required(s.responses[i]).draft =
        question.rule.kind === 'manual'
          ? 'confirmed'
          : '真实纸表尚未做，计划另记。';
      s.responses[i] = submitResponse(question, required(s.responses[i]));
      expect(s.responses[i]?.submissions[0]?.correct).toBeNull();
    }
    state.sessions.push(s);
    expect(statistics(s).accuracy).toBeNull();
    expect(s.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(7);
    expect(
      s.questions.filter((q) => q.rule.kind === 'reflection'),
    ).toHaveLength(2);
    expect(parseBackup(exportBackup(state)).data).toEqual(state);
    expect(JSON.stringify(state.sessions[0])).toBe(before);
  });
  it('registers the new course and sends only fresh variants following a real number-specialty error', () => {
    const pool = required(
      book().specialties?.find((l) => l.id === 'ms-lower-numbers'),
    );
    expect(pool.version).toBe(4);
    expect(
      book()
        .units.flatMap((u) => u.lessons)
        .some((l) => l.id === lesson.id),
    ).toBe(true);
    const s = createSession(pool, book().id, 'child', { seed: 5 });
    const index = s.questions.findIndex((q) => q.id === 'ml-final-numbers-q5');
    required(s.responses[index]).draft = [0, 99, 99];
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
