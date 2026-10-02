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
import { solidPracticeLessons } from './math-solid-practice';

describe('pep solid observation and construction', () => {
  it('separates shapes irrespective of colour and distinguishes absent cylinders from a blank answer', () => {
    const course = required(solidPracticeLessons[0]);
    for (const [suffix, answer] of [
      ['q1', 3],
      ['q2', 2],
      ['q3', 0],
      ['q4', 1],
    ] as const) {
      const question = required(
        course.questions.find((q) => q.id.endsWith(suffix)),
      );
      expect(evaluate(question.rule, answer)).toBe(true);
      expect(evaluate(question.rule, answer + 1)).toBe(false);
    }
    expect(() =>
      evaluate(
        required(course.questions.find((q) => q.id.endsWith('q3'))).rule,
        null,
      ),
    ).toThrow('educationLearning.answerRequired');
    expect(
      evaluate(
        required(course.questions.find((q) => q.id.endsWith('q5'))).rule,
        '不能',
      ),
    ).toBe(true);
  });
  it('counts whole blocks and accepts all positive quantity partitions without claiming spatial compatibility', () => {
    const course = required(solidPracticeLessons[1]);
    for (const [suffix, value] of [
      ['q1', 4],
      ['q3', 4],
      ['q4', 5],
    ] as const) {
      const question = required(
        course.questions.find((q) => q.id.endsWith(suffix)),
      );
      expect(evaluate(question.rule, value)).toBe(true);
      expect(evaluate(question.rule, value - 1)).toBe(false);
    }
    const question = required(
      course.questions.find((q) => q.id.endsWith('q2')),
    );
    for (let part = 1; part < 6; part++)
      expect(evaluate(question.rule, [part, 6 - part])).toBe(true);
    for (const parts of [
      [0, 6],
      [6, 0],
      [2, 3],
      [-1, 7],
    ])
      expect(evaluate(question.rule, parts)).toBe(false);
    expect(question.prompt).toContain('只检查数量');
    expect(question.explanation).toContain('不判断');
    expect(
      evaluate(
        required(course.questions.find((q) => q.id.endsWith('q5'))).rule,
        '圆柱',
      ),
    ).toBe(true);
    expect(
      evaluate(
        required(course.questions.find((q) => q.id.endsWith('q6'))).rule,
        '圆柱',
      ),
    ).toBe(true);
    const review = required(
      course.reviewQuestions?.find((q) => q.id.endsWith('r2')),
    );
    expect(evaluate(review.rule, '球')).toBe(true);
  });
  it('records manual attempts and reflections separately and persists every new visual snapshot', () => {
    const now = '2026-10-03T00:00:00.000Z';
    for (const course of solidPracticeLessons) {
      const session = createSession(course, 'pep-math-p1-upper-2024', 'child', {
        seed: 7,
        now,
      });
      expect(statistics(session).manual).toBe(0);
      for (const [index, question] of session.questions.entries()) {
        if (
          question.rule.kind !== 'manual' &&
          question.rule.kind !== 'reflection'
        )
          continue;
        const response = required(session.responses[index]);
        response.draft =
          question.rule.kind === 'manual'
            ? 'confirmed'
            : '这次由家长代录：材料还没齐，部分活动未做。';
        session.responses[index] = submitResponse(question, response, now);
        expect(session.responses[index]?.submissions[0]?.correct).toBeNull();
      }
      expect(statistics(session).independent).toBe(0);
      expect(statistics(session).accuracy).toBeNull();
      expect(statistics(session).reflections).toBe(2);
      const state = {
        schemaVersion: 1 as const,
        activeProfileId: 'child',
        profiles: [{ id: 'child', nickname: '学习者', createdAt: now }],
        sessions: [session],
      };
      expect(parseBackup(exportBackup(state)).data).toEqual(state);
    }
  });
  it('keeps the original identification course first with its v1 questions and adds two independent practice packs', () => {
    const book = required(mathBooks.find((b) => b.volume === 'upper'));
    const unit = required(book.units.find((u) => u.id === 'u3'));
    expect(unit.lessons.map((course) => course.id)).toEqual([
      'mu-solid',
      'mu-solid-observe',
      'mu-solid-build',
    ]);
    const original = required(unit.lessons[0]);
    expect(original.version).toBe(1);
    expect(original.questions.map((q) => q.id)).toEqual(
      Array.from({ length: 6 }, (_, i) => `mu-solid-q${i + 1}`),
    );
    const ids = unit.lessons.flatMap((course) =>
      [...course.questions, ...(course.reviewQuestions ?? [])].map((q) => q.id),
    );
    expect(new Set(ids).size).toBe(ids.length);
  });
});
