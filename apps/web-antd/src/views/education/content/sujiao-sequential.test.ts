import { describe, expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
} from '../learning/engine';
import { mathBooks } from './math';
import { sujiaoSequentialDraft as lesson } from './sujiao-sequential';

describe('sujiao sequential quantity changes', () => {
  it('requires both intermediate and final results in order for all four operation patterns', () => {
    for (const tasks of [lesson.questions, lesson.reviewQuestions!]) {
      const expressions = tasks.filter((question) =>
        question.id.includes('-expression-'),
      );
      expect(expressions).toHaveLength(4);
      for (const question of expressions) {
        const match = question.prompt.match(/(\d+) ([+-]) (\d+) ([+-]) (\d+)/)!;
        const start = Number(match[1]);
        const middle =
          match[2] === '+'
            ? start + Number(match[3])
            : start - Number(match[3]);
        const end =
          match[4] === '+'
            ? middle + Number(match[5])
            : middle - Number(match[5]);
        for (const value of [start, middle, end]) {
          expect(value).toBeGreaterThanOrEqual(0);
          expect(value).toBeLessThanOrEqual(9);
        }
        expect(evaluate(question.rule, [middle, end])).toBe(true);
        expect(evaluate(question.rule, [start, end])).toBe(false);
        expect(evaluate(question.rule, [end, middle])).toBe(false);
        expect(() => evaluate(question.rule, [end])).toThrow(
          'educationLearning.answerRequired',
        );
        expect(question.visual).toEqual({
          kind: 'number-line',
          minimum: 0,
          maximum: 9,
          value: start,
        });
      }
      const stories = tasks.filter(
        (question) =>
          question.id.includes('-story-') && question.rule.kind === 'steps',
      );
      expect(stories).toHaveLength(2);
    }
    expect(
      lesson.reviewQuestions!.find((q) => q.id.endsWith('-story-add'))!.rule,
    ).toEqual({ kind: 'steps', values: [5, 8] });
    expect(
      lesson.questions.find((q) => q.id.endsWith('-story-mixed'))!.rule,
    ).toEqual({ kind: 'steps', values: [8, 6] });
    expect(
      lesson.reviewQuestions!.find((q) => q.id.endsWith('-story-mixed'))!.rule,
    ).toEqual({ kind: 'steps', values: [3, 5] });
  });
  it('changes review contexts while preserving knowledge and keeps the source draft unregistered', () => {
    expect(lesson.status).toBe('preparing');
    expect(
      mathBooks.flatMap((book) =>
        book.units.flatMap((unit) => unit.lessons.map((item) => item.id)),
      ),
    ).not.toContain(lesson.id);
    const main = lesson.questions.filter(
      (question) => question.rule.kind !== 'manual',
    );
    expect(main).toHaveLength(7);
    expect(lesson.reviewQuestions).toHaveLength(7);
    for (const [index, question] of main.entries()) {
      const review = lesson.reviewQuestions![index]!;
      expect(review.knowledge).toBe(question.knowledge);
      expect(review.prompt).not.toBe(question.prompt);
    }
  });
  it('retains first mistakes separately from corrected multi-field work and physical confirmation through backup', () => {
    const now = '2026-10-01T08:00:00.000Z';
    const session = createSession(
      lesson,
      'unregistered-source-draft',
      'child',
      { now, seed: 17 },
    );
    session.phase = 'practice';
    const index = session.questions.findIndex(
      (question) => question.rule.kind === 'steps',
    );
    session.responses[index] = submitResponse(
      session.questions[index]!,
      { ...session.responses[index]!, draft: [-1, -1] },
      now,
    );
    for (const [position, question] of session.questions.entries()) {
      const draft = (() => {
        if (question.rule.kind === 'steps') return question.rule.values;
        return question.rule.kind === 'choice'
          ? question.rule.value
          : 'confirmed';
      })();
      session.responses[position] = submitResponse(
        question,
        { ...session.responses[position]!, draft },
        now,
      );
    }
    expect(
      session.responses[index]!.submissions.map((item) => item.correct),
    ).toEqual([false, true]);
    expect(statistics(session).manual).toBe(2);
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
  });
});
