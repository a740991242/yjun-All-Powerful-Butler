import { describe, expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import { cubePairOptions } from '../learning/cube-pair';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
} from '../learning/engine';
import { required } from '../learning/required';
import { newReviewQuestions } from '../learning/review';
import {
  solidPieceUnits,
  solidRecomposeData,
} from '../learning/solid-recompose';
import { mathBooks } from './math';
import { finalPracticeLessons } from './math-final-practice';

const find = (index: number, suffix: string) =>
  required(
    required(finalPracticeLessons[index]).questions.find((q) =>
      q.id.endsWith(`-${suffix}`),
    ),
  );
describe('pep final review meanings, intermediate results and actual activities', () => {
  it('recommends only quantity-relation variants after a real failed whole/part submission', () => {
    const lesson = required(finalPracticeLessons[1]);
    const session = createSession(lesson, 'pep-math-p1-upper-2024', 'child', {
      seed: 17,
    });
    const index = session.questions.findIndex(
      (q) => q.id === `${lesson.id}-q5`,
    );
    const question = required(session.questions[index]);
    const response = required(session.responses[index]);
    response.draft = 2;
    session.responses[index] = submitResponse(question, response);
    expect(session.responses[index]?.submissions[0]?.correct).toBe(false);
    const candidates = newReviewQuestions(lesson, session, [session]);
    expect(candidates.map((q) => q.id)).toEqual([
      `${lesson.id}-r1`,
      `${lesson.id}-r9`,
    ]);
    expect(
      candidates.every((q) => q.knowledge === `${lesson.id}-relations`),
    ).toBe(true);
    const attempt = createSession(lesson, session.bookId, session.profileId, {
      mode: 'review',
      questions: candidates,
    });
    expect(newReviewQuestions(lesson, session, [session, attempt])).toEqual([]);
  });
  it('checks position versus value, zero/ten borders, all sixteen calculations and every chain intermediate', () => {
    for (const [suffix, answer] of [
      ['q1', [5, 10, 16]],
      ['q2', [15, 17]],
      ['q3', [13, 1, 3]],
      ['q5', [2, 0]],
      ['q6', [10, 10, 10]],
      ['q9', [13, 5, 10, 18]],
      ['q10', [17, 0, 7, 10]],
      ['q11', [14, 4, 10, 9]],
      ['q12', [14, 3, 10, 20]],
      ['q16', [18, 10, 17, 12, 18]],
      ['q17', [10, 18, 8, 10, 0]],
    ] as const) {
      const rule = find(0, suffix).rule;
      expect(evaluate(rule, [...answer])).toBe(true);
      expect(
        evaluate(
          rule,
          answer.map((n, i) => (i === 0 ? n + 1 : n)),
        ),
      ).toBe(false);
    }
    expect(evaluate(find(0, 'q4').rule, 9)).toBe(true);
    expect(evaluate(find(0, 'q7').rule, 11)).toBe(true);
    expect(evaluate(find(0, 'q7').rule, 9)).toBe(false);
    expect(() => evaluate(find(0, 'q5').rule, [2, null])).toThrow(
      'educationLearning.answerRequired',
    );
    expect(() => evaluate(find(0, 'q17').rule, [10, 18, 8, 10, null])).toThrow(
      'educationLearning.answerRequired',
    );
    expect(evaluate(find(0, 'q13').rule, '=')).toBe(true);
    expect(evaluate(find(0, 'q14').rule, '<')).toBe(true);
    expect(evaluate(find(0, 'q15').rule, '>')).toBe(true);
    const review = required(finalPracticeLessons[0]?.reviewQuestions);
    expect(evaluate(required(review[0]).rule, [7, 12, 18])).toBe(true);
    expect(evaluate(required(review[0]).rule, [5, 10, 16])).toBe(false);
    expect(evaluate(required(review[2]).rule, [10, 17, 7, 10, 0])).toBe(true);
    expect(evaluate(required(review[2]).rule, [10, 18, 8, 10, 0])).toBe(false);
  });
  it('keeps count/ordinal, whole/part, shape counts and geometric fit distinct, including changed review conditions', () => {
    expect(evaluate(find(1, 'q1').rule, '数量')).toBe(true);
    expect(evaluate(find(1, 'q3').rule, [7, 7, 4, 3])).toBe(true);
    expect(evaluate(find(1, 'q4').rule, [2, 4, 10, 14])).toBe(true);
    expect(evaluate(find(1, 'q5').rule, 12)).toBe(true);
    expect(evaluate(find(1, 'q5').rule, 2)).toBe(false);
    expect(evaluate(find(1, 'q6').rule, 9)).toBe(true);
    expect(evaluate(find(1, 'q7').rule, ['圆柱', '正方体', '长方体'])).toBe(
      true,
    );
    expect(evaluate(find(1, 'q7').rule, ['球', '圆柱'])).toBe(false);
    expect(evaluate(find(1, 'q8').rule, [1, 2, 3, 0])).toBe(true);
    expect(() => evaluate(find(1, 'q8').rule, [1, 2, 3, null])).toThrow(
      'educationLearning.answerRequired',
    );
    expect(evaluate(find(1, 'q9').rule, 8)).toBe(true);
    expect(evaluate(find(1, 'q9').rule, 4)).toBe(false);
    expect(
      cubePairOptions('main')
        .filter((pair) => pair.valid)
        .map((pair) => `${pair.first}+${pair.second}`),
    ).toEqual(['A+E', 'B+F', 'C+D']);
    expect(evaluate(find(1, 'q11').rule, ['A+E', 'B+F', 'C+D'])).toBe(true);
    const review = required(finalPracticeLessons[1]?.reviewQuestions);
    const changedPair = required(review.find((q) => q.id.endsWith('-r10')));
    expect(
      cubePairOptions('review')
        .filter((pair) => pair.valid)
        .map((pair) => `${pair.first}+${pair.second}`),
    ).toEqual(['A+E', 'B+F']);
    expect(evaluate(changedPair.rule, ['A+E', 'B+F', 'C+D'])).toBe(false);
    const solid = solidRecomposeData({
      kind: 'solid-recompose',
      scene: 'cube-join',
      variant: 'main',
    });
    expect(
      solid.input
        .map((piece) => solidPieceUnits(piece))
        .reduce((a, b) => a + b, 0),
    ).toBe(4);
    expect(
      solid.choices.map((group) =>
        group.reduce((sum, piece) => sum + solidPieceUnits(piece), 0),
      ),
    ).toEqual([4, 4, 3]);
    const newSolid = solidRecomposeData({
      kind: 'solid-recompose',
      scene: 'pair-cubes',
      variant: 'review',
    });
    expect(newSolid.input).toHaveLength(2);
    expect(
      newSolid.choices.map((group) =>
        group.reduce((sum, piece) => sum + solidPieceUnits(piece), 0),
      ),
    ).toEqual([3, 2, 2]);
    expect(
      evaluate(required(review.find((q) => q.id.endsWith('-r4'))).rule, [
        'B',
        'C',
      ]),
    ).toBe(true);
  });
  it('restores every new visual and the original review v1 exactly and keeps real activity/reflection unscored', () => {
    const book = required(mathBooks.find((b) => b.volume === 'upper'));
    const lessons = required(book.units.find((u) => u.id === 'u6')).lessons;
    expect(lessons.slice(0, 2).map((l) => l.id)).toEqual([
      'mu-review-story',
      'mu-review',
    ]);
    expect(lessons.slice(2)).toEqual(finalPracticeLessons);
    const now = '2026-10-03T00:00:00.000Z';
    const original = createSession(required(lessons[1]), book.id, 'child', {
      seed: 17,
      now,
    });
    expect(original.lessonVersion).toBe(1);
    expect(original.questions).toHaveLength(6);
    for (const [index, lesson] of finalPracticeLessons.entries()) {
      expect(lesson.questions).toHaveLength(index === 0 ? 22 : 21);
      const session = createSession(lesson, book.id, 'child', {
        seed: 17,
        now,
      });
      for (const [i, q] of session.questions.entries()) {
        if (q.rule.kind !== 'manual' && q.rule.kind !== 'reflection') continue;
        const response = required(session.responses[i]);
        response.draft =
          q.rule.kind === 'manual' ? 'confirmed' : '测试记录：实际与待做分开。';
        session.responses[i] = submitResponse(q, response, now);
        expect(session.responses[i]?.submissions[0]?.correct).toBeNull();
      }
      expect(statistics(session).accuracy).toBeNull();
      expect(statistics(session).reflections).toBe(index === 0 ? 1 : 3);
      const state = {
        schemaVersion: 1 as const,
        activeProfileId: 'child',
        profiles: [{ id: 'child', nickname: '学习者', createdAt: now }],
        sessions: [original, session],
      };
      expect(parseBackup(exportBackup(state)).data).toEqual(state);
      // The wire validator must reject a damaged new model instead of dropping it.
      if (index === 0) {
        const damaged = JSON.parse(exportBackup(state));
        const q = damaged.data.sessions[1].questions.find(
          (q: { visual?: { kind: string } }) =>
            q.visual?.kind === 'semester-grid',
        );
        q.visual.hidden = [[0, 1]];
        q.visual.mode = 'numbers';
        expect(() => parseBackup(JSON.stringify(damaged))).toThrow(
          'educationLearning.invalidBackup',
        );
      }
    }
  });
  it('provides review within each declared concept and keeps specialty changes outside formal lesson identities', () => {
    for (const lesson of finalPracticeLessons) {
      for (const q of lesson.questions.filter(
        (q) => !['manual', 'reflection'].includes(q.rule.kind),
      ))
        expect(
          lesson.reviewQuestions?.some((r) => r.knowledge === q.knowledge),
        ).toBe(true);
      const tasks = [...lesson.questions, ...(lesson.reviewQuestions ?? [])];
      expect(new Set(tasks.map((q) => q.id)).size).toBe(tasks.length);
    }
    const book = required(mathBooks.find((b) => b.volume === 'upper'));
    for (const [id, version, source] of [
      ['ms-upper-count', 4, find(0, 'q3')],
      ['ms-upper-calculation', 6, find(0, 'q17')],
      ['ms-upper-relations', 6, find(1, 'q5')],
      ['ms-upper-shapes', 3, find(1, 'q11')],
    ] as const) {
      const pool = required(book.specialties?.find((l) => l.id === id));
      expect(pool.version).toBe(version);
      expect(pool.questions).toContainEqual(source);
    }
  });
});
