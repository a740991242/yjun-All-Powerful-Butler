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
const answerSets = [
  {
    id: 'ml-oral-add',
    results: [36, 52, 33, 54, 88, 70],
    methods: [
      [6, 0, 3, 36],
      [2, 0, 5, 52],
      [13, 1, 3, 33],
      [14, 1, 5, 54],
      [8, 0, 8, 88],
      [10, 1, 7, 70],
    ],
    alternative: [3, 3, 33],
    strategies: ['A：7+6=13，再20+13=33', 'B：27+3=30，再30+3=33'],
    review: [
      [8, 0, 4, 48],
      [12, 1, 6, 62],
      [1, 0, 7, 71],
      [5, 0, 9, 95],
    ],
  },
  {
    id: 'ml-oral-sub',
    results: [45, 28, 26, 53, 47, 35],
    methods: [
      [0, 8, 4, 45],
      [0, 8, 4, 28],
      [1, 12, 2, 26],
      [1, 11, 5, 53],
      [0, 7, 7, 47],
      [1, 10, 3, 35],
    ],
    alternative: [2, 4, 26],
    strategies: ['A：12−6=6，再20+6=26', 'B：32−2=30，再30−4=26'],
    review: [
      [0, 9, 5, 52],
      [1, 13, 4, 45],
      [1, 10, 7, 76],
      [0, 6, 7, 36],
    ],
  },
];
describe('oral unit methods and original lesson records', () => {
  it('checks each intermediate unit and timing independently from results, including zeros', () => {
    for (const fixture of answerSets) {
      const l = course(fixture.id);
      expect(l.version).toBe(2);
      expect(l.questions).toHaveLength(17);
      l.questions.slice(0, 6).forEach((q, i) => {
        expect(q.id).toBe(`${fixture.id}-q${i + 1}`);
        expect(evaluate(q.rule, required(fixture.results[i]))).toBe(true);
      });
      fixture.methods.forEach((answer, i) => {
        const q = required(
          l.questions.find((q) => q.id === `${fixture.id}-oral-method${i + 1}`),
        );
        expect(evaluate(q.rule, answer)).toBe(true);
        expect(() => evaluate(q.rule, [null, ...answer.slice(1)])).toThrow(
          'educationLearning.answerRequired',
        );
        const wrong = [...answer];
        wrong[1] = required(wrong[1]) + 1;
        expect(evaluate(q.rule, wrong)).toBe(false);
      });
      const find = (suffix: string) =>
        required(
          l.questions.find((q) => q.id === `${fixture.id}-oral-${suffix}`),
        );
      expect(evaluate(find('alternative').rule, fixture.alternative)).toBe(
        true,
      );
      expect(
        evaluate(find('alternative').rule, [
          6,
          6,
          required(fixture.alternative[2]),
        ]),
      ).toBe(false);
      expect(evaluate(find('strategies').rule, fixture.strategies)).toBe(true);
      expect(
        evaluate(find('strategies').rule, [...fixture.strategies, 'C']),
      ).toBe(false);
      required(l.reviewQuestions).forEach((q, i) =>
        expect(evaluate(q.rule, required(fixture.review[i]))).toBe(true),
      );
    }
  });
  it('keeps real activities and reflection unscored, old v1 question snapshots exact through backup', () => {
    const state = initialLibrary('口算方法核验');
    for (const fixture of answerSets) {
      const l = course(fixture.id);
      const old = createSession(
        { ...l, version: 1, questions: l.questions.slice(0, 6) },
        book().id,
        state.activeProfileId,
        { seed: 4 },
      );
      old.responses[0]!.draft = 0;
      state.sessions.push(old);
    }
    const snapshots = JSON.stringify(state.sessions);
    for (const fixture of answerSets) {
      const s = createSession(
        course(fixture.id),
        book().id,
        state.activeProfileId,
        { seed: 5 },
      );
      for (const [i, q] of s.questions.entries())
        if (q.rule.kind === 'manual' || q.rule.kind === 'reflection') {
          s.responses[i]!.draft =
            q.rule.kind === 'manual' ? 'confirmed' : '如实记录尚未做实物操作。';
          s.responses[i] = submitResponse(q, required(s.responses[i]));
          expect(s.responses[i]?.submissions[0]?.correct).toBeNull();
        }
      expect(statistics(s).accuracy).toBeNull();
      state.sessions.push(s);
    }
    const restored = parseBackup(exportBackup(state)).data;
    expect(restored).toEqual(state);
    expect(JSON.stringify(restored.sessions.slice(0, 2))).toBe(snapshots);
    expect(
      required(book().specialties?.find((l) => l.id === 'ms-lower-calculation'))
        .version,
    ).toBe(3);
  });
  it('uses unseen new method variants for actual errors in the combined calculation specialty', () => {
    const pool = required(
      book().specialties?.find((l) => l.id === 'ms-lower-calculation'),
    );
    for (const id of ['ml-oral-add', 'ml-oral-sub']) {
      const s = createSession(pool, book().id, 'child');
      s.phase = 'practice';
      const index = s.questions.findIndex((q) => q.id === `${id}-oral-method3`);
      s.responses[index]!.draft = [0, 0, 0, 0];
      s.responses[index] = submitResponse(
        required(s.questions[index]),
        required(s.responses[index]),
      );
      expect(s.responses[index]?.submissions[0]?.correct).toBe(false);
      const fresh = newReviewQuestions(pool, s, [s]);
      expect(fresh.map((q) => q.id)).toEqual(
        Array.from({ length: 4 }, (_, i) => `${id}-oral-review${i + 1}`),
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
