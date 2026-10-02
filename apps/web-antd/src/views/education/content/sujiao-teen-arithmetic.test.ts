import { describe, expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
} from '../learning/engine';
import { mathBooks } from './math';
import { sujiaoTeenArithmeticDraft as lesson } from './sujiao-teen-arithmetic';

describe('sujiao teen arithmetic draft', () => {
  it('uses only non-carry or non-borrow equations and distinguishes subtraction of ten', () => {
    for (const questions of [lesson.questions, lesson.reviewQuestions!]) {
      const equations = questions.filter((q) => /-equation-\d+$/.test(q.id));
      expect(equations).toHaveLength(8);
      for (const q of equations) {
        const match = q.prompt.match(/^(\d+) ([+-]) (\d+)/)!;
        const a = Number(match[1]);
        const b = Number(match[3]);
        const add = match[2] === '+';
        const expected = add ? a + b : a - b;
        expect(Math.max(a, b)).toBeLessThanOrEqual(19);
        expect(expected).toBeGreaterThanOrEqual(0);
        expect(expected).toBeLessThanOrEqual(19);
        if (add) expect((a % 10) + (b % 10)).toBeLessThan(10);
        else expect(a % 10).toBeGreaterThanOrEqual(b % 10);
        expect(evaluate(q.rule, expected)).toBe(true);
        expect(evaluate(q.rule, expected + 1)).toBe(false);
        if (b === 10) expect(evaluate(q.rule, a - 1)).toBe(false);
        expect(() => evaluate(q.rule, null)).toThrow(
          'educationLearning.answerRequired',
        );
      }
      for (const q of questions.filter((q) => q.rule.kind === 'steps')) {
        if (q.rule.kind !== 'steps' || q.visual?.kind !== 'number-line')
          throw new Error('Expected path');
        const start = q.visual.value;
        const delta = q.id.endsWith('-forward') ? 1 : -1;
        expect(evaluate(q.rule, [start + delta, start + 2 * delta])).toBe(true);
        expect(evaluate(q.rule, [start, start + delta])).toBe(false);
        expect(q.rule.values.every((n) => n >= 10 && n <= 19)).toBe(true);
      }
    }
  });
  it('changes review contexts and keeps independent preparing status', () => {
    expect(lesson.status).toBe('preparing');
    expect(
      mathBooks.flatMap((b) =>
        b.units.flatMap((u) => u.lessons.map((l) => l.id)),
      ),
    ).not.toContain(lesson.id);
    const main = lesson.questions.filter((q) => q.rule.kind !== 'manual');
    expect(main).toHaveLength(12);
    expect(lesson.reviewQuestions).toHaveLength(12);
    for (const [index, q] of main.entries()) {
      expect(lesson.reviewQuestions![index]!.knowledge).toBe(q.knowledge);
      expect(lesson.reviewQuestions![index]!.prompt).not.toBe(q.prompt);
    }
    for (const tasks of [main, lesson.reviewQuestions!]) {
      for (const q of tasks.filter((q) => q.id.includes('-story-'))) {
        const [a, b] = q.prompt.match(/\d+/g)!.map(Number);
        expect(
          evaluate(q.rule, q.id.endsWith('-story-add') ? a! + b! : a! - b!),
        ).toBe(true);
      }
    }
  });
  it('round-trips first mistakes, corrected answers, help and manual activity separately', () => {
    const now = '2026-10-01T14:00:00.000Z';
    const session = createSession(
      lesson,
      'unregistered-source-draft',
      'child',
      { now, seed: 43 },
    );
    session.phase = 'practice';
    const first = session.questions.findIndex((q) =>
      q.id.endsWith('-equation-4'),
    );
    session.responses[first] = submitResponse(
      session.questions[first]!,
      { ...session.responses[first]!, draft: 17, readingHelp: true },
      now,
    );
    for (const [index, q] of session.questions.entries()) {
      const draft = (() => {
        if (q.rule.kind === 'number') return q.rule.value;
        return q.rule.kind === 'steps' ? q.rule.values : 'confirmed';
      })();
      session.responses[index] = submitResponse(
        q,
        { ...session.responses[index]!, draft },
        now,
      );
    }
    expect(statistics(session).manual).toBe(2);
    expect(session.responses[first]!.submissions.map((s) => s.correct)).toEqual(
      [false, true],
    );
    expect(session.responses[first]!.submissions[0]!.readingHelp).toBe(true);
    const backup = exportBackup(
      {
        schemaVersion: 1,
        activeProfileId: 'child',
        profiles: [{ id: 'child', nickname: '孩子', createdAt: now }],
        sessions: [session],
      },
      now,
    );
    expect(parseBackup(backup).data.sessions[0]).toEqual(session);
  });
});
