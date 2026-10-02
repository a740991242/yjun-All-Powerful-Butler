import type { Answer } from '../learning/types';

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
import { shoppingPracticeLesson as lesson } from './math-shopping-practice';

describe('pEP shopping practical activity', () => {
  it('accepts all exact-budget combinations irrespective of order, but rejects extra or missing pairs', () => {
    const question = required(
      lesson.questions.find((q) => q.id.endsWith('-q4')),
    );
    expect(evaluate(question.rule, ['map-weather', 'picture-animal'])).toBe(
      true,
    );
    expect(evaluate(question.rule, ['picture-animal'])).toBe(false);
    expect(
      evaluate(question.rule, ['picture-animal', 'map-weather', 'picture-map']),
    ).toBe(false);
    expect(evaluate(question.rule, ['weather-animal'])).toBe(false);
    const review = required(
      lesson.reviewQuestions?.find((q) => q.id.endsWith('-r2')),
    );
    expect(evaluate(review.rule, ['drawing-mark', 'clip-book'])).toBe(true);
    expect(evaluate(review.rule, ['mark-book'])).toBe(false);
  });
  it('checks unit conversions, payment and zero change independently', () => {
    const examples: [string, Answer][] = [
      ['q1', [1, 5, 7]],
      ['q2', 4],
      ['q3', 'equal'],
      ['q5', [24, 30, 6]],
      ['q6', 0],
    ];
    for (const [suffix, answer] of examples) {
      const question = required(
        lesson.questions.find((q) => q.id === `${lesson.id}-${suffix}`),
      );
      expect(evaluate(question.rule, answer)).toBe(true);
    }
    const zero = required(lesson.questions.find((q) => q.id.endsWith('-q6')));
    expect(() => evaluate(zero.rule, null)).toThrow(
      'educationLearning.answerRequired',
    );
    expect(evaluate(zero.rule, 1)).toBe(false);
    const payment = required(
      lesson.questions.find((q) => q.id.endsWith('-q5')),
    );
    expect(evaluate(payment.rule, [24, 30, 0])).toBe(false);
    expect(() => evaluate(payment.rule, [24, 30, null])).toThrow(
      'educationLearning.answerRequired',
    );
  });
  it('keeps actual buying, selling, both records and six self-assessments outside objective scores and in backups', () => {
    const now = '2026-10-03T00:00:00.000Z';
    const session = createSession(lesson, 'pep-math-p1-lower-2024', 'child', {
      seed: 7,
      now,
    });
    for (const suffix of [
      'buy',
      'sell',
      'buy-record',
      'sell-record',
      'review-prepare',
      'review-explain',
      'review-notice',
      'review-share',
      'review-solve',
      'review-cooperate',
    ]) {
      session.questionIndex = session.questions.findIndex(
        (q) => q.id === `${lesson.id}-${suffix}`,
      );
      const question = required(session.questions[session.questionIndex]);
      const response = required(session.responses[session.questionIndex]);
      response.draft =
        question.rule.kind === 'manual'
          ? 'confirmed'
          : '这次只做了模拟；剩余准备未完成。';
      session.responses[session.questionIndex] = submitResponse(
        question,
        response,
        now,
      );
      expect(
        session.responses[session.questionIndex]?.submissions[0]?.correct,
      ).toBeNull();
    }
    expect(statistics(session).independent).toBe(0);
    expect(statistics(session).accuracy).toBeNull();
    expect(statistics(session).manual).toBe(2);
    expect(statistics(session).reflections).toBe(8);
    const state = {
      schemaVersion: 1 as const,
      activeProfileId: 'child',
      profiles: [{ id: 'child', nickname: '学习者', createdAt: now }],
      sessions: [session],
    };
    expect(parseBackup(exportBackup(state)).data).toEqual(state);
  });
  it('appends a separately identified practice pack while preserving both original courses and their v1 task IDs', () => {
    const book = required(mathBooks.find((b) => b.volume === 'lower'));
    const unit = required(book.units.find((u) => u.id === 'shopping'));
    expect(unit.lessons.map((course) => course.id)).toEqual([
      'ml-money',
      'ml-shop',
      lesson.id,
    ]);
    for (const original of unit.lessons.slice(0, 2)) {
      expect(original.version).toBe(1);
      expect(original.questions.map((q) => q.id)).toEqual(
        Array.from({ length: 6 }, (_, n) => `${original.id}-q${n + 1}`),
      );
    }
    expect(new Set(lesson.questions.map((q) => q.id)).size).toBe(
      lesson.questions.length,
    );
    expect(lesson.page).toBe(77);
    expect(lesson.steps).toHaveLength(5);
  });
});
