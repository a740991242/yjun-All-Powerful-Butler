import { describe, expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
} from '../learning/engine';
import { mathBooks } from './math';
import { sujiaoMissingAddendDraft as lesson } from './sujiao-missing-addend';

describe('sujiao missing quantity draft', () => {
  it('asks for the added quantity rather than final total and retains genuine zero', () => {
    for (const tasks of [lesson.questions, lesson.reviewQuestions!]) {
      const missing = tasks.filter((q) => /-missing-\d+$/.test(q.id));
      expect(missing).toHaveLength(7);
      for (const q of missing) {
        const numbers = q.prompt.match(/\d+/g)!.map(Number);
        const [target, existing] = numbers;
        expect(target!).toBeLessThanOrEqual(10);
        expect(existing!).toBeLessThanOrEqual(target!);
        expect(evaluate(q.rule, target! - existing!)).toBe(true);
        expect(evaluate(q.rule, target!)).toBe(false);
        expect(() => evaluate(q.rule, null)).toThrow(
          'educationLearning.answerRequired',
        );
      }
      const path = tasks.find((q) => q.rule.kind === 'steps')!;
      if (path.rule.kind !== 'steps' || path.visual?.kind !== 'number-line')
        throw new Error('Expected path');
      const moves = Array.from(
        { length: 10 - path.visual.value },
        (_, index) =>
          path.visual!.kind === 'number-line'
            ? path.visual!.value + index + 1
            : 0,
      );
      expect(evaluate(path.rule, moves)).toBe(true);
      expect(
        evaluate(
          path.rule,
          moves.map((n) => n - 1),
        ),
      ).toBe(false);
    }
    expect(
      lesson.questions.find((q) => q.id.endsWith('-missing-6'))!.rule,
    ).toEqual({ kind: 'number', value: 0 });
    expect(
      lesson.reviewQuestions!.find((q) => q.id.endsWith('-missing-6'))!.rule,
    ).toEqual({ kind: 'number', value: 0 });
  });
  it('changes review quantities and contexts without replacing any registered book', () => {
    expect(lesson.status).toBe('preparing');
    expect(
      mathBooks.flatMap((book) =>
        book.units.flatMap((unit) => unit.lessons.map((item) => item.id)),
      ),
    ).not.toContain(lesson.id);
    const main = lesson.questions.filter((q) => q.rule.kind !== 'manual');
    expect(main).toHaveLength(9);
    expect(lesson.reviewQuestions).toHaveLength(9);
    for (const [index, q] of main.entries()) {
      const review = lesson.reviewQuestions![index]!;
      expect(review.knowledge).toBe(q.knowledge);
      expect(review.prompt).not.toBe(q.prompt);
    }
  });
  it('backs up correct zero, first mistakes and actual activity confirmations independently', () => {
    const now = '2026-10-01T11:00:00.000Z';
    const session = createSession(
      lesson,
      'unregistered-source-draft',
      'child',
      { now, seed: 29 },
    );
    session.phase = 'practice';
    const index = session.questions.findIndex((q) =>
      q.id.endsWith('-missing-6'),
    );
    session.responses[index] = submitResponse(
      session.questions[index]!,
      { ...session.responses[index]!, draft: 10 },
      now,
    );
    for (const [position, q] of session.questions.entries()) {
      const draft = (() => {
        if (q.rule.kind === 'number' || q.rule.kind === 'choice')
          return q.rule.value;
        return q.rule.kind === 'steps' ? q.rule.values : 'confirmed';
      })();
      session.responses[position] = submitResponse(
        q,
        { ...session.responses[position]!, draft },
        now,
      );
    }
    expect(statistics(session).manual).toBe(2);
    expect(
      session.responses[index]!.submissions.map((item) => item.correct),
    ).toEqual([false, true]);
    expect(session.responses[index]!.submissions.at(-1)!.answer).toBe(0);
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
