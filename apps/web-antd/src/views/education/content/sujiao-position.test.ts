import { describe, expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
} from '../learning/engine';
import { seatNeighbour } from '../learning/seat-grid';
import { mathBooks } from './math';
import { sujiaoPositionDraft } from './sujiao-position';

describe('sujiao life positions draft', () => {
  it('matches the diagram, changes reference and seating for review, and remains unregistered', () => {
    const lesson = sujiaoPositionDraft;
    expect(lesson.status).toBe('preparing');
    expect(
      mathBooks.flatMap((book) =>
        book.units.flatMap((unit) => unit.lessons.map((item) => item.id)),
      ),
    ).not.toContain(lesson.id);
    for (const [review, tasks] of [
      lesson.questions,
      lesson.reviewQuestions!,
    ].entries()) {
      const reference = review ? '小安' : '小乐';
      for (const direction of ['front', 'rear', 'left', 'right'] as const) {
        const question = tasks.find((item) =>
          item.id.endsWith(`-${direction}`),
        )!;
        if (question.visual?.kind !== 'seat-grid')
          throw new Error('Expected seats');
        const answer = seatNeighbour(question.visual, reference, direction)!;
        expect(evaluate(question.rule, answer)).toBe(true);
        expect(evaluate(question.rule, reference)).toBe(false);
      }
      expect(
        evaluate(
          tasks.find((item) => item.id.endsWith('-row'))!.rule,
          review ? 3 : 1,
        ),
      ).toBe(true);
      expect(
        evaluate(
          tasks.find((item) => item.id.endsWith('-column'))!.rule,
          review ? 1 : 3,
        ),
      ).toBe(true);
      for (const question of tasks.filter(
        (item) => item.rule.kind === 'choice',
      ))
        expect(
          question.choices!.filter((choice) =>
            evaluate(question.rule, choice.id),
          ),
        ).toHaveLength(1);
    }
    for (const [index, question] of lesson.questions
      .filter((item) => item.rule.kind !== 'manual')
      .entries()) {
      const review = lesson.reviewQuestions![index]!;
      expect(review.knowledge).toBe(question.knowledge);
      expect(
        JSON.stringify({ prompt: review.prompt, visual: review.visual }),
      ).not.toBe(
        JSON.stringify({ prompt: question.prompt, visual: question.visual }),
      );
    }
  });
  it('retains the seating snapshot, first errors and three separately confirmed practical tasks', () => {
    const now = '2026-10-01T06:00:00.000Z';
    const session = createSession(
      sujiaoPositionDraft,
      'unregistered-source-draft',
      'child',
      { now, seed: 12 },
    );
    session.phase = 'practice';
    const index = session.questions.findIndex(
      (question) => question.rule.kind === 'number',
    );
    session.responses[index] = submitResponse(
      session.questions[index]!,
      { ...session.responses[index]!, draft: -1 },
      now,
    );
    for (const [position, question] of session.questions.entries()) {
      const draft =
        question.rule.kind === 'choice' || question.rule.kind === 'number'
          ? question.rule.value
          : 'confirmed';
      session.responses[position] = submitResponse(
        question,
        { ...session.responses[position]!, draft },
        now,
      );
    }
    expect(statistics(session).manual).toBe(3);
    expect(
      session.responses[index]!.submissions.map((item) => item.correct),
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
    const corrupt = JSON.parse(json);
    const diagram = corrupt.data.sessions[0].questions.find(
      (question: { visual?: { kind: string } }) =>
        question.visual?.kind === 'seat-grid',
    );
    diagram.visual.rows[0][0] = diagram.visual.rows[0][1];
    expect(() => parseBackup(JSON.stringify(corrupt))).toThrow(Error);
  });
});
