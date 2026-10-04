import { describe, expect, it } from 'vitest';

import { arithmeticCell, sumFrequency } from '../learning/arithmetic-grid';
import { exportBackup, parseBackup } from '../learning/backup';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
} from '../learning/engine';
import { required } from '../learning/required';
import { mathBooks } from './math';
import { carryPracticeLessons } from './math-carry-practice';

const find = (index: number, suffix: string) =>
  required(
    required(carryPracticeLessons[index]).questions.find((q) =>
      q.id.endsWith(`-${suffix}`),
    ),
  );
describe('pep carry process, quantity relations and table scope', () => {
  it('checks each decomposition field and both specified methods without treating zero as empty', () => {
    const answers = [
      [1, 5, 10, 15],
      [2, 3, 10, 13],
      [3, 3, 10, 13],
      [4, 3, 10, 13],
      [1, 3, 10, 13],
      [2, 5, 10, 15],
      [3, 5, 10, 15],
      [1, 0, 10, 10],
    ];
    for (const [i, answer] of answers.entries()) {
      const q = find(0, `q${i + 1}`);
      expect(evaluate(q.rule, answer)).toBe(true);
      // A correct final sum cannot conceal a wrong decomposition.
      expect(
        evaluate(
          q.rule,
          answer.map((n, position) => (position === 0 ? n + 1 : n)),
        ),
      ).toBe(false);
    }
    expect(evaluate(find(0, 'q6').rule, [3, 5, 10, 15])).toBe(false);
    expect(evaluate(find(0, 'q7').rule, [2, 5, 10, 15])).toBe(false);
    expect(find(0, 'q6').visual).toEqual({
      kind: 'ten-frame',
      left: 8,
      right: 7,
    });
    expect(find(0, 'q7').visual).toEqual({
      kind: 'ten-frame',
      left: 7,
      right: 8,
    });
    expect(find(0, 'q5').visual).toEqual({
      kind: 'ten-frame',
      left: 9,
      right: 4,
    });
    expect(() => evaluate(find(0, 'q8').rule, [1, null, 10, 10])).toThrow(
      'educationLearning.answerRequired',
    );
    const review = required(carryPracticeLessons[0]?.reviewQuestions);
    expect(evaluate(required(review[0]).rule, [1, 7, 10, 17])).toBe(true);
    expect(evaluate(required(review[0]).rule, [1, 5, 10, 15])).toBe(false);
    expect(evaluate(required(review[3]).rule, [4, 0, 10, 10])).toBe(true);
    const solutions = [];
    for (const left of [2, 7])
      for (const right of [3, 8]) {
        if (9 - left + right === 11 - right + left)
          solutions.push([left, right]);
      }
    expect(solutions).toEqual([
      [2, 3],
      [7, 8],
    ]);
    expect(find(0, 'swap').prompt).toContain('右边摆3、8');
  });
  it('distinguishes the original whole, repeated classifications, units, self and amount of change', () => {
    expect(evaluate(find(1, 'q1').rule, [14, 14])).toBe(true);
    expect(evaluate(find(1, 'q1').rule, [28, 28])).toBe(false);
    for (const [suffix, answer, wrong] of [
      ['q2', 15, 1],
      ['q3', 13, 5],
      ['q4', 14, 2],
      ['q5', 15, 14],
      ['q7', 2, 14],
      ['q8', 5, 23],
      ['q10', 12, 2],
    ] as const) {
      expect(evaluate(find(1, suffix).rule, answer)).toBe(true);
      expect(evaluate(find(1, suffix).rule, wrong)).toBe(false);
    }
    expect(evaluate(find(1, 'q6').rule, [13, 13])).toBe(true);
    expect(evaluate(find(1, 'q6').rule, [26, 26])).toBe(false);
    expect(evaluate(find(1, 'q9').rule, '加')).toBe(true);
    expect(evaluate(find(1, 'q9').rule, '减')).toBe(false);
    const review = required(carryPracticeLessons[1]?.reviewQuestions);
    expect(evaluate(required(review[0]).rule, 14)).toBe(true);
    expect(evaluate(required(review[0]).rule, 15)).toBe(false);
    expect(evaluate(required(review[1]).rule, 12)).toBe(true);
    expect(evaluate(required(review[1]).rule, 11)).toBe(false);
  });
  it('includes exactly ten in the 45-card range, preserves the older grid and accepts positive open partitions beyond nine', () => {
    const rows = Array.from({ length: 9 }, (_, i) => 10 + i);
    const counts = rows.map((sum) => sumFrequency(sum));
    expect(counts).toEqual([9, 8, 7, 6, 5, 4, 3, 2, 1]);
    expect(counts.reduce((a, b) => a + b, 0)).toBe(45);
    expect(evaluate(find(2, 'q1').rule, '放进')).toBe(true);
    expect(evaluate(find(2, 'q2').rule, 9)).toBe(true);
    expect(evaluate(find(2, 'q3').rule, 1)).toBe(true);
    expect(evaluate(find(2, 'q4').rule, 0)).toBe(true);
    expect(() => evaluate(find(2, 'q4').rule, null)).toThrow(
      'educationLearning.answerRequired',
    );
    expect(evaluate(find(2, 'q5').rule, [1, 10])).toBe(true);
    for (const parts of [
      [10, 10],
      [1, 19],
      [19, 1],
    ])
      expect(evaluate(find(2, 'q6').rule, parts)).toBe(true);
    for (const parts of [
      [0, 20],
      [9, 9],
      [-1, 21],
    ])
      expect(evaluate(find(2, 'q6').rule, parts)).toBe(false);
    expect(evaluate(find(2, 'q7').rule, [10, 10, 17])).toBe(true);
    expect(evaluate(find(2, 'q11').rule, [8, 7])).toBe(true);
    expect(evaluate(find(2, 'q12').rule, [6, 5])).toBe(true);
    // Existing saved carry grids keep their original strict >10 semantics.
    expect(arithmeticCell('carry-add', 0, 1)).toBeNull();
    expect(arithmeticCell('sum-grid', 0, 8)?.value).toBe(10);
    expect(arithmeticCell('sum-grid', 1, 7)?.value).toBe(10);
    expect(arithmeticCell('sum-grid', 7, 8)?.value).toBe(17);
    const review = required(carryPracticeLessons[2]?.reviewQuestions);
    expect(evaluate(required(review[0]).rule, 7)).toBe(true);
    expect(evaluate(required(review[2]).rule, [12, 10])).toBe(true);
    expect(evaluate(required(review[2]).rule, [8, 7])).toBe(false);
  });
  it('keeps original v1 sessions and manual/reflection records intact across strict backups and expands specialties separately', () => {
    const book = required(mathBooks.find((b) => b.volume === 'upper'));
    const lessons = required(book.units.find((u) => u.id === 'u5')).lessons;
    expect(lessons.slice(0, 3).map((l) => l.id)).toEqual([
      'mu-carry-nine',
      'mu-carry-eight',
      'mu-carry-small',
    ]);
    expect(lessons.slice(3)).toEqual(carryPracticeLessons);
    const now = '2026-10-03T00:00:00.000Z';
    const originals = lessons
      .slice(0, 3)
      .map((l) => createSession(l, book.id, 'child', { seed: 17, now }));
    for (const original of originals) {
      expect(original.lessonVersion).toBe(1);
      expect(original.questions).toHaveLength(6);
    }
    for (const [index, course] of carryPracticeLessons.entries()) {
      expect(course.questions).toHaveLength(required([18, 17, 19][index]));
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
            : '测试记录：实做与计划分别记录。';
        session.responses[i] = submitResponse(q, response, now);
        expect(session.responses[i]?.submissions[0]?.correct).toBeNull();
      }
      expect(statistics(session).accuracy).toBeNull();
      expect(statistics(session).reflections).toBe(2);
      const state = {
        schemaVersion: 1 as const,
        activeProfileId: 'child',
        profiles: [{ id: 'child', nickname: '学习者', createdAt: now }],
        sessions: [...originals, session],
      };
      expect(parseBackup(exportBackup(state)).data).toEqual(state);
    }
    const questions = lessons.flatMap((l) => [
      ...l.questions,
      ...(l.reviewQuestions ?? []),
    ]);
    expect(new Set(questions.map((q) => q.id)).size).toBe(questions.length);
    const calculation = required(
      book.specialties?.find((l) => l.id === 'ms-upper-calculation'),
    );
    const relationPool = required(
      book.specialties?.find((l) => l.id === 'ms-upper-relations'),
    );
    expect(calculation.version).toBe(6);
    expect(relationPool.version).toBe(6);
    expect(calculation.questions).toContainEqual(find(0, 'q8'));
    expect(relationPool.questions).toContainEqual(find(1, 'q5'));
    expect(calculation.questions).toContainEqual(find(2, 'q6'));
  });
});
