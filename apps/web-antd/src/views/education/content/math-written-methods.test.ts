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

const book = () => required(mathBooks.find((b) => b.volume === 'lower'));
const course = (id: string) =>
  required(
    book()
      .units.flatMap((u) => u.lessons)
      .find((l) => l.id === id),
  );
const fixtures = [
  {
    id: 'ml-written-add',
    results: [37, 57, 63, 73, 65, 80],
    methods: [
      [0, 7, 3],
      [0, 7, 5],
      [1, 3, 6],
      [1, 3, 7],
      [1, 5, 6],
      [1, 0, 8],
    ],
    check: [57, 19],
    alignment: ['把8对在个位', '个位15写5并向十位进1'],
    review: [
      [0, 9, 5],
      [1, 5, 6],
      [1, 6, 7],
      [1, 0, 7],
    ],
  },
  {
    id: 'ml-written-sub',
    results: [45, 34, 25, 26, 64, 36],
    methods: [
      [0, 5, 4],
      [0, 4, 3],
      [1, 5, 2],
      [1, 6, 2],
      [1, 4, 6],
      [1, 6, 3],
    ],
    check: [80, 43],
    alignment: ['80先换成7个十和10个一', '个位10−6得4，十位7−1得6'],
    review: [
      [0, 5, 4],
      [1, 5, 3],
      [1, 3, 7],
      [1, 6, 4],
    ],
  },
];
describe('written algorithms, one-digit alignment and zero boundaries', () => {
  it('checks all six methods, the zero digit, inverse checks and fresh methods independently', () => {
    for (const f of fixtures) {
      const l = course(f.id);
      expect(l.version).toBe(3);
      expect(l.questions).toHaveLength(17);
      expect(l.steps).toHaveLength(4);
      f.results.forEach((value, i) =>
        expect(
          evaluate(
            required(l.questions.find((q) => q.id === `${f.id}-q${i + 1}`))
              .rule,
            value,
          ),
        ).toBe(true),
      );
      f.methods.forEach((values, i) => {
        const q = required(
          l.questions.find((q) => q.id === `${f.id}-method${i + 1}`),
        );
        expect(evaluate(q.rule, values)).toBe(true);
        expect(
          evaluate(q.rule, [1 - required(values[0]), ...values.slice(1)]),
        ).toBe(false);
        expect(() => evaluate(q.rule, [null, ...values.slice(1)])).toThrow(
          'educationLearning.answerRequired',
        );
        // Confusing original tens with the result or dropping a written zero is incorrect.
        expect(
          evaluate(q.rule, [
            required(values[0]),
            required(values[1]),
            required(values[2]) + 1,
          ]),
        ).toBe(false);
      });
      expect(
        evaluate(
          required(l.questions.find((q) => q.id === `${f.id}-check`)).rule,
          f.check,
        ),
      ).toBe(true);
      const alignment = required(
        l.questions.find((q) => q.id === `${f.id}-alignment`),
      );
      expect(evaluate(alignment.rule, f.alignment)).toBe(true);
      expect(
        evaluate(alignment.rule, [
          ...f.alignment,
          required(alignment.choices?.[2]).id,
        ]),
      ).toBe(false);
      f.review.forEach((values, i) =>
        expect(
          evaluate(
            required(
              l.reviewQuestions?.find(
                (q) => q.id === `${f.id}-method-review${i + 1}`,
              ),
            ).rule,
            values,
          ),
        ).toBe(true),
      );
      expect(l.reviewQuestions).toHaveLength(10);
    }
  });
  it('keeps v2 eleven-question snapshots exact and real writing/reflections unscored', () => {
    const state = initialLibrary('笔算核对');
    for (const f of fixtures) {
      const l = course(f.id);
      const oldQuestions = l.questions.filter(
        (q) =>
          q.id.includes('-q') ||
          /^.*-method[1-4]$/.test(q.id) ||
          q.id === `${f.id}-paper`,
      );
      expect(oldQuestions).toHaveLength(11);
      const old = createSession(
        {
          ...l,
          version: 2,
          steps: l.steps.slice(0, 3),
          questions: oldQuestions,
        },
        book().id,
        state.activeProfileId,
        { seed: 2 },
      );
      required(old.responses[0]).draft = 0;
      state.sessions.push(old);
      const fresh = createSession(l, book().id, state.activeProfileId, {
        seed: 3,
      });
      for (const [i, q] of fresh.questions.entries()) {
        if (q.rule.kind !== 'manual' && q.rule.kind !== 'reflection') continue;
        required(fresh.responses[i]).draft =
          q.rule.kind === 'manual' ? 'confirmed' : '未做纸笔，如实记录。';
        fresh.responses[i] = submitResponse(q, required(fresh.responses[i]));
        expect(fresh.responses[i]?.submissions[0]?.correct).toBeNull();
      }
      expect(statistics(fresh).accuracy).toBeNull();
      state.sessions.push(fresh);
    }
    expect(parseBackup(exportBackup(state)).data).toEqual(state);
  });
  it('offers method variants after real process errors in the combined specialty, then exhausts them', () => {
    const pool = required(
      book().specialties?.find((l) => l.id === 'ms-lower-calculation'),
    );
    expect(pool.version).toBe(3);
    for (const f of fixtures) {
      const s = createSession(pool, book().id, 'child');
      const index = s.questions.findIndex((q) => q.id === `${f.id}-method5`);
      required(s.responses[index]).draft = [0, 0, 0];
      s.responses[index] = submitResponse(
        required(s.questions[index]),
        required(s.responses[index]),
      );
      expect(s.responses[index]?.submissions[0]?.correct).toBe(false);
      const fresh = newReviewQuestions(pool, s, [s]);
      expect(fresh).toHaveLength(10);
      expect(
        fresh.filter((q) => q.id.includes('-method-review')).map((q) => q.id),
      ).toEqual(
        Array.from({ length: 4 }, (_, i) => `${f.id}-method-review${i + 1}`),
      );
      const review = createSession(pool, book().id, 'child', {
        mode: 'review',
        originalSessionId: s.id,
        questions: fresh,
      });
      expect(newReviewQuestions(pool, s, [s, review])).toEqual([]);
    }
  });
});
