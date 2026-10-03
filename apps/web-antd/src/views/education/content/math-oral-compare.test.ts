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
import { oralCompareLesson as lesson } from './math-oral-compare';

const book = () => required(mathBooks.find((b) => b.volume === 'lower'));
const q = (n: number) =>
  required(lesson.questions.find((q) => q.id === `ml-oral-compare-q${n}`));
describe('oral unit quantities, independent contexts and actual prediction', () => {
  it('checks every main method and changed review with independently computed arithmetic', () => {
    const answers = [
      [27, 44],
      [5, 60, 65],
      [2, 40, 42],
      [48, 93, 19, 46],
      [81, 36, 94, 67],
      [13, 40, 53],
      [4, 3, 43],
      [2, 5, 35],
      [6, 7, 13, 30, 13, 43],
      [14, 8, 6, 40, 6, 46],
      [60, 10, 1, 61],
      [7, 1, 5, 1],
      [
        '先6+7=13，再30+13',
        '先取十的数量30，再加6+7所得13',
        '先加4到40，再加3',
      ],
      [38, 24],
      [58, 27],
      [2, 0],
    ];
    answers.forEach((a, i) => expect(evaluate(q(i + 1).rule, a)).toBe(true));
    [
      [7, 70, 77],
      [3, 40, 43],
      [8, 1, 4, 1],
      [13, 9, 4, 50, 4, 54],
    ].forEach((a, i) =>
      expect(evaluate(required(lesson.reviewQuestions?.[i]).rule, a)).toBe(
        true,
      ),
    );
    expect(evaluate(q(2).rule, [2 + 3, 40 + 20, 42 + 23])).toBe(true);
    expect(evaluate(q(3).rule, [6 - 4, 70 - 30, 76 - 34])).toBe(true);
    expect(
      evaluate(
        q(12).rule,
        [83 - 7, 83 - 70, 60 - 5, 60 - 50].map((n) => Math.floor(n / 10)),
      ),
    ).toBe(true);
    expect(
      evaluate(
        required(lesson.reviewQuestions?.[2]).rule,
        [94 - 8, 94 - 80, 50 - 6, 50 - 40].map((n) => Math.floor(n / 10)),
      ),
    ).toBe(true);
    expect(evaluate(q(16).rule, [92 - 90, Math.floor((92 - 90) / 10)])).toBe(
      true,
    );
  });
  it('rejects digit/quantity mixing, reusing a part, sequential independent stories and premature tens', () => {
    expect(evaluate(q(1).rule, [27, 47])).toBe(false);
    expect(evaluate(q(2).rule, [5, 6, 65])).toBe(false);
    expect(evaluate(q(3).rule, [2, 4, 42])).toBe(false);
    expect(evaluate(q(4).rule, [48, 98, 19, 49])).toBe(false);
    expect(evaluate(q(6).rule, [13, 4, 93])).toBe(false);
    expect(evaluate(q(7).rule, [4, 7, 47])).toBe(false);
    expect(evaluate(q(8).rule, [2, 7, 33])).toBe(false);
    expect(evaluate(q(10).rule, [14, 8, 6, 50, 6, 56])).toBe(false);
    expect(evaluate(q(11).rule, [70, 10, 1, 71])).toBe(false);
    expect(evaluate(q(12).rule, [7, 8, 5, 6])).toBe(false);
    expect(evaluate(q(14).rule, [38, 18])).toBe(false);
    expect(evaluate(q(15).rule, [14, 8])).toBe(false);
    expect(
      evaluate(q(13).rule, [
        '先6+7=13，再30+13',
        '先取十的数量30，再加6+7所得13',
        '先加4到40，再加3',
        '先36+7，再把7加一次',
      ]),
    ).toBe(false);
    expect(() => evaluate(q(16).rule, [2, null])).toThrow(
      'educationLearning.answerRequired',
    );
  });
  it('keeps the old v1 snapshot, real zero and partial method draft, and does not score actual chronology or reflection', () => {
    const state = initialLibrary('方法比较核验');
    const original = required(
      book()
        .units.flatMap((u) => u.lessons)
        .find((l) => l.id === 'ml-oral-sub'),
    );
    const old = createSession(
      { ...original, version: 1, questions: original.questions.slice(0, 6) },
      book().id,
      state.activeProfileId,
      { seed: 1 },
    );
    state.sessions.push(old);
    const before = JSON.stringify(old);
    const s = createSession(lesson, book().id, state.activeProfileId, {
      seed: 2,
    });
    const index = s.questions.findIndex((q) => q.id === 'ml-oral-compare-q16');
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
          : '实际先判后算尚未做，记录疑问与计划。';
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
    const realPrediction = required(
      lesson.questions.find((q) => q.id === 'ml-oral-compare-m5'),
    );
    expect(realPrediction.rule).toEqual({ kind: 'manual' });
  });
  it('registers the entire course and selects fresh variants only after its actual specialty mistake', () => {
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
    const index = s.questions.findIndex((q) => q.id === 'ml-oral-compare-q12');
    required(s.responses[index]).draft = [7, 8, 5, 6];
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
