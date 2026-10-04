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
import { relationPracticeLessons } from './math-relations-practice';

const fixtures = [
  {
    id: 'ml-relations-parts',
    total: 15,
    manual: 5,
    reflections: 2,
    answers: [
      41,
      24,
      45,
      22,
      [20, 12, 8],
      '两部分合成整体',
      ['用去的26张', '剩下的19张'],
      0,
    ],
    reviews: [45, 35, 41, [24, 15, 9]],
  },
  {
    id: 'ml-relations-comparison',
    total: 17,
    manual: 5,
    reflections: 2,
    answers: [
      [6, 6],
      43,
      25,
      34,
      34,
      0,
      ['17−11=6', '11+6=17', '17−6=11'],
      0,
      '相差数量',
      [30, 9],
    ],
    reviews: [[7, 7], 54, 38, 46],
  },
  {
    id: 'ml-relations-organize',
    total: 22,
    manual: 7,
    reflections: 3,
    answers: [
      [15, 38],
      '先求乙，再求合计',
      [47, 26],
      [48, 29],
      [32, 59],
      [32, 4],
      [14, 29],
      [24, 55],
      '不能确定',
      [0, 12],
      [28, 11],
      ['两人合计多少张', '甲比乙多多少张'],
    ],
    reviews: [
      [17, 43],
      [49, 29],
      [47, 35],
      [37, 5],
    ],
  },
];
const lower = () => required(mathBooks.find((b) => b.volume === 'lower'));
const lesson = (id: string) =>
  required(relationPracticeLessons.find((l) => l.id === id));
const question = (id: string, suffix: string) =>
  required(lesson(id).questions.find((q) => q.id === `${id}-${suffix}`));
describe('source-scoped quantity relations, dependency and real activity boundaries', () => {
  it('independently checks every known quantity, operation direction, unit and review answer', () => {
    for (const f of fixtures) {
      const l = lesson(f.id);
      expect(l.questions).toHaveLength(f.total);
      expect(l.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(
        f.manual,
      );
      expect(
        l.questions.filter((q) => q.rule.kind === 'reflection'),
      ).toHaveLength(f.reflections);
      f.answers.forEach((value, i) =>
        expect(evaluate(question(f.id, `q${i + 1}`).rule, value)).toBe(true),
      );
      f.reviews.forEach((value, i) =>
        expect(evaluate(required(l.reviewQuestions?.[i]).rule, value)).toBe(
          true,
        ),
      );
    }
  });
  it('rejects using a new comparison as the common standard, resetting a sequential remainder or mixing chairs', () => {
    const id = 'ml-relations-organize';
    expect(evaluate(question(id, 'q3').rule, [47, 38])).toBe(false);
    expect(evaluate(question(id, 'q4').rule, [48, 53])).toBe(false);
    expect(evaluate(question(id, 'q6').rule, [41, 4])).toBe(false);
    expect(evaluate(question(id, 'q1').rule, [8, 31])).toBe(false);
    expect(evaluate(question(id, 'q10').rule, [0, 12])).toBe(true);
    expect(() => evaluate(question(id, 'q10').rule, [null, 12])).toThrow(
      'educationLearning.answerRequired',
    );
    expect(evaluate(question('ml-relations-comparison', 'q4').rule, 16)).toBe(
      false,
    );
    expect(evaluate(question('ml-relations-comparison', 'q5').rule, 52)).toBe(
      false,
    );
    expect(evaluate(question('ml-relations-parts', 'q3').rule, 7)).toBe(false);
  });
  it('preserves original six-question v1 records and backs up every new visual without turning reflections into scores', () => {
    const b = lower();
    const state = initialLibrary('数量关系核验');
    const original = required(
      b.units.flatMap((u) => u.lessons).find((l) => l.id === 'ml-relations'),
    );
    expect(original.version).toBe(1);
    expect(original.questions).toHaveLength(6);
    expect(original.questions.map((q) => q.id)).toEqual(
      Array.from({ length: 6 }, (_, i) => `ml-relations-q${i + 1}`),
    );
    const old = createSession(original, b.id, state.activeProfileId, {
      seed: 4,
    });
    required(old.responses[0]).draft = 0;
    state.sessions.push(old);
    for (const f of fixtures) {
      const s = createSession(lesson(f.id), b.id, state.activeProfileId, {
        seed: 5,
      });
      for (const [i, q] of s.questions.entries()) {
        if (q.rule.kind !== 'manual' && q.rule.kind !== 'reflection') continue;
        required(s.responses[i]).draft =
          q.rule.kind === 'manual' ? 'confirmed' : '如实记录尚未做材料活动。';
        s.responses[i] = submitResponse(q, required(s.responses[i]));
        expect(s.responses[i]?.submissions[0]?.correct).toBeNull();
      }
      expect(statistics(s).accuracy).toBeNull();
      state.sessions.push(s);
    }
    expect(parseBackup(exportBackup(state)).data).toEqual(state);
  });
  it('includes only the affected new knowledge in specialty review and stops when fresh variants are used', () => {
    const b = lower();
    const pool = required(
      b.specialties?.find((l) => l.id === 'ms-lower-relations'),
    );
    expect(pool.version).toBe(5);
    for (const f of fixtures) {
      const s = createSession(pool, b.id, 'child');
      const index = s.questions.findIndex((q) => q.id === `${f.id}-q1`);
      const q = required(s.questions[index]);
      required(s.responses[index]).draft =
        q.rule.kind === 'number' ? 999 : [99, 99];
      s.responses[index] = submitResponse(q, required(s.responses[index]));
      expect(s.responses[index]?.submissions[0]?.correct).toBe(false);
      const fresh = newReviewQuestions(pool, s, [s]);
      expect(fresh.map((q) => q.id)).toEqual(
        Array.from({ length: 4 }, (_, i) => `${f.id}-review${i + 1}`),
      );
      const r = createSession(pool, b.id, 'child', {
        mode: 'review',
        originalSessionId: s.id,
        questions: fresh,
      });
      expect(newReviewQuestions(pool, s, [s, r])).toEqual([]);
    }
  });
});
