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
import { oralOrganizeLesson as lesson } from './math-oral-organize';

const book = () => required(mathBooks.find((b) => b.volume === 'lower'));
const q = (n: number) =>
  required(lesson.questions.find((q) => q.id === `ml-oral-organize-q${n}`));
const review = (n: number) => required(lesson.reviewQuestions?.[n - 1]);

describe('oral organization, complete matches and bounded open answers', () => {
  it('checks all main and changed review answers, independent arrows and complete matching', () => {
    const answers = [
      ['46+8=54'],
      [59, 43, 33],
      ['62−7=55'],
      [44, 67, 43],
      [3, 7, 7, 6],
      [67, 53, 84, 66, 69, 63, 52, 52],
      ['44+23', '59+8', '74−7', '37+30'],
      ['>', '<', '='],
      [33, 68, 45, 29, 52, 73],
      [72, 32, 35, 27, 64, 41, 75, 68],
      35,
      31,
      ['47+5', '82−30', '60−8', '52+0'],
      12,
      [16, 39],
      [62, 48, 54],
      ['A和C', 'B和C'],
      [0, 6, 18],
      [0, 0],
      [
        '同单位的几个一与几个十分别加减',
        '个位满十可换成1个十',
        '个位不够减可拆1个十',
        '每满一组可重复减同样数量',
      ],
    ];
    answers.forEach((a, i) => expect(evaluate(q(i + 1).rule, a)).toBe(true));
    [
      [4, 8, 5, 7],
      [27, 69, 45, 37, 63, 82],
      [42, 31, 94],
      ['X和Z', 'Y和Z'],
    ].forEach((a, i) => expect(evaluate(review(i + 1).rule, a)).toBe(true));
    expect(
      evaluate(
        q(5).rule,
        [24 + 8, 63 + 7, 45 + 32, 8 + 56].map((n) => Math.floor(n / 10)),
      ),
    ).toBe(true);
    expect(
      evaluate(q(6).rule, [
        44 + 23,
        84 - 31,
        76 + 8,
        71 - 5,
        62 + 7,
        83 - 20,
        5 + 47,
        60 - 8,
      ]),
    ).toBe(true);
    expect(
      evaluate(q(9).rule, [5 + 28, 40 + 28, 17 + 28, 36 - 7, 59 - 7, 80 - 7]),
    ).toBe(true);
    expect(
      evaluate(q(10).rule, [
        32 + 40,
        72 - 40,
        27 + 8,
        35 - 8,
        41 + 23,
        64 - 23,
        68 + 7,
        75 - 7,
      ]),
    ).toBe(true);
    for (const [index, target] of [
      [7, 67],
      [13, 52],
    ] as const) {
      const values = required(q(index).choices)
        .filter((c) => {
          const [a, operator, b] = required(
            c.id.match(/^(\d+)([+−])(\d+)$/),
          ).slice(1);
          return (
            (operator === '+'
              ? Number(a) + Number(b)
              : Number(a) - Number(b)) === target
          );
        })
        .map((c) => c.id);
      expect(evaluate(q(index).rule, values)).toBe(true);
      expect(evaluate(q(index).rule, values.slice(1))).toBe(false);
    }
    for (const index of [1, 3]) {
      const correct = required(q(index).choices)
        .filter((c) => {
          const [a, operator, b, result] = required(
            c.id.match(/^(\d+)([+−])(\d+)=(\d+)$/),
          ).slice(1);
          return (
            (operator === '+'
              ? Number(a) + Number(b)
              : Number(a) - Number(b)) === Number(result)
          );
        })
        .map((c) => c.id);
      expect(evaluate(q(index).rule, correct)).toBe(true);
    }
  });
  it('accepts every independently enumerated open integer and rejects strict boundaries and out-of-range results', () => {
    for (const [question, addends, subtract, limit, add, minimum] of [
      [q(18), [14, 28], 6, 27, 8, 25],
      [review(3), [17, 26], 7, 25, 6, 23],
    ] as const) {
      const legal = [[], [], []] as number[][];
      for (let n = 0; n <= 99; n++) {
        if (required(addends[0]) + required(addends[1]) > n)
          required(legal[0]).push(n);
        if (n - subtract >= 0 && n - subtract < limit)
          required(legal[1]).push(n);
        if (n + add > minimum && n + add <= 100) required(legal[2]).push(n);
      }
      expect(question.rule.kind).toBe('number-picks');
      if (question.rule.kind !== 'number-picks') throw new Error('wrong rule');
      expect(question.rule.fields).toEqual(legal);
      const base = legal.map((values) => required(values[0]));
      for (let field = 0; field < 3; field++) {
        for (let n = -1; n <= 100; n++) {
          const answer = [...base];
          answer[field] = n;
          expect(evaluate(question.rule, answer)).toBe(
            required(legal[field]).includes(n),
          );
        }
      }
      expect(evaluate(question.rule, [20, 20, 20])).toBe(true);
      expect(
        evaluate(
          question.rule,
          legal.map((values) => required(values.at(-1))),
        ),
      ).toBe(true);
      expect(
        evaluate(question.rule, [0, subtract - 1, minimum - add + 1]),
      ).toBe(false);
      expect(() => evaluate(question.rule, [0, null, 100 - add])).toThrow(
        'educationLearning.answerRequired',
      );
    }
    expect(evaluate(q(5).rule, [32, 70, 77, 64])).toBe(false);
    expect(evaluate(q(8).rule, ['>', '<', '>'])).toBe(false);
    expect(evaluate(q(9).rule, [33, 61, 89, 29, 22, 15])).toBe(false);
    expect(evaluate(q(15).rule, [6, 9])).toBe(false);
    expect(evaluate(q(19).rule, [1, 1])).toBe(false);
    expect(() => evaluate(q(19).rule, [null, 0])).toThrow(
      'educationLearning.answerRequired',
    );
  });
  it('enumerates every whole-group pair once and includes exactly-full capacity', () => {
    for (const [question, names, sizes, capacity] of [
      [q(17), ['A', 'B', 'C'], [28, 34, 20], 54],
      [review(4), ['X', 'Y', 'Z'], [25, 29, 23], 52],
    ] as const) {
      const feasible: string[] = [];
      const totals: number[] = [];
      for (let i = 0; i < 3; i++)
        for (let j = i + 1; j < 3; j++) {
          const total = required(sizes[i]) + required(sizes[j]);
          totals.push(total);
          if (total <= capacity)
            feasible.push(`${required(names[i])}和${required(names[j])}`);
        }
      expect(totals).toContain(capacity);
      expect(evaluate(question.rule, feasible)).toBe(true);
      expect(evaluate(question.rule, feasible.slice(0, 1))).toBe(false);
      expect(
        evaluate(
          question.rule,
          required(question.choices).map((c) => c.id),
        ),
      ).toBe(false);
      if (question.id === q(17).id)
        expect(evaluate(q(16).rule, totals)).toBe(true);
    }
  });
  it('preserves old v1 snapshots, partial open/zero drafts and unscored actual tasks through strict backup', () => {
    const state = initialLibrary('整理核验');
    const original = required(
      book()
        .units.flatMap((u) => u.lessons)
        .find((l) => l.id === 'ml-oral-add'),
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
    const open = s.questions.findIndex((q) => q.id === 'ml-oral-organize-q18');
    const zero = s.questions.findIndex((q) => q.id === 'ml-oral-organize-q19');
    required(s.responses[open]).draft = [0, null, 92];
    required(s.responses[zero]).draft = [null, 0];
    for (const [i, question] of s.questions.entries()) {
      if (
        question.rule.kind !== 'manual' &&
        question.rule.kind !== 'reflection'
      )
        continue;
      required(s.responses[i]).draft =
        question.rule.kind === 'manual'
          ? 'confirmed'
          : '真实整理未做，疑问与未来计划另记。';
      s.responses[i] = submitResponse(question, required(s.responses[i]));
      expect(s.responses[i]?.submissions[0]?.correct).toBeNull();
    }
    state.sessions.push(s);
    expect(statistics(s).accuracy).toBeNull();
    expect(s.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(8);
    expect(
      s.questions.filter((q) => q.rule.kind === 'reflection'),
    ).toHaveLength(3);
    expect(parseBackup(exportBackup(state)).data).toEqual(state);
    expect(JSON.stringify(state.sessions[0])).toBe(before);
    const malformed = structuredClone(state);
    const question = required(required(malformed.sessions[1]).questions[open]);
    if (question.rule.kind !== 'number-picks') throw new Error('wrong rule');
    question.rule.fields[0] = [0, 0];
    expect(() => exportBackup(malformed)).toThrow(
      'educationLearning.invalidRecord',
    );
    expect(() =>
      parseBackup(
        JSON.stringify({
          format: 'butler-grade-one',
          exportedAt: new Date().toISOString(),
          data: malformed,
        }),
      ),
    ).toThrow('educationLearning.invalidBackup');
  });
  it('registers the lesson and issues fresh variants after a real specialty error without repeating exhausted questions', () => {
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
    const index = s.questions.findIndex((q) => q.id === 'ml-oral-organize-q19');
    required(s.responses[index]).draft = [1, 1];
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
