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
import { hundredFinishLesson as lesson } from './math-hundred-finish';

const book = () => required(mathBooks.find((b) => b.volume === 'lower'));
const q = (n: number) =>
  required(lesson.questions.find((q) => q.id === `ml-hundred-finish-q${n}`));
describe('hundred-unit final activities and independent reflections', () => {
  it('enumerates the complete two-digit sets independently, excluding leading zero and duplicate overlap', () => {
    const numbers = Array.from({ length: 90 }, (_, i) => i + 10);
    const same = numbers
      .filter((n) => Math.floor(n / 10) === n % 10)
      .map(String);
    const sevens = numbers
      .filter((n) => Math.floor(n / 10) === 7 || n % 10 === 7)
      .map(String);
    expect(evaluate(q(5).rule, same)).toBe(true);
    expect(evaluate(q(7).rule, sevens)).toBe(true);
    expect(same).toHaveLength(9);
    expect(sevens).toHaveLength(18);
    expect(evaluate(q(5).rule, [...same, '00'])).toBe(false);
    expect(evaluate(q(7).rule, [...sevens, '07'])).toBe(false);
    expect(
      evaluate(
        q(7).rule,
        sevens.filter((n) => n !== '70'),
      ),
    ).toBe(false);
    expect(
      evaluate(
        q(7).rule,
        sevens.filter((n) => n !== '77'),
      ),
    ).toBe(false);
    expect(evaluate(q(7).rule, [...sevens, '77'])).toBe(false);
    const threes = numbers
      .filter((n) => Math.floor(n / 10) === 3 || n % 10 === 3)
      .map(String);
    expect(evaluate(required(lesson.reviewQuestions?.[2]).rule, threes)).toBe(
      true,
    );
    expect(
      evaluate(
        required(lesson.reviewQuestions?.[1]).rule,
        same.filter((n) => Number(n) > 55),
      ),
    ).toBe(true);
  });
  it('checks every result, route validity choice and new variant without conflating cells or all fruit with a path', () => {
    const answers = [
      [6, 7],
      [8, 7],
      [7, 7],
      ['A→B→C→D→F→I→L', 'A→E→G→H→J→K→L'],
      ['11', '22', '33', '44', '55', '66', '77', '88', '99'],
      9,
      [
        '17',
        '27',
        '37',
        '47',
        '57',
        '67',
        '70',
        '71',
        '72',
        '73',
        '74',
        '75',
        '76',
        '77',
        '78',
        '79',
        '87',
        '97',
      ],
      [10, 9, 1, 18],
      '不能，只有一张7',
      [9, 10, 1, 0, 0],
    ];
    answers.forEach((answer, i) =>
      expect(evaluate(q(i + 1).rule, answer)).toBe(true),
    );
    expect(evaluate(q(1).rule, [13, 13])).toBe(false);
    expect(evaluate(q(2).rule, [6, 5])).toBe(false);
    expect(evaluate(q(3).rule, [6, 7])).toBe(false);
    expect(evaluate(q(8).rule, [10, 9, 0, 19])).toBe(false);
    expect(evaluate(q(9).rule, '能，写两次7')).toBe(false);
    expect(() => evaluate(q(10).rule, [9, 10, 1, null, 0])).toThrow(
      'educationLearning.answerRequired',
    );
    expect(evaluate(required(lesson.reviewQuestions?.[0]).rule, 8)).toBe(true);
    expect(evaluate(required(lesson.reviewQuestions?.[3]).rule, [1, 1])).toBe(
      true,
    );
  });
  it('keeps old snapshots and partial zero drafts, and leaves both actual tasks and reflections outside accuracy', () => {
    const state = initialLibrary('末页核验');
    const original = required(
      book()
        .units.flatMap((u) => u.lessons)
        .find((l) => l.id === 'ml-hundred-counting'),
    );
    const old = createSession(original, book().id, state.activeProfileId, {
      seed: 1,
    });
    state.sessions.push(old);
    const before = JSON.stringify(old);
    const s = createSession(lesson, book().id, state.activeProfileId, {
      seed: 2,
    });
    const index = s.questions.findIndex(
      (q) => q.id === 'ml-hundred-finish-q10',
    );
    required(s.responses[index]).draft = [9, null, 1, 0, 0];
    for (const [i, question] of s.questions.entries()) {
      if (
        question.rule.kind !== 'manual' &&
        question.rule.kind !== 'reflection'
      )
        continue;
      required(s.responses[i]).draft =
        question.rule.kind === 'manual'
          ? 'confirmed'
          : '实际活动尚未做，记录疑问。';
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
    const corrupted = structuredClone(state);
    const visual = required(
      required(corrupted.sessions[1]).questions.find(
        (q) => q.id === 'ml-hundred-finish-q1',
      ),
    ).visual;
    if (visual?.kind === 'fruit-maze') Object.assign(visual, { answer: 6 });
    expect(() => exportBackup(corrupted)).toThrow(
      'educationLearning.invalidRecord',
    );
  });
  it('registers the complete new course and selects fresh variants after a real specialty mistake', () => {
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
    const index = s.questions.findIndex((q) => q.id === 'ml-hundred-finish-q1');
    required(s.responses[index]).draft = [13, 13];
    s.responses[index] = submitResponse(
      required(s.questions[index]),
      required(s.responses[index]),
    );
    const fresh = newReviewQuestions(pool, s, [s]);
    expect(fresh.map((q) => q.id)).toEqual(
      required(lesson.reviewQuestions).map((q) => q.id),
    );
    const review = createSession(pool, book().id, 'child', {
      mode: 'review',
      originalSessionId: s.id,
      questions: fresh,
    });
    expect(newReviewQuestions(pool, s, [s, review])).toEqual([]);
  });
});
