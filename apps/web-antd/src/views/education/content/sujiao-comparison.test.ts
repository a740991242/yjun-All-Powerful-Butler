import { describe, expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
} from '../learning/engine';
import { mathBooks } from './math';
import { sujiaoComparisonDraft } from './sujiao-comparison';

describe('sujiao quantity comparison', () => {
  it('covers all three relations with changed review quantities and strict inequalities', () => {
    const lesson = sujiaoComparisonDraft;
    expect(lesson.status).toBe('preparing');
    expect(
      mathBooks.flatMap((book) =>
        book.units.flatMap((unit) => unit.lessons.map((item) => item.id)),
      ),
    ).not.toContain(lesson.id);
    const questions = [...lesson.questions, ...lesson.reviewQuestions!];
    expect(new Set(questions.map((question) => question.id)).size).toBe(
      questions.length,
    );
    for (const tasks of [lesson.questions, lesson.reviewQuestions!]) {
      const symbols = tasks.filter(
        (question) => question.visual?.kind === 'count',
      );
      expect(symbols).toHaveLength(3);
      for (const question of symbols) {
        if (question.visual?.kind !== 'count')
          throw new Error('Expected count');
        const { count, other } = question.visual;
        expect(count).toBeGreaterThanOrEqual(1);
        expect(count).toBeLessThanOrEqual(5);
        expect(other).toBeGreaterThanOrEqual(1);
        expect(other).toBeLessThanOrEqual(5);
        expect(
          ['=', '>', '<'].filter((symbol) => evaluate(question.rule, symbol)),
        ).toEqual([
          (() => {
            if (count === other) return '=';
            return count > other! ? '>' : '<';
          })(),
        ]);
      }
      for (const question of tasks.filter((item) => item.rule.kind === 'set')) {
        const threshold = Number(question.prompt.match(/[234]/)![0]);
        const less = question.id.endsWith('all-less');
        const expected = [1, 2, 3, 4, 5]
          .filter((value) => (less ? value < threshold : value > threshold))
          .map(String);
        expect(evaluate(question.rule, expected)).toBe(true);
        expect(evaluate(question.rule, [...expected, String(threshold)])).toBe(
          false,
        );
        expect(() => evaluate(question.rule, [])).toThrow(
          'educationLearning.answerRequired',
        );
      }
    }
    const main = lesson.questions.filter(
      (question) => question.visual?.kind === 'count',
    );
    const review = lesson.reviewQuestions!.filter(
      (question) => question.visual?.kind === 'count',
    );
    for (const [index, question] of main.entries())
      expect(review[index]!.visual).not.toEqual(question.visual);
    for (const question of questions.filter(
      (item) => item.rule.kind === 'choice',
    )) {
      expect(
        question.choices!.filter((choice) =>
          evaluate(question.rule, choice.id),
        ),
      ).toHaveLength(1);
    }
  });

  it('retains wrong first comparisons and keeps physical confirmation out of objective scores', () => {
    const now = '2026-10-01T02:00:00.000Z';
    const session = createSession(
      sujiaoComparisonDraft,
      'unregistered-source-draft',
      'child',
      { now, seed: 8 },
    );
    session.phase = 'practice';
    const first = session.questions[0]!;
    session.responses[0] = submitResponse(
      first,
      { ...session.responses[0]!, draft: '>' },
      now,
    );
    for (const [index, question] of session.questions.entries()) {
      const draft = (() => {
        if (question.rule.kind === 'choice' || question.rule.kind === 'number')
          return question.rule.value;
        return question.rule.kind === 'set'
          ? question.rule.values
          : 'confirmed';
      })();
      session.responses[index] = submitResponse(
        question,
        { ...session.responses[index]!, draft },
        now,
      );
    }
    expect(
      session.responses[0]!.submissions.map((submission) => submission.correct),
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
    const data = JSON.parse(json);
    data.data.sessions[0].questions[0].visual.count = -1;
    expect(() => parseBackup(JSON.stringify(data))).toThrow(Error);
  });
});
