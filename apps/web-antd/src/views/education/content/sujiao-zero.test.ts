import { describe, expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
} from '../learning/engine';
import { mathBooks } from './math';
import {
  sujiaoZeroArithmeticDraft,
  sujiaoZeroDrafts,
  sujiaoZeroRecognitionDraft,
} from './sujiao-zero';

describe('sujiao zero drafts', () => {
  it('distinguishes a known zero from an unanswered task and provides changed review tasks', () => {
    const live = mathBooks.flatMap((book) =>
      book.units.flatMap((unit) => unit.lessons.map((lesson) => lesson.id)),
    );
    for (const lesson of sujiaoZeroDrafts) {
      expect(lesson.status).toBe('preparing');
      expect(live).not.toContain(lesson.id);
      const main = lesson.questions.filter(
        (question) => question.rule.kind !== 'manual',
      );
      expect(main).toHaveLength(8);
      expect(lesson.reviewQuestions).toHaveLength(8);
      for (const [index, question] of main.entries()) {
        const review = lesson.reviewQuestions![index]!;
        expect(review.knowledge).toBe(question.knowledge);
        expect(review.prompt).not.toBe(question.prompt);
      }
      const all = [...lesson.questions, ...lesson.reviewQuestions!];
      expect(new Set(all.map((question) => question.id)).size).toBe(all.length);
      for (const question of all) {
        if (question.rule.kind === 'choice')
          expect(
            question.choices!.filter((choice) =>
              evaluate(question.rule, choice.id),
            ),
          ).toHaveLength(1);
        if (question.rule.kind === 'number') {
          expect(question.rule.value).toBeGreaterThanOrEqual(0);
          expect(question.rule.value).toBeLessThanOrEqual(5);
          expect(() => evaluate(question.rule, null)).toThrow(
            'educationLearning.answerRequired',
          );
        }
      }
    }
    const empty = sujiaoZeroRecognitionDraft.questions[0]!;
    expect(evaluate(empty.rule, 0)).toBe(true);
    expect(evaluate(empty.rule, 1)).toBe(false);
    const order = sujiaoZeroRecognitionDraft.questions.find(
      (question) => question.rule.kind === 'sequence',
    )!;
    expect(evaluate(order.rule, ['0', '1', '2', '3', '4', '5'])).toBe(true);
    expect(evaluate(order.rule, ['1', '2', '3', '4', '5', '0'])).toBe(false);
  });

  it('handles all four zero operations, especially subtracting none versus subtracting everything', () => {
    for (const tasks of [
      sujiaoZeroArithmeticDraft.questions,
      sujiaoZeroArithmeticDraft.reviewQuestions!,
    ]) {
      const equations = tasks.filter((question) =>
        question.id.includes('-calculate-'),
      );
      expect(equations).toHaveLength(4);
      for (const question of equations) {
        const match = question.prompt.match(/(\d+) ([+-]) (\d+)/)!;
        const left = Number(match[1]);
        const right = Number(match[3]);
        const expected = match[2] === '+' ? left + right : left - right;
        expect(evaluate(question.rule, expected)).toBe(true);
        if (match[2] === '-' && right === 0) {
          expect(evaluate(question.rule, 0)).toBe(false);
        } else if (match[2] === '-') {
          expect(evaluate(question.rule, left)).toBe(false);
        }
      }
      const noRemoval = tasks.find((question) =>
        question.id.endsWith('no-removal'),
      )!;
      const allRemoved = tasks.find((question) =>
        question.id.endsWith('all-removed'),
      )!;
      expect(evaluate(noRemoval.rule, 0)).toBe(false);
      expect(evaluate(allRemoved.rule, 0)).toBe(true);
    }
  });

  it('roundtrips zero answers and zero-count diagrams while preserving first mistakes and manual work', () => {
    const now = '2026-10-01T04:00:00.000Z';
    for (const lesson of sujiaoZeroDrafts) {
      const session = createSession(
        lesson,
        'unregistered-source-draft',
        'child',
        { now, seed: 10 },
      );
      session.phase = 'practice';
      const firstIndex = session.questions.findIndex(
        (question) =>
          question.rule.kind === 'number' && question.rule.value === 0,
      );
      expect(firstIndex).toBeGreaterThanOrEqual(0);
      const first = session.questions[firstIndex]!;
      session.responses[firstIndex] = submitResponse(
        first,
        { ...session.responses[firstIndex]!, draft: -1 },
        now,
      );
      for (const [index, question] of session.questions.entries()) {
        const draft = (() => {
          if (
            question.rule.kind === 'number' ||
            question.rule.kind === 'choice'
          )
            return question.rule.value;
          return question.rule.kind === 'sequence'
            ? question.rule.values
            : 'confirmed';
        })();
        session.responses[index] = submitResponse(
          question,
          { ...session.responses[index]!, draft },
          now,
        );
      }
      expect(statistics(session).manual).toBe(2);
      expect(
        session.responses[firstIndex]!.submissions.map((item) => item.correct),
      ).toEqual([false, true]);
      const json = exportBackup(
        {
          schemaVersion: 1,
          activeProfileId: 'child',
          profiles: [{ id: 'child', nickname: '孩子', createdAt: now }],
          sessions: [session],
        },
        now,
      );
      expect(parseBackup(json).data.sessions[0]).toEqual(session);
      const zeroResponses = session.questions.flatMap((question, index) =>
        question.rule.kind === 'number' && question.rule.value === 0
          ? [session.responses[index]!]
          : [],
      );
      expect(zeroResponses.length).toBeGreaterThan(0);
      for (const response of zeroResponses) expect(response.draft).toBe(0);
    }
  });
});
