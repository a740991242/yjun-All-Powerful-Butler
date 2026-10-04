import { describe, expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
} from '../learning/engine';
import { required } from '../learning/required';
import { mathBooks } from './math';
import { twentyPracticeLessons } from './math-twenty-practice';

const find = (index: number, suffix: string) =>
  required(
    required(twentyPracticeLessons[index]).questions.find((q) =>
      q.id.endsWith(`-${suffix}`),
    ),
  );
describe('pep 11–20 physical units and interval meaning', () => {
  it('distinguishes represented quantity from digit and bundle counts and retains zero in multi-field answers', () => {
    for (const [suffix, answer, wrong] of [
      ['q1', [1, 6, 16], [1, 6, 7]],
      ['q2', [2, 0], [0, 2]],
      ['q3', [10, 1], [1, 1]],
      ['q5', [2, 0], [1, 10]],
      ['q7', [8, 0], [16, 0]],
      ['q8', [7, 1], [7, 0]],
    ] as const) {
      const rule = find(0, suffix).rule;
      expect(evaluate(rule, [...answer])).toBe(true);
      expect(evaluate(rule, [...wrong])).toBe(false);
    }
    expect(() => evaluate(find(0, 'q2').rule, [2, null])).toThrow(
      'educationLearning.answerRequired',
    );
    expect(evaluate(find(0, 'q4').rule, 2)).toBe(false);
    expect(evaluate(find(0, 'q4').rule, 20)).toBe(true);
    expect(evaluate(find(0, 'q6').rule, '不同')).toBe(true);
  });
  it('separates ordinal, inclusive and exclusive intervals, adjacency and elapsed days', () => {
    for (const [suffix, answer, wrong] of [
      ['q3', 3, 18],
      ['q4', 5, 4],
      ['q5', 5, 6],
      ['q6', 0, 1],
      ['q7', 5, 6],
      ['q8', 5, 6],
      ['q9', 5, 4],
    ] as const) {
      expect(evaluate(find(1, suffix).rule, answer)).toBe(true);
      expect(evaluate(find(1, suffix).rule, wrong)).toBe(false);
    }
    expect(() => evaluate(find(1, 'q6').rule, null)).toThrow(
      'educationLearning.answerRequired',
    );
    expect(evaluate(find(1, 'q10').rule, '星期四')).toBe(true);
    expect(evaluate(find(1, 'q10').rule, '星期三')).toBe(false);
    expect(evaluate(find(1, 'q2').rule, '20')).toBe(true);
    const review = required(twentyPracticeLessons[1]?.reviewQuestions);
    expect(evaluate(required(review[0]).rule, 6)).toBe(true);
    expect(evaluate(required(review[0]).rule, 5)).toBe(false);
    expect(evaluate(required(review[1]).rule, 8)).toBe(true);
    expect(evaluate(required(review[2]).rule, 0)).toBe(true);
  });
  it('keeps whole/part units and intermediate zero distinct and checks transformed review conditions', () => {
    expect(evaluate(find(2, 'q1').rule, [14, 10, 4])).toBe(true);
    expect(evaluate(find(2, 'q4').rule, 16)).toBe(true);
    expect(evaluate(find(2, 'q5').rule, 20)).toBe(false);
    expect(evaluate(find(2, 'q5').rule, 12)).toBe(true);
    expect(evaluate(find(2, 'q6').rule, 3)).toBe(true);
    expect(evaluate(find(2, 'q7').rule, [10, 17])).toBe(true);
    expect(evaluate(find(2, 'q8').rule, [10, 0])).toBe(true);
    expect(() => evaluate(find(2, 'q8').rule, [10, null])).toThrow(
      'educationLearning.answerRequired',
    );
    expect(evaluate(find(2, 'q9').rule, '=')).toBe(true);
    const review = required(twentyPracticeLessons[2]?.reviewQuestions);
    expect(evaluate(required(review[0]).rule, [17, 10, 7])).toBe(true);
    expect(evaluate(required(review[0]).rule, [14, 10, 4])).toBe(false);
    expect(evaluate(required(review[2]).rule, [10, 13])).toBe(true);
  });
  it('saves actual activity and each personal reflection without auto-scoring and retains original v1 snapshots', () => {
    const book = required(mathBooks.find((b) => b.volume === 'upper'));
    const lessons = required(book.units.find((u) => u.id === 'u4')).lessons;
    expect(lessons.slice(0, 4).map((l) => l.id)).toEqual([
      'mu-twenty-sequence',
      'mu-twenty-place',
      'mu-twenty-compare',
      'mu-twenty-addsub',
    ]);
    expect(lessons.slice(4)).toEqual(twentyPracticeLessons);
    const now = '2026-10-03T00:00:00.000Z';
    const original = createSession(required(lessons[0]), book.id, 'child', {
      now,
      seed: 17,
    });
    expect(original.lessonVersion).toBe(1);
    expect(original.questions).toHaveLength(6);
    for (const [index, course] of twentyPracticeLessons.entries()) {
      expect(course.questions).toHaveLength(required([23, 25, 57][index]));
      const session = createSession(course, book.id, 'child', {
        seed: 17,
        now,
      });
      for (const [i, q] of session.questions.entries()) {
        if (q.rule.kind !== 'manual' && q.rule.kind !== 'reflection') continue;
        const response = required(session.responses[i]);
        response.draft =
          q.rule.kind === 'manual'
            ? 'confirmed'
            : '测试记录：实际活动与待做计划分开。';
        session.responses[i] = submitResponse(q, response, now);
        expect(session.responses[i]?.submissions[0]?.correct).toBeNull();
      }
      expect(statistics(session).accuracy).toBeNull();
      expect(statistics(session).reflections).toBe(index === 2 ? 3 : 1);
      const state = {
        schemaVersion: 1 as const,
        activeProfileId: 'child',
        profiles: [{ id: 'child', nickname: '学习者', createdAt: now }],
        sessions: [original, session],
      };
      expect(parseBackup(exportBackup(state)).data).toEqual(state);
    }
    const tasks = lessons.flatMap((l) => [
      ...l.questions,
      ...(l.reviewQuestions ?? []),
    ]);
    expect(new Set(tasks.map((q) => q.id)).size).toBe(tasks.length);
    const pool = required(
      book.specialties?.find((l) => l.id === 'ms-upper-relations'),
    );
    expect(pool.version).toBe(6);
    expect(pool.questions).toContainEqual(find(1, 'q6'));
    expect(pool.questions).toContainEqual(find(2, 'q8'));
  });
});
