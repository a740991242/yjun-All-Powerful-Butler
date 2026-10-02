import { describe, expect, it } from 'vitest';

import { exportBackup, parseBackup } from '../learning/backup';
import {
  createSession,
  evaluate,
  statistics,
  submitResponse,
} from '../learning/engine';
import { sujiaoFillArithmeticLesson as lesson } from './sujiao-fill-arithmetic';

describe('missing quantities in small arithmetic', () => {
  it('solves each blank by its place, checks substituted equality and respects diagram order', () => {
    expect(
      lesson.questions.filter((q) => q.rule.kind !== 'manual'),
    ).toHaveLength(10);
    expect(lesson.reviewQuestions).toHaveLength(10);
    for (const tasks of [lesson.questions, lesson.reviewQuestions!]) {
      for (const q of tasks.filter((q) => q.rule.kind === 'number')) {
        if (q.rule.kind !== 'number') throw new Error('Expected scalar');
        const formula = q.prompt
          .split('。')[0]!
          .replace('□', String(q.rule.value));
        const match = formula.match(/(\d+) ([+-]) (\d+) = (\d+)/)!;
        const a = Number(match[1]);
        const b = Number(match[3]);
        const total = Number(match[4]);
        expect(match[2] === '+' ? a + b : a - b).toBe(total);
        expect(evaluate(q.rule, q.rule.value + 1)).toBe(false);
      }
      const add = tasks.find((q) => q.id.endsWith('-two-addends'))!;
      if (add.visual?.kind !== 'count') throw new Error('Expected groups');
      expect(evaluate(add.rule, [add.visual.count, add.visual.other!])).toBe(
        true,
      );
      if (add.visual.count !== add.visual.other)
        expect(evaluate(add.rule, [add.visual.other!, add.visual.count])).toBe(
          false,
        );
      const subtract = tasks.find((q) => q.id.endsWith('-two-subtraction'))!;
      if (subtract.visual?.kind !== 'count')
        throw new Error('Expected remaining');
      const original = Number(subtract.prompt.match(/原来有(\d+)/)![1]);
      expect(
        evaluate(subtract.rule, [
          original - subtract.visual.count,
          subtract.visual.count,
        ]),
      ).toBe(true);
      for (const q of tasks.filter((q) => q.rule.kind === 'choice'))
        expect(q.choices!.filter((c) => evaluate(q.rule, c.id))).toHaveLength(
          1,
        );
    }
    for (const [i, q] of lesson.questions
      .filter((q) => q.rule.kind !== 'manual')
      .entries()) {
      const review = lesson.reviewQuestions![i]!;
      expect(review.knowledge).toBe(q.knowledge);
      expect(review.prompt).not.toBe(q.prompt);
    }
  });

  it('retains partial arrays and corrected first mistakes without treating four physical tasks as correct answers', () => {
    const now = '2026-10-01T07:00:00.000Z';
    const session = createSession(
      lesson,
      'sujiao-math-p1-upper-2024',
      'child',
      { now, seed: 19 },
    );
    session.phase = 'practice';
    const index = session.questions.findIndex((q) => q.rule.kind === 'steps');
    const q = session.questions[index]!;
    session.responses[index]!.draft = [1, null];
    const data = {
      schemaVersion: 1 as const,
      activeProfileId: 'child',
      profiles: [{ id: 'child', nickname: '孩子', createdAt: now }],
      sessions: [session],
    };
    expect(
      parseBackup(exportBackup(data, now)).data.sessions[0]!.responses[index]!
        .draft,
    ).toEqual([1, null]);
    session.responses[index] = submitResponse(
      q,
      { ...session.responses[index]!, draft: [5, 5] },
      now,
    );
    for (const [i, q] of session.questions.entries()) {
      const draft = (() => {
        if (q.rule.kind === 'choice' || q.rule.kind === 'number')
          return q.rule.value;
        return q.rule.kind === 'steps' ? q.rule.values : 'confirmed';
      })();
      session.responses[i] = submitResponse(
        q,
        { ...session.responses[i]!, draft },
        now,
      );
    }
    expect(session.responses[index]!.submissions.map((s) => s.correct)).toEqual(
      [false, true],
    );
    expect(statistics(session).manual).toBe(4);
    expect(parseBackup(exportBackup(data, now)).data.sessions[0]).toEqual(
      session,
    );
  });
});
