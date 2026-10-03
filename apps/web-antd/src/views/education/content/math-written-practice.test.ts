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
import { writtenPracticeLessons } from './math-written-practice';

const course = () =>
  required(writtenPracticeLessons.find((l) => l.id === 'ml-written-compare'));
const book = () => required(mathBooks.find((b) => b.volume === 'lower'));
const question = (n: number) =>
  required(course().questions.find((q) => q.id === `ml-written-compare-q${n}`));

describe('written expansion, concise notation and valid order alternatives', () => {
  it('independently verifies expanded amounts, regrouped units, result digits and inverse checks', () => {
    const answers = [
      [60, 7, 67],
      '合法，数量和单位对应',
      [14, 50, 1, 4, 6, 64],
      ['先个位，进1后十位得6', '先十的部分50，再合14得64'],
      '从个位换来的1个十',
      [5, 13, 3, 5, 35],
      [6, 10, 4, 4, 44],
      '写5即可，前面的十位0可省',
      [15, 40, 55],
      ['8要对准7所在的个位', '先写哪一行不改变各数的值'],
      '十位再少1，改成3，个位得5',
      [42, 25],
      [0, 9, 5],
    ];
    answers.forEach((value, i) =>
      expect(evaluate(question(i + 1).rule, value)).toBe(true),
    );
    const reviews = [
      [70, 9, 79],
      [12, 70, 1, 2, 8, 82],
      [7, 14, 4, 5, 45],
      [10, 60, 70],
    ];
    reviews.forEach((value, i) =>
      expect(
        evaluate(required(course().reviewQuestions?.[i]).rule, value),
      ).toBe(true),
    );
    const registered = required(
      book()
        .units.flatMap((u) => u.lessons)
        .find((l) => l.id === course().id),
    );
    expect(registered.questions).toEqual(course().questions);
    expect(registered.reviewQuestions).toEqual(course().reviewQuestions);
  });
  it('rejects missing exchange, treating amount as digit, misalignment and cumulative inverse subtraction', () => {
    expect(evaluate(question(1).rule, [6, 7, 67])).toBe(false);
    expect(evaluate(question(3).rule, [14, 60, 1, 4, 6, 64])).toBe(false);
    expect(evaluate(question(3).rule, [14, 50, 1, 4, 5, 54])).toBe(false);
    expect(evaluate(question(6).rule, [6, 13, 4, 5, 45])).toBe(false);
    expect(evaluate(question(7).rule, [7, 10, 5, 4, 54])).toBe(false);
    expect(evaluate(question(9).rule, [7, 120, 127])).toBe(false);
    expect(evaluate(question(12).rule, [42, 0])).toBe(false);
    expect(evaluate(question(2).rule, '先十位一律算错')).toBe(false);
    expect(evaluate(question(11).rule, '先十位，所以永远不能算对')).toBe(false);
    expect(evaluate(question(13).rule, [0, 9, 5])).toBe(true);
    expect(() => evaluate(question(13).rule, [null, 9, 5])).toThrow(
      'educationLearning.answerRequired',
    );
    expect(() => evaluate(question(13).rule, [0, 9])).toThrow(
      'educationLearning.answerRequired',
    );
  });
  it('keeps the original v3 written snapshot and partial 0 while real tasks and reflection remain unscored', () => {
    const state = initialLibrary('笔算方法对照核验');
    const original = required(
      book()
        .units.flatMap((u) => u.lessons)
        .find((l) => l.id === 'ml-written-add'),
    );
    expect(original.version).toBe(3);
    expect(original.questions).toHaveLength(17);
    const old = createSession(original, book().id, state.activeProfileId, {
      seed: 7,
    });
    const oldIndex = old.questions.findIndex(
      (q) => q.id === 'ml-written-add-method1',
    );
    required(old.responses[oldIndex]).draft = [0, null, null];
    state.sessions.push(old);
    const snapshot = JSON.stringify(old);
    const s = createSession(course(), book().id, state.activeProfileId, {
      seed: 8,
    });
    const index = s.questions.findIndex(
      (q) => q.id === 'ml-written-compare-q13',
    );
    required(s.responses[index]).draft = [0, null, null];
    for (const [i, q] of s.questions.entries()) {
      if (q.rule.kind !== 'manual' && q.rule.kind !== 'reflection') continue;
      required(s.responses[i]).draft =
        q.rule.kind === 'manual' ? 'confirmed' : '实际纸笔未做，保留疑问。';
      s.responses[i] = submitResponse(q, required(s.responses[i]));
      expect(s.responses[i]?.submissions[0]?.correct).toBeNull();
    }
    expect(statistics(s).accuracy).toBeNull();
    expect(s.questions.filter((q) => q.rule.kind === 'manual')).toHaveLength(6);
    expect(
      s.questions.filter((q) => q.rule.kind === 'reflection'),
    ).toHaveLength(2);
    state.sessions.push(s);
    const restored = parseBackup(exportBackup(state)).data;
    expect(restored).toEqual(state);
    expect(JSON.stringify(restored.sessions[0])).toBe(snapshot);
  });
  it('uses all four fresh methods for a real specialty mistake without rewriting the old session', () => {
    const state = initialLibrary('笔算新方法复习');
    const specialty = required(
      book().specialties?.find((l) => l.id === 'ms-lower-calculation'),
    );
    expect(specialty.version).toBe(10);
    const s = createSession(specialty, book().id, state.activeProfileId, {
      seed: 9,
    });
    const index = s.questions.findIndex(
      (q) => q.id === 'ml-written-compare-q3',
    );
    required(s.responses[index]).draft = [14, 50, 1, 4, 5, 54];
    s.responses[index] = submitResponse(
      required(s.questions[index]),
      required(s.responses[index]),
    );
    state.sessions.push(s);
    const snapshot = JSON.stringify(s);
    const fresh = newReviewQuestions(specialty, s, state.sessions);
    expect(fresh.map((q) => q.id).toSorted()).toEqual(
      required(course().reviewQuestions)
        .map((q) => q.id)
        .toSorted(),
    );
    const r = createSession(specialty, book().id, state.activeProfileId, {
      seed: 10,
      mode: 'review',
      originalSessionId: s.id,
      questions: fresh,
    });
    r.completedAt = new Date().toISOString();
    state.sessions.push(r);
    expect(newReviewQuestions(specialty, s, state.sessions)).toEqual([]);
    expect(JSON.stringify(s)).toBe(snapshot);
  });
});
