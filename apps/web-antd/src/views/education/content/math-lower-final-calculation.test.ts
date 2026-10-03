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
import { lowerFinalCalculationLesson as lesson } from './math-lower-final-calculation';
const book = () => required(mathBooks.find((b) => b.volume === 'lower'));
const q = (n: number) =>
  required(lesson.questions.find((q) => q.id === `ml-final-calculation-q${n}`));
describe('lower semester complete calculation and chronological quantities', () => {
  it('independently computes all twelve expressions, two chains, six intermediate/final pairs and changed reviews', () => {
    const answers = [
      [46 + 4, 64 - 7, 30 + 38, 94 - 60],
      [76 + 17, 53 + 29, 38 + 57, 62 + 31],
      [51 - 28, 72 - 36, 84 - 54, 80 - 26],
      [12, 49, 44, 15],
      [73, 65, 49, 74],
      [8 + 8, 8 + 8 - 7],
      [6 + 45, 6 + 45 - 8],
      [46 + 9, 46 + 9 - 7],
      [76 - 23, 76 - 23 + 38],
      [54 + 35, 54 + 35 - 20],
      [80 - 48, 80 - 48 - 32],
      '=',
      '>',
      '>',
      '<',
      '<',
      '<',
      [
        '个位6+7=13，再60+13=73',
        '先46+20=66，再66+7=73',
        '先46+4=50，再50+23=73',
      ],
      [1, 12, 6, 6, 3, 36],
      [13, 1, 7, 3, 73],
    ];
    answers.forEach((a, i) => expect(evaluate(q(i + 1).rule, a)).toBe(true));
    [
      [37 + 5, 82 - 7, 48 + 26, 70 - 34],
      [15, 53, 47, 19],
      [82 - 52, 82 - 52 - 30],
      '=',
    ].forEach((a, i) =>
      expect(evaluate(required(lesson.reviewQuestions?.[i]).rule, a)).toBe(
        true,
      ),
    );
    for (const [question, start, changes] of [
      [q(4), 30, [-18, 37, -5, -29]],
      [q(5), 46, [27, -8, -16, 25]],
      [required(lesson.reviewQuestions?.[1]), 32, [-17, 38, -6, -28]],
    ] as const) {
      let current: number = start;
      const values = changes.map((change) => {
        current += change;
        expect(current).toBeGreaterThanOrEqual(0);
        expect(current).toBeLessThanOrEqual(100);
        return current;
      });
      expect(evaluate(question.rule, values)).toBe(true);
    }
    const left = [58 - 6, 45 + 20, 84, 76 - 40, 67 - 50, 78];
    const right = [52, 37, 72 + 8, 65, 29, 71 + 8];
    left.forEach((a, i) => {
      const b = required(right[i]);
      let sign = '=';
      if (a > b) sign = '>';
      else if (a < b) sign = '<';
      expect(evaluate(q(12 + i).rule, sign)).toBe(true);
    });
    expect(
      evaluate(q(19).rule, [
        1,
        (72 % 10) + 10,
        (72 % 10) + 10 - (36 % 10),
        Math.floor(72 / 10) - 1,
        Math.floor(72 / 10) - 1 - Math.floor(36 / 10),
        72 - 36,
      ]),
    ).toBe(true);
    expect(
      evaluate(q(20).rule, [
        (46 % 10) + (27 % 10),
        1,
        Math.floor((46 + 27) / 10),
        (46 + 27) % 10,
        46 + 27,
      ]),
    ).toBe(true);
  });
  it('rejects correct final values with wrong intermediate values, resetting a chain, missing zero or wrong units', () => {
    expect(evaluate(q(4).rule, [12, 67, 25, 1])).toBe(false);
    expect(evaluate(q(5).rule, [73, 38, 30, 71])).toBe(false);
    expect(evaluate(q(6).rule, [1, 9])).toBe(false);
    expect(evaluate(q(9).rule, [23, 91])).toBe(false);
    expect(evaluate(q(11).rule, [48, 0])).toBe(false);
    expect(() => evaluate(q(11).rule, [32, null])).toThrow(
      'educationLearning.answerRequired',
    );
    expect(() => evaluate(q(4).rule, [15])).toThrow(
      'educationLearning.answerRequired',
    );
    expect(evaluate(q(12).rule, '>')).toBe(false);
    expect(evaluate(q(19).rule, [1, 12, 6, 7, 3, 36])).toBe(false);
    expect(evaluate(q(19).rule, [10, 12, 6, 6, 3, 36])).toBe(false);
    expect(evaluate(q(20).rule, [13, 1, 6, 3, 73])).toBe(false);
    expect(evaluate(q(18).rule, ['个位6+7=13，再60+13=73'])).toBe(false);
    expect(
      evaluate(
        q(18).rule,
        required(q(18).choices).map((c) => c.id),
      ),
    ).toBe(false);
  });
  it('retains old six-result final snapshots and partial zero drafts while separating actual activity and reflection', () => {
    const state = initialLibrary('期末计算核验');
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
    const index = s.questions.findIndex(
      (q) => q.id === 'ml-final-calculation-q11',
    );
    required(s.responses[index]).draft = [null, 0];
    for (const [i, question] of s.questions.entries()) {
      if (
        question.rule.kind !== 'manual' &&
        question.rule.kind !== 'reflection'
      )
        continue;
      required(s.responses[i]).draft =
        question.rule.kind === 'manual'
          ? 'confirmed'
          : '实际纸笔未做，计划另列。';
      s.responses[i] = submitResponse(question, required(s.responses[i]));
      expect(s.responses[i]?.submissions[0]?.correct).toBeNull();
    }
    expect(statistics(s).accuracy).toBeNull();
    expect(s.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(5);
    expect(
      s.questions.filter((q) => q.rule.kind === 'reflection'),
    ).toHaveLength(2);
    state.sessions.push(s);
    expect(parseBackup(exportBackup(state)).data).toEqual(state);
    expect(JSON.stringify(state.sessions[0])).toBe(before);
  });
  it('registers the full calculation course and issues its four fresh variants after a real specialty mistake', () => {
    const pool = required(
      book().specialties?.find((l) => l.id === 'ms-lower-calculation'),
    );
    expect(pool.version).toBe(10);
    expect(
      book()
        .units.flatMap((u) => u.lessons)
        .some((l) => l.id === lesson.id),
    ).toBe(true);
    const s = createSession(pool, book().id, 'child', { seed: 5 });
    const index = s.questions.findIndex(
      (q) => q.id === 'ml-final-calculation-q11',
    );
    required(s.responses[index]).draft = [48, 0];
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
